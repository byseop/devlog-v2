import { Fira_Mono } from '@next/font/google';
import Link from 'next/link';

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
  return (
    <header id="header" className={`${className}`}>
      <div className="header-inner">
        <div className="logo-wrap">
          <span className={`logo ${firaMono.className}`}>
            <Link href="/">byseop</Link>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
