import BackButton from '@/components/BackButton';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const EditProfileScreen = () => {
  const [fullName, setFullName] = useState('Mike P Sullivan');
  const [phoneNumber, setPhoneNumber] = useState('+92 321 2033774');
  const [email, setEmail] = useState('mikepsully@gmail.com');

  const [addresses, setAddresses] = useState<any>([
    {
      type: 'Home',
      icon: 'home',
      color: '#007bff',
      address: 'E-23/12-Z, Al-Rehman Street, Abid Road, Walton',
    },
    {
      type: 'Office',
      icon: 'business',
      color: '#e91e63',
      address: '23 A Khayaban-e-Iqbal, Sector XX DHA Phase 3, Lahore',
    },
  ]);

  const handleSave = () => {
    // You can integrate your API logic here
    Alert.alert('Profile Saved', `Name: ${fullName}\nPhone: ${phoneNumber}\nEmail: ${email}`);
  };

  const handleCancel = () => {
    router.replace('/tabs' as any)
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => router.replace('/tabs/home')} />
        <Text style={styles.title}>EDIT PROFILE</Text>
      </View>

      {/* Fields */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>FULL NAME</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          placeholder="Full Name"
        />

        <Text style={styles.label}>PHONE NUMBER</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
      </View>

      {/* Addresses */}
      <View style={styles.addressHeader}>
        <Text style={styles.label}>Addresses</Text>
        <TouchableOpacity style={styles.addMore}>
          <Text style={styles.addMoreText}>Add More</Text>
        </TouchableOpacity>
      </View>

      {addresses.map((addr, idx) => (
        <View key={idx} style={styles.addressCard}>
          <View style={styles.iconBox}>
            <MaterialIcons name={addr.icon} size={20} color={addr.color} />
          </View>
          <View style={styles.addressInfo}>
            <Text style={styles.addressType}>{addr.type.toUpperCase()}</Text>
            <Text style={styles.addressText}>{addr.address}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="edit" size={16} color="#FF4D00" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="trash-2" size={16} color="#FF4D00" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Footer Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#f0f2f5',
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffeaea',
  },
  cameraIcon: {
    position: 'absolute',
    right: screenWidth / 2 - 30,
    bottom: 0,
    backgroundColor: '#FF2D2D',
    borderRadius: 20,
    padding: 6,
  },
  fieldGroup: {
    marginVertical: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  addMore: {
    borderWidth: 1,
    borderColor: '#FF2D2D',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  addMoreText: {
    color: '#FF2D2D',
    fontSize: 13,
    fontWeight: '500',
  },
  addressCard: {
    backgroundColor: '#f0f4f8',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressType: {
    fontWeight: '700',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
  },
  iconBtn: {
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelBtn: {
    backgroundColor: '#f0f2f5',
    paddingVertical: 14,
    borderRadius: 30,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  saveBtn: {
    backgroundColor: '#FF4D00',
    paddingVertical: 14,
    borderRadius: 30,
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelText: {
    fontWeight: '600',
    color: '#000',
  },
  saveText: {
    fontWeight: '600',
    color: '#fff',
  },
});

export default EditProfileScreen;
