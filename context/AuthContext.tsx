import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockAuthAPI } from '../api/mockApi';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (phone: string) => Promise<any>;
  verifyOTP: (otp: string) => Promise<any>;
  updateProfile: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  tempPhone: string;
}
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tempPhone, setTempPhone] = useState<string>('');

  useEffect(() => {
    // Check if user is logged in
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.log('Error loading user data', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (phoneNumber: string): Promise<any> => {
    try {
      setTempPhone(phoneNumber);
      // Mock API call to send OTP
      const response = await mockAuthAPI.sendOTP(phoneNumber);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (otp: string): Promise<any> => {
    try {
      // Mock API call to verify OTP
      const response = await mockAuthAPI.verifyOTP(tempPhone, otp);

      if (response.success) {
        setUser(response.user);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (userData: any): Promise<any> => {
    try {
      // Mock API call to update profile
      const response = await mockAuthAPI.updateProfile(userData);

      if (response.success) {
        setUser({...user, ...userData});
        await AsyncStorage.setItem('user', JSON.stringify({...user, ...userData}));
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.log('Error logging out', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        verifyOTP,
        updateProfile,
        logout,
        tempPhone
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};