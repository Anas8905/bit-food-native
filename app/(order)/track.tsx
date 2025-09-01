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


const OrderTrackingScreen = () => {
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
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.estimatedTime}>
            {order.estimatedDeliveryTime} Min
          </Text>
          <Text style={styles.estimatedTimeLabel}>
            ESTIMATED DELIVERY TIME
          </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
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
    fontSize: 28,
    fontWeight: 'bold',
  },
  estimatedTimeLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default OrderTrackingScreen;