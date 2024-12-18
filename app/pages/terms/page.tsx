import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-4">
        <p>Welcome to BARK NFT Marketplace. By using our services, you agree to these terms. Please read them carefully.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
        <p>By accessing or using the BARK NFT Marketplace, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Use of Service</h2>
        <p>You may use our service only if you can form a binding contract with BARK, and only in compliance with these Terms and all applicable laws. When you create your BARK account, you must provide us with accurate and complete information.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Content and Conduct</h2>
        <p>Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Intellectual Property</h2>
        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of BARK and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Termination</h2>
        <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Changes to Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">7. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us.</p>
      </div>
      <div className="mt-8">
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}

