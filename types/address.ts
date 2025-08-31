export type AddressContextValue = {
  loading: boolean;
  addresses: Address[];
  selectedAddress: Address | null;
  addAddress: (addr: Address, selectAfter?: boolean) => Promise<void>;
  selectAddress: (id: string | null) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

export type AddressLabel = 'Home' | 'Office' | 'Other';

export type Address = {
    id: string;
    label: string;
    address: string;
    latitude: number;
    longitude: number;
  };
