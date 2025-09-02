import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { mockPizzaAPI } from '../api/mockApi';

export interface Pizza {
  id: number | string;
  name: string;
  description?: string;
}

export interface UsePizzaDataReturn {
  categories: string[];
  pizzas: Record<string, Pizza[]>;
  loading: boolean;
  refreshing: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredPizzas: Record<string, Pizza[]>;
  popularPizzas: Pizza[];
  seePizza: (id: number | string) => void;
  handleRefresh: () => Promise<void>;
  hasQuery: boolean;
  hasResults: boolean;
}

export const usePizzaData = (): UsePizzaDataReturn => {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [pizzas, setPizzas] = useState<Record<string, Pizza[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      const { categories } = await mockPizzaAPI.getCategories();

      const pizzasByCategory: Record<string, Pizza[]> = {};
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
    let filteredData: Record<string, Pizza[]> = {};

    Object.keys(pizzas).forEach(category => {
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
  const popularPizzas = pizzas['Popular'] ?? [];
  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = hasQuery && Object.keys(filteredPizzas).length > 0;

  const seePizza = (id: number | string) => {
    setSearchQuery("");
    router.push(`/pizza/${id}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPizzas();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  return {
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
    hasQuery,
    hasResults,
  };
};
