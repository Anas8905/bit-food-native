import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockPizzaAPI } from '../../api/mockApi';
import NoInternet from '../../components/NoInternet';
import PizzaCard from '../../components/PizzaCard';
import Navbar from '../../components/ui/Navbar';
import { useCart } from '@/hooks/useCart';
import { useNetwork } from '@/hooks/useNetwork';
import { useAddress } from '@/hooks/useAddress';
import { Feather } from '@expo/vector-icons';

const HomeScreen = () => {
  const router = useRouter();
  const { isConnected } = useNetwork();
  const { cart } = useCart();
  const { selectedAddress } = useAddress();
  const [categories, setCategories] = useState<string[]>([]);
  const [pizzas, setPizzas] = useState<Record<string, any[]>>({});
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

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

  const getFilteredData = () => {
    let filteredData: Record<string, any[]> = {};

    // Determine which categories to show
    const categoriesToShow = selectedCategories.includes('All')
      ? categories
      : selectedCategories;

    // Filter by categories first
    categoriesToShow.forEach(category => {
      if (pizzas[category]) {
        filteredData[category] = pizzas[category];
      }
    });

    // If there's a search query, filter pizzas by name
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase().trim();
      Object.keys(filteredData).forEach(category => {
        filteredData[category] = filteredData[category].filter(pizza =>
          pizza.name.toLowerCase().includes(searchLower) ||
          pizza.description?.toLowerCase().includes(searchLower)
        );

        // Remove empty categories
        if (filteredData[category].length === 0) {
          delete filteredData[category];
        }
      });
    }

    return filteredData;
  };

  const filteredPizzas = getFilteredData();

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (category === 'All') {
        return ['All'];
      } else {
        if (prev.includes(category)) {
          const newSelection = prev.filter(cat => cat !== category && cat !== 'All');
          return newSelection.length === 0 ? ['All'] : newSelection;
        } else {
          const filteredPrev = prev.filter(cat => cat !== 'All');
          return [...filteredPrev, category];
        }
      }
    });
  };

  useEffect(() => {
    if (isConnected) {
      fetchData();
    }
  }, [isConnected]);

  if (!isConnected) {
    return <NoInternet onRetry={fetchData} />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
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
      <Navbar location={selectedAddress?.label ?? "Home"} cartCount={cartItemCount} />
        <View style={styles.inputs}>
          <Feather
            name="search"
            size={18}
            color="#bbb"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search pizza"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.input, { textAlignVertical: 'top' }]}
            spellCheck={false}
            autoCorrect={false}
          />
        </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.categorySection}>
          <Text style={styles.allCatTitle}>All Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catContainer}
          >
            <TouchableOpacity
              style={[
                styles.catPillBase,
                selectedCategories.includes('All') && styles.catPill
              ]}
              onPress={() => toggleCategory('All')}
            >
              <Text style={[
                styles.pillTextBase,
                selectedCategories.includes('All') && styles.pillText
              ]}>
                All
              </Text>
            </TouchableOpacity>

            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.catPillBase,
                  selectedCategories.includes(category) && styles.catPill
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text style={[
                  styles.pillTextBase,
                  selectedCategories.includes(category) && styles.pillText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {Object.keys(filteredPizzas).length > 0 ? (
          Object.keys(filteredPizzas).map((category) => (
            <View key={category}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <FlatList
                data={filteredPizzas[category]}
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
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {searchQuery.trim() ? 'No pizzas found matching your search' : 'No pizzas available'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputs: {
    position: 'relative',
    marginHorizontal: 12,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 11,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 12,
    paddingLeft: 40,
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySection: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  allCatTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  catContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  catPillBase: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    width: 90,
    alignItems: 'center',
  },
  catPill: {
    backgroundColor: '#FA4A0C',
  },
  pillTextBase: {
    fontSize: 12,
    fontWeight: 700,
    color: '#666',
  },
  pillText: {
    color: 'white',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  pizzaList: {
    paddingHorizontal: 10,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;
