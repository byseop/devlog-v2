import { Fira_Mono } from '@next/font/google';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import useRootState from '../../core/hooks/useRootState';
import styleThemeSlice from '../../core/reducer/styleTheme';

import { IoSunny, IoMoon } from 'react-icons/io5';

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
  const dispatch = useDispatch();
  const { mode } = useRootState((state) => state.theme);

  const handleClickThemeToggle = () => {
    dispatch(
      styleThemeSlice.actions.toggle({
        mode: mode === 'light' ? 'dark' : 'light'
      })
    );
  };

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
            <button onClick={handleClickThemeToggle}>
              <span className={mode}>
                <IoSunny />
              </span>
              <span className={mode}>
                <IoMoon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
