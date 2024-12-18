// An API call to get the current SOL to USDC exchange rate
export async function getSOLtoUSDCRate(): Promise<number> {
    // In a real scenario, this would be an API call to a price feed
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return 222.5; // Example fixed rate, in a real scenario this would be dynamic
  }
  
  export async function convertSOLtoUSDC(solAmount: number): Promise<number> {
    const rate = await getSOLtoUSDCRate();
    return solAmount * rate;
  }
  
  