import React from 'react';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDrawer } from '../hooks/useDrawer';
import { useAuth } from '../hooks/useAuth';
import DrawerBase from './DrawBase';

export default function AppDrawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    closeDrawer();
    router.push('/login');
  };

  return (
    <DrawerBase
      isOpen={isOpen}
      onClose={closeDrawer}
      width="75%"
      side="left"
      duration={300}
      renderHeader={() => (
        <View>
          <TouchableOpacity onPress={closeDrawer} style={{ marginBottom: 10 }}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 16 }}>
            <Text style={styles.userName}>{user?.fullName}</Text>
            <Text style={styles.phone}>{user?.phoneNumber}</Text>
          </View>
        </View>
      )}
      renderContent={({ close }) => (
        <View>
          <DrawerItem
            label="Profile"
            icon={<Feather name="user" size={20} />}
            onPress={() => {
              router.push('/profile');
              close();
            }}
          />
          <DrawerItem
            label="Order History"
            icon={<Feather name="clock" size={20} />}
            onPress={() => {
              router.push('/reorder');
              close();
            }}
          />
          <DrawerItem label="Notifications" icon={<Feather name="bell" size={20} />} />
          <DrawerItem label="Offers & Promos" icon={<Feather name="tag" size={20} />} />
          <DrawerItem label="Privacy Policy" icon={<Feather name="shield" size={20} />} />
          <DrawerItem label="FAQs" icon={<Feather name="help-circle" size={20} />} />
        </View>
      )}
      renderFooter={() => (
        <View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Feather name="log-out" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

function DrawerItem({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      {icon ? <View style={{ marginRight: 12 }}>{icon}</View> : null}
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  closeIcon: { fontSize: 20, alignSelf: 'flex-start' },
  userName: { fontSize: 18, fontWeight: 'bold' },
  phone: { fontSize: 14, color: '#888' },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  itemText: { fontSize: 16 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  logoutText: { fontSize: 16, marginLeft: 10 },
});
