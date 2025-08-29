import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';

const OTPScreen = () => {
  const reouter = useRouter()
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const { verifyOTP, tempPhone } = useAuth();

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP');
      return;
    }

    try {
      setLoading(true);
      await verifyOTP(otpString);
      reouter.push('/terms')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setTimer(60);
    // Implement resend OTP logic here
    Alert.alert('Success', 'OTP resent successfully');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => reouter.back()} />
        <TouchableOpacity style={styles.supportButton}>
          <Ionicons name="headset-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Enter the 4-digit code sent to you at {tempPhone}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.resendLink}
          onPress={handleResendOTP}
          disabled={timer > 0}
        >
          <Text style={styles.resendText}>
            Didn&apos;t Recieve OTP code? Resend ({timer > 0 ? `00:${timer.toString().padStart(2, '0')}` : 'now'})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>SUBMIT</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  supportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    fontSize: 24,
    textAlign: 'center',
  },
  resendLink: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  resendText: {
    color: '#333',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#FA4A0C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OTPScreen;