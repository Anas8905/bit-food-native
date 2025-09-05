import AddressMap from '@/components/AddressMap';
import Navbar from '@/components/ui/Navbar';
import { isAndroid } from '@/utils/common.utils';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export default function AddressScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navWrap}>
        <Navbar />
      </View>
      <AddressMap />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: isAndroid ? 24 : 0,
  },
  navWrap: {
    paddingHorizontal: 20,
  },
})