import BackButton from '@/components/BackButton';
import SwipableModal from '@/components/SwipableModal';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Dimensions, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Sample() {
  const router = useRouter();
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <BackButton onPress={() => router.back()} />
      <Text style={styles.headerTitle}>Modals</Text>
      <View style={{ width: 40 }} />
    </View>
    <View style={styles.subContainer}>
      <Button
        title="Open Basic Modal"
        onPress={() => setModal1Open(true)}
      />

      <Button
        title="Open Form Modal"
        onPress={() => setModal2Open(true)}
      />

      <Button
        title="Open Custom Height Modal"
        onPress={() => setModal3Open(true)}
      />

      {/* Basic Modal Example */}
      <SwipableModal
        isVisible={modal1Open}
        onClose={() => setModal1Open(false)}
      >
        <Text style={styles.modalText}>This is a basic modal.</Text>
        <Button
          title="Close Modal"
          onPress={() => setModal1Open(false)}
        />
      </SwipableModal>

      {/* Form Modal Example with ScrollView */}
      <SwipableModal
        isVisible={modal2Open}
        onClose={() => setModal2Open(false)}
        contentStyle={styles.formModalContent}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalTitle}>User Form</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Bio"
            multiline
            numberOfLines={4}
            placeholderTextColor="#666"
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Submit"
              onPress={() => setModal2Open(false)}
            />
            <Button
              title="Cancel"
              onPress={() => setModal2Open(false)}
              color="#ff4444"
            />
          </View>
        </ScrollView>
      </SwipableModal>

      {/* Custom Height Modal Example */}
      <SwipableModal
        isVisible={modal3Open}
        onClose={() => setModal3Open(false)}
        height={SCREEN_HEIGHT * 0.5}
        contentStyle={styles.customModalContent}
      >
        <Text style={styles.modalText}>
          This modal is only 50% of screen height!
        </Text>
        <Text style={styles.subText}>
          Perfect for quick actions or small content.
        </Text>
        <Button
          title="Got it!"
          onPress={() => setModal3Open(false)}
        />
      </SwipableModal>
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  subContainer: {
    display: 'flex',
    gap: 16,
    paddingTop: 200,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  formModalContent: {
    paddingVertical: 32,
  },
  customModalContent: {
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});