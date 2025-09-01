import { useCart } from '@/hooks/useCart';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Animated,
  ScrollView,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DIP_OPTIONS, mockPizzaAPI } from '../../api/mockApi';
import BackButton from '../../components/BackButton';
interface Variation {
  size: string;
  price: number;
}
interface PizzaItem {
  id: string;
  name: string;
  image: ImageSourcePropType;
  category: string;
  rating: number;
  reviewCount: string;
  description: string;
  deliveryTime?: number;
  deliveryFee?: string;
  price?: number;
  variations?: Variation[];
}

export default function PizzaDetailScreen(): React.ReactElement | null {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart, isFavorite, toggleFavorite } = useCart();
  const [pizza, setPizza] = useState<PizzaItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<Variation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedDips, setSelectedDips] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedHeight] = useState(new Animated.Value(420));

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        setLoading(true);
        const { pizza } = await mockPizzaAPI.getPizzaById(id);
        setPizza(pizza as PizzaItem);

        if (pizza.variations && pizza.variations.length > 0) {
          setSelectedSize(pizza.variations[1]);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load pizza details';
        Alert.alert('Error', message);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchPizza();
  }, [id, router]);

  const handleAddToCart = (): void => {
    if (!pizza) {
      return;
    }
    if (!selectedSize) {
      Alert.alert('Error', 'Please select a size');
      return;
    }

    const cartItem = {
      id: pizza.id,
      name: pizza.name,
      image: pizza.image,
      size: selectedSize.size,
      price: selectedSize.price,
      quantity,
      dips: selectedDips,
    };

    addToCart(cartItem, quantity);
    Alert.alert('Success', 'Added to cart!', [
      {
        text: 'Continue Shopping',
        style: 'cancel',
      },
      {
        text: 'Go to Cart',
        onPress: () => router.push('/tabs/cart')
      },
    ]);
  };

  const incrementQuantity = () => setQuantity(quantity + 1);

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleDip = (dip: string) => {
    setSelectedDips(prev =>
      prev.includes(dip) ? prev.filter(d => d !== dip) : [...prev, dip]
    );
  };

  const toggleModal = () => {
    const toValue = isExpanded ? 420 : 610;

    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FA4A0C" />
      </View>
    );
  }

  if (!pizza) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.innerHeader}>
          <BackButton onPress={() => router.back()} />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() =>
              toggleFavorite({
                id: pizza.id,
                name: pizza.name,
                price: selectedSize?.price ?? pizza.price ?? 0,
                quantity: 1,
                image: pizza.image,
                ...(selectedSize ? { size: selectedSize.size } : {}),
              })
            }
          >
            <Ionicons
              name={isFavorite(pizza.id) ? "heart" : "heart-outline"}
              size={24}
              color="#FA4A0C"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Image source={pizza.image} style={styles.image} />

    {/* Info Section */}
    <Animated.View style={[styles.infoContainer, { height: animatedHeight }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContent}
      >
        {/* Swipe Section */}
        <TouchableOpacity
          style={styles.swipeContainer}
          onPress={toggleModal}
        >
          <View style={styles.swipeBtn}>
          </View>
        </TouchableOpacity>

        {/* Variation Section */}
        <View>
          <View style={styles.titleRow}>
            <View>
              <View style={styles.catBadge}>
                <Text style={styles.category}>{pizza.category}</Text>
              </View>
              <Text style={styles.title}>{pizza.name}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{pizza.rating} ({pizza.reviewCount})</Text>
            </View>
          </View>

          <Text style={styles.description}>{pizza.description}</Text>

          <View style={styles.variationContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.variationTitle}>Variation</Text>
              <Text style={styles.variationSubtitle}>Please select one</Text>
            </View>
            <View style={styles.radioGroup}>
              {pizza.variations && pizza.variations.map((variation, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.variationOption}
                  onPress={() => setSelectedSize(variation)}
                >
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedSize && selectedSize.size === variation.size && styles.radioOuterSelected,
                      ]}
                    >
                      {selectedSize && selectedSize.size === variation.size && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.variationText}>{variation.size}</Text>
                  </View>
                  <Text style={styles.variationPrice}>Rs. {variation.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {isExpanded && (
          <>
            {/* Dip Section */}
            <View style={styles.dipContainer}>
              <Text style={styles.variationTitle}>Choose Dip</Text>
              <View style={styles.checkboxGroup}>
                {DIP_OPTIONS.map((dip) => (
                  <TouchableOpacity
                    key={dip}
                    style={styles.checkboxRow}
                    onPress={() => toggleDip(dip)}
                    activeOpacity={0.7}
                  >
                    <Checkbox
                      value={selectedDips.includes(dip)}
                      onValueChange={() => toggleDip(dip)}
                      color="#FA4A0C"
                    />
                    <Text style={styles.checkboxLabel}>{dip}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={decrementQuantity}
                >
                  <Ionicons name="remove" size={20} color="#FA4A0C" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={incrementQuantity}
                >
                  <Ionicons name="add" size={20} color="#FA4A0C" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
              >
                <Text style={styles.addToCartText}>
                  Add to Cart - {selectedSize ? `${selectedSize.price * quantity}` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 15,
    position: 'absolute',
    top: 70,
    left: 0,
    zIndex: 1,
    width: '100%',
  },
  innerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  swipeContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    // backgroundColor: 'gray'
  },
  swipeBtn: {
    width: 50,
    height: 4,
    backgroundColor: '#FFD5C7',
    borderRadius: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  catBadge: {
    backgroundColor: '#FFECE5',
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginBottom: 10,
    alignItems: 'center',
    width: 76,
    borderRadius: 7,
  },
  category: {
    color: '#FA4A0C',
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  rating: {
    marginLeft: 5,
  },
  description: {
    color: '#666',
    marginBottom: 10,
    lineHeight: 22,
  },
  variationContainer: {
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  variationTitle: {
    fontSize: 18,
    fontWeight: 600,
  },
  variationSubtitle: {
    color: '#FA4A0C',
    backgroundColor: '#FFECE5',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 12,
  },
  radioGroup: {
    gap: 20,
    marginTop: 12,
  },
  variationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FA4A0C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: '#FA4A0C',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FA4A0C',
  },
  variationText: {
    fontSize: 16,
  },
  variationPrice: {
    fontSize: 16,
  },
  dipContainer: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFD5C7',
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#FA4A0C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxGroup: {
    marginTop: 12,
    gap: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 15,
    marginLeft: 10,
  },
});
