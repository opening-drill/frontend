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

export async function loginRequest(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/auth/login', {
    username: credentials.username.trim(),
    password: credentials.password,
  });
  return response.data;
}