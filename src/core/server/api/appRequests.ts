import { api } from './axiosClient';
import type { User } from '../../store/authAtom';
export interface LoginRequest {
  username: string;
  password?: string;
}

// Raw shape coming from the backend
interface BackendLoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    roles: string[];
    permissions: string[];
  };
}

export interface LoginResponse {
  token: string;
  user: User;
  expires_in: number;
}

export async function loginRequest(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<BackendLoginResponse>(`/api/auth/login`, {
    username: credentials.username.trim(),
    password: credentials.password,
  });

  const raw = response.data;
  // Map backend roles array → role string for route guard
  const user: User = {
    id: raw.user.id,
    username: raw.user.username,
    full_name: raw.user.full_name,
    roles: raw.user.roles,
    role: raw.user.roles?.[0] ?? '',
    permissions: raw.user.permissions ?? [],
  };

  return { token: raw.token, user, expires_in: 0 };
}