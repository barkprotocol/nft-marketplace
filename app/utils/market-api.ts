interface MarketPrice {
    coinmarketcap: number;
    coingecko: number;
    jupiter: number;
  }
  
  export async function fetchMarketPrices(token: string): Promise<MarketPrice> {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    // Simulating different prices from each source
    const basePrice = Math.random() * 250 + 799; // Random price between 250 and 799
    return {
      coinmarketcap: parseFloat((basePrice * 0.99).toFixed(2)),
      coingecko: parseFloat((basePrice * 1.01).toFixed(2)),
      jupiter: parseFloat((basePrice * 1.00).toFixed(2)),
    };
  }
  
  