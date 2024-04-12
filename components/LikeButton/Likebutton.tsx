import { HTMLAttributes, useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import LikeLottieJson from '@assets/lotties/like.json';
import numeral from 'numeral';

import type { AnimationItem } from 'lottie-web';

export interface ILikeButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

const LikeButton: React.FC<ILikeButtonProps> = ({ isActive, ...props }) => {
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
    console.log(2);
    if (isActive) {
      console.log(5);
      ref.playSegments([10, 90], true);
    } else {
      console.log(6);
      ref.playSegments([100, 180], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, ref]);

  return (
    <button {...props}>
      <Player
        src={LikeLottieJson}
        style={{ width: 80, height: 80 }}
        lottieRef={setRef}
        keepLastFrame
      />
      {154 >= 1000 ? numeral(154).format('0.0a') : 154}
    </button>
  );
};

export default LikeButton;
