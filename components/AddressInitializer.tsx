import { useEffect } from 'react';
import { useAddressStore } from '@/stores/address';

export const AddressInitializer = (): null => {
  const refresh = useAddressStore((s) => s.refresh);

  useEffect(() => { void refresh() }, [refresh]);
  return null;
};
