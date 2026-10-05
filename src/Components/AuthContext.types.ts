export interface User {
  userid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "buyer" | "seller" | "admin";
}

export const AUTH_STORAGE_KEY = "auth_user";

export function loadUser(): User | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}