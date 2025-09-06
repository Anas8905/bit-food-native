export interface AuthContextType {
    user: User | null;
    setUser: (user: User) => void;
    loading: boolean;
    login: (user: User) => Promise<AuthResponse>;
    verifyOTP: (otp: string) => Promise<AuthResponse>;
    updateProfile: (user: User) => Promise<AuthResponse>;
    logout: () => Promise<void>;
}

export type User = {
    fullName: string;
    email: string;
    phoneNumber: string;
};

export type AuthResponse = {
    success: boolean;
    message?: string;
};
