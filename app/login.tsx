import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';
import { formatPhoneNumber } from '@/utils/phoneFormatter';


export default function LoginScreen(): React.JSX.Element {
  const router = useRouter()
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [national, setNational] = useState('');
  const [loading, setLoading] = useState(false);
  const countryCode = "+92";
  const { phoneNumber, maxNationalDigits } = formatPhoneNumber(national, countryCode);

  const sendOTP = async () => {
    if (!fullName.trim()) {
      return showAlert('Error', 'Please enter your full name.');
    }

    if (!email.trim()) {
      return showAlert('Error', 'Please enter your email.');
    }

    if (!national) {
      return showAlert('Error', 'Please enter your phone number.');
    }

    try {
      setLoading(true);
      await login({ fullName, email, phoneNumber });
      router.navigate('/otp');
    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Hello!</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>What&apos;s your Full name?</Text>
          <TextInput
            style={styles.input}
            placeholder="Type here"
            value={fullName}
            onChangeText={setFullName}
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>What&apos;s your Email?</Text>
          <TextInput
            style={styles.input}
            placeholder="Type here"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enter Your Mobile Number</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <View style={styles.flag}>
                <Text>🇵🇰</Text>
              </View>
              <Text style={styles.prefix}>{countryCode}</Text>
              {/* <Ionicons name="chevron-down" size={16} color="black" /> */}
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Type here"
              value={national}
              maxLength={maxNationalDigits}
              onChangeText={(t) => setNational(t.replace(/[^\d]/g, ''))}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={sendOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>SEND CODE</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
  },
  flag: {
    marginRight: 5,
  },
  prefix: {
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FA4A0C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
