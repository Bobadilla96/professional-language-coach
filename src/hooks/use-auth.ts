"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { RegisterPayload } from "@/domain/models/auth";
import { getAuthSnapshot, loginUser, logoutUser, registerUser, subscribeAuth } from "@/lib/auth.client";

const AUTH_SERVER_SNAPSHOT = {
  user: null,
  ready: false
} as const;

export function useAuth() {
  const auth = useSyncExternalStore(subscribeAuth, getAuthSnapshot, () => AUTH_SERVER_SNAPSHOT);

  const login = useCallback((email: string, password: string) => {
    return loginUser(email, password);
  }, []);

  const register = useCallback((payload: RegisterPayload) => {
    return registerUser(payload);
  }, []);

  const logout = useCallback(() => {
    return logoutUser();
  }, []);

  return {
    user: auth.user,
    ready: auth.ready,
    isAuthenticated: Boolean(auth.user),
    login,
    register,
    logout
  };
}
