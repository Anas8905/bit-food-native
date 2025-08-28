import { useDrawer } from '@/context/DrawerContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
type RootDrawerParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};


type NavbarProps = {
  location?: string;
  cartCount?: number;
};

const Navbar: React.FC<NavbarProps> = ({ location = 'Home', cartCount = 2 }) => {
  const { openDrawer } = useDrawer(); // ✅ fix: destructure the hook
  const navigation = useNavigation(); // for cart navigation

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
        style={[styles.circleButton, styles.cartButton]}
        onPress={() => navigation.navigate('Cart')}
      >
        <Ionicons name="cart-outline" size={20} color="white" />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    backgroundColor: '#000',
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
