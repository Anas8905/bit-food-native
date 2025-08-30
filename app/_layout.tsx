import { Slot } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AddressProvider } from '@/context/AddressContext';
import CustomDrawer from '../components/ui/CustomDrawer';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { DrawerProvider } from '../context/DrawerContext';
import { NetworkProvider } from '../context/NetworkContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NetworkProvider>
      <AddressProvider>
          <CartProvider>
            <AuthProvider>
              <DrawerProvider>
                <Slot />
                <CustomDrawer />
              </DrawerProvider>
            </AuthProvider>
          </CartProvider>
        </AddressProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}
