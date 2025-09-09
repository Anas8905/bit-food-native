import { useRouter } from 'expo-router';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mockPizzaAPI } from '../api/mockApi';
import { useNetwork } from './useNetwork';
import { useAlert } from './useAlert';

export const usePizzaData = (): UsePizzaDataReturn => {
  const router = useRouter();
  const { isConnected } = useNetwork();
  const { showAlert } = useAlert();
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [pizzas, setPizzas] = useState<Record<string, Pizza[]>>({});
  const [filteredPizzas, setFilteredPizzas] = useState<Record<string, Pizza[]>>({});
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [isResultsLoading, setIsResultsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Record<string, Pizza[]>>({});
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);

  const fetchAllPizzas = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      if (!isRefresh) setIsCatalogLoading(true);

      const { pizzasByCategory } = await mockPizzaAPI.searchCatalog({
        query: '',
        categories: [],
        groupByCategory: true,
      });

      setPizzas(pizzasByCategory as Record<string, Pizza[]>);
    } catch (error) {
      console.error('Error fetching full catalog', error);
    } finally {
      if (isRefresh) setRefreshing(false);
      if (!isRefresh) setIsCatalogLoading(false);
    }
  }, []);

  const fetchFilteredPizzas = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        setIsResultsLoading(true);

        const categoriesFilter = selectedCategories.includes('All') ? [] : selectedCategories;

        const { categories, pizzasByCategory } =
          await mockPizzaAPI.searchCatalog({
            query: '',
            categories: categoriesFilter,
            groupByCategory: true,
          });

        setFilteredPizzas(pizzasByCategory as Record<string, Pizza[]>);
        setFilteredCategories(categories);
      } catch (error) {
        console.error('Error fetching filtered catalog', error);
      } finally {
        if (isRefresh) setRefreshing(false);
        setIsResultsLoading(false);
      }
    },
    [selectedCategories]
  );

  const filteredByCategory = useMemo(() => {
    return filteredPizzas;
  }, [filteredPizzas]);

  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults({});
      setHasSearched(false);
      return;
    }

    try {
      setIsSearchLoading(true);
      setHasSearched(false);
      const { pizzasByCategory } = await mockPizzaAPI.searchPizzas(query);
      setSearchResults(pizzasByCategory as Record<string, Pizza[]>);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching pizzas', error);
      setSearchResults({});
      setHasSearched(true);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  const debouncedSearch = useRef(
    debounce((query: string) => {
      fetchSearchResults(query);
    }, 700)
  ).current;

  useEffect(() => {
    debouncedSearch(searchQuery);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const allPizzas = useMemo(() => Object.values(pizzas).flat(), [pizzas]);

  const popularPizzas = pizzas['Popular'] ?? [];
  const allCategories = useMemo(() => Object.keys(pizzas), [pizzas]);

  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = hasQuery && Object.keys(searchResults).length > 0;
  const shouldShowLoading = hasQuery && (isSearchLoading || !hasSearched);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (category === 'All') return ['All'];
      if (prev.includes(category)) {
        const next = prev.filter(cat => cat !== category && cat !== 'All');
        return next.length === 0 ? ['All'] : next;
      }
      return [...prev.filter(cat => cat !== 'All'), category];
    });
  }, []);

  const seePizza = useCallback((id: number | string) => {
    setSearchQuery('');
    router.navigate(`/pizza/${id}`);
  }, [router]);


  const handleRefresh = useCallback(async () => {
    if (!isConnected) {
      return showAlert('Connection Error', 'Network still not available.');
    }

    await fetchFilteredPizzas(true);
    await fetchAllPizzas(true);
  }, [fetchFilteredPizzas, fetchAllPizzas, isConnected]);

  useEffect(() => {
    fetchAllPizzas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchFilteredPizzas();
  }, [fetchFilteredPizzas]);

  return {
    filteredCategories,
    allCategories,
    pizzas,
    filteredPizzas,
    filteredByCategory,
    searchResults,
    allPizzas,
    popularPizzas,
    isCatalogLoading,
    isResultsLoading,
    isSearchLoading,
    refreshing,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    seePizza,
    handleRefresh,
    hasQuery,
    hasResults,
    shouldShowLoading,
  };
};
