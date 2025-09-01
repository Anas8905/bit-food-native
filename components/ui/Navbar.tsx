import { useDrawer } from '@/hooks/useDrawer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type NavbarProps = {
  location?: string;
  cartCount?: number;
};

const Navbar = ({ location, cartCount = 0 }: NavbarProps) => {
  const { openDrawer } = useDrawer();
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      {/* Menu Button */}

      <TouchableOpacity onPress={openDrawer}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>


      {/* Center Text */}
      <View style={styles.centerText}>
        <Text style={styles.label}>DELIVER TO</Text>
        <View style={styles.locationRow}>
          <Text style={styles.location}>{location}</Text>
          <Ionicons name="chevron-down" size={16} color="black" />
        </View>
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
  },
  label: {
    fontSize: 10,
    color: '#FF4500',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
    color: '#333',
  },
});

export default Navbar;
