import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

// Define the User interface to represent the user object structure
interface User {
  publicKey: string;
  balance: number;
  id: string;
  email?: string;
  username?: string;
}

// Define the WalletContextType for type safety, including wallet connection info
interface WalletContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  walletAddress: string | null;
  connection: Connection;
  connectWallet: () => void;
  disconnectWallet: () => void; // Add disconnectWallet
}

// Create the WalletContext with an undefined default value
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// WalletProvider component to manage and provide WalletContext to children
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { publicKey, connect, disconnect, connected } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Set up Solana connection (e.g., Devnet or Mainnet)
  const connection = new Connection(clusterApiUrl('devnet')); // You can change the network here

  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey.toString()); // Update walletAddress if publicKey is available

      // Fetch user data after wallet connection
      fetchUserData(publicKey.toString());
    } else {
      setWalletAddress(null); // Clear walletAddress if publicKey is not available
    }
  }, [publicKey]);

  // Function to fetch user data from an API or service after wallet is connected
  const fetchUserData = async (walletAddress: string) => {
    // Here, make an API call to fetch user data associated with the wallet address
    // For now, we'll mock it:
    const mockUser: User = {
      publicKey: walletAddress,
      balance: 100, // Replace with actual balance fetch
      id: '12345', // Mock ID
      email: 'user@example.com', // Mock email
      username: 'user123', // Mock username
    };

    setUser(mockUser); // Set the user data
  };

  const connectWallet = async () => {
    if (!connected) {
      await connect(); // Connect wallet
    }
  };

  const disconnectWallet = async () => {
    if (connected) {
      await disconnect(); // Disconnect wallet
      setUser(null); // Reset user state on disconnect
    }
  };

  return (
    <WalletContext.Provider value={{ user, setUser, walletAddress, connection, connectWallet, disconnectWallet }}>
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
