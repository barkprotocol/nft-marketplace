import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { FileQuestion } from 'lucide-react'

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <FileQuestion className="w-24 h-24 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href="/">
          Return to Home
        </Link>
      </Button>
    </div>
  )
}