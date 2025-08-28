import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockPizzaAPI } from '../../api/mockApi';
import NoInternet from '../../components/NoInternet';
import PizzaCard from '../../components/PizzaCard';
import Navbar from '../../components/ui/Navbar';
import { useNetwork } from '../../context/NetworkContext';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [pizzas, setPizzas] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isConnected } = useNetwork();

  const fetchData = async () => {
    try {
      setLoading(true);
      const { categories } = await mockPizzaAPI.getCategories();

      const pizzasByCategory: Record<string, any[]> = {};
      for (const category of categories) {
        const { pizzas } = await mockPizzaAPI.getPizzas(category);
        pizzasByCategory[category] = pizzas;
      }

      setCategories(categories);
      setPizzas(pizzasByCategory);
    } catch (error) {
      console.error('Error fetching data', error);
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
        <ActivityIndicator size="large" color="#FA4A0C" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Navbar location="Work" cartCount={3} />
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
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <PizzaCard
                  pizza={item}
                  onPress={() => router.push(`/pizza/${item.id}`)}
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
