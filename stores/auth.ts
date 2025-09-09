import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mockAuthAPI } from '@/api/mockApi';
import { useAddressStore } from './address';
import { useCartStore } from './cart';
import { asyncStorage } from '@/services/asyncStorage';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tempUser: null,
      loading: false,
      hydrated: false,

      setUser: (u) => set({ user: u, tempUser: null }),
      setLoading: (v) => set({ loading: v }),

      login: async (user) => {
        const res = await mockAuthAPI.sendOTP(user);
        if (res.success) set({ tempUser: user });
        return res;
      },

      verifyOTP: async (otp) => {
        const { tempUser } = get();
        if (!tempUser) return { success: false, message: 'No user found for OTP verification.' };

        return await mockAuthAPI.verifyOTP(tempUser.phoneNumber, otp);
      },

      updateProfile: async (userData) => {
        const res = await mockAuthAPI.updateProfile(userData);
        if (res.success) set({ user: userData });
        return res;
      },

      clearLocalAuthData: async () => {
        set({ user: null, tempUser: null });
        await Promise.all([
          useAddressStore.getState().reset?.(),
          useCartStore.getState().reset?.(),
        ]);
      },

      logout: async () => {
        await get().clearLocalAuthData();
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (s) => ({ user: s.user, tempUser: s.tempUser }),
      version: 1,
      onRehydrateStorage: () => {
        return (_state, error) => {
          useAuthStore.setState({
            hydrated: true,
          });
          if (error) {
            console.error('Auth rehydration failed:', error);
            useAuthStore.setState({ hydrated: true });
          }
        };
      },
    }
  )
);

