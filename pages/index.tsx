import axios from 'axios';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const res = axios.get('/api/posts', {
      params: {
        a: 1
      }
    });
  }, []);
  return 123;
}
