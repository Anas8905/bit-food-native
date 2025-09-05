import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { mockPizzaAPI } from '../api/mockApi';

export interface Pizza {
  id: number | string;
  name: string;
  description?: string;
  [key: string]: any;
}

export interface UsePizzaDataReturn {
  allCategories: string[];
  filteredCategories: string[];
  pizzas: Record<string, Pizza[]>;
  filteredPizzas: Record<string, Pizza[]>;
  filteredByCategory: Record<string, Pizza[]>;
  allPizzas: Pizza[];
  selectedCategories: string[];
  toggleCategory: (c: string) => void;
  isCatalogLoading: boolean;
  isResultsLoading: boolean;
  refreshing: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  popularPizzas: Pizza[];
  seePizza: (id: number | string) => void;
  handleRefresh: () => Promise<void>;
  hasQuery: boolean;
  hasResults: boolean;
}

export const usePizzaData = (): UsePizzaDataReturn => {
  const router = useRouter();
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [pizzas, setPizzas] = useState<Record<string, Pizza[]>>({});
  const [filteredPizzas, setFilteredPizzas] = useState<Record<string, Pizza[]>>({});
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [isResultsLoading, setIsResultsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

        const q = searchQuery.trim();
        const categoriesFilter = selectedCategories.includes('All') ? [] : selectedCategories;

        const { categories, pizzasByCategory } =
          await mockPizzaAPI.searchCatalog({
            query: q,
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
    [searchQuery, selectedCategories]
  );

  const filteredByCategory = useMemo(() => {
    // The server already returned only the categories we asked for (or all non-empty if 'All').
    // Keeping this memo mainly for compatibility with existing UI.
    return filteredPizzas;
  }, [filteredPizzas]);

  const allPizzas = useMemo(() => Object.values(pizzas).flat(), [pizzas]);

  const popularPizzas = pizzas['Popular'] ?? [];
  const allCategories = useMemo(() => Object.keys(pizzas), [pizzas]);

  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = hasQuery && Object.keys(filteredPizzas).length > 0;

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
    router.push(`/pizza/${id}`);
  }, [router]);


  const handleRefresh = useCallback(async () => {
    await fetchFilteredPizzas(true);
    await fetchAllPizzas(true);
  }, [fetchFilteredPizzas, fetchAllPizzas]);

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
    allPizzas,
    popularPizzas,
    isCatalogLoading,
    isResultsLoading,
    refreshing,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    seePizza,
    handleRefresh,
    hasQuery,
    hasResults,
  };
};
