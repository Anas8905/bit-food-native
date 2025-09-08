import { Stack, usePathname } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppDrawer from '@/components/AppDrawer';
import { AddressProvider } from '@/context/AddressContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { DrawerProvider } from '../context/DrawerContext';
import { NetworkProvider } from '../context/NetworkContext';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { navScreens, screens } from '@/constants/screens';
import { AlertProvider } from '@/context/AlertContext';
import Navbar from '@/components/ui/Navbar';
import { isAndroid } from '@/utils/common.utils';

export default function RootLayout() {
  const pathname = usePathname();

  const showNavbar = navScreens.includes(pathname);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NetworkProvider>
            <AlertProvider>
              <AddressProvider>
                <AuthProvider>
                  <CartProvider>
                          <DrawerProvider>
                            {showNavbar && (
                              <SafeAreaView style={{ backgroundColor: '#fff' }}>
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
                  </CartProvider>
                </AuthProvider>
              </AddressProvider>
            </AlertProvider>
        </NetworkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: isAndroid ?  46 : 0,
  },
})