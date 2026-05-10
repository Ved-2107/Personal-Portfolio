'use client';
import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { authApi } from '@/services/api';
import { AuthState, User } from '@/types';

type AuthAction =
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, loading: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authApi.me()
        .then((res) => dispatch({ type: 'SET_USER', payload: { user: res.data.data, token } }))
        .catch(() => { localStorage.removeItem('auth_token'); dispatch({ type: 'SET_LOADING', payload: false }); });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { user, token } = res.data.data;
    localStorage.setItem('auth_token', token);
    dispatch({ type: 'SET_USER', payload: { user, token } });
  };

  const logout = async () => {
    await authApi.logout().catch(() => {});
    localStorage.removeItem('auth_token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
