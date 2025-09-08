import { useCartStore } from '@/stores/cart';
import { useEffect } from 'react';

export const CartInitializer = (): null => {
  const hydrate = useCartStore((s) => s.hydrate);

  useEffect(() => { void hydrate() }, [hydrate]);
  return null;
};
