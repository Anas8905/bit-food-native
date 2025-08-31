import { NetworkContext } from "@/context/NetworkContext";
import { NetworkContextType } from "@/types/network";
import { useContext } from "react";

export const useNetwork = (): NetworkContextType => {
    const context = useContext(NetworkContext);
    if (!context) {
      throw new Error('useNetwork must be used within a NetworkProvider');
    }
    return context;
};
