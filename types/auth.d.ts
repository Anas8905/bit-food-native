type AuthState = {
  user: User | null;
  tempUser: User | null;
  loading: boolean;
  hydrated: boolean;

  setUser: (u: User | null) => void;
  setLoading: (v: boolean) => void;

  login: (user: User) => Promise<AuthResponse>;
  verifyOTP: (otp: string) => Promise<AuthResponse>;
  updateProfile: (userData: User) => Promise<AuthResponse>;
  clearLocalAuthData: () => Promise<void>;
  logout: () => Promise<void>;
};

type User = {
    fullName: string;
    email: string;
    phoneNumber: string;
};

type AuthResponse = {
    success: boolean;
    message?: string;
};
