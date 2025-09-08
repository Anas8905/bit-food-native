import { useNetworkStore } from '@/stores/network';
import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';

export function NetworkListener(): null {
  const setIsConnected = useNetworkStore((s) => s.setIsConnected);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected);
    });

    NetInfo.fetch().then((state) => setIsConnected(!!state.isConnected));

    return unsubscribe;
  }, [setIsConnected]);

  return null;
}
