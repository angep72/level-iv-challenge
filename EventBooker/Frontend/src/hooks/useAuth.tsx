import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';

/**
 * The shape of the authentication context value.
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

/**
 * Authentication context for managing user state and authentication actions.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication context to child components.
 * Handles user state, login, logout, and persistent authentication.
 * @param children - React children components
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = authService.getStoredUser();
      const storedToken = authService.getStoredToken();
      
      if (storedUser && storedToken) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Logs in the user and stores authentication data.
   * @param userData - The authenticated user object
   * @param token - JWT token
   */
  const login = (userData: User, token: string) => {
    authService.setAuthData(userData, token);
    setUser(userData);
  };

  /**
   * Logs out the user and clears authentication data.
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access authentication context.
 * Throws an error if used outside of AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};