export type AuthRole = "learner" | "mentor" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  createdAt: string;
}

export interface AuthAccount extends AuthUser {
  password: string;
}

export interface AuthSession {
  user: AuthUser;
  loggedAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: AuthRole;
}
