import { Region } from "react-native-maps";

export const DEFAULT_REGION: Region = {
    latitude: 24.8607,
    longitude: 67.0011,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
};

export const makeId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

export const LABEL_OPTIONS = [
  { label: 'Home' },
  { label: 'Office' },
  { label: 'Other' },
];