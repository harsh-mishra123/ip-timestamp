// lib/arweave.ts
import Arweave from 'arweave';

// Initialize with testnet
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

export async function storeOnArweave(file: File, metadata: any) {
  try {
    // For MVP, use Web3.Storage (free)
    const { Web3Storage } = await import('web3.storage');
    const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN! });
    
    const cid = await client.put([file], {
      name: file.name,
      maxRetries: 3
    });
    
    return {
      cid,
      url: `https://${cid}.ipfs.w3s.link`
    };
  } catch (error) {
    console.error('Storage failed:', error);
    throw error;
  }
}