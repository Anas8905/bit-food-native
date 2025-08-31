import { Address } from '@/types/address';
import { norm } from '@/utils/common.utils';
import { getData, removeData, saveData } from './asyncStorage';
import { KEYS } from '@/constants/Keys';

export const getAddresses = async(): Promise<Address[]> => {
  return await getData<Address[]>(KEYS.ADDRESSES) ?? [];
}

export const saveAddress = async (newAddress: Address): Promise<void> => {
  const list = await getAddresses();
  const isOther = norm(newAddress.label) === 'other';

  const next = isOther
  ? [...list, newAddress]
  : [newAddress, ...list.filter(a => norm(a.label) !== norm(newAddress.label))];

  await saveData(KEYS.ADDRESSES, dedupe(next).slice(0, 20));
}

export const removeAddressById = async(id: string): Promise<void> => {
  const list = await getAddresses();
  const next = list.filter(a => a.id !== id);
  await saveData(KEYS.ADDRESSES, next);
}

export const getSelectedAddressId = async(): Promise<string | null> => {
  return await getData(KEYS.SELECTED_ADDRESS_ID);
}

export const setSelectedAddressId = async(id: string | null): Promise<void> => {
  if (id) await saveData(KEYS.SELECTED_ADDRESS_ID, id);
  else await removeData(KEYS.SELECTED_ADDRESS_ID);
}

const dedupe = (list: Address[]): Address[] => {
  const seen = new Map<string, Address>();
  for (const a of list) {
    const key = `${a.address}-${round(a.latitude)}-${round(a.longitude)}`;
    if (!seen.has(key)) seen.set(key, a);
  }
  return Array.from(seen.values());
}

const round = (n: number) => Number(n.toFixed(6));
