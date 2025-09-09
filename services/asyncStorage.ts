import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const asyncStorage = AsyncStorage;

export const resetAsyncStorage = async (): Promise<void> => {
    await asyncStorage.clear();
    const keys = await asyncStorage.getAllKeys();
    if (!keys.length) {
        return Alert.alert("Empty", "Async storage is empty.")
    }
    console.log("All keys:", keys);
};
