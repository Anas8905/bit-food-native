import { useAddress } from '@/hooks/useAddress';
import { useDrawer } from '@/hooks/useDrawer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type NavbarProps = {
  cartCount?: number;
};

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const { addresses, selectedAddress, selectAddress } = useAddress();

  const labels = useMemo(
    () => (addresses ?? []).map(({ id, label }) => ({ label, value: id })),
    [addresses]
  );

    const updateDeliveryAddress = async (id: string) => {
      try {
        await selectAddress(id);
        Alert.alert('Success', 'Your delivery address is updated.');
      } catch {
        Alert.alert('Failed to update delivery address.');
      }
    }

  return (
    <View style={styles.navbar}>
      {/* Menu Button */}
      <TouchableOpacity onPress={openDrawer}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>


      {/* Center Text */}
      <View style={styles.centerText}>
        <Text style={styles.label}>DELIVER TO</Text>
        {labels.length > 0 ? (
          <Dropdown
            data={labels}
            labelField="label"
            valueField="value"
            value={selectedAddress?.id ?? null}
            onChange={(item) => {
              updateDeliveryAddress(item.value);
            }}
            style={styles.input}
          />
        ) : (
          <TouchableOpacity style={styles.locationRow} onPress={() => router.push('/tabs/address')}>
            <Text style={styles.location}>Select location</Text>
            <Ionicons name="chevron-down" size={12} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Button */}
      <TouchableOpacity
        style={[styles.circleButton]}
        onPress={() => router.push('/tabs/cart')}
      >
        <Ionicons name="cart-outline" size={20} color="black" />
        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? 60 : 70,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingHorizontal: 16,
  },
  input: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginBottom: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ff4d00',
    borderRadius: 10,
    paddingHorizontal: 5,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 18,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  centerText: {
    alignItems: 'center',
    width: '25%'
  },
  label: {
    fontSize: 10,
    color: '#FF4500',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  locationRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: '#333',
  },
});

