// app/(drawer)/_layout.tsx
import { createDrawerNavigator } from '@react-navigation/drawer';
import { withLayoutContext } from 'expo-router';
import CustomDrawerContent from '../../components/ui/CustomDrawerContent';

// Create the navigator instance
const DrawerNavigator = createDrawerNavigator();

// Wrap the Navigator component using withLayoutContext
const Drawer = withLayoutContext(DrawerNavigator.Navigator);

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="tabs" />
      <Drawer.Screen name="profile" />
      <Drawer.Screen name="settings" />
    </Drawer>
  );
}
