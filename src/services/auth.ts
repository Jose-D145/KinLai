// src/services/auth.ts

export const isAuthenticated = (): boolean => {
  // Verifica se existe um token salvo
  return !!localStorage.getItem('auth_token');
};
