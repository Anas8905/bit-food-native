import BackButton from '@/components/BackButton';
import EmptyState from '@/components/EmptyState';
import { useAddress } from '@/hooks/useAddress';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/auth';
import { norm } from '@/utils/common.utils';
import { AntDesign, Feather, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
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

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { addresses, selectAddress, selectedAddress, removeAddress } = useAddress();
  const [fullName, setFullName] = useState(user?.fullName);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
  const [email, setEmail] = useState(user?.email);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("");

  const AddressIcon = ({ label }: { label?: string }) => {
    const l = norm(label);

    if (l === 'home') {
      return <AntDesign name="home" size={20} color="#009DFF" />;
    }
    if (l === 'work') {
      return <FontAwesome5 name="building" size={20} color="orange" />;
    }
    return <FontAwesome5 name="map-marker-alt" size={20} color="red" />;
  }

  const updateSelectedAddress = async (id: string) => {
    try {
      setSelectedId(id);
      await selectAddress(id);
      Alert.alert('Success', 'Your selected address is updated.');
    } catch {
      Alert.alert('Failed to update selected address.');
    } finally {
      setSelectedId(null);
    }
  }

  const saveProfile = async () => {
    if (!fullName || !email || !phoneNumber) {
      Alert.alert('Missing fields', 'Please fill all fields.');
      return;
    }

    setIsUpdating(true);
    const updatedUser: User = { fullName, email, phoneNumber };

    try {
      const response = await updateProfile(updatedUser);

      if (response.success) {
        Alert.alert('Profile Updated', `Name: ${fullName}\nPhone: ${phoneNumber}\nEmail: ${email}`);
      }
    } catch {
      Alert.alert('Update Failed', 'Profile is not updated.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text style={styles.title}>EDIT PROFILE</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>FULL NAME</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          placeholder="Full Name"
          editable={!isUpdating}
        />

        <Text style={styles.label}>PHONE NUMBER</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          keyboardType="phone-pad"
          editable={!isUpdating}
        />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isUpdating}
        />
      </View>

      {/* Addresses Header */}
      <View style={styles.addressHeader}>
        <Text style={styles.label}>Addresses</Text>
        <TouchableOpacity
          style={styles.addMore}
          onPress={() => router.replace('/tabs/address')}
          disabled={isUpdating || !!selectedId}
        >
          <Text style={styles.addMoreText}>
            { addresses.length > 0 ? "+ Add More" : "+ Add New" }
          </Text>
        </TouchableOpacity>
      </View>

      {/* Addresses List */}
      {addresses.length > 0 ? (
      <ScrollView
        style={styles.addressesScrollView}
        contentContainerStyle={{ paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {addresses.map((addr) => (
          <TouchableOpacity
            key={addr.id}
            onPress={() => updateSelectedAddress(addr.id)}
            disabled={isUpdating || !!selectedId}
            style={[
              styles.addressCard,
              selectedId === addr.id && styles.disableAddress,
              selectedAddress?.id === addr.id && styles.selectedCard,
            ]}
          >
            <View style={styles.iconBox}>
              <AddressIcon label={addr.label} />
            </View>

            <View style={styles.addressInfo}>
              <Text style={styles.addressType}>{addr.label.toUpperCase()}</Text>
              <Text style={styles.addressText}>{addr.address}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.iconBtn}>
                <FontAwesome6
                  name="edit"
                  size={15}
                  color="#FF4D00"
                  onPress={() => router.push(`/address/${addr.id}`)}
                  disabled={isUpdating || !!selectedId}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Feather
                  name="trash-2"
                  size={16}
                  color="#FF4D00"
                  onPress={() => removeAddress(addr.id)}
                  disabled={isUpdating || !!selectedId}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    ) : (
        <EmptyState
          icon="address"
          title="No Address"
          message="Click the add new button to add your address."
          isAddrScrn={true}
        />
    )}

      {/* Footer Buttons */}
      <View style={styles.footerContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            disabled={isUpdating || !!selectedId}
          >
            <Text style={styles.cancelText}>Discard Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={saveProfile}
            disabled={isUpdating || !!selectedId}
          >
            {isUpdating ? (
                <ActivityIndicator color="white" size={16} />
              ) : (
                <Text style={styles.saveText}>SAVE</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
    addressesScrollView: {
      maxHeight: 350,
      marginTop: 10,
      flexGrow: 0,
    },
    footerContainer: {
      backgroundColor: '#fff',
      paddingTop: 15,
      paddingBottom: 20,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
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
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    disableAddress: {
      opacity: 0.5,
    },
    selectedCard: {
      borderColor: '#ff6534',
      borderWidth: 2,
      backgroundColor: '#fff',
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
      fontWeight: 600,
      color: '#000',
    },
    saveText: {
      color: '#fff',
      fontWeight: 700,
    },
  });
