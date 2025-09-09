import { create } from 'zustand';

export const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: true,
  setIsConnected: (isConnected) => set({ isConnected }),
}));
