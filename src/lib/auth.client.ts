"use client";

import type { User } from "@supabase/supabase-js";
import type { AuthAccount, AuthRole, AuthSession, AuthUser, RegisterPayload } from "@/domain/models/auth";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ensureProfile } from "@/lib/supabase/user-data.client";

const USERS_KEY = "tech-english-users";
const SESSION_KEY = "tech-english-session";
export const AUTH_CHANGE_EVENT = "tech-english-auth-changed";

type AuthSnapshot = {
  user: AuthUser | null;
  ready: boolean;
};

export type AuthActionResult =
  | {
      ok: true;
      user: AuthUser | null;
      requiresEmailConfirmation?: boolean;
      message?: string;
    }
  | { ok: false; error: string };

const DEMO_ACCOUNT: AuthAccount = {
  id: "user-demo-1",
  name: "Demo Developer",
  email: "demo@coach.dev",
  password: "demo123",
  role: "learner",
  createdAt: new Date("2026-01-01T10:00:00.000Z").toISOString()
};

let snapshot: AuthSnapshot = {
  user: null,
  ready: !isSupabaseConfigured()
};
let initialized = false;
let unsubscribeSupabase: (() => void) | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

function setSnapshot(next: Partial<AuthSnapshot>) {
  snapshot = {
    ...snapshot,
    ...next
  };
  notify();
}

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function toPublicUser(account: AuthAccount): AuthUser {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    createdAt: account.createdAt
  };
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function normalizeRole(value: unknown): AuthRole {
  return value === "mentor" || value === "admin" ? value : "learner";
}

function mapSupabaseUser(user: User | null): AuthUser | null {
  if (!user || !user.email) return null;

  const metadata = user.user_metadata ?? {};
  const name =
    typeof metadata.full_name === "string" && metadata.full_name.trim()
      ? metadata.full_name.trim()
      : typeof metadata.name === "string" && metadata.name.trim()
        ? metadata.name.trim()
        : user.email.split("@")[0];

  return {
    id: user.id,
    name,
    email: user.email,
    role: normalizeRole(metadata.role),
    createdAt: user.created_at ?? new Date().toISOString()
  };
}

export function getStoredAccounts(): AuthAccount[] {
  return safeRead<AuthAccount[]>(USERS_KEY, []);
}

export function ensureAuthSeed() {
  const users = getStoredAccounts();
  if (users.length) return;
  safeWrite(USERS_KEY, [DEMO_ACCOUNT]);
}

function getLocalSessionUser(): AuthUser | null {
  const session = safeRead<AuthSession | null>(SESSION_KEY, null);
  return session?.user ?? null;
}

function initializeLocalAuth() {
  if (typeof window === "undefined") return;
  ensureAuthSeed();
  snapshot = {
    user: getLocalSessionUser(),
    ready: true
  };
}

async function initializeSupabaseAuth() {
  if (initialized || typeof window === "undefined" || !isSupabaseConfigured()) return;

  initialized = true;
  const supabase = createSupabaseClient();

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    const mapped = mapSupabaseUser(user);
    if (mapped) {
      void ensureProfile(mapped);
    }
    setSnapshot({ user: mapped, ready: true });
  } catch {
    setSnapshot({ user: null, ready: true });
  }

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    const mapped = mapSupabaseUser(session?.user ?? null);
    if (mapped) {
      void ensureProfile(mapped);
    }
    setSnapshot({ user: mapped, ready: true });
  });

  unsubscribeSupabase = () => data.subscription.unsubscribe();
}

export function subscribeAuth(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  listeners.add(listener);

  if (isSupabaseConfigured()) {
    void initializeSupabaseAuth();
  } else {
    initializeLocalAuth();
    window.addEventListener("storage", listener);
    window.addEventListener(AUTH_CHANGE_EVENT, listener);
  }

  return () => {
    listeners.delete(listener);

    if (!isSupabaseConfigured()) {
      window.removeEventListener("storage", listener);
      window.removeEventListener(AUTH_CHANGE_EVENT, listener);
    }

    if (!listeners.size && unsubscribeSupabase) {
      unsubscribeSupabase();
      unsubscribeSupabase = null;
      initialized = false;
    }
  };
}

export function getAuthSnapshot(): AuthSnapshot {
  if (!isSupabaseConfigured()) {
    initializeLocalAuth();
  } else if (typeof window !== "undefined") {
    void initializeSupabaseAuth();
  }

  return snapshot;
}

function registerLocalUser(payload: RegisterPayload): AuthActionResult {
  ensureAuthSeed();
  const users = getStoredAccounts();
  const email = payload.email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "This email is already registered." };
  }

  const account: AuthAccount = {
    id: createId(),
    name: payload.name.trim(),
    email,
    password: payload.password,
    role: payload.role,
    createdAt: new Date().toISOString()
  };

  const session: AuthSession = { user: toPublicUser(account), loggedAt: new Date().toISOString() };

  safeWrite(USERS_KEY, [...users, account]);
  safeWrite(SESSION_KEY, session);
  setSnapshot({ user: session.user, ready: true });

  return { ok: true, user: session.user };
}

function loginLocalUser(email: string, password: string): AuthActionResult {
  ensureAuthSeed();
  const users = getStoredAccounts();
  const account = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!account || account.password !== password) {
    return { ok: false, error: "Invalid email or password." };
  }

  const session: AuthSession = { user: toPublicUser(account), loggedAt: new Date().toISOString() };
  safeWrite(SESSION_KEY, session);
  setSnapshot({ user: session.user, ready: true });

  return { ok: true, user: session.user };
}

export async function registerUser(payload: RegisterPayload): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return registerLocalUser(payload);
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    options: {
      data: {
        full_name: payload.name.trim(),
        role: payload.role
      }
    }
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const mapped = mapSupabaseUser(data.user);
  if (mapped) {
    await ensureProfile(mapped);
  }

  if (!data.session) {
    setSnapshot({ user: null, ready: true });
    return {
      ok: true,
      user: mapped,
      requiresEmailConfirmation: true,
      message: "Check your email to confirm your account before signing in."
    };
  }

  setSnapshot({ user: mapped, ready: true });
  return { ok: true, user: mapped };
}

export async function loginUser(email: string, password: string): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return loginLocalUser(email, password);
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const mapped = mapSupabaseUser(data.user);
  if (mapped) {
    await ensureProfile(mapped);
  }

  setSnapshot({ user: mapped, ready: true });
  return { ok: true, user: mapped };
}

export async function logoutUser() {
  if (!isSupabaseConfigured()) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }
    setSnapshot({ user: null, ready: true });
    return;
  }

  const supabase = createSupabaseClient();
  await supabase.auth.signOut();
  setSnapshot({ user: null, ready: true });
}

export function getDemoCredentials() {
  return isSupabaseConfigured()
    ? null
    : {
        email: DEMO_ACCOUNT.email,
        password: DEMO_ACCOUNT.password
      };
}

