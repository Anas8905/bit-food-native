import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => {
  const { user, loading } = useAuth();
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth to load and navigate accordingly
      if (!loading) {
        setTimeout(() => {
          if (user) {
            router.push('/tabs/home');
          } else {
            router.replace('/welcome')
          }
        }, 2000); // 2 seconds delay for splash screen
      }
    };

    checkAuth();
  }, [loading, user, router]);

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

export default SplashScreen;