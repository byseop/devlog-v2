#!/bin/bash
# SessionStart hook — project-agnostic. Copy this file verbatim into other
# repos (gamer4info, ssalspi, devlog-v2, ...); nothing in it names a project.
# Register it in .claude/settings.json as a SessionStart command hook:
#   "$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.sh"
#
# Project name: basename of `git remote get-url origin` without ".git"
# (https://github.com/byseop/devlog-v2 -> devlog-v2), else basename of the
# project dir. Used as-is for the SSM path, and as PREFIX for the fallback
# below (uppercased, non-alphanumerics dropped, "_" appended: devlog-v2 ->
# DEVLOGV2_).
#
# Everything is written as export lines to $CLAUDE_ENV_FILE, which Claude
# Code sources before every later Bash command. Each line is guarded at
# source time — `[ -n "${X:-}" ] || export X=...` — so a value set later in
# the session wins. A name X is never written when it is already non-empty in
# the environment or set to a non-empty value in .env / .env.local (local
# values win). Names must match ^[A-Z_][A-Z0-9_]*$ and must not be on the
# deny-list (AWS credentials/config, PATH/HOME/shell/loader/proxy variables,
# NODE_OPTIONS, GH_TOKEN/GITHUB_TOKEN, CLAUDE_*, GIT_*); skipped names are
# reported on stderr (names only — values never reach stdout/stderr).
#
# 1) SSM Parameter Store (cloud sessions only, CLAUDE_CODE_REMOTE=true — never
#    on a local machine). Reads, with the session's AWS credentials,
#      /shared/<NAME>     values shared by all projects
#      /<project>/<NAME>  values for this project (override /shared on clash)
#    via `aws ssm get-parameters-by-path --with-decryption` (non-recursive,
#    all pages, region ${AWS_DEFAULT_REGION:-ap-northeast-2}). Env var name =
#    last path segment. Values are written shell-quoted (python3), so sourcing
#    reproduces them byte for byte. A failing path (aws missing, AccessDenied,
#    network, timeout) prints one warning line and is skipped; the hook still
#    exits 0 for it.
#    Add a value (admin credentials, e.g. on the operator's Mac):
#      aws ssm put-parameter --type SecureString --name /<project>/NAME --value ...
# 2) Prefix fallback (all environments, TRANSITIONAL): maps <PREFIX><X> -> <X>
#    from the environment (the line holds a reference "$<PREFIX><X>", not the
#    value). Written after the SSM lines, and skipped for names SSM already
#    wrote, so SSM wins. Remove this block once the <PREFIX>* environment
#    variables are deleted from the cloud environment.
# 3) Cloud sessions only: NODE_USE_ENV_PROXY=1 (Node's fetch ignores
#    HTTPS_PROXY otherwise) and a dependency install chosen by lockfile:
#    yarn.lock -> yarn install --frozen-lockfile, package-lock.json -> npm ci,
#    pnpm-lock.yaml -> pnpm install --frozen-lockfile (nothing otherwise). An
#    install failure only warns; the hook still exits 0.
set -euo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
REMOTE_URL=$(git -C "$ROOT" remote get-url origin 2>/dev/null || true)
PROJECT=${REMOTE_URL%/}; PROJECT=${PROJECT##*/}; PROJECT=${PROJECT##*:}; PROJECT=${PROJECT%.git}
[ -n "$PROJECT" ] || PROJECT=$(basename "$ROOT")
PREFIX="$(printf '%s' "$PROJECT" | tr '[:lower:]' '[:upper:]' | tr -cd 'A-Z0-9')_"
[ "$PREFIX" != "_" ] || PREFIX="__NO_PREFIX__"
ENV_FILE="${CLAUDE_ENV_FILE:-}"

defined_in_dotenv() {
  local f
  for f in "$ROOT/.env" "$ROOT/.env.local"; do
    [ -f "$f" ] && grep -Eq "^[[:space:]]*(export[[:space:]]+)?$1=[^[:space:]]" "$f" && return 0
  done
  return 1
}

# 0 = may be exported. Prints nothing; callers report.
allowed_name() {
  [[ "$1" =~ ^[A-Z_][A-Z0-9_]*$ ]] || return 1
  case "$1" in
    AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_SESSION_TOKEN|AWS_SECURITY_TOKEN|\
    AWS_DEFAULT_REGION|AWS_REGION|AWS_PROFILE|AWS_CONFIG_FILE|\
    AWS_SHARED_CREDENTIALS_FILE|AWS_CA_BUNDLE|PATH|HOME|USER|SHELL|PWD|IFS|ENV|\
    BASH_ENV|LD_PRELOAD|LD_LIBRARY_PATH|NODE_OPTIONS|HTTP_PROXY|HTTPS_PROXY|\
    NO_PROXY|GH_TOKEN|GITHUB_TOKEN|CLAUDE_*|GIT_*) return 1 ;;
  esac
  return 0
}

already_set() { [ -n "${!1:-}" ] || defined_in_dotenv "$1"; }

written=" "

# --- 1) SSM Parameter Store -------------------------------------------------
ssm_load() {
  local region="${AWS_DEFAULT_REGION:-ap-northeast-2}" tmp i p rc cls
  local paths=("/shared/" "/$PROJECT/") ok=()
  if ! command -v aws >/dev/null 2>&1; then
    echo "ssm: WARN aws CLI not found — skipped ${paths[*]}" >&2; return 0
  fi
  if ! command -v python3 >/dev/null 2>&1; then
    echo "ssm: WARN python3 not found — skipped ${paths[*]}" >&2; return 0
  fi
  tmp=$(mktemp -d) && chmod 700 "$tmp" || return 0
  SSM_TMP=$tmp; trap 'rm -rf "$SSM_TMP"' EXIT
  for i in "${!paths[@]}"; do
    p=${paths[$i]}; rc=0
    timeout 60 aws ssm get-parameters-by-path --path "$p" --no-recursive \
      --with-decryption --region "$region" --output json \
      --cli-connect-timeout 5 --cli-read-timeout 15 \
      >"$tmp/$i.json" 2>"$tmp/$i.err" </dev/null || rc=$?
    if [ "$rc" -ne 0 ]; then
      if   [ "$rc" -eq 124 ]; then cls=timeout
      elif grep -q 'AccessDenied' "$tmp/$i.err"; then cls=AccessDenied
      elif grep -Eqi 'timed? ?out|timeout' "$tmp/$i.err"; then cls=timeout
      elif grep -Eqi 'could not connect|connection|endpoint|name resolution|proxy' "$tmp/$i.err"; then cls=network
      elif grep -Eqi 'credentials|token|signature|UnrecognizedClient' "$tmp/$i.err"; then cls=credentials
      else cls="error(exit $rc)"; fi
      echo "ssm: WARN $p skipped ($cls)" >&2
      continue
    fi
    ok+=("$p=$tmp/$i.json")
  done
  [ "${#ok[@]}" -gt 0 ] || return 0

  # Parse + merge (later path overrides earlier) + shell-quote in python;
  # output is NUL-separated "name, path, quoted value" records in a 0600 file.
  if ! python3 -I - "$tmp/recs" "${ok[@]}" <<'PY'
import json, os, shlex, sys
out, specs = sys.argv[1], sys.argv[2:]
merged = {}
for spec in specs:
    path, f = spec.split("=", 1)
    try:
        with open(f, encoding="utf-8") as fh:
            params = json.load(fh).get("Parameters") or []
    except Exception as e:
        sys.stderr.write("ssm: WARN %s skipped (bad response: %s)\n" % (path, type(e).__name__))
        continue
    sys.stderr.write("ssm: %s -> %d params\n" % (path, len(params)))
    for prm in params:
        name = str(prm.get("Name", "")).rsplit("/", 1)[-1]
        val = prm.get("Value")
        if not name or not isinstance(val, str) or "\0" in name or "\0" in val:
            continue
        merged.pop(name, None)
        merged[name] = (path, val)
fd = os.open(out, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
with os.fdopen(fd, "wb") as o:
    for name, (path, val) in merged.items():
        try:
            rec = b"".join(x.encode("utf-8") + b"\0" for x in (name, path, shlex.quote(val)))
        except UnicodeEncodeError:
            continue
        o.write(rec)
PY
  then
    echo "ssm: WARN could not parse SSM responses — nothing loaded" >&2; return 0
  fi

  local name src q loaded=() kept=() denied=()
  while IFS= read -r -d '' name && IFS= read -r -d '' src && IFS= read -r -d '' q; do
    if ! allowed_name "$name"; then denied+=("$name"); continue; fi
    if already_set "$name"; then kept+=("$name"); continue; fi
    printf '[ -n "${%s:-}" ] || export %s=%s\n' "$name" "$name" "$q" >> "$ENV_FILE"
    written+="$name "
    loaded+=("$name")
  done < "$tmp/recs"
  echo "ssm: loaded=[${loaded[*]:-}] kept-existing=[${kept[*]:-}] denied=[${denied[*]:-}]" >&2
}

if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  if [ -n "$ENV_FILE" ]; then
    ssm_load || echo "ssm: WARN loader failed — continuing without SSM values" >&2
  else
    echo "ssm: CLAUDE_ENV_FILE unset — not read" >&2
  fi
fi

# --- 2) Prefix fallback (transitional) --------------------------------------
mapped=() skipped=() denied=()
for src in $(compgen -e | grep "^$PREFIX" || true); do
  dst="${src#"$PREFIX"}"
  [ -n "${!src:-}" ] || continue
  if ! allowed_name "$dst"; then denied+=("$dst"); continue; fi
  if [[ "$written" == *" $dst "* ]] || already_set "$dst"; then
    skipped+=("$dst"); continue
  fi
  if [ -n "$ENV_FILE" ]; then
    printf '[ -n "${%s:-}" ] || export %s="$%s"\n' "$dst" "$dst" "$src" >> "$ENV_FILE"
  fi
  mapped+=("$dst")
done
echo "env prefix map ($PREFIX*): mapped=[${mapped[*]:-}] kept-existing=[${skipped[*]:-}] denied=[${denied[*]:-}]" >&2
[ -n "$ENV_FILE" ] || echo "  (CLAUDE_ENV_FILE unset: nothing written)" >&2

# --- 3) Cloud-only setup -----------------------------------------------------
if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  # Node's built-in fetch ignores HTTPS_PROXY; without this, outbound calls
  # bypass the egress proxy and get 403 "Host not in allowlist" (Node >= 22.21).
  if [ -n "$ENV_FILE" ]; then
    echo '[ -n "${NODE_USE_ENV_PROXY:-}" ] || export NODE_USE_ENV_PROXY=1' >> "$ENV_FILE"
  fi
  cd "$ROOT"
  # A failed install must not fail the hook: the env lines above are already
  # written, and a stale lockfile (seen in devlog-v2) would otherwise make every
  # session start report a hook error. Warn and let the session start.
  rc=0
  if   [ -f yarn.lock ];         then yarn install --frozen-lockfile --non-interactive >&2 || rc=$?
  elif [ -f package-lock.json ]; then npm ci >&2 || rc=$?
  elif [ -f pnpm-lock.yaml ];    then pnpm install --frozen-lockfile >&2 || rc=$?
  fi
  [ "$rc" -eq 0 ] || echo "deps: WARN dependency install failed (exit $rc) — env vars were written; install manually" >&2
fi
exit 0
