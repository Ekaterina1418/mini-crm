

export interface Card {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: string | null;
  phone: string | null;
  department: string | null;
  active: boolean;
}

export interface FormClient {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: string | null;
  phone: string | null;
  department: string | null;
  active: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role?: string | null;
  active: boolean;
}

export interface AuthSuccess {
  success: true;
  token?: string;
  user?: AuthUser | null;
}
export interface AuthError {
  success: false;
  message: string;
}
export type AuthResponse = AuthSuccess | AuthError;

export interface RefreshResponse {
  success: boolean;
  token?: string;      
  user?: AuthUser | null;
  message?: string;    
}
export type Severity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'text';

export const config = {
  api: {
    bodyParser: false,
  }
}
