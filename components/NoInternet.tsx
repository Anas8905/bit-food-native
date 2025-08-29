import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NoInternet = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <Feather name="wifi-off" size={60} color="#FA4A0C" />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.message}>
        Your internet connection is currently not available please check or try again.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onRetry}
      >
        <Text style={styles.buttonText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FA4A0C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NoInternet;