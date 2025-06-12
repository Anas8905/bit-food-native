import { Slot } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { NetworkProvider } from '../context/NetworkContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <CartProvider>
          <AuthProvider>
            <Slot /> 
          </AuthProvider>
        </CartProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}
