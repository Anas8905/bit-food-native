import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePizzaData } from '../../hooks/usePizzaData';
import BackButton from '@/components/BackButton';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const router = useRouter();
  const {
    loading,
    searchQuery,
    setSearchQuery,
    filteredPizzas,
    popularPizzas,
    seePizza,
    hasQuery,
  } = usePizzaData();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FA4A0C" />
      </View>
    );
  }

    return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
        <TextInput
          placeholder="Search pizza"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          autoFocus
          returnKeyType="search"
          spellCheck={false}
          autoCorrect={false}
        />
      </View>

      {/* Search Results */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchQuery.trim() && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Results</Text>
            {Object.keys(filteredPizzas).length > 0 ? (
              Object.keys(filteredPizzas).map((category) => (
                <View key={category}>
                  {filteredPizzas[category].map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.resultItem}
                      onPress={() => seePizza(item.id)}
                    >
                      <Ionicons name="restaurant-outline" size={20} color="orange" />
                      <Text style={styles.itemName}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.notFoundText}>No pizzas found.</Text>
              </View>
            )}
          </View>
        )}

        {/* Popular Searches */}
        <View style={[hasQuery ? styles.lowMargin : styles.popularSection]}>
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.popularGrid}>
            {popularPizzas.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.popularItem}
                onPress={() => seePizza(item.id)}
              >
                <Ionicons name="restaurant-outline" size={20} color="#FA4A0C" />
                <Text style={styles.popularItemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 600,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  resultsSection: {
    marginBottom: 30,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  notFoundText: {
    fontSize: 16,
    color: '#666',
  },
  popularSection: {
    marginTop: 20,
  },
  lowMargin: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularItem: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 6,
    textAlign: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
