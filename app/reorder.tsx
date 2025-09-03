import { orders } from '@/api/mockApi';
import BackButton from '@/components/BackButton';
import EmptyState from '@/components/EmptyState';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/types/cart';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type TabKey = 'history' | 'ongoing';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'history', label: 'History' },
  { key: 'ongoing', label: 'Ongoing' },
];

export default function OrderScreen() {
    const { cart, addToCart, removeFromCart, isInCart } = useCart();
    const [activeTab, setActiveTab] = useState<TabKey>('history');
    const [loadingId, setLoadingId] = useState<string | null>(null);


    const handleReorder = async (pizza: any): Promise<void> => {
      if (!pizza) return;

      const cartItem: CartItem = {
        id: pizza.id,
        name: pizza.name,
        image: pizza.image,
        size: pizza.size,
        price: pizza.price,
        quantity: pizza.quantity,
      };

      try {
        setLoadingId(pizza.id);

        await new Promise(resolve => setTimeout(resolve, 1000));
        addToCart(cartItem, pizza.quantity);

        Alert.alert('Success', 'Added to cart!', [
          {
            text: 'Stay Here',
            style: 'cancel',
          },
          {
            text: 'Go to Cart',
            onPress: () => router.push('/tabs/cart')
          },
        ]);
      } finally {
        setLoadingId(null);
      }
    };

    const cancelOrder = async (order): Promise<void> => {
      try {
        setLoadingId(order.id);
        await new Promise(resolve => setTimeout(resolve, 1000));
        removeFromCart(order.id, order.size);

        Alert.alert('Success', 'Ordered has removed from cart!')
      } finally {
        setLoadingId(null);
      }
    };

    const ongoingOrders = orders.filter(c => cart.some(o => o.id === c.id));
    const isHistoryTab = activeTab === 'history';
    const data = isHistoryTab ? orders : ongoingOrders;

    const renderItem = ({ item }: { item: typeof orders[0] }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/pizza/${item.id}`)}
      >
        <View style={styles.pizzaContent}>
          <Image source={item.image} style={styles.image} />
          <View style={styles.details}>
            <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.price}>PKR {item.price}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.orderIdBtn} onPress={() => router.push(`/track?orderId=${item.id}`)}>
          <Text style={styles.orderId}>#{item.id}</Text>
        </TouchableOpacity>
        <View style={styles.buttonsRow}>
            <TouchableOpacity
              onPress={!isHistoryTab ? () => router.push(`/track?orderId=${item.id}`) : undefined}
              style={[styles.orderBtn, isHistoryTab ? styles.rateButton : styles.track]}
            >
              <Text style={isHistoryTab ? styles.rateText : styles.trackText}>
                {isHistoryTab ? 'Rate' : 'Track Order'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.orderBtn, styles.reorderButton, isInCart(item.id) && styles.cancelButton]}
              onPress={() => (isInCart(item.id) ? cancelOrder(item) : handleReorder(item))}
              activeOpacity={0.8}
            >
              {loadingId === item.id ? (
                <ActivityIndicator color={isInCart(item.id) ? 'red' : 'white'} size={17} />
              ) : (
                <Text style={[styles.reorderText, isInCart(item.id) && styles.cancelText]}>
                  {isInCart(item.id) ? 'Cancel' : 'Reorder'}
                </Text>
              )}
            </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <BackButton onPress={() => router.replace('/tabs/home')} />
        <Text style={styles.title}>ORDERS</Text>
      </View>

      {/* Tab Navbar */}
      <View style={styles.tabsGroup} accessibilityRole="tablist">
        {TABS.map(t => {
          const selected = activeTab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setActiveTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={() => [styles.tab, selected && styles.activeTab]}
            >
              <Text style={[styles.tabText, selected && styles.activeTabText]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={[
          { paddingBottom: 80 },
          (data.length === 0) && { flexGrow: 1, justifyContent: 'center', },
        ]}
        ListEmptyComponent={isHistoryTab ? (
          <EmptyState
            icon="order"
            title="No orders"
            message="Still not hungry? :("
            buttonText="Order Deliciousness"
            onButtonPress={() => router.push('/tabs/home')}
          />
        ) : (
          <EmptyState
            icon="order"
            title="No ongoing orders"
            message="Still not hungry? :("
            buttonText="Order Deliciousness"
            onButtonPress={() => router.push('/tabs/home')}
          />
        )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 50,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
      paddingHorizontal: 16,
    },
    headerText: {
      fontSize: 18,
      fontWeight: '600',
    },
    backButton: {
      backgroundColor: '#f0f2f5',
      padding: 8,
      borderRadius: 20,
      marginRight: 12,
    },
    tabsGroup: {
      flexDirection: 'row',
      marginBottom: 20,
      marginTop: 30,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingBottom: 8,
      borderBottomWidth: 0.5,
      borderBottomColor: '#ddd',
    },
    tabText: {
      fontSize: 14,
      color: '#777',
    },
    activeTab: {
      borderBottomWidth: 1,
      borderBottomColor: '#FA4A0C',
    },
    activeTabText: {
      color: "#FA4A0C",
    },
    card: {
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 1,
    },
    pizzaContent: {
      flexDirection: 'row',
      gap: 12,
    },
    image: {
      width: 72,
      height: 72,
      borderRadius: 8,
    },
    details: {
      justifyContent: 'space-between',
    },
    name: {
      fontSize: 14,
      fontWeight: 600,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    time: {
      fontSize: 12,
      color: '#666',
    },
    price: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    buttonsRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    orderBtn: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 24,
      paddingVertical: 8,
    },
    rateButton: {
      borderWidth: 1,
      borderColor: '#FA4A0C',
    },
    track: {
      backgroundColor: '#FA4A0C',
    },
    trackText: {
      color: '#fff',
      fontWeight: '600',
    },
    rateText: {
      color: '#FA4A0C',
      fontWeight: '600',
      fontSize: 14,
    },
    reorderButton: {
      backgroundColor: '#FA4A0C',
      paddingVertical: 8,
    },
    reorderText: {
      color: '#fff',
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: '#ECF0F4',
    },
    cancelText: {
      color: '#FA4A0C',
    },
    orderIdBtn: {
      position: 'absolute',
      right: 24,
      top: 16,
    },
    orderId: {
      color: '#3b5998',
      textDecorationLine: 'underline',
      fontSize: 13,
    },
    emptyText: {
      fontSize: 14,
      color: '#888',
    },
  });

