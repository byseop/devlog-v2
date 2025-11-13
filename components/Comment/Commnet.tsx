'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const COMMENT_THEME = {
  light: 'github-light',
  dark: 'github-dark'
};

const Comment = () => {
  const [container, setContainer] = useState<Element | null>(null);
  const { mode } = useTheme();

  useEffect(() => {
    if (!container) return;

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.setAttribute('repo', 'byseop/devlog-v2');
    script.setAttribute('issue-term', 'title');
    script.setAttribute('label', 'comment');
    script.setAttribute('theme', `github-${mode}`);
    script.setAttribute('crossorigin', 'anonymous');
    container.appendChild(script);
  }, [container]);

  useEffect(() => {
    if (!container) return;

    const message = {
      type: 'set-theme',
      theme: COMMENT_THEME[mode]
    };
    const commentIframe = container.querySelector('iframe');

    commentIframe?.contentWindow?.postMessage(message, 'https://utteranc.es');
  }, [mode]);

  useEffect(() => {
    return () => {
      const style = document.head.getElementsByTagName('style')[0];
      if (style.innerHTML.includes('utterances')) {
        style.remove();
      }
    };
  }, []);

  return <div className="comment-container" ref={setContainer} />;
};

export default Comment;
