interface Pizza {
  id: number | string;
  name: string;
  description?: string;
  category?: string;
  rating?: number;
  reviewCount?: string;
  deliveryTime?: number;
  deliveryFee?: string;
  variations?: {
    size: string;
    price: number;
  }[];
  image?: any;
  price?: number;
}

interface UsePizzaDataReturn {
  allCategories: string[];
  filteredCategories: string[];
  pizzas: Record<string, Pizza[]>;
  filteredPizzas: Record<string, Pizza[]>;
  filteredByCategory: Record<string, Pizza[]>;
  searchResults: Record<string, Pizza[]>;
  allPizzas: Pizza[];
  selectedCategories: string[];
  toggleCategory: (c: string) => void;
  isCatalogLoading: boolean;
  isResultsLoading: boolean;
  isSearchLoading: boolean;
  refreshing: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  popularPizzas: Pizza[];
  seePizza: (id: number | string) => void;
  handleRefresh: () => Promise<void>;
  hasQuery: boolean;
  hasResults: boolean;
  shouldShowLoading: boolean;
}