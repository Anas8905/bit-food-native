import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppDrawer from '@/components/AppDrawer';
import { AddressProvider } from '@/context/AddressContext';
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
              <GestureHandlerRootView style={{ flex: 1 }}>
                <DrawerProvider>
                    <Slot />
                    <AppDrawer />
                </DrawerProvider>
              </GestureHandlerRootView>
            </AuthProvider>
          </CartProvider>
        </AddressProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}
