import { useNetworkStore } from '@/stores/network';

export const useNetwork = (): NetworkStateType => {
  const isConnected = useNetworkStore((s) => s.isConnected);
  return { isConnected };
};
