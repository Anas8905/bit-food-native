import AddressMap from '@/components/AddressMap';
import Navbar from '@/components/ui/Navbar';
import { isAndroid } from '@/utils/common.utils';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export default function EditAddressScreen(): React.JSX.Element {
  const { addressId } = useLocalSearchParams<{ addressId: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navWrap}>
        <Navbar />
      </View>
      <AddressMap
        addressId={addressId}
        saveButtonText="Update Address"
      />
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
