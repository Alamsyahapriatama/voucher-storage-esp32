import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, AuthContextType } from '../types.ts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<void> => {
    // Dummy authentication - in a real app this would call an API
    if (username && password.length >= 6) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUser({
        id: '1',
        username,
        email: `${username}@example.com`
      });
      
      // Store auth state in localStorage for persistence
      localStorage.setItem('auth', JSON.stringify({
        isAuthenticated: true,
        username
      }));
    } else {
      throw new Error('Invalid credentials. Password must be at least 6 characters.');
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('auth');
  };

  // Check for existing auth on component mount
  React.useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    
    if (storedAuth) {
      try {
        const { username, isAuthenticated } = JSON.parse(storedAuth);
        
        if (isAuthenticated && username) {
          setUser({
            id: '1',
            username,
            email: `${username}@example.com`
          });
        }
      } catch (error) {
        console.error('Error parsing stored auth data', error);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};