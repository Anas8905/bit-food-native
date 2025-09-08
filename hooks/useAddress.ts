import { useAddressStore } from '@/stores/address';
import { Address } from '@/types/address';

export const useAddress = (): {
  loading: boolean;
  addresses: Address[];
  selectedAddress: Address | null;
  addAddress: (address: Address, select?: boolean) => Promise<void>;
  selectAddress: (id: string | null) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  resetAddresses: () => Promise<void>;
  refresh: () => Promise<void>;
} => {
  const loading          = useAddressStore((s) => s.loading);
  const addresses        = useAddressStore((s) => s.addresses);
  const selectedAddress  = useAddressStore((s) => s.selectedAddress);

  const addAddress       = useAddressStore((s) => s.addAddress);
  const selectAddress    = useAddressStore((s) => s.selectAddress);
  const removeAddress    = useAddressStore((s) => s.removeAddress);
  const resetAddresses   = useAddressStore((s) => s.reset);
  const refresh          = useAddressStore((s) => s.refresh);

  return {
    loading,
    addresses,
    selectedAddress,
    addAddress,
    selectAddress,
    removeAddress,
    resetAddresses,
    refresh,
  };
};
