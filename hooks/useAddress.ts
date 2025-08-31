import { useContext } from "react";
import { AddressContext } from "@/context/AddressContext";

export const useAddress = () => {
    const ctx = useContext(AddressContext);
    if (!ctx) throw new Error('useAddress must be used inside <AddressProvider>');
    return ctx;
}
