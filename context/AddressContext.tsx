import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    PropsWithChildren,
  } from 'react';
  import type { Address } from '../types/address';
  import {
    getAddresses,
    removeAddressById,
    getSelectedAddressId,
    setSelectedAddressId,
    saveAddress,
  } from '../services/addressStorage';

  type AddressContextValue = {
    loading: boolean;
    addresses: Address[];
    selectedAddress: Address | null;
    addAddress: (addr: Address, selectAfter?: boolean) => Promise<void>;
    selectAddress: (id: string | null) => Promise<void>;
    removeAddress: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
  };

  const AddressContext = createContext<AddressContextValue | null>(null);

  export function AddressProvider({ children }: PropsWithChildren) {
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    const hydrate = useCallback(async () => {
      setLoading(true);
      try {
        const [list, selectedId] = await Promise.all([getAddresses(), getSelectedAddressId()]);
        setAddresses(list);
        const current = list.find(a => a.id === selectedId) ?? list[0] ?? null;
        setSelectedAddress(current ?? null);
        await setSelectedAddressId(current ? current.id : null);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => { void hydrate(); }, [hydrate]);

    const addAddress = useCallback(async (addr: Address, selectAfter = true) => {
      await saveAddress(addr);
      const list = await getAddresses();
      setAddresses(list);
      if (selectAfter) {
        setSelectedAddress(addr);
        await setSelectedAddressId(addr.id);
      }
    }, []);

    const selectAddress = useCallback(async (id: string | null) => {
      if (!id) {
        setSelectedAddress(null);
        await setSelectedAddressId(null);
        return;
      }
      const found = addresses.find(a => a.id === id) ?? null;
      setSelectedAddress(found);
      await setSelectedAddressId(found ? found.id : null);
    }, [addresses]);

    const removeAddress = useCallback(async (id: string) => {
      await removeAddressById(id);
      const list = await getAddresses();
      setAddresses(list);
      // if selected is removed, fall back to first or null
      if (selectedAddress?.id === id) {
        const next = list[0] ?? null;
        setSelectedAddress(next);
        await setSelectedAddressId(next ? next.id : null);
      }
    }, [selectedAddress]);

    const refresh = useCallback(async () => {
      await hydrate();
    }, [hydrate]);

    const value = useMemo<AddressContextValue>(() => ({
      loading, addresses, selectedAddress,
      addAddress, selectAddress, removeAddress, refresh,
    }), [loading, addresses, selectedAddress, addAddress, selectAddress, removeAddress, refresh]);

    return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
  }

  export function useAddress() {
    const ctx = useContext(AddressContext);
    if (!ctx) throw new Error('useAddress must be used inside <AddressProvider>');
    return ctx;
  }
