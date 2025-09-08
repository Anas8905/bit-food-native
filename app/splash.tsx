import { useAddress } from '@/hooks/useAddress';
import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen(): React.JSX.Element {
  const { user, hydrated } = useAuth();
  const { addresses } = useAddress();
  const router = useRouter();
  const pathname = usePathname();

  const addressExists = addresses.length > 0;

  useEffect(() => {
    if (!hydrated) return;

    const timer = setTimeout(() => {
      if (user) {
        if (addressExists && pathname !== "/home") router.replace("/home");
        else if (!addressExists && pathname !== "/address") router.replace("/address");
      } else {
        if (pathname !== "/welcome") router.replace("/welcome");
      }
    }, 2000); // 2s splash delay

    return () => clearTimeout(timer);
  }, [hydrated, user, addressExists, pathname, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Ratatouille</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FA4A0C',
  },
  logo: {
    fontFamily: 'serif',
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    fontStyle: 'italic',
  },
});
