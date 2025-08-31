import { NetworkContextType } from '@/types/network';
import NetInfo from '@react-native-community/netinfo';
import { createContext, useEffect, useState } from 'react';

export const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected); // ✅ force boolean
    });

    // Optional: fetch current state once at mount
    NetInfo.fetch().then(state => {
      setIsConnected(!!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};