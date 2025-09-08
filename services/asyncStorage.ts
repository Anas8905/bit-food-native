import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const asyncStorage = AsyncStorage;

export const getData = async <T>(key: string): Promise<T | null> => {
    const raw = await asyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  };

export const saveData = async (key: string, value: unknown): Promise<void> => {
    await asyncStorage.setItem(key, JSON.stringify(value));
};

export const removeData = async (key: string): Promise<void> => {
    await asyncStorage.removeItem(key);
};

export const resetAsyncStorage = async (): Promise<void> => {
    await asyncStorage.clear();
    const keys = await asyncStorage.getAllKeys();
    if (!keys.length) {
        return Alert.alert("Empty", "Async storage is empty.")
    }
    console.log("All keys:", keys);
};
