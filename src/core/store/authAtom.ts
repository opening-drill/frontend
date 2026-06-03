import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  roles: string[];
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
