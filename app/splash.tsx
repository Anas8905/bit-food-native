import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

const SplashScreen = ({ navigation }) => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth to load and navigate accordingly
      if (!loading) {
        setTimeout(() => {
          if (user) {
            navigation.replace('Main');
          } else {
            navigation.replace('Welcome');
          }
        }, 2000); // 2 seconds delay for splash screen
      }
    };
    
    checkAuth();
  }, [loading, user, navigation]);
  
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
    backgroundColor: '#E84C3D',
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