import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DrawerBase from './DrawBase';
import { Pizza } from '@/hooks/usePizzaData';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onPizzaSelect: (id: number | string) => void;
  popularPizzas: Pizza[];
  filteredPizzas: Record<string, Pizza[]>;
}

export default function SearchDrawer({
  isOpen,
  onClose,
  searchQuery,
  onSearchQueryChange,
  onPizzaSelect,
  popularPizzas,
  filteredPizzas,
}: SearchDrawerProps) {
  const innerInputRef = useRef<TextInput>(null);
  const isNavigatingRef = useRef(false);

  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = hasQuery && Object.keys(filteredPizzas).length > 0;

  const closeDrawer = () => {
    onSearchQueryChange('');
    onClose();
  };

  const handlePizzaSelect = (id: number | string) => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    onClose();
    requestAnimationFrame(() => {
      onPizzaSelect(id);
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
        <TextInput
          ref={innerInputRef}
          placeholder="Search pizza"
          value={searchQuery}
          onChangeText={onSearchQueryChange}
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
                        onPress={() => handlePizzaSelect(item.id)}
                        style={styles.resultItem}
                        disabled={isNavigatingRef.current}
                      >
                        <Ionicons name="restaurant-outline" size={20} color="orange" />
                        <Text style={styles.itemName}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))
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
  notFound: {
    marginTop: -10,
    marginBottom: 10,
  },
  notFoundText: {
    fontSize: 16,
    color: '#666',
  },
});
