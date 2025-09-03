import { useCart } from '@/hooks/useCart';
import { useNetwork } from '@/hooks/useNetwork';
import { Feather } from '@expo/vector-icons';
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
import NoInternet from '../../components/NoInternet';
import PizzaCard from '../../components/PizzaCard';
import SearchDrawer from '../../components/SearchDrawer';
import Navbar from '../../components/ui/Navbar';
import { Pizza, usePizzaData } from '../../hooks/usePizzaData';
import { isAndroid } from '@/utils/common.utils';

export default function HomeScreen() {
  const { isConnected } = useNetwork();
  const { cart } = useCart();
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    categories,
    pizzas,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    filteredPizzas,
    popularPizzas,
    seePizza,
    handleRefresh,
  } = usePizzaData();

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

  const getFilteredByCategory = () => {
    let filteredData: Record<string, Pizza[]> = {};

    const categoriesToShow = selectedCategories.includes('All')
      ? categories
      : selectedCategories;

    categoriesToShow.forEach(category => {
      if (pizzas[category]) {
        filteredData[category] = pizzas[category];
      }
    });

    return filteredData;
  };


  const catFilteredPizzas = getFilteredByCategory();

  const getAllPizzas = () => {
    let allPizzas: Pizza[] = [];
    Object.values(pizzas).forEach(categoryPizzas => {
      allPizzas.push(...categoryPizzas);
    });
    return allPizzas;
  };

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

  if (!isConnected) {
    return <NoInternet onRetry={handleRefresh} />;
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
      <Navbar cartCount={cartItemCount}
      />
        <View style={styles.inputs}>
          <Feather
            name="search"
            size={18}
            color="#bbb"
            style={styles.searchIcon}
          />
          <TextInput
            ref={outerInputRef}
            placeholder="Search pizza"
            style={styles.input}
            spellCheck={false}
            autoCorrect={false}
            onFocus={openDrawerFromSearch}
          />
        </View>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
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
        {Object.keys(catFilteredPizzas).length > 0 ? (
          Object.keys(catFilteredPizzas).map((category) => (
            <View key={category}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <FlatList
                data={catFilteredPizzas[category]}
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
            <Text style={styles.noResultsText}>No pizzas available</Text>
          </View>
        )}

        {/* All Pizzas Section */}
        {getAllPizzas().length > 0 && (
          <View style={styles.allPizzasSection}>
            <Text style={styles.allPizzasTitle}>All Pizzas</Text>
            <FlatList
              data={getAllPizzas()}
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
        )}
      </ScrollView>

      <SearchDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onPizzaSelect={seePizza}
        popularPizzas={popularPizzas}
        filteredPizzas={filteredPizzas}
      />
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
    top: isAndroid ? 12 : 11,
    left: 20,
    zIndex: 1,
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
  allPizzasSection: {
    marginTop: 20,
  },
  allPizzasTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginHorizontal: 20,
    marginBottom: 10,
  },
});

