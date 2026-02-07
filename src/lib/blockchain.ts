// lib/blockchain.ts
import type { WalletClient } from 'viem';
import { publicClient, timestampContract } from './ethereum';

export async function timestampOnChain(hash: string, walletClient: WalletClient) {
  try {
    const txHash = await walletClient.writeContract({
      ...timestampContract,
      functionName: 'timestampDocument',
      args: [hash],
      account: walletClient.account,
    });

    return {
      success: true,
      txHash,
    };
  } catch (error) {
    console.error('Blockchain timestamp failed:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}

export async function verifyOnChain(hash: string) {
  const hexHash = (hash.startsWith('0x') ? hash : `0x${hash}`) as `0x${string}`;
  const timestamp = await publicClient.readContract({
    ...timestampContract,
    functionName: 'verifyDocument',
    args: [hexHash]
  });
  
  return Number(timestamp);
}