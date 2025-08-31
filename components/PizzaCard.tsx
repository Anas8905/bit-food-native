import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PizzaCard = ({ pizza, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: pizza.image }} style={styles.image} />

      <View style={styles.infoContainer}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.timeText}>{pizza.deliveryTime} min</Text>
        </View>

        <View style={styles.deliveryContainer}>
          <Ionicons name="bicycle-outline" size={14} color="#FA4A0C" />
          <Text style={styles.deliveryText}>{pizza.deliveryFee}</Text>
        </View>
      </View>

      <Text style={styles.name}>{pizza.name}</Text>

      {pizza.description && (
        <Text style={styles.description} numberOfLines={2}>
          {pizza.description}
        </Text>
      )}

      <Text style={styles.price}>PKR {pizza.price || pizza.variations[1].price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginHorizontal: 8,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    color: '#FA4A0C',
    marginLeft: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FA4A0C',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});

export default PizzaCard;