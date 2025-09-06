import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
  ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DrawerBase from './DrawBase';
import { usePizzaData } from '@/hooks/usePizzaData';
import { isAndroid } from '@/utils/common.utils';
import BackButton from './BackButton';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
  const innerInputRef = useRef<TextInput>(null);
  const isNavigatingRef = useRef(false);
  const {
    searchQuery,
    setSearchQuery,
    seePizza,
    popularPizzas,
    filteredPizzas,
    isCatalogLoading,
    isResultsLoading,
    hasQuery,
    hasResults
  } = usePizzaData()

  const closeDrawer = () => {
    setSearchQuery('');
    onClose();
  };

  const handlePizzaSelect = (id: number | string) => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    onClose();
    requestAnimationFrame(() => {
      seePizza(id);
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);
    });
  };

  return (
    <DrawerBase
      isOpen={isOpen}
      onClose={onClose}
      side="right"
      width="100%"
      preventUpdates={isNavigatingRef.current}
      renderHeader={() => (
        <View style={styles.header}>
          <BackButton onPress={closeDrawer} />
          <Text style={styles.headerTitle}>Search</Text>
        </View>
      )}
    >
      <View style={styles.drawerContent}>
        <Feather
          name="search"
          size={18}
          color="#bbb"
          style={styles.searchIcon}
        />
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
              <View style={[styles.resultTop, !isResultsLoading && styles.resultBottom]}>
                <Text style={styles.resultTitle}>Results</Text>
              </View>

              {isResultsLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FA4A0C" />
                </View>
              ) : hasResults ? (
                Object.keys(filteredPizzas).map((category) => {
                  const items = filteredPizzas[category];
                  return (
                    <View key={category}>
                      {items.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handlePizzaSelect(item.id)}
                          style={styles.resultItem}
                          disabled={isResultsLoading || isNavigatingRef.current}
                        >
                          <Ionicons name="restaurant-outline" size={20} color="#FA4A0C" />
                          <Text style={styles.itemName}>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  );
                })
              ) : (
                <View style={styles.notFound}>
                  <Text style={styles.notFoundText}>No pizzas found</Text>
                </View>
              )}
            </>
          ) : null}

          <View style={[hasQuery ? styles.lowMargin : styles.highMargin]}>
            <Text style={styles.popularTitle}>Popular Searches</Text>

            {isCatalogLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FA4A0C" />
              </View>
            ) : (
              popularPizzas.length ? (
                <View style={styles.popularGrid}>
                  {popularPizzas.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handlePizzaSelect(item.id)}
                      style={styles.gridItem}
                      accessibilityRole="button"
                      accessibilityLabel={`View ${item.name}`}
                      disabled={isNavigatingRef.current}
                    >
                      <Ionicons name="restaurant-outline" size={20} color="#FA4A0C" />
                      <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.notFoundText}>No popular pizzas available</Text>
              )
            )}
          </View>
        </ScrollView>
      </View>
    </DrawerBase>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginLeft: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 600,
  },
  drawerContent: {
    flex: 1,
  },
  searchIcon: {
    position: 'absolute',
    top: isAndroid ? 12 : 11,
    left: 16,
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
  drawerInput: {
    paddingLeft: 40,
  },
  dataContainer: {
    paddingBottom: 20,
  },
  resultTop: {
    marginTop: 20,
  },
  resultBottom: {
    marginBottom: 20,
  },
  resultItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  itemName: {
    fontSize: 16,
    color: '#555',
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
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  itemText: {
    fontWeight: '500',
    color: '#333',
    marginTop: 6,
  },
  notFound: {
    marginTop: -10,
    marginBottom: 10,
  },
  notFoundText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
