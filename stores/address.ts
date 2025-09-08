// stores/address.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Address } from '@/types/address';
import { norm } from '@/utils/common.utils';
import { asyncStorage } from '@/services/asyncStorage';

// ---------- helpers ----------
const round = (n: number) => Number(n.toFixed(6));

const dedupe = (list: Address[]): Address[] => {
  const seen = new Map<string, Address>();
  for (const a of list) {
    const key = `${a.address}-${round(a.latitude)}-${round(a.longitude)}`;
    if (!seen.has(key)) seen.set(key, a);
  }
  return Array.from(seen.values());
};

const computeSelected = (list: Address[], id: string | null): Address | null =>
  id ? list.find((a) => a.id === id) ?? null : list[0] ?? null;

// ---------- store ----------
type AddressState = {
  loading: boolean;
  addresses: Address[];
  selectedAddress: Address | null;
  selectedAddressId: string | null;

  refresh: () => Promise<void>;
  addAddress: (addr: Address, selectAfter?: boolean) => Promise<void>;
  selectAddress: (id: string | null) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  reset: () => Promise<void>;
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      loading: true,
      addresses: [],
      selectedAddress: null,
      selectedAddressId: null,

      // ---------- public API ----------
      refresh: async () => {
        const { addresses, selectedAddressId } = get();
        set({
          selectedAddress: computeSelected(addresses, selectedAddressId),
        });
      },

      addAddress: async (addr, selectAfter = true) => {
        // Simulate delay
        await new Promise((r) => setTimeout(r, 1000));

        const list = get().addresses;
        const isOther = norm(addr.label) === 'other';

        const next = isOther
          ? [...list, addr]
          : [addr, ...list.filter((a) => norm(a.label) !== norm(addr.label))];

        const clipped = dedupe(next).slice(0, 20);

        const selectedAddressId = selectAfter ? addr.id : get().selectedAddressId;

        set({
          addresses: clipped,
          selectedAddressId,
          selectedAddress: computeSelected(clipped, selectedAddressId),
        });
      },

      selectAddress: async (id) => {
        const { addresses } = get();

        // Simulate delay
        await new Promise((r) => setTimeout(r, 1000));

        set({
          selectedAddressId: id,
          selectedAddress: computeSelected(addresses, id),
        });
      },

      removeAddress: async (id) => {
        const { addresses, selectedAddressId } = get();
        const next = addresses.filter((a) => a.id !== id);

        const nextSelectedId =
          selectedAddressId === id ? (next[0]?.id ?? null) : selectedAddressId;

        set({
          addresses: next,
          selectedAddressId: nextSelectedId,
          selectedAddress: computeSelected(next, nextSelectedId),
        });
      },

      reset: async () => {
        set({
          addresses: [],
          selectedAddress: null,
          selectedAddressId: null,
        });
      },
    }),
    {
      name: 'addr-store',
      storage: createJSONStorage(() => asyncStorage),

      partialize: (s) => ({
        addresses: s.addresses,
        selectedAddressId: s.selectedAddressId,
      }),

      onRehydrateStorage: () => {
        // before hydration
        return () => {
          // after hydration
          const { addresses, selectedAddressId } = useAddressStore.getState();

          useAddressStore.setState({
            selectedAddress: computeSelected(addresses, selectedAddressId),
            loading: false,
          });
        };
      },
      version: 1,
    }
  )
);
