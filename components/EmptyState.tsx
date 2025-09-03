import { FontAwesome5, Fontisto, Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OrderIcon from "../assets/images/order.svg"

type EmptyStateProps = {
  icon: string;
  title: string;
  message: string;
  buttonText?: string;
  onButtonPress?: () => void;
  isAddrScrn? : boolean;
};

export default function EmptyState({
  icon,
  title,
  message,
  buttonText,
  onButtonPress,
  isAddrScrn,
}: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case 'cart':
        return <Ionicons name="cart-outline" size={60} color="#FA4A0C" />;
      case 'heart':
        return <Fontisto name="heart-alt" size={60} color="#FA4A0C"/>
      case 'search':
        return <Ionicons name="search-outline" size={60} color="#FA4A0C" />;
      case 'wifi-off':
        return <Ionicons name="wifi-outline" size={60} color="#FA4A0C" />;
      case 'receipt':
        return <Ionicons name="receipt-outline" size={60} color="#FA4A0C" />;
      case 'address':
        return <FontAwesome5 name="map-marker-alt" size={50} color="#ddd" />;
      case 'order':
        return <OrderIcon width={70} height={70} />;
      default:
        return <Ionicons name="alert-circle-outline" size={60} color="#FA4A0C" />;
    }
  };

  return (
    <View style={[styles.container, isAddrScrn ? styles.addrScrn : styles.noAddrScrn]}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <Text style={[styles.title, isAddrScrn && styles.addrTitle]}>{title}</Text>
      <Text style={[styles.message, isAddrScrn && styles.addrMsg]}>{message}</Text>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  addrScrn: {
    marginTop: 20,
  },
  noAddrScrn: {
    flex: 1,
    justifyContent: 'center',
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
  addrTitle: {
    color: "#bbb",
  },
  addrMsg: {
    color: "#aaa",
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
