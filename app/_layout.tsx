import { Stack, usePathname } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppDrawer from '@/components/AppDrawer';
import { AddressProvider } from '@/context/AddressContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { DrawerProvider } from '../context/DrawerContext';
import { NetworkProvider } from '../context/NetworkContext';
import Navbar from '@/components/ui/Navbar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { navScreens, screens } from '@/constants/screens';

export default function RootLayout() {
  const pathname = usePathname();

  const showNavbar = navScreens.includes(pathname);

  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <AddressProvider>
          <CartProvider>
            <AuthProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <DrawerProvider>
                  {showNavbar && (
                    <SafeAreaView>
                      <View style={styles.container}>
                        <Navbar />
                      </View>
                    </SafeAreaView>
                  )}
                  <Stack screenOptions={{ headerShown: false }}>
                    {screens.map((name) => (
                      <Stack.Screen key={name} name={name} />
                    ))}
                  </Stack>
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
})