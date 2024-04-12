import { useEffect, useState } from 'react';
import { Fira_Mono } from '@next/font/google';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import useRootState from '@core/hooks/useRootState';
import styleThemeSlice from '@core/reducer/styleTheme';
import { Player } from '@lottiefiles/react-lottie-player';

import { BsGithub } from 'react-icons/bs';
import changeThemeLottieJson from '@assets/lotties/change_theme.json';

import type { AnimationItem } from 'lottie-web';

interface IProps {
  className?: string;
}

const firaMono = Fira_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Helvetica Neue',
    'Apple SD Gothic Neo',
    'Malgun Gothic',
    '맑은 고딕',
    '나눔고딕',
    'Nanum Gothic',
    'Noto Sans KR',
    'Noto Sans CJK KR',
    'arial',
    '돋움',
    'Dotum',
    'Tahoma',
    'Geneva',
    'sans-serif'
  ]
});

const Header: React.FC<IProps> = ({ className }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { mode } = useRootState((state) => state.theme);

  const [themeToggleRef, setThemeToggleRef] = useState<AnimationItem | null>();

  const handleClickThemeToggle = () => {
    if (mode === 'light') {
      dispatch(
        styleThemeSlice.actions.toggle({
          mode: 'dark'
        })
      );
      themeToggleRef?.playSegments([40, 200], true);
    } else {
      dispatch(
        styleThemeSlice.actions.toggle({
          mode: 'light'
        })
      );
      themeToggleRef?.playSegments([300, 450], true);
    }
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (mode === 'dark') {
      themeToggleRef?.goToAndStop(300, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return (
    <header id="header" className={`${className}`}>
      <div className="header-inner">
        <div className="logo-wrap">
          <span className={`logo ${firaMono.className}`}>
            <Link href="/">byseop</Link>
          </span>
        </div>
        <div className="actions">
          <div className="btn-wrap">
            <a href="https://github.com/byseop" target="_blank">
              <span>
                <BsGithub />
              </span>
            </a>
          </div>
          <div
            className="btn-wrap btn-wrap--lottie"
            onClick={handleClickThemeToggle}
          >
            <button>
              <Player
                src={changeThemeLottieJson}
                style={{ height: 40, width: 'auto ' }}
                lottieRef={setThemeToggleRef}
                speed={2.5}
                keepLastFrame
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
