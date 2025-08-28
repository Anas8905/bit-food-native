import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const orders = [
  {
    id: '162432',
    image: require('../assets/images/pizza_pepperoni.png'),
    title: 'Peri Peri Pizza',
    price: 'Rs. 1400',
    time: 'Jun 17 · 12:30 am',
  },
  {
    id: '323790',
    image: require('../assets/images/pizza_special.png'),
    title: 'Peri Peri Pizza, Stuff Crust',
    price: 'Rs. 3736',
    time: 'Jun 17 · 12:30 am',
  },
  {
    id: '435701',
    image: require('../assets/images/pizza_dark.png'),
    title: 'Hot & Spicy, Thin Crust',
    price: 'Rs. 5736',
    time: 'Jun 17 · 12:30 am',
  },
];

const OrderHistoryScreen: React.FC = () => {
  const renderItem = ({ item }: { item: typeof orders[0] }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.details}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={styles.time}>{item.time}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.rateButton}>
            <Text style={styles.rateText}>Rate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reorderButton}>
            <Text style={styles.reorderText}>Reorder</Text>
            </TouchableOpacity>
        </View>
        </View>

      <Text style={styles.orderId}>#{item.id}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/tabs' as any)}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>EDIT PROFILE</Text>
      </View>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
    },
    header: {
      padding: 16,
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 20,
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
    card: {
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    image: {
      width: 72,
      height: 72,
      borderRadius: 8,
      marginRight: 16,
    },
    details: {
      flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    time: {
      fontSize: 12,
      color: '#666',
      marginBottom: 4,
    },
    price: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    buttonsRow: {
      flexDirection: 'row',
      marginTop: 4,
    },
    rateButton: {
      borderWidth: 1,
      borderColor: '#ff0000',
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 24,
      marginRight: 12,
    },
    rateText: {
      color: '#ff0000',
      fontWeight: '600',
      fontSize: 14,
    },
    reorderButton: {
      backgroundColor: '#ff0000',
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 24,
    },
    reorderText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
    },
    orderId: {
      position: 'absolute',
      right: 24,
      top: 16,
      color: '#3b5998',
      textDecorationLine: 'underline',
      fontSize: 13,
    },
  });
  

export default OrderHistoryScreen;
