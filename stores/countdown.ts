import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorage } from '@/services/asyncStorage';

type CountdownState = {
  ends: Record<string, number>;
  hydrated: boolean;
  setEnd: (id: string, endTime: number) => void;
  remove: (id: string) => void;
  getEnd: (id: string) => number | undefined;
};

export const useCountdownStore = create<CountdownState>()(
  persist(
    (set, get) => ({
      ends: {},
      hydrated: false,
      setEnd: (id, endTime) =>
        set((s) => ({ ends: { ...s.ends, [id]: endTime } })),
      remove: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.ends;
          return { ends: rest };
        }),
      getEnd: (id) => get().ends[id],
    }),
    {
      name: 'countdown-store',
      storage: createJSONStorage(() => asyncStorage),
      onRehydrateStorage: () => (state, error) => {
        state?.setEnd && setTimeout(() => {
          state.hydrated = true;
        }, 0);
      },
    }
  )
);
