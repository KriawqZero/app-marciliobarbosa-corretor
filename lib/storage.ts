import * as SecureStore from 'expo-secure-store';

const KEY_BASE_URL = 'admin_base_url';
const KEY_TOKEN = 'admin_api_token';

export async function saveCredentials(baseUrl: string, token: string): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEY_BASE_URL, baseUrl.trim().replace(/\/+$/, '')),
    SecureStore.setItemAsync(KEY_TOKEN, token.trim()),
  ]);
}

export async function getCredentials(): Promise<{ baseUrl: string; token: string } | null> {
  const [baseUrl, token] = await Promise.all([
    SecureStore.getItemAsync(KEY_BASE_URL),
    SecureStore.getItemAsync(KEY_TOKEN),
  ]);
  if (!baseUrl || !token) return null;
  return { baseUrl, token };
}

export async function clearCredentials(): Promise<void> {
  await Promise.all([SecureStore.deleteItemAsync(KEY_BASE_URL), SecureStore.deleteItemAsync(KEY_TOKEN)]);
}
