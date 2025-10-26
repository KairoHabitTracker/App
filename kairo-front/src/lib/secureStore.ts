// Libraries
import * as SecureStoreModule from 'expo-secure-store';
import { Platform } from 'react-native';

const NativeSecureStore = (SecureStoreModule as any)?.default ?? (SecureStoreModule as any);

// Use localStorage for web, since SecureStore does not support it (for testing purposes)
// Since my poor little Samsung doesn't like expo development server lol
// Unironically might keep this for web anyways if we host it?
export async function getItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === 'web' || !NativeSecureStore?.getItemAsync) {
    try {
      const value = localStorage.getItem(key);
      return value;
    } catch {
      return null;
    }
  }
  return NativeSecureStore.getItemAsync(key as any);
}


export async function setItemAsync(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web' || !NativeSecureStore?.setItemAsync) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore
    }
    return;
  }
  return NativeSecureStore.setItemAsync(key as any, value as any);
}

export async function deleteItemAsync(key: string): Promise<void> {
  if (Platform.OS === 'web' || !NativeSecureStore?.deleteItemAsync) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
    return;
  }
  return NativeSecureStore.deleteItemAsync(key as any);
}

export default {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
};
