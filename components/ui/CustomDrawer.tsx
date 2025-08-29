// components/CustomDrawer.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDrawer } from '../../context/DrawerContext';
import { useAuth } from '@/context/AuthContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CustomDrawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const { logout } = useAuth();
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }

    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (!isOpen) {
        setVisible(false);
      }
    });
  }, [isOpen, translateX]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  }

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={closeDrawer}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={closeDrawer}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <View style={styles.drawerTitle}>
            <Text style={styles.userName}>Taimoor Khan</Text>
            <Text style={styles.phone}>+92 3212033774</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <DrawerItem label="Profile" icon="user"
            onPress={() => {
              router.push('/profile')
              closeDrawer()
            }}
          />
          <DrawerItem label="Order History" icon="clock"
            onPress={() => {
              router.push('/reorder')
              closeDrawer()
            }}
          />
          <DrawerItem label="Notifications" icon="bell" />
          <DrawerItem label="Offers & Promos" icon="tag" />
          <DrawerItem label="Privacy Policy" icon="shield" />
          <DrawerItem label="FAQs" icon="help-circle" />
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Feather name="log-out" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

function DrawerItem({
  label,
  icon,
  onPress = () => {},
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap | keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Feather name={icon as any} size={20} style={{ marginRight: 12 }} />
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  drawer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.75,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
  },
  closeIcon: {
    fontSize: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  drawerTitle: {
    marginTop: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 14,
    color: '#888',
  },
  menu: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  itemText: {
    fontSize: 16,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
    marginBottom: 40,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
