import { useCart } from '@/hooks/useCart';
import { Tabs } from 'expo-router';
import MapIcon from '../../assets/images/map.svg';
import HomeIcon from '../../assets/images/home.svg';
import ProfileIcon from '../../assets/images/profile.svg';
import HeartIcon from '../../assets/images/heart.svg';
import CartIcon from '../../assets/images/cart.svg';
import { TabBarIcon } from '@/components/ui/TabBarIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout(): React.JSX.Element {
  const { cartItemsCount, favItemsCount } = useCart();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#101010',
        tabBarStyle: {
          paddingTop: 10,
          height: 40 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="address"
        options={{
          title: 'Address',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={MapIcon} color={color} size={20} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={ProfileIcon} color={color} size={19} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={HomeIcon} color={color} size={20} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={({ navigation }) => {
          const isFocused = navigation.isFocused();
          return {
            title: 'Favorites',
            ...(favItemsCount > 0 && {
              tabBarBadge: favItemsCount > 99 ? '99+' : favItemsCount
            }),
            tabBarBadgeStyle: {
              backgroundColor: isFocused ? 'royalblue' : '#FA4F0C',
              fontSize: 10,
              top: isFocused ? -8 : -5,
              left: isFocused ? 18 : 14,
            },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon Icon={HeartIcon} color={color} size={22} focused={focused} />
            ),
          };
        }}
      />
      <Tabs.Screen
        name="cart"
        options={({ navigation }) => {
          const isFocused = navigation.isFocused();
          return {
            title: 'Cart',
            ...(cartItemsCount > 0 && {
              tabBarBadge: cartItemsCount > 99 ? '99+' : cartItemsCount
            }),
            tabBarBadgeStyle: {
              backgroundColor: isFocused ? 'royalblue' : '#FA4F0C',
              fontSize: 10,
              top: isFocused ? -8 : -5,
              left: isFocused ? 18 : 14,
            },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon Icon={CartIcon} color={color} size={20} focused={focused} />
            ),
          };
        }}
      />
    </Tabs>
        );
}

