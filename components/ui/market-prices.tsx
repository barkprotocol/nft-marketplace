"use client"

import { useState, useEffect } from 'react'
import { fetchMarketPrices } from '@/app/utils/market-api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function MarketPrices() {
  const [prices, setPrices] = useState<{ [key: string]: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const solPrices = await fetchMarketPrices('SOL')
        setPrices(solPrices)
      } catch (error) {
        console.error('Error fetching market prices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>SOL Market Prices</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading prices...</p>
        ) : prices ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Price (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>CoinMarketCap</TableCell>
                <TableCell className="text-right">${prices.coinmarketcap.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CoinGecko</TableCell>
                <TableCell className="text-right">${prices.coingecko.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jupiter</TableCell>
                <TableCell className="text-right">${prices.jupiter.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p>Failed to load prices. Please try again later.</p>
        )}
      </CardContent>
    </Card>
  )
}

