import AddressMap from '@/components/AddressMap';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function AddressScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AddressMap />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
})