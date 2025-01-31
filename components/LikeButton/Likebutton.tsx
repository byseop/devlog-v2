import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import numeral from 'numeral';
import { FcLikePlaceholder, FcLike } from 'react-icons/fc';

export interface ILikeButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  count?: number;
}

const LikeButton: React.FC<ILikeButtonProps> = ({
  isActive,
  count,
  className,
  ...props
}) => {
  return (
    <button className={className} {...props}>
      {isActive ? (
        <FcLike className="like-icon" />
      ) : (
        <FcLikePlaceholder className="like-icon" />
      )}
      {typeof count === 'number' && count >= 1000
        ? numeral(count).format('0.0a')
        : count}
    </button>
  );
};

export default LikeButton;
