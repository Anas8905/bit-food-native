import { useAuthStore } from '@/stores/auth';

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const tempUser = useAuthStore((s) => s.tempUser);
  const loading = useAuthStore((s) => s.loading);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const login = useAuthStore((s) => s.login);
  const verifyOTP = useAuthStore((s) => s.verifyOTP);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);

  return { user, tempUser, setUser, loading, hydrated, login, verifyOTP, updateProfile, logout, setLoading };
};
