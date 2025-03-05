
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
