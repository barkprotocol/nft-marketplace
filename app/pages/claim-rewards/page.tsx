import React, { FC, useState } from 'react';
import { useWalletContext } from '@/app/context/wallet-context'; // Import context hook
import { Transaction, SystemProgram } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react'; // Import Solana wallet adapter

const ClaimRewardsPage: FC = () => {
  const { walletAddress, connection, connectWallet } = useWalletContext(); // Getting values from WalletContext
  const { publicKey, sendTransaction } = useWallet(); // Get wallet adapter's public key and sendTransaction method
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(''); // Message state for error or success feedback

  const claimRewards = async () => {
    // Ensure wallet is connected
    if (!walletAddress) {
      setMessage('Please connect your wallet first!');
      return;
    }

    // Set loading state to true while claiming rewards
    setLoading(true);

    try {
      // Ensure publicKey is available
      if (!publicKey) {
        setMessage('No wallet connected!');
        return;
      }

      // Example reward amount (1 SOL = 1,000,000,000 lamports)
      const rewardAmount = 1_000_000;

      // Create a new transaction for claiming rewards
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey, // Transfer to the same wallet address, change if needed
          lamports: rewardAmount, // Amount to transfer (in lamports)
        })
      );

      // Send the transaction and await its confirmation
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);

      // Show success message after transaction completion
      setMessage('Rewards claimed successfully!');
    } catch (error) {
      // Handle error message with better feedback
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setMessage(`Error: ${errorMessage}`);
    } finally {
      // Set loading state to false after operation completes
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Claim Your Rewards</h1>

      {/* Connect Wallet button */}
      <button
        onClick={connectWallet}
        className="mt-4 bg-gray-900 hover:bg-gray-950 text-white p-2 rounded"
      >
        {walletAddress ? `Connected: ${walletAddress}` : 'Connect Wallet'}
      </button>

      {/* Claim Rewards button */}
      <button
        onClick={claimRewards}
        disabled={loading || !publicKey} // Disable if loading or wallet not connected
        className={`mt-4 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded ${
          loading || !publicKey ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Claiming...' : 'Claim Rewards'}
      </button>

      {/* Display message after transaction */}
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default ClaimRewardsPage;
