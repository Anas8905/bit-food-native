import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppDrawer from '@/components/AppDrawer';
import { AddressProvider } from '@/context/AddressContext';
import { SearchProvider } from '@/context/SearchContext';
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
                <SearchProvider>
                  <Slot />
                  <AppDrawer />
                </SearchProvider>
              </DrawerProvider>
            </AuthProvider>
          </CartProvider>
        </AddressProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}
