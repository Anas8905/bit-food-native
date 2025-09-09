type AddressState = {
  loading: boolean;
  addresses: Address[];
  selectedAddress: Address | null;
  selectedAddressId: string | null;

  refresh: () => Promise<void>;
  addAddress: (addr: Address, selectAfter?: boolean) => Promise<void>;
  selectAddress: (id: string | null) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  reset: () => Promise<void>;
};

interface AddressStateType {
  loading: boolean;
  addresses: Address[];
  selectedAddress: Address | null;
  addAddress: (address: Address, select?: boolean) => Promise<void>;
  selectAddress: (id: string | null) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  resetAddresses: () => Promise<void>;
  refresh: () => Promise<void>;
}

type AddressLabel = 'Home' | 'Work' | 'Other';

type Address = {
    id: string;
    label: string;
    address: string;
    latitude: number;
    longitude: number;
};
