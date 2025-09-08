import { create } from 'zustand';

export type NetworkState = {
  isConnected: boolean;
  setIsConnected: (v: boolean) => void;
};

export const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: true,
  setIsConnected: (isConnected) => set({ isConnected }),
}));
