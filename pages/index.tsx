import axios from 'axios';
import { useEffect } from 'react';
import Home from '../components/Home';

export default function () {
  useEffect(() => {
    const res = axios.get('/api/posts', {
      params: {
        a: 1
      }
    });
  }, []);
  return <Home />;
}
