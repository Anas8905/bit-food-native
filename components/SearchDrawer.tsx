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
          <TouchableOpacity onPress={closeDrawer} style={styles.closeBtn}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
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

            {popularPizzas.length ? (
              <View style={styles.pillsWrap}>
                {popularPizzas.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handlePizzaSelect(item.id)}
                    style={styles.pill}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${item.name}`}
                    disabled={isNavigatingRef.current}
                  >
                    <Text style={styles.name}>{item.name}</Text>
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
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 6,
    marginRight: 8,
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
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 2,
    marginTop: 6,
    gap: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#32343E4D',
  },
  name: {
    color: '#32343E',
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
