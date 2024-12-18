import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { WalletButton } from "@/components/ui/wallet-button";

export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
            alt="BARK Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">BARK</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/marketplace" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
            Marketplace
          </Link>
          <Link href="/collection" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
            Collection
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
            About
          </Link>
          <Link href="/faq" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}

