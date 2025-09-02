import DrawerBase from '@/components/DrawBase';
import { useSearch } from '@/context/SearchContext';
import { useCart } from '@/hooks/useCart';
import { useNetwork } from '@/hooks/useNetwork';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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

export default function HomeScreen() {
  const router = useRouter();
  const { isConnected } = useNetwork();
  const { cart } = useCart();
  const { onSearchTrigger } = useSearch();
  const [categories, setCategories] = useState<string[]>([]);
  const [pizzas, setPizzas] = useState<Record<string, any[]>>({});
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const outerInputRef = useRef<TextInput>(null);
  const innerInputRef = useRef<TextInput>(null);

  const openDrawerFromSearch = () => {
    setIsDrawerOpen(true);
    requestAnimationFrame(() => outerInputRef.current?.blur());
  };

  useEffect(() => {
    if (isDrawerOpen) {
      const t = setTimeout(() => innerInputRef.current?.focus(), 320);
      return () => clearTimeout(t);
    }
  }, [isDrawerOpen]);

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

    const categoriesToShow = selectedCategories.includes('All')
      ? categories
      : selectedCategories;

    categoriesToShow.forEach(category => {
      if (pizzas[category]) {
        filteredData[category] = pizzas[category];
      }
    });

    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase().trim();
      Object.keys(filteredData).forEach(category => {
        filteredData[category] = filteredData[category].filter(pizza =>
          pizza.name.toLowerCase().includes(searchLower) ||
          pizza.description?.toLowerCase().includes(searchLower)
        );

        if (filteredData[category].length === 0) {
          delete filteredData[category];
        }
      });
    }

    return filteredData;
  };

  const filteredPizzas = getFilteredData();

  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = hasQuery && Object.keys(filteredPizzas).length > 0;
  const popularPizzas = pizzas['Popular'] ?? [];

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

  const seePizza = (id: number | string) => {
    setSearchQuery("");
    router.push(`/pizza/${id}`);
  }

  const closeSlider = (closeFn) => {
    setSearchQuery("");
    closeFn();
  }

  useEffect(() => {
    if (isConnected) {
      fetchData();
    }
  }, [isConnected]);

  // Register search callback for the search tab button
  useEffect(() => {
    onSearchTrigger(() => {
      setIsDrawerOpen(true);
    });
  }, [onSearchTrigger]);

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
      <Navbar cartCount={cartItemCount}
      />
        <View style={styles.inputs}>
          <Feather
            name="search"
            size={18}
            color="#bbb"
            style={[styles.searchIcon, styles.DrawerSearchIcon]}
          />
          <TextInput
            ref={outerInputRef}
            placeholder="Search pizza"
            style={[styles.input, { textAlignVertical: 'top' }]}
            spellCheck={false}
            autoCorrect={false}
            onFocus={openDrawerFromSearch}
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
                    onPress={() => seePizza(item.id)}
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

      <DrawerBase
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        side="right"
        width="100%"
        renderHeader={({ close }) => (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => closeSlider(close)} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Search</Text>
          </View>
        )}
      >
        <View style={styles.drawerContent}>
          <TextInput
            ref={innerInputRef}
            placeholder="Search pizza"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
            style={[styles.input, styles.drawerInput]}
            spellCheck={false}
            autoCorrect={false}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.dataContainer}
          >
            {hasQuery ? (
              <>
                <View style={styles.resultContainer}>
                  <Text style={styles.resultTitle}>Results</Text>
                </View>

                {hasResults ? (
                  Object.keys(filteredPizzas).map((category) => (
                    <View key={category}>
                      {filteredPizzas[category].map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => seePizza(item.id)}
                          style={styles.resultItem}
                        >
                          <Ionicons name="restaurant-outline" size={20} color="orange" />
                          <Text style={styles.itemName}>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))
                ) : (
                  <View>
                    <Text style={styles.notFoundText}>
                      No pizzas found matching your search
                    </Text>
                  </View>
                )}
              </>
            ) : null}

            <View style={[hasQuery ? styles.lowMargin : styles.highMargin]}>
              <Text style={styles.popularTitle}>Popular Searches</Text>

              {popularPizzas.length ? (
                <View style={styles.pillsWrap}>
                  {popularPizzas.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => seePizza(item.id)}
                      style={styles.pill}
                      accessibilityRole="button"
                      accessibilityLabel={`View ${item.name}`}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.notFoundText}>No popular pizzas available</Text>
              )}
            </View>
          </ScrollView>

        </View>
      </DrawerBase>
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
    top: 11,
    zIndex: 1,
  },
  DrawerSearchIcon: {
    left: 20,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 12,
    paddingLeft: 46,
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
  header: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 6,
     marginRight: 8
    },
  closeIcon: {
    fontSize: 18,
   },
  headerTitle: {
    fontSize: 18,
    fontWeight: 500,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 600,
  },
  drawerContent: {
    flex: 1
  },
  drawerInput: {
    paddingLeft: 40,
  },
  dataContainer: {
    paddingBottom: 20,
  },
  resultContainer: {
    marginVertical: 20,
  },
  resultItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  itemName: {
    fontSize: 16,
    color: '#555'
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
  highMargin: {
    marginTop: 20,
  },
  lowMargin: {
    marginTop: 10,
  },
  popularTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -6,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#f2f2f2',
    marginHorizontal: 6,
    marginTop: 6,
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
  notFoundText: {
    fontSize: 16,
    color: '#666',
  },
});

