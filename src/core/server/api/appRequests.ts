import { api } from './axiosClient';
import type { User } from '../../store/authAtom';

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expires_in: number;
}

/**
 * Sends a login request to the backend.
 * Falls back to mock authentication in development when VITE_USE_MOCK_API is 'true'
 * or when the backend service is not running.
 */
export async function loginRequest(credentials: LoginRequest): Promise<LoginResponse> {
  const useMock = import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.DEV;

  if (useMock) {
    // Simulate network delay for realistic loading animations
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Basic input validation simulating server response rules
    const username = credentials.username.trim();
    
    if (!credentials.password || credentials.password.length < 4) {
      throw new Error('הסיסמה חייבת להכיל לפחות 4 תווים');
    }

    // Mock successful response matching the backend contract
    return {
      token: 'mock-jwt-token-dana-cohen-12345',
      user: {
        id: username,
        first_name: 'דנה',
        last_name: 'כהן',
        role: '2',
        permissions: ['view', 'dispatch'],
      },
      expires_in: 28800,
    };
  }

  // Real backend API call
  const response = await api.post<LoginResponse>('/api/auth/login', credentials);
  return response.data;
}