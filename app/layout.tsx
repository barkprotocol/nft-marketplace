import { Inter } from 'next/font/google'
import './styles/globals.css'
import Header from '@/components/ui/layout/header'
import Footer from '@/components/ui/layout/footer'
import { WalletContextProvider } from '@/components/providers/wallet-provider'
import { ThemeProvider } from "@/components/providers/theme-provider"
import ErrorBoundary from '@/components/error-boundary'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BARK | NFT Marketplace and Staking',
  description: 'Buy, sell, and stake your favorite Solana NFTs on BARK Protocol',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletContextProvider>
            <ErrorBoundary>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </ErrorBoundary>
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

