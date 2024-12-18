import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { encodeURL, createQR, createQROptions } from '@solana/pay';
import { v4 as uuidv4 } from 'uuid';
import base58 from 'bs58';
import BigNumber from 'bignumber.js';

export async function generateBlink(
  recipient: string,
  amount: number,
  label: string,
  message: string,
  memo: string
): Promise<string> {
  const amountInLamports = new BigNumber(amount).times(LAMPORTS_PER_SOL);
  const reference = new PublicKey(base58.encode(Buffer.from(uuidv4())));
  const url = encodeURL({
    recipient: new PublicKey(recipient),
    amount: amountInLamports,
    reference,
    label,
    message,
    memo
  });

  return url.toString();
}

export async function createBlinkQR(blinkUrl: string): Promise<string> {
  const qrOptions: CreateQROptions = {
    width: 512,
    height: 512,
    type: 'canvas',
    data: blinkUrl,
    margin: 16,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q',
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 0,
    },
  };

  const qr = createQR(qrOptions);
  const qrCanvas = await qr.toCanvas();
  return qrCanvas.toDataURL();
}

export async function createBlinkTransaction(
  connection: Connection,
  payer: PublicKey,
  recipient: PublicKey,
  amount: number,
  reference: PublicKey,
  memo: string
): Promise<Transaction> {
  const transaction = new Transaction();
  const amountInLamports = new BigNumber(amount).times(LAMPORTS_PER_SOL).toNumber();

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: recipient,
      lamports: amountInLamports
    })
  );

  if (memo) {
    transaction.add(
      new SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: recipient,
        lamports: 0
      }).add(
        new TransactionInstruction({
          keys: [],
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
          data: Buffer.from(memo, 'utf8'),
        })
      )
    );
  }

  transaction.add(
    new SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: recipient,
      lamports: 0
    }).add(
      new TransactionInstruction({
        keys: [{ pubkey: reference, isSigner: false, isWritable: false }],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: Buffer.from(''),
      })
    )
  );

  return transaction;
}

