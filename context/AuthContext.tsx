import { getData, removeData, saveData } from '@/services/asyncStorage';
import { AuthContextType, AuthResponse, User } from '@/types/auth';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { mockAuthAPI } from '../api/mockApi';
import { KEYS } from '@/constants/Keys';
import { useAddress } from '@/hooks/useAddress';
import { useRouter } from 'expo-router';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { refresh } = useAddress();

  const logout = useCallback(
    async (opts?: { replace?: boolean }): Promise<void> => {
      try {
        await Promise.all([
          removeData(KEYS.USER),
          removeData(KEYS.TEMP_USER),
          removeData(KEYS.ADDRESSES),
          removeData(KEYS.SELECTED_ADDRESS_ID),
        ]);

        setUser(null);
        await refresh();

        if (opts?.replace) {
          router.replace('/welcome');
        } else {
          router.push('/welcome');
        }
      } catch (error) {
        console.log('Error logging out', error);
      }
    },
    [router, refresh]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // await resetAsyncStorage();
        const existing = await getData<User>(KEYS.USER);
        if (!cancelled) {
          if (!existing) {
            await logout({ replace: true });
          } else {
            setUser(existing)
          }
        }
      } catch {
        if (!cancelled) await logout({ replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [logout]);

  const login = useCallback(async (user: User): Promise<AuthResponse> => {
    // Mock API call to send OTP
    return mockAuthAPI.sendOTP(user);
  }, []);

  const verifyOTP = useCallback(async (otp: string): Promise<AuthResponse> => {
    try {
      const tempUser = await getData<User>(KEYS.TEMP_USER);
      if (!tempUser) {
        return {
          success: false,
          message: 'No user found for OTP verification.',
        };
      }

      // Mock API call to verify OTP
      const response = await mockAuthAPI.verifyOTP(tempUser.phoneNumber, otp);

      if (response.success) {
        setUser(tempUser);
        await saveData(KEYS.USER, tempUser);
        await removeData(KEYS.TEMP_USER);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (userData: User): Promise<AuthResponse> => {
    try {
      // Mock API call to update profile
      return await mockAuthAPI.updateProfile(userData);
    } catch (error) {
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      verifyOTP,
      updateProfile,
      logout,
    }),
    [user, loading, login, verifyOTP, updateProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};