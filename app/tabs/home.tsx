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
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    allCategories,
    filteredByCategory,
    allPizzas,
    selectedCategories,
    toggleCategory,
    isCatalogLoading,
    isResultsLoading,
    refreshing,
    handleRefresh,
    seePizza,
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

  if (!isConnected) {
    return <NoInternet onRetry={handleRefresh} />;
  }

  if (isCatalogLoading && !isDrawerOpen) {
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

        {/* Category Pills */}
        <View style={styles.categorySection}>
          <Text style={styles.allCatTitle}>All Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catContainer}
          >
            {['All', ...allCategories].map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.catPillBase,
                  selectedCategories.includes(category) && styles.catPill,
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text
                  style={[
                    styles.pillTextBase,
                    selectedCategories.includes(category) && styles.pillText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
      {/* Categorized pizzas */}
      <View style={{ position: 'relative' }}>
        {Object.keys(filteredByCategory).length > 0 ? (
          Object.keys(filteredByCategory).map((category) => {
            const items = filteredByCategory[category];
            return (
              <View key={category}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <FlatList<Pizza>
                  data={items}
                  keyExtractor={(item) => String(item.id)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.pizzaList}
                  renderItem={({ item }) => (
                    <PizzaCard pizza={item} onPress={() => seePizza(item.id)} />
                  )}
                  // refreshing={refreshing}
                  // onRefresh={handleRefresh}
                />
              </View>
            );
          })
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No pizzas available</Text>
          </View>
        )}

        {/* All pizzas */}
        {selectedCategories.length === 1 && selectedCategories[0] === 'All' && allPizzas.length > 0 && (
          <View style={styles.allPizzasSection}>
            <Text style={styles.allPizzasTitle}>All Pizzas</Text>
            <FlatList
              data={allPizzas}
              keyExtractor={item => String(item.id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              // refreshing={refreshing}
              // onRefresh={handleRefresh}
              contentContainerStyle={styles.pizzaList}
              renderItem={({ item }) => (
                <PizzaCard pizza={item} onPress={() => seePizza(item.id)} />
              )}
            />
          </View>
        )}
        {isResultsLoading && <View style={styles.sectionOverlay} />}
        </View>
      </ScrollView>

      <SearchDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
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
  sectionOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
});

