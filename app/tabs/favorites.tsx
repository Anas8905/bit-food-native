import BackButton from "@/components/BackButton";
import EmptyState from "@/components/EmptyState";
import { useCart } from "@/hooks/useCart";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Favorites() {
  const router = useRouter();
  const { favorites, removeFromFavorites } = useCart();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.favItem} onPress={() => router.push(`/pizza/${item.id}`)}>
      <Image source={item.image} style={styles.itemImage} />

      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text>{item.rating} ({item.reviewCount})</Text>
        </View>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromFavorites(item.id, item.size)}
        >
          <Ionicons name="trash-outline" size={20} color="#FA4A0C" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="No favorites saved"
        message="Hunt the heart icon in the top right to add your favorites here."
        buttonText="Let's find some favorites"
        onButtonPress={() => router.push('/tabs/home')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <BackButton onPress={() => router.replace('/tabs/home')} />
      <Text style={styles.headerTitle}>FAVORITES</Text>
      <View style={{ width: 40 }} />
    </View>

    <FlatList
      data={favorites}
      keyExtractor={(item, index) => `${item.id}-${item.size}-${index}`}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
    />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  favItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    color: '#666',
    marginBottom: 5,
  },
  ratingContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  removeButton: {
    padding: 5,
  },
})