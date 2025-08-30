import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockOrderAPI } from '../api/mockApi';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useAddress } from '@/context/AddressContext';

const CheckoutScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  const { selectedAddress: selectedAddr } = useAddress();

  const [selectedAddress, setSelectedAddress] = useState(selectedAddr);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const gst = Math.round(subtotal * 0.16);
  const deliveryFee = 0; // Free delivery
  const discount = 320; // Example discount
  const total = subtotal + gst - discount;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        userId: user.id,
        items: cart,
        subtotal,
        gst,
        deliveryFee,
        discount,
        total,
        address: selectedAddress,
        paymentMethod,
        deliveryInstructions,
      };

      const { order } = await mockOrderAPI.placeOrder(orderData);

      clearCart();
      router.replace(`/track?orderId=${order.id}` as any);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="location-pin" size={20} color="#FA4A0C" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => router.push({
                pathname: '/tabs/address',
                params: { addressId: selectedAddress?.id },
              })}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressContainer}>
            <Image source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-23%20at%201.11.43%E2%80%AFPM-ZvQHn1EW8H5bsPTWEiLGUZ2OsMWNiq.png' }} style={styles.mapImage} />
            <Text style={styles.address}>{selectedAddress?.address}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color="#FA4A0C" />
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => {}}
            >
              <Text style={styles.changeButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Full Name: {user.fullName}</Text>
            <Text style={styles.detailLabel}>Phone No: {user.phoneNumber}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="credit-card" size={18} color="#FA4A0C" />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <View style={styles.paymentContainer}>
            <Text style={styles.paymentMethod}>Cash on Delivery (COD)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={20} color="#FA4A0C" />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub Total</Text>
              <Text style={styles.summaryValue}>Rs. {subtotal}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (16%)</Text>
              <Text style={styles.summaryValue}>Rs. {gst}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: '#FA4A0C' }]}>Discount</Text>
              <Text style={[styles.summaryValue, { color: '#FA4A0C' }]}>-{discount}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>Rs. {total}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.instructionsTitle}>Delivery Instructions</Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="e.g Don't ring the doorbell"
            value={deliveryInstructions}
            onChangeText={setDeliveryInstructions}
            multiline
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.placeOrderButtonText}>PLACE ORDER</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  changeButton: {
    marginLeft: 'auto',
  },
  changeButtonText: {
    color: '#FA4A0C',
    fontWeight: 'bold',
  },
  addressContainer: {
    marginTop: 5,
  },
  mapImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailsContainer: {
    marginTop: 5,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  paymentContainer: {
    marginTop: 5,
  },
  paymentMethod: {
    fontSize: 14,
  },
  summaryContainer: {
    marginTop: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  placeOrderButton: {
    backgroundColor: '#FA4A0C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;