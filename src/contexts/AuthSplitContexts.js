import { createContext } from 'react';

/**
 * Read-only auth context. Provides user state without mutation functions.
 * Components that only read auth state (user, dbUser, loading, etc.) should
 * use this hook to avoid unnecessary re-renders from auth mutations.
 */
export const AuthUserContext = createContext(null);

/**
 * Write-only auth context. Provides mutation functions (login, register, etc.)
 * without exposing read state. Components that only perform auth actions should
 * use this hook to avoid unnecessary re-renders from auth state changes.
 */
export const AuthActionsContext = createContext(null);
