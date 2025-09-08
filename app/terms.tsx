import { useAuth } from '@/hooks/useAuth';
import { Checkbox } from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import { useAlert } from '@/hooks/useAlert';

export default function TermsScreen(): React.JSX.Element {
  const router = useRouter();
  const { tempUser, setUser } = useAuth();
  const { showAlert } = useAlert();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!termsAccepted || !privacyAccepted) {
      return showAlert('Error', 'Please accept all terms to continue.');
    }

    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (tempUser) {
        setUser(tempUser);
        router.replace('/address');
      } else {
        return showAlert('Error', 'You are not logged in.');
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Terms and Conditions</Text>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={termsAccepted}
            onValueChange={setTermsAccepted}
            color={termsAccepted ? '#FA4A0C' : ''}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>
            I accept the Terms and Conditions
          </Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={privacyAccepted}
            onValueChange={setPrivacyAccepted}
            color={privacyAccepted ? '#FA4A0C' : ''}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>
            I accept the Privacy notice & information. Use policy & cookies policy
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? (<ActivityIndicator color="white" size={19} />) : "SUBMIT"}
            </Text>
          </Pressable>
        </View>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FA4A0C',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
