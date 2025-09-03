import { Platform } from "react-native";

export const norm = (s?: string): string => (s ?? '').trim().toLowerCase();

export const isAndroid = Platform.OS === 'android';
