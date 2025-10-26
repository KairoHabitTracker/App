// Libraries
import * as SecureStoreModule from 'expo-secure-store';
import { Platform } from 'react-native';

// Define the minimal interface we need from expo-secure-store. This covers both
// The module shape that exports functions directly and the shape that exposes
// A `default` export (some bundlers / transpilation setups may produce either).
type SecureStoreAPI = {
  getItemAsync?: (key: string) => Promise<string | null>;
  setItemAsync?: (key: string, value: string) => Promise<void>;
  deleteItemAsync?: (key: string) => Promise<void>;
};

function resolveSecureStore(mod: unknown): SecureStoreAPI | undefined {
  if (!mod || typeof mod !== 'object') return undefined;
  const record = mod as Record<string, unknown>;
  // Direct exports (module.getItemAsync)
  if (typeof record.getItemAsync === 'function') {
    return {
      getItemAsync: record.getItemAsync as (key: string) => Promise<string | null>,
      setItemAsync: record.setItemAsync as (key: string, value: string) => Promise<void>,
      deleteItemAsync: record.deleteItemAsync as (key: string) => Promise<void>,
    };
  }
  // Default export (module.default.getItemAsync)
  if (record.default && typeof (record.default as Record<string, unknown>).getItemAsync === 'function') {
    const def = record.default as Record<string, unknown>;
    return {
      getItemAsync: def.getItemAsync as (key: string) => Promise<string | null>,
      setItemAsync: def.setItemAsync as (key: string, value: string) => Promise<void>,
      deleteItemAsync: def.deleteItemAsync as (key: string) => Promise<void>,
    };
  }
  return undefined;
}

const NativeSecureStore = resolveSecureStore(SecureStoreModule);

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
  return NativeSecureStore.getItemAsync(key);
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
  return NativeSecureStore.setItemAsync(key, value);
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
  return NativeSecureStore.deleteItemAsync(key);
}

export default {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
};
