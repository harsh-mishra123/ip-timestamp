// app/verify/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { Search, CheckCircle, XCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { getDocumentOnChain } from '@/lib/blockchain';
import { timestampContract } from '@/lib/ethereum';
import { useDocumentsStore } from '@/lib/documents-store';

export default function VerifyPage() {
  const [hash, setHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    timestamp?: number;
    owner?: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { address } = useAccount();
  const addDocument = useDocumentsStore((state) => state.addDocument);
  const searchParams = useSearchParams();
  const hasAutoVerified = useRef(false);

  const hashBytes32 = useMemo(() => {
    if (!hash) return '';
    const trimmed = hash.startsWith('0x') ? hash.slice(2) : hash;
    if (trimmed.length !== 64) return '';
    return `0x${trimmed}` as `0x${string}`;
  }, [hash]);

  const handleVerify = useCallback(async () => {
    if (!hashBytes32) return;

    setError('');
    setIsVerifying(true);
    try {
      const doc = await getDocumentOnChain(hashBytes32);
      const verified = doc.timestamp > 0;

      setVerificationResult({
        verified,
        timestamp: doc.timestamp,
        owner: doc.owner,
      });

      if (verified) {
        const createdAt = Date.now();
        const viewerAddress = address || 'guest';
        const documentId = `${viewerAddress}-${hashBytes32}-verify`;

        addDocument({
          id: documentId,
          name: 'Verified Hash',
          hash: hashBytes32,
          timestamp: doc.timestamp,
          owner: doc.owner,
          source: 'verify',
          createdAt,
          viewerAddress,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Verification failed. Please try again.');
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  }, [addDocument, address, hashBytes32]);

  useEffect(() => {
    const hashParam = searchParams.get('hash');
    if (hashParam && !hash) {
      setHash(hashParam);
    }
  }, [searchParams, hash]);

  useEffect(() => {
    const hashParam = searchParams.get('hash');
    if (!hashParam || !hashBytes32 || hasAutoVerified.current) return;
    hasAutoVerified.current = true;
    void handleVerify();
  }, [searchParams, hashBytes32, handleVerify]);

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Verify Document</h1>
        <p className="text-zinc-400 mb-12">Check if a document has been timestamped on the blockchain</p>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Input Section */}
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6 mx-auto">
              <Search className="w-8 h-8 text-emerald-400" />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Document Hash
                </label>
                <input
                  type="text"
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  placeholder="Enter SHA-256 hash (64 characters)"
                  className="w-full p-4 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500/50 font-mono text-sm"
                />
              </div>
              
              <button
                onClick={handleVerify}
                disabled={!hashBytes32 || isVerifying}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                {isVerifying ? 'Verifying...' : 'Verify on Blockchain'}
              </button>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          {verificationResult && (
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6 mx-auto">
                {verificationResult.verified ? (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400" />
                )}
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">
                  {verificationResult.verified ? 'Document Verified!' : 'Document Not Found'}
                </h3>
                <p className="text-zinc-400">
                  {verificationResult.verified
                    ? 'This document has been timestamped on the blockchain'
                    : 'No timestamp found for this hash'}
                </p>
              </div>
              
              {verificationResult.verified && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-black/50 rounded-lg border border-white/5">
                      <div className="text-sm text-zinc-400 mb-1">Timestamp</div>
                      <div className="font-medium">
                        {new Date((verificationResult.timestamp || 0) * 1000).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-black/50 rounded-lg border border-white/5">
                      <div className="text-sm text-zinc-400 mb-1">Owner</div>
                      <div className="font-mono text-sm truncate">
                        {verificationResult.owner}
                      </div>
                    </div>
                  </div>
                  
                  <a
                    href={`https://sepolia.etherscan.io/address/${timestampContract.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 border border-white/10 hover:bg-white/5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    View on Etherscan
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <h3 className="font-semibold mb-3">How to Verify</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>• Obtain the SHA-256 hash from the document creator</li>
              <li>• Paste the 64-character hash above</li>
              <li>• Click verify to check the blockchain</li>
              <li>• View timestamp and ownership information</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}