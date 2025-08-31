import { DEFAULT_REGION, LABEL_OPTIONS, makeId } from '@/constants/address';
import { Address, AddressFormProps } from '@/types/address';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MapView, { Marker, Region } from 'react-native-maps';
import { useAddress } from '../hooks/useAddress';

export default function AddressMap({ addressId, saveButtonText = 'Save Address' }: AddressFormProps) {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const { addAddress, addresses } = useAddress();
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [pin, setPin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [busy, setBusy] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!addressId)

  const editMode = !!addressId;

  useEffect(() => {
    if (!editMode) {
      setAddress('');
      setLabel('');
      setPin(null);
      return;
    }

    const addressObj = addresses.find(i => i.id === addressId);
    if (!addressObj) {
      setAddress('');
      setLabel('');
      setPin(null);
      return;
    }

    setAddress(addressObj.address ?? '');
    setLabel(addressObj.label ?? '');

    const coords = { latitude: addressObj.latitude, longitude: addressObj.longitude };
    setPin(coords);
    setRegion({
      ...coords,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012
    });
  }, [addressId, addresses, editMode]);

  const geocodeAndPreview = async () => {
    if (!address.trim()) {
      return Alert.alert('Enter an address', 'Please type the street, area, city, etc.');
    }

    setBusy(true);
    try {
      const results = await Location.geocodeAsync(address.trim());
      if (!results?.length) {
        Alert.alert('Not found', 'Could not locate that address. Please refine it.');
        return;
      }

      const { latitude, longitude } = results[0];
      const next: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012
      };
      setPin({ latitude, longitude });
      setRegion(next);
      mapRef.current?.animateToRegion(next, 600);
    } catch (err) {
      Alert.alert('Error', 'Geocoding failed. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const useCurrentLocation = async () => {
    setBusy(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need location permission to use your current position.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.Balanced
      });
      const { latitude, longitude } = loc.coords;
      setPin({ latitude, longitude });

      const next: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012
      };
      setRegion(next);
      mapRef.current?.animateToRegion(next, 600);

      try {
        const r = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (r?.[0]) {
          const a = r[0];
          const line = [a.name, a.street, a.city, a.region, a.postalCode, a.country]
            .filter(Boolean)
            .join(', ');
          setAddress(line);
        }
      } catch {}
    } catch {
      Alert.alert('Error', 'Could not get your current location.');
    } finally {
      setBusy(false);
    }
  };

  const saveAddress = async () => {
    if (!pin) {
      return Alert.alert('Warning', 'Geocode first, then adjust the pin if needed.');
    }

    setIsSaving(true);

    const addr: Address = {
      id: editMode ? addressId! : makeId(),
      label: label.trim() || 'Other',
      address: address.trim() || `${pin.latitude.toFixed(5)}, ${pin.longitude.toFixed(5)}`,
      latitude: pin.latitude,
      longitude: pin.longitude,
    };

    try {
      await addAddress(addr, true);
      Alert.alert('✅ Saved', 'This address is now selected for delivery.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputs}>
        <TextInput
          placeholder="Address (street, area, city or nearby landmark)"
          value={address}
          onChangeText={setAddress}
          style={[styles.input, { textAlignVertical: 'top' }]}
          autoCapitalize="words"
          spellCheck={false}
          autoCorrect={false}
          multiline
          numberOfLines={3}
        />

        <Dropdown
          data={LABEL_OPTIONS}
          labelField="label"
          valueField="label"
          placeholder="Select a label..."
          value={label || null}
          onChange={(item) => setLabel(item.label)}
          style={styles.input}
        />

        <View style={styles.row}>
          <TouchableOpacity
            onPress={geocodeAndPreview}
            style={styles.btn}
            disabled={busy}
          >
            <Text style={styles.btnText}>
              {busy ? 'Working…' : 'Geocode & Preview'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={useCurrentLocation}
            style={[styles.btn, styles.ghost]}
            disabled={busy}
          >
            <Text style={[styles.btnText, styles.ghostText]}>
              Use current location
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={(r) => setRegion(r)}
      >
        {pin && (
          <Marker
            coordinate={pin}
            draggable
            title={label || 'Delivery location'}
            description={address}
            onDragEnd={(e) => setPin(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>

      <View style={[styles.actionBtns, isEditMode ? styles.actionEdit : styles.actionCreate]}>
      {isEditMode && (
          <TouchableOpacity onPress={() => router.back()} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
      )}

        <TouchableOpacity
          onPress={saveAddress}
          style={styles.save}
          disabled={!pin || isSaving}
          activeOpacity={0.7}
        >
          {isSaving ? (
            <ActivityIndicator color="white" size={16} />
          ) : (
            <Text style={styles.saveText}>{saveButtonText}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputs: {
    padding: 12,
    paddingTop: Platform.select({ ios: 16, android: 12 }),
  },
  input: {
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FA4A0C',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
  ghost: {
    backgroundColor: '#f1f1f1',
  },
  ghostText: {
    color: '#111',
  },
  map: {
    flex: 1,
  },
  actionBtns: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionCreate: {
    bottom: 20,
  },
  actionEdit: {
    bottom: 45,
  },
  save: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#FA4A0C',
    alignItems: 'center',
    flex: 1,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
  cancel: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  cancelText: {
    color: '#111',
    fontWeight: '700',
  },
});

