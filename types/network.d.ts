interface NetworkStateType { isConnected: boolean }

type NetworkState = {
  isConnected: boolean;
  setIsConnected: (v: boolean) => void;
};
