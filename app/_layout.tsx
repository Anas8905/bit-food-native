import { AlertHost } from '@/components/AlertHost';
import AppDrawer from '@/components/AppDrawer';
import { NetworkListener } from '@/components/NetworkListener';
import Navbar from '@/components/ui/Navbar';
import { navScreens, screens } from '@/constants/screens';
import { isAndroid } from '@/utils/common.utils';
import { Stack, usePathname } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout(): React.JSX.Element {
  const pathname = usePathname();
  const showNavbar = navScreens.includes(pathname);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NetworkListener />
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
        <AlertHost />
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
