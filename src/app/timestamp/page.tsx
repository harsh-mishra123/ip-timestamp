// app/timestamp/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { sepolia } from 'viem/chains';
import { Upload, FileText, Hash, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';
import { timestampOnChain } from '@/lib/blockchain';
import { publicClient } from '@/lib/ethereum';
import { useDocumentsStore } from '@/lib/documents-store';

export default function TimestampPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'confirmed' | 'failed'>('idle');
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const addDocument = useDocumentsStore((state) => state.addDocument);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const hashBytes32 = useMemo(() => {
    if (!hash) return '';
    const trimmed = hash.startsWith('0x') ? hash.slice(2) : hash;
    if (trimmed.length !== 64) return '';
    return `0x${trimmed}` as `0x${string}`;
  }, [hash]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsProcessing(true);

    // Generate hash (simplified - use crypto-js in production)
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    setHash(hashHex);
    setIsProcessing(false);
  };

  const handleTimestamp = async () => {
    if (!hashBytes32 || !isConnected || !walletClient || !address) return;

    setError('');
    setTxHash('');
    setTxStatus('idle');
    setIsSubmitting(true);

    const activeChainId =
      walletClient?.chain?.id ??
      (await walletClient.getChainId());

    if (activeChainId !== sepolia.id) {
      setIsSubmitting(false);
      setError('Please switch your wallet to the Sepolia testnet.');
      return;
    }

    const result = await timestampOnChain(hashBytes32, walletClient, address as `0x${string}`);
    if (!result.success) {
      setError(result.error || 'Transaction failed. Please try again.');
      setIsSubmitting(false);
      return;
    }

    if (!result.txHash) {
      setError('Transaction hash missing. Please try again.');
      setIsSubmitting(false);
      return;
    }

    if (result.success) {
      const createdAt = Date.now();
      const viewerAddress = address || 'guest';
      const name = file?.name || 'Untitled Document';
      const documentId = `${viewerAddress}-${hashBytes32}-timestamp`;

      addDocument({
        id: documentId,
        name,
        hash: hashBytes32,
        timestamp: Math.floor(createdAt / 1000),
        owner: address,
        txHash: result.txHash,
        source: 'timestamp',
        createdAt,
        viewerAddress,
      });

      setTxHash(result.txHash);
      setTxStatus('pending');
      void (async () => {
        try {
          await publicClient.waitForTransactionReceipt({ hash: result.txHash });
          if (isMounted.current) {
            setTxStatus('confirmed');
          }
        } catch (err) {
          if (isMounted.current) {
            setTxStatus('failed');
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'Transaction failed to confirm.');
          }
        }
      })();
    }

    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Timestamp Document</h1>
        <p className="text-zinc-400 mb-12">Create an immutable proof of your file&apos;s existence on the blockchain</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6">
                <Upload className="w-8 h-8 text-blue-400" />
              </div>
              
              <label className="block">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isProcessing}
                />
                <div className="cursor-pointer p-6 border-2 border-dashed border-white/10 rounded-xl hover:border-blue-500/50 transition-colors text-center">
                  {file ? (
                    <div className="space-y-2">
                      <FileText className="w-8 h-8 text-blue-400 mx-auto" />
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-zinc-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium mb-2">Choose a file</p>
                      <p className="text-sm text-zinc-400">
                        PDF, DOC, Image, or Code files
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* File Info */}
            {file && (
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  File Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Name:</span>
                    <span className="font-medium truncate">{file.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Type:</span>
                    <span>{file.type || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Size:</span>
                    <span>{(file.size / 1024).toFixed(2)} KB</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hash & Actions */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Document Hash
              </h3>
              
              {hash ? (
                <div className="space-y-4">
                  <div className="p-4 bg-black/50 rounded-lg border border-white/5">
                    <code className="text-sm font-mono break-all text-blue-300">
                      {hash}
                    </code>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Algorithm:</span>
                    <span className="font-medium">SHA-256</span>
                  </div>
                  
                  <button
                    onClick={handleTimestamp}
                    disabled={!isConnected || !hashBytes32 || isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                  >
                    {isSubmitting
                      ? 'Submitting Transaction...'
                      : isConnected
                      ? 'Timestamp on Blockchain'
                      : 'Connect Wallet to Continue'}
                  </button>

                  {error && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                      <AlertTriangle className="mt-0.5 h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  {txHash && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      <div className="space-y-1">
                        <p>
                          {txStatus === 'confirmed'
                            ? 'Transaction confirmed on-chain.'
                            : txStatus === 'failed'
                            ? 'Transaction failed to confirm. Check the explorer.'
                            : 'Transaction sent. It can take a minute to confirm.'}
                        </p>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-200 hover:text-white"
                        >
                          View transaction
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  {isProcessing ? (
                    <div className="space-y-2">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p>Calculating hash...</p>
                    </div>
                  ) : (
                    <p>Upload a file to generate its unique fingerprint</p>
                  )}
                </div>
              )}
            </div>

            {/* Information */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <h3 className="font-semibold mb-3">How It Works</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">1</span>
                  </div>
                  <span>Your file is processed locally - nothing is uploaded to our servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">2</span>
                  </div>
                  <span>A unique SHA-256 hash is generated from your file content</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">3</span>
                  </div>
                  <span>The hash is permanently recorded on the Ethereum blockchain</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}