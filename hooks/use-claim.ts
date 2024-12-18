import { useState, useCallback } from 'react';

type ClaimStatus = 'idle' | 'loading' | 'success' | 'error';

export function useClaim() {
  const [status, setStatus] = useState<ClaimStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const claim = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      // API call or Solana blockchain interaction
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate a successful claim 80% of the time
          if (Math.random() < 0.8) {
            resolve('Success');
          } else {
            reject(new Error('Failed to claim NFT'));
          }
        }, 2000);
      });

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }, []);

  return {
    status,
    error,
    claim,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

