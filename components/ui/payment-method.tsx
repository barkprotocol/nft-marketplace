import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SolanaIcon, USDCIcon, BARKIcon } from '@/components/ui/icons'

interface PaymentMethodProps {
  selectedMethod: 'sol' | 'usdc' | 'bark'; 
  onSelectMethod: (method: 'sol' | 'usdc' | 'bark') => void;
}

export function PaymentMethod({ selectedMethod, onSelectMethod }: PaymentMethodProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Payment Method</h3>
        <RadioGroup value={selectedMethod} onValueChange={(value) => onSelectMethod(value as 'sol' | 'usdc' | 'bark')}>
          <div className="flex flex-wrap space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sol" id="sol" />
              <Label htmlFor="sol" className="flex items-center space-x-2">
                <SolanaIcon className="w-6 h-6" />
                <span>SOL</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <RadioGroupItem value="usdc" id="usdc" />
              <Label htmlFor="usdc" className="flex items-center space-x-2">
                <USDCIcon className="w-6 h-6" />
                <span>USDC</span>
              </Label>
            </div>
            {/* Add BARK Payment Option */}
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <RadioGroupItem value="bark" id="bark" />
              <Label htmlFor="bark" className="flex items-center space-x-2">
                <BARKIcon className="w-6 h-6" />
                <span>BARK</span>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
