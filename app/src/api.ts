import axios from 'axios';
import { Platform } from 'react-native';
import { NewsResponse } from './types';

// Android emulator reaches the host machine via 10.0.2.2.
// Override with EXPO_PUBLIC_API_URL for physical devices (use your LAN IP).
const fallbackHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || `http://${fallbackHost}:4000`;

export async function fetchNews(): Promise<NewsResponse> {
  const { data } = await axios.get<NewsResponse>(`${API_URL}/api/news`, {
    timeout: 10000,
  });
  return data;
}
