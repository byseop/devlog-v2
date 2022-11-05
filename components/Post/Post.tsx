import dynamic from 'next/dynamic';
import { NotionRenderer } from 'react-notion-x';

import type { ExtendedRecordMap } from 'notion-types';
import useRootState from '../../core/hooks/useRootState';

interface IPostProps {
  className?: string;
  id: string;
  data: ExtendedRecordMap;
}

const Post: React.FC<IPostProps> = ({ id, data, className }) => {
  const Code = dynamic(() =>
    import('react-notion-x/build/third-party/code').then((m) => m.Code)
  );
  const { mode } = useRootState((state) => state.theme);
  return (
    <div className={`post-wrapper ${className}`}>
      <NotionRenderer
        recordMap={data}
        darkMode={mode === 'dark'}
        components={{ Code }}
      />
    </div>
  );
};

export default Post;
