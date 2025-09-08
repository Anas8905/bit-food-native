import AddressMap from '@/components/AddressMap';
import { isAndroid } from '@/utils/common.utils';
import { StyleSheet, View } from 'react-native';

export default function AddressScreen() {
  return (
    <View style={styles.container}>
      <AddressMap addressId={null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isAndroid ? 8 : 0,
  },
})