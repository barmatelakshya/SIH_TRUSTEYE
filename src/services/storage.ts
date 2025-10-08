interface UserData {
  totalScans: number;
  threatsFound: number;
  safeMessages: number;
  scanHistory: Array<{
    id: string;
    type: 'text' | 'url';
    input: string;
    result: string;
    riskLevel: string;
    timestamp: string;
  }>;
  lastActive: string;
}

const STORAGE_KEY = 'trusteye_user_data';

export function saveUserData(data: UserData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
}

export function loadUserData(): UserData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load user data:', error);
    return null;
  }
}

export function clearUserData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user data:', error);
  }
}

export function getDefaultUserData(): UserData {
  return {
    totalScans: 0,
    threatsFound: 0,
    safeMessages: 0,
    scanHistory: [],
    lastActive: new Date().toISOString()
  };
}
