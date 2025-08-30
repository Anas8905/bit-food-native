import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '@/types/address';
import { norm } from '@/utils/common.utils';

const KEY = 'savedAddresses';
const SELECTED_KEY = 'selectedAddressId';

export async function getAddresses(): Promise<Address[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function setAddresses(list: Address[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function saveAddress(addr: Address): Promise<void> {
  const list = await getAddresses();
  const isOther = norm(addr.label) === 'other';

  const next = isOther
  ? [...list, addr]
  : [addr, ...list.filter(a => norm(a.label) !== norm(addr.label))];

  await setAddresses(dedupe(next).slice(0, 20));
}

export async function removeAddressById(id: string): Promise<void> {
  const list = await getAddresses();
  const next = list.filter(a => a.id !== id);
  await setAddresses(next);
}

export async function getSelectedAddressId(): Promise<string | null> {
  return (await AsyncStorage.getItem(SELECTED_KEY)) || null;
}

export async function setSelectedAddressId(id: string | null): Promise<void> {
  if (id) await AsyncStorage.setItem(SELECTED_KEY, id);
  else await AsyncStorage.removeItem(SELECTED_KEY);
}

function dedupe(list: Address[]): Address[] {
  const seen = new Map<string, Address>();
  for (const a of list) {
    const key = `${a.address}-${round(a.latitude)}-${round(a.longitude)}`;
    if (!seen.has(key)) seen.set(key, a);
  }
  return Array.from(seen.values());
}
const round = (n: number) => Number(n.toFixed(6));
