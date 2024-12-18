import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-4">
        <p>At BARK NFT Marketplace, we take your privacy seriously. This Privacy Policy describes how we collect, use, and share your personal information.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, wallet address, and transaction history.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, and to communicate with you about products, services, offers, and events.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Sharing of Information</h2>
        <p>We may share your information with third-party vendors, service providers, and other partners who need access to such information to carry out work on our behalf. We may also release information when its release is appropriate to comply with the law or protect our rights.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Data Security</h2>
        <p>We use reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet or electronic storage system is completely secure.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Your Choices</h2>
        <p>You may update, correct or delete information about you at any time by logging into your online account or by contacting us. You may also opt out of receiving promotional communications from us by following the instructions in those messages.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Changes to this Policy</h2>
        <p>We may change this privacy policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">7. Contact Us</h2>
        <p>If you have any questions about this privacy policy, please contact us.</p>
      </div>
      <div className="mt-8">
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}

