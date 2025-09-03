import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockOrderAPI } from '../../api/mockApi';
import CountdownTimer from '@/components/CountDownTimer';
import { Ionicons } from '@expo/vector-icons';
import { isAndroid } from '@/utils/common.utils';


export default function TrackScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { order } = await mockOrderAPI.getOrderById(orderId);
        setOrder(order);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to load order details');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FA4A0C" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Track</Text>
      </View>

      {/* Success Message */}
      <View style={styles.successContainer}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={60} color="#FA4A0C" />
        </View>

        <Text style={styles.successTitle}>Order Placed Successfully</Text>

        <CountdownTimer order={order} styles={styles} />

        <View style={styles.orderDetailsContainer}>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Order ID:</Text>
            <Text style={[styles.orderDetailValue, styles.idText]}>#{order.id}</Text>
          </View>

          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Order Total:</Text>
            <Text style={styles.orderDetailValue}>${order.total}</Text>
          </View>

          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Payment Method:</Text>
            <Text style={styles.orderDetailValue}>Cash on Delivery</Text>
          </View>

          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Delivery Address:</Text>
            <Text
              style={styles.orderDetailValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {order?.deliveryAddress?.address || order.deliveryAddress}
            </Text>
          </View>
        </View>

        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Preparing your order</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  estimatedTime: {
    fontSize: 70,
    fontWeight: '500',
    color: '#FA4A0C'
  },
  estimatedTimeLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  successContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  orderDetailsContainer: {
    backgroundColor: isAndroid ? '#f3f9ff' : '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 25,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderDetailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  orderDetailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
    fontWeight: 500,
  },
  idText: {
    textDecorationLine: 'underline',
    color: '#3b5998',
    fontWeight: 400,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffe2d8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FA4A0C',
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FA4A0C',
  },
});
