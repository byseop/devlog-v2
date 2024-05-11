import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import numeral from 'numeral';
import likeJson from '@assets/lotties/like.json';
import Lottie from 'react-lottie-player';

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
  const lottieRef = useRef<AnimationItem>(null);
  const [isInitialLottie, setIsInitialLottie] = useState<boolean>(true);

  useEffect(() => {
    if (!lottieRef.current || typeof isActive === 'undefined') return;

    if (isActive) {
      if (isInitialLottie) {
        lottieRef.current.goToAndStop(90, true);
        setIsInitialLottie(false);
      } else {
        lottieRef.current.playSegments([10, 90], true);
      }
    } else {
      if (isInitialLottie) {
        lottieRef.current.goToAndStop(180, true);
        setIsInitialLottie(false);
      } else {
        lottieRef.current.playSegments([100, 180], true);
      }
    }
  }, [lottieRef.current, isActive]);

  return (
    <button {...props}>
      <Lottie
        ref={lottieRef}
        animationData={likeJson}
        style={{ width: 80, height: 80 }}
        loop={false}
      />
      {typeof count === 'number' && count >= 1000
        ? numeral(count).format('0.0a')
        : count}
    </button>
  );
};

export default LikeButton;
