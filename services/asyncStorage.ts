import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const getData = async <T>(key: string): Promise<T | null> => {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  };

export const saveData = async (key: string, value: unknown): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const removeData = async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
};

export const resetAsyncStorage = async (): Promise<void> => {
    await AsyncStorage.clear();
    const keys = await AsyncStorage.getAllKeys();
    if (!keys.length) {
        Alert.alert("Empty", "Async storage is empty.")
        return;
    }
    console.log("All keys:", keys);
};
