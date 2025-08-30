export type AddressLabel = 'Home' | 'Office' | 'Other';

export type Address = {
    id: string;
    label: string;
    address: string;
    latitude: number;
    longitude: number;
  };
