import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockPizzaAPI } from '../../api/mockApi';
import BackButton from '../../components/BackButton';
import { useCart } from '../../context/CartContext';

const PizzaDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [pizza, setPizza] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const { addToCart, isFavorite, toggleFavorite } = useCart();
  
  useEffect(() => {
    const fetchPizza = async () => {
      console.log(id, 'pizza id')
      try {
        setLoading(true);
        const { pizza } = await mockPizzaAPI.getPizzaById(id);
        setPizza(pizza);
        
        // Set default selected size
        if (pizza.variations && pizza.variations.length > 0) {
          setSelectedSize(pizza.variations[1]); // Default to medium size
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to load pizza details');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    
    fetchPizza();
  }, [id]);
  
  const handleAddToCart = () => {
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
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(pizza)}
        >
          <Ionicons 
            name={isFavorite(pizza.id) ? "heart" : "heart-outline"} 
            size={24} 
            color="#FA4A0C" 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        <Image source={{ uri: pizza.image }} style={styles.image} />
        
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.category}>{pizza.category}</Text>
              <Text style={styles.title}>{pizza.name}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{pizza.rating} ({pizza.reviewCount})</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{pizza.description}</Text>
          
          <View style={styles.variationContainer}>
            <Text style={styles.variationTitle}>Variation</Text>
            <Text style={styles.variationSubtitle}>Please select one</Text>
            
            {pizza.variations && pizza.variations.map((variation, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.variationOption,
                  selectedSize && selectedSize.size === variation.size && styles.selectedVariation,
                ]}
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
      </ScrollView>
      
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    height: 250,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  category: {
    color: '#FA4A0C',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    marginBottom: 20,
    lineHeight: 22,
  },
  variationContainer: {
    marginBottom: 20,
  },
  variationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  variationSubtitle: {
    color: '#FA4A0C',
    marginBottom: 15,
  },
  variationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedVariation: {
    backgroundColor: '#FFF5F5',
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
    borderColor: '#CCC',
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
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
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
});

export default PizzaDetailScreen;