export interface AuthContextType {
    user: User | null;
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
