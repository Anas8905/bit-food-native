import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import { useCart } from '@/hooks/useCart';

const CartScreen = () => {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }
    router.push(`/checkout`)
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />

      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSize}>{item.size}</Text>
        <Text style={styles.itemPrice}>Rs. {item.price}</Text>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => {
              if (item.quantity > 1) {
                updateQuantity(item.id, item.size, item.quantity - 1);
              }
            }}
          >
            <Ionicons name="remove" size={16} color="#FA4A0C" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.size, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color="#FA4A0C" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id, item.size)}
        >
          <Ionicons name="trash-outline" size={20} color="#FA4A0C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cart.length === 0) {
    return (
      <EmptyState
        icon="cart"
        title="No Items Yet"
        message="Still not hungry? :("
        buttonText="Order Deliciousness"
        onButtonPress={() => router.push('/tabs/home')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CART</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item, index) => `${item.id}-${item.size}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>Rs. {getCartTotal()}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContent: {
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemSize: {
    color: '#666',
    marginBottom: 5,
  },
  itemPrice: {
    fontWeight: 'bold',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  removeButton: {
    padding: 5,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#FA4A0C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;