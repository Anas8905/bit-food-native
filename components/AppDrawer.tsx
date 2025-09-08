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
  };

  return (
    <DrawerBase
      isOpen={isOpen}
      onClose={closeDrawer}
      width="75%"
      side="left"
      duration={300}
      renderHeader={() => (
        <View style={{ marginTop: 20, }}>
          <TouchableOpacity onPress={closeDrawer} style={styles.closeBtn}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 16, gap: 4 }}>
            <Text style={styles.userName}>{user?.fullName}</Text>
            <Text style={styles.phone}>{user?.phoneNumber}</Text>
          </View>
        </View>
      )}
      renderContent={({ close }) => (
        <View style={{ marginTop: 10, gap: 22, }}>
          <DrawerItem
            label="Order History"
            icon={<Feather name="clock" size={20} />}
            onPress={() => {
              router.navigate('/reorder');
              close();
            }}
          />
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

const DrawerItem = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      {icon ? <View>{icon}</View> : null}
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
  },
  closeIcon: {
    fontSize: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 14,
    color: '#888',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontSize: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6
  },
  logoutText: {
    fontSize: 16,
  },
});
