import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index(): null {
  const router = useRouter();

  useEffect(() => {
    requestAnimationFrame(() => {
      router.replace('/splash');
    });
  }, [router]);

  return null;
}
