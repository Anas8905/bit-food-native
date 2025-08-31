import AddressMap from '@/components/AddressMap';
import { useLocalSearchParams } from 'expo-router';

export default function EditAddressScreen() {
  const { addressId } = useLocalSearchParams<{ addressId: string }>();

  return (
    <AddressMap
      addressId={addressId}
      saveButtonText="Update Address"
    />
  );
}