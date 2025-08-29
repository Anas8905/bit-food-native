import BackButton from '@/components/BackButton';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
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

        <View style={styles.trackingContainer}>
          <View style={styles.trackingStep}>
            <View style={[styles.stepIndicator, styles.completedStep]}>
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
            <Text style={styles.stepText}>Your order has been received</Text>
          </View>

          <View style={styles.trackingLine} />

          <View style={styles.trackingStep}>
            <View style={[styles.stepIndicator, styles.activeStep]}>
              <Ionicons name="restaurant" size={16} color="white" />
            </View>
            <Text style={styles.stepText}>Preparing your food</Text>
          </View>

          <View style={styles.trackingLine} />

          <View style={styles.trackingStep}>
            <View style={styles.stepIndicator}>
              <Ionicons name="bicycle" size={16} color="#CCC" />
            </View>
            <Text style={[styles.stepText, { color: '#999' }]}>Your order has been picked up for delivery</Text>
          </View>

          <View style={styles.trackingLine} />

          <View style={styles.trackingStep}>
            <View style={styles.stepIndicator}>
              <Ionicons name="checkmark-done" size={16} color="#CCC" />
            </View>
            <Text style={[styles.stepText, { color: '#999' }]}>Order arriving soon!</Text>
          </View>
        </View>

        <View style={styles.courierContainer}>
          <Image
            source={{ uri: order.courier.image }}
            style={styles.courierImage}
          />
          <View style={styles.courierInfo}>
            <Text style={styles.courierName}>{order.courier.name}</Text>
            <Text style={styles.courierRole}>Courier</Text>
          </View>
          <View style={styles.courierActions}>
            <TouchableOpacity style={styles.courierActionButton}>
              <Ionicons name="call" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.courierActionButton}>
              <Ionicons name="chatbubble" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#F0F0F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f1f1f1',
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  trackingContainer: {
    padding: 20,
  },
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  activeStep: {
    backgroundColor: '#FA4A0C',
  },
  stepText: {
    fontSize: 14,
  },
  trackingLine: {
    width: 2,
    height: 20,
    backgroundColor: '#F0F0F0',
    marginLeft: 14,
  },
  courierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  courierImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  courierInfo: {
    flex: 1,
    marginLeft: 15,
  },
  courierName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  courierRole: {
    fontSize: 12,
    color: '#999',
  },
  courierActions: {
    flexDirection: 'row',
  },
  courierActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FA4A0C',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default OrderTrackingScreen;