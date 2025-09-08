import HorizontalPizzaCard from '@/components/HorizontalPizzaCard';
import { useNetwork } from '@/hooks/useNetwork';
import { isAndroid } from '@/utils/common.utils';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import SearchDrawer from '../../components/SearchDrawer';
import Navbar from '../../components/ui/Navbar';
import VerticalPizzaCard from '../../components/VerticalPizzaCard';
import { usePizzaData } from '../../hooks/usePizzaData';

export default function HomeScreen(): React.JSX.Element {
  const { isConnected } = useNetwork();
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

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsDrawerOpen(false);
      };
    }, [])
  );

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
      <Navbar />

      <View style={styles.innerContainer}>
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

        <FlatList
          data={
            selectedCategories.length === 1 && selectedCategories[0] === 'All'
              ? allPizzas
              : []
          }
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HorizontalPizzaCard pizza={item} onPress={() => seePizza(item.id)} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          ListHeaderComponent={
            <View style={{ position: 'relative' }}>
              {/* Categorized pizzas */}
              {Object.keys(filteredByCategory).length > 0 ? (
                Object.keys(filteredByCategory).map((category) => {
                  const items = filteredByCategory[category];
                  return (
                    <View key={category} style={{ marginBottom: 16 }}>
                      <Text style={styles.categoryTitle}>{category}</Text>
                      <FlatList
                        data={items}
                        keyExtractor={(item) => String(item.id)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                          <VerticalPizzaCard
                            pizza={item}
                            onPress={() => seePizza(item.id)}
                          />
                        )}
                        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                      />
                    </View>
                  );
                })
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No pizzas available</Text>
                </View>
              )}

              {/* All Pizzas */}
              {selectedCategories.length === 1 &&
                selectedCategories[0] === 'All' &&
                allPizzas.length > 0 && (
                  <Text style={[styles.allPizzasTitle, { marginTop: 8 }]}>
                    All Pizzas
                  </Text>
                )}
            </View>
          }
        />

      </View>

      <SearchDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      {isResultsLoading && <View style={[StyleSheet.absoluteFill, styles.sectionOverlay]} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  innerContainer: {
    flex: 1,
    marginTop: 6,
  },
  inputs: {
    position: 'relative',
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
    marginBottom: 10,
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
  allPizzasTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10,
  },
  sectionOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
});

