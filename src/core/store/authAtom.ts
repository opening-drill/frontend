import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface User {
  id: string;
  username: string;
  full_name: string;
  // 'roles' is what the backend sends; 'role' is derived for routing compat
  roles: string[];
  role: string; // e.g. '1' = chief, '2' = alerts officer
  permissions: string[];
}

// Persist the token in localStorage
export const tokenAtom = atomWithStorage<string | null>('auth_token', null);

// Persist the user info in localStorage
export const userAtom = atomWithStorage<User | null>('auth_user', null);

// Derived atom to easily check if the user is logged in
export const isAuthenticatedAtom = atom((get) => get(tokenAtom) !== null);

// Derived atom to fetch the user's permissions
export const permissionsAtom = atom((get) => {
  const user = get(userAtom);
  return user ? user.permissions : [];
});

// Write-only atom to handle logout cleanly
export const logoutAtom = atom(null, (_get, set) => {
  set(tokenAtom, null);
  set(userAtom, null);
});
