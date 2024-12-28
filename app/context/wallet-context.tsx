import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the User interface to represent the user object structure
interface User {
  id: string;
  email?: string; // Optional email
  username?: string; // Optional username
  // Add other fields as needed
}

// Define the WalletContextType for type safety, which includes user and setUser function
interface WalletContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the WalletContext with an undefined default value for better type safety
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// WalletProvider component to manage and provide WalletContext to children
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // State to manage the user object

  return (
    <WalletContext.Provider value={{ user, setUser }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to access WalletContext with proper type safety
export const useWalletContext = (): WalletContextType => {
  const context = useContext(WalletContext);

  // Ensure that the context is only used within a WalletProvider
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }

  return context;
};
