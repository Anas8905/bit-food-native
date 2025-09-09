import { useAddressStore } from '@/stores/address';

export const useAddress = (): AddressStateType => {
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
