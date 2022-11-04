import { Fira_Mono } from '@next/font/google';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import useRootState from '../../core/hooks/useRootState';
import styleThemeSlice from '../../core/reducer/styleTheme';

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
  const { theme } = useRootState((state) => state);
  const handleClickToggle = () => {
    dispatch(
      styleThemeSlice.actions.toggle({
        mode: theme.mode === 'light' ? 'dark' : 'light'
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
      </div>
      <button onClick={handleClickToggle}>토글</button>
      {theme.mode}
    </header>
  );
};

export default Header;
