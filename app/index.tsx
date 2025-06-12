import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    requestAnimationFrame(() => {
      router.replace('/splash');
    });
  }, []);

  return null;
}
