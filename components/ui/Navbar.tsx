import { useAddress } from '@/hooks/useAddress';
import { useAlert } from '@/hooks/useAlert';
import { useCart } from '@/hooks/useCart';
import { useDrawer } from '@/hooks/useDrawer';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MenuIcon from '../../assets/images/menu.svg';

export default function Navbar(): React.JSX.Element{
  const router = useRouter();
  const pathname = usePathname();
  const { openDrawer } = useDrawer();
  const { addresses, selectedAddress, selectAddress } = useAddress();
  const { cartItemsCount } = useCart();
  const { showAlert } = useAlert();

  const labels = useMemo(
    () => (addresses ?? []).map(({ id, label }) => ({ label, value: id })),
    [addresses]
  );

  const selectLocation = () => {
    if (addresses.length <= 0) {
      if (pathname === "/address") {
        return showAlert(
          'No Delivery Address',
          "Please add a delivery address and try again.",
        )
      } else {
        return showAlert(
          'No Delivery Address',
          "Please add a delivery address and try again.",
          [
            {
              text: 'Add Address',
              onPress: () => router.navigate('/address'),
              style: 'default',
            },
            {
              text: 'Cancel',
              style: 'destructive',
            },
          ]
        )
      }
    }
  }

  const updateDeliveryAddress = async (id: string) => {
    if (id === selectedAddress?.id) return;

    try {
      await selectAddress(id);
      showAlert('Success', 'Your delivery address is updated.');
    } catch {
      showAlert('Failed to update delivery address.');
    }
  }

  return (
    <View style={styles.navbar}>
      {/* Menu Button */}
      <TouchableOpacity onPress={openDrawer} style={[styles.circleButton]}>
        <MenuIcon width={46} height={46} color="#101010" />
      </TouchableOpacity>

      {/* Center */}
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
          <TouchableOpacity style={styles.locationRow} onPress={selectLocation}>
            <Text style={styles.location}>Select location</Text>
            <Ionicons name="chevron-down" size={12} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Button */}
      <TouchableOpacity
        style={[styles.circleButton]}
        onPress={() => router.navigate('/cart')}
      >
        <Ionicons name="cart-outline" size={20} color="black" />
        {cartItemsCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItemsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
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
    minWidth: 94,
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

