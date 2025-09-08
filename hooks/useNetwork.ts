import { useNetworkStore } from '@/stores/network';

export type NetworkContextType = { isConnected: boolean };

export const useNetwork = (): NetworkContextType => {
  const isConnected = useNetworkStore((s) => s.isConnected);
  return { isConnected };
};
