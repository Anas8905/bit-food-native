import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EmptyState = ({ icon, title, message, buttonText, onButtonPress }) => {
  const getIcon = () => {
    switch (icon) {
      case 'cart':
        return <Ionicons name="cart-outline" size={60} color="#FA4A0C" />;
      case 'heart':
        return <Ionicons name="heart-outline" size={60} color="#FA4A0C" />;
      case 'search':
        return <Ionicons name="search-outline" size={60} color="#FA4A0C" />;
      case 'wifi-off':
        return <Ionicons name="wifi-outline" size={60} color="#FA4A0C" />;
      case 'receipt':
        return <Ionicons name="receipt-outline" size={60} color="#FA4A0C" />;
      default:
        return <Ionicons name="alert-circle-outline" size={60} color="#FA4A0C" />;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {buttonText && (
        <TouchableOpacity 
          style={styles.button}
          onPress={onButtonPress}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FA4A0C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmptyState;