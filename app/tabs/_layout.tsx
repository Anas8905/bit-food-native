import { useCart } from '@/hooks/useCart';
import { Fontisto, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import MapIcon from '../../assets/images/map.svg';
import HomeIcon from '../../assets/images/home.svg';
import SearchIcon from '../../assets/images/search.svg';

export default function TabLayout() {
  const { cart, favorites } = useCart();
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favItemsCount = favorites.length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FA4A0C',
        tabBarInactiveTintColor: '#101010',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="address"
        options={{
          title: 'Address',
          tabBarIcon: ({ color }) => (
            <MapIcon width={22} height={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <SearchIcon width={20} height={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <HomeIcon width={26} height={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => (
          <View>
            <Fontisto name="heart-alt" size={18} color={color} />
            {favItemsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favItemsCount}</Text>
              </View>
            )}
          </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <View>
              <Ionicons name="cart-outline" size={24} color={color} />
              {cartItemsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemsCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -9,
    backgroundColor: '#FA4A0C',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
