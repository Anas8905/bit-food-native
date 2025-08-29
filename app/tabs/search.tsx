import BackButton from "@/components/BackButton";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
      const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <BackButton onPress={() => router.replace('/tabs/home')} />
      <Text style={styles.headerTitle}>SEARCH</Text>
      <View style={{ width: 40 }} />
    </View>
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
})