import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { encodeURL, createQR } from '@solana/pay';

export async function generateSolanaBlink(
  recipient: string,
  amount: number,
  reference: string,
  label: string,
  message: string,
  memo: string
): Promise<string> {
  const url = encodeURL({
    recipient: new PublicKey(recipient),
    amount,
    reference: new PublicKey(reference),
    label,
    message,
    memo
  });

  return url.toString();
}

export async function createSolanaBlinkQR(blinkUrl: string): Promise<string> {
  const qr = createQR(blinkUrl);
  return qr.toDataURL();
}

