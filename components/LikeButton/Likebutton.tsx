import { HTMLAttributes, useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import numeral from 'numeral';

import type { AnimationItem } from 'lottie-web';

export interface ILikeButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  count?: number;
}

const LikeButton: React.FC<ILikeButtonProps> = ({
  isActive,
  count,
  ...props
}) => {
  const likeCount = count || 0;
  const [ref, setRef] = useState<AnimationItem | null>(null);
  const [firstLottie, setFirstLottie] = useState<boolean>(false);

  useEffect(() => {
    if (!ref || firstLottie) {
      return;
    }
    if (isActive) {
      ref.goToAndStop(90, true);
    } else {
      ref.goToAndStop(180, true);
    }

    setFirstLottie(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, ref]);

  useEffect(() => {
    if (!ref || !firstLottie) {
      return;
    }
    if (isActive) {
      ref.playSegments([10, 90], true);
    } else {
      ref.playSegments([100, 180], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, ref]);

  return (
    <button {...props}>
      <Player
        src="/assets/lotties/like.json"
        style={{ width: 80, height: 80 }}
        lottieRef={setRef}
        keepLastFrame
      />
      {likeCount >= 1000 ? numeral(likeCount).format('0.0a') : likeCount}
    </button>
  );
};

export default LikeButton;
