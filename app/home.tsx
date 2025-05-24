import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockPizzaAPI } from '../api/mockApi';
import NoInternet from '../components/NoInternet';
import PizzaCard from '../components/PizzaCard';
import { useNetwork } from '../context/NetworkContext';

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [pizzas, setPizzas] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isConnected } = useNetwork();
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const { categories } = await mockPizzaAPI.getCategories();
      
      const pizzasByCategory = {};
      for (const category of categories) {
        const { pizzas } = await mockPizzaAPI.getPizzas(category);
        pizzasByCategory[category] = pizzas;
      }
      
      setCategories(categories);
      setPizzas(pizzasByCategory);
    } catch (error) {
      console.log('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  
  useEffect(() => {
    if (isConnected) {
      fetchData();
    }
  }, [isConnected]);
  
  if (!isConnected) {
    return <NoInternet onRetry={fetchData} />;
  }
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E84C3D" />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {categories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <FlatList
              data={pizzas[category]}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <PizzaCard 
                  pizza={item} 
                  onPress={() => navigation.navigate('PizzaDetail', { pizzaId: item.id })}
                />
              )}
              contentContainerStyle={styles.pizzaList}
            />
          </View>
        ))}
      </ScrollView>
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
  categorySection: {
    marginVertical: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  pizzaList: {
    paddingHorizontal: 10,
  },
});

export default HomeScreen;