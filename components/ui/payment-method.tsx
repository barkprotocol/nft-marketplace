import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SolanaIcon, USDCIcon } from '@/components/ui/icons'

interface PaymentMethodProps {
  selectedMethod: 'sol' | 'usdc';
  onSelectMethod: (method: 'sol' | 'usdc') => void;
}

export function PaymentMethod({ selectedMethod, onSelectMethod }: PaymentMethodProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Payment Method</h3>
        <RadioGroup value={selectedMethod} onValueChange={(value) => onSelectMethod(value as 'sol' | 'usdc')}>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sol" id="sol" />
              <Label htmlFor="sol" className="flex items-center space-x-2">
                <SolanaIcon className="w-6 h-6" />
                <span>SOL</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="usdc" id="usdc" />
              <Label htmlFor="usdc" className="flex items-center space-x-2">
                <USDCIcon className="w-6 h-6" />
                <span>USDC</span>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

