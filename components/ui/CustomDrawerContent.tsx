import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => props.navigation.closeDrawer()}>
          <Entypo name="cross" size={24} />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <Text style={styles.name}>Taimoor Khan</Text>
          <Text style={styles.phone}>+92 3212033774</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <DrawerItem
          label="Profile"
          icon={() => <Feather name="user" size={20} />}
          onPress={() => {}}
        />
        <DrawerItem
          label="Order History"
          icon={() => <MaterialIcons name="reorder" size={20} />}
          onPress={() => {}}
        />
        <DrawerItem
          label="Notifications"
          icon={() => <Feather name="bell" size={20} />}
          onPress={() => {}}
        />
        <DrawerItem
          label="Offers & Promos"
          icon={() => <Feather name="tag" size={20} />}
          onPress={() => {}}
        />
        <DrawerItem
          label="Privacy Policy"
          icon={() => <Feather name="shield" size={20} />}
          onPress={() => {}}
        />
        <DrawerItem
          label="FAQ’s"
          icon={() => <Feather name="help-circle" size={20} />}
          onPress={() => {}}
        />
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutBtn}>
          <Feather name="log-out" size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  closeBtn: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  profileContainer: {
    marginTop: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  phone: {
    fontSize: 14,
    color: '#888',
  },
  menu: {
    marginTop: 20,
  },
  logoutContainer: {
    marginTop: 'auto',
    padding: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
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
