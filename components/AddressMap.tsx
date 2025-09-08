import { DEFAULT_REGION, LABEL_OPTIONS, makeId } from '@/constants/address';
import { useAlert } from '@/context/AlertContext';
import { Address } from '@/types/address';
import { isAndroid } from '@/utils/common.utils';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MapView, { Marker, MarkerDragStartEndEvent, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useAddress } from '../hooks/useAddress';

export interface AddressFormProps {
  addressId?: string;
  saveButtonText?: string;
}

export default function AddressMap({ addressId, saveButtonText = 'Save Address' }: AddressFormProps) {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const { addAddress, addresses } = useAddress();
  const { showAlert } = useAlert();
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [pin, setPin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [busy, setBusy] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode] = useState(!!addressId);

  const editMode = !!addressId;

  const addressObj = useCallback(() => {
    if (!editMode || !addressId) return null;
    return addresses.find(i => i.id === addressId) || null;
  }, [addressId, addresses, editMode]);

  useEffect(() => {
    if (!editMode) {
      setAddress('');
      setLabel('');
      setPin(null);
      setRegion(DEFAULT_REGION);
      return;
    }

    const currentAddressObj = addressObj();
    if (!currentAddressObj) {
      setAddress('');
      setLabel('');
      setPin(null);
      setRegion(DEFAULT_REGION);
      return;
    }

    setAddress(currentAddressObj.address ?? '');
    setLabel(currentAddressObj.label ?? '');

    const coords = { latitude: currentAddressObj.latitude, longitude: currentAddressObj.longitude };
    setPin(coords);
    setRegion({
      ...coords,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012
    });
  }, [editMode, addressObj]);

  const focusRegion = (latitude: number, longitude: number) => ({
    latitude, longitude, latitudeDelta: 0.012, longitudeDelta: 0.012,
  });

  const geocodeAndPreview = async () => {
    if (!address.trim()) {
      return showAlert('Enter an address', 'Please type the street, area, city, etc.');
    }

    setBusy(true);
    try {
      const [result] = await Location.geocodeAsync(address.trim());
      if (!result) {
        return showAlert('Not found', 'Could not locate that address. Please refine it.');
      }

      const { latitude, longitude } = result;
      setPin({ latitude, longitude });
      const next: Region = focusRegion(latitude, longitude);
      setRegion(next);
      mapRef.current?.animateToRegion(next, 600);
    } catch {
      showAlert('Error', 'Geocoding failed. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const useCurrentLocation = async () => {
    setBusy(true);
    try {
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        return showAlert(
          'Location Services Disabled',
          'Please enable location services in your device settings to use this feature.'
        );
      }

      let { status } = await Location.getForegroundPermissionsAsync();

      if (status !== 'granted') {
        const permissionResponse = await Location.requestForegroundPermissionsAsync();
        status = permissionResponse.status;
      }

      if (status !== 'granted') {
        return showAlert(
          'Permission Denied',
          'We need location permission to use your current position. Please enable location access in your device settings.'
        );
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      setPin({ latitude, longitude });

      const next: Region = focusRegion(latitude, longitude);
      setRegion(next);
      mapRef.current?.animateToRegion(next, 600);
      await reverseGeocode(latitude, longitude);
    } catch (error) {
      console.error('Location error:', error);
      showAlert(
        'Error',
        'Could not get your current location. Please check your location settings and try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (results?.length) {
        const r = results[0];
        const parts = [r.name, r.street, r.city, r.region, r.postalCode, r.country]
          .filter(Boolean)
          .join(', ');
        setAddress(parts);
      }
    } catch {}
  }

  const saveAddress = async () => {
    if (!pin) {
      return showAlert('Warning', 'Geocode first, then adjust the pin if needed.');
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
      showAlert('Success', 'This address is now saved and selected for delivery.');
    } catch {
      showAlert('Error', 'Failed to save address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <TextInput
          placeholder="Address (street, area, city or nearby landmark)"
          value={address}
          onChangeText={setAddress}
          style={[styles.input]}
          autoCapitalize="words"
          spellCheck={false}
          autoCorrect={false}
          multiline
          numberOfLines={2}
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
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={(r: Region) => setRegion(r)}
      >
        {pin && (
          <Marker
            coordinate={pin}
            draggable
            title={label || 'Delivery location'}
            description={address}
            onDragEnd={async (e: MarkerDragStartEndEvent) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setPin({ latitude, longitude });
              await reverseGeocode(latitude, longitude);
            }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputs: {
    paddingBottom: 12,
    paddingTop: isAndroid ? 0 : 6,
    paddingHorizontal: 18,
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
    bottom: isAndroid ? 45 : 14,
  },
  autocomplete: {
    flex: 0,
  },
  listView: {
    backgroundColor: '#fff',
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

