import { Pizza } from '@/hooks/usePizzaData';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HorizontalPizzaCard({ pizza, onPress }: { pizza: Pizza; onPress: () => void }): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <Image source={pizza.image} style={styles.image} />

        <View style={styles.textInfo}>
          <View style={styles.header}>
            <Text style={styles.name}>{pizza.name}</Text>
            {pizza.description && (
              <Text style={styles.description} numberOfLines={2}>
                {pizza.description}
              </Text>
            )}
            <Text style={styles.price}>
              PKR {pizza?.price || pizza?.variations?.[1]?.price}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.timeText}>{pizza.deliveryTime} min</Text>
            </View>

            <View style={styles.deliveryContainer}>
              <Ionicons name="bicycle-outline" size={14} color="#FA4A0C" />
              <Text style={styles.deliveryText}>
                {pizza.deliveryFee}
              </Text>
            </View>
          </View>
        </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    height: 120,
    width: 120,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
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
  textInfo: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
  },
  header: {
    gap: 3,
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 10,
    color: '#666',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FA4A0C',
  },
});
