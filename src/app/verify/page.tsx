// app/verify/page.tsx
'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

export default function VerifyPage() {
  const [hash, setHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    timestamp?: number;
    owner?: string;
  } | null>(null);

  const handleVerify = async () => {
    if (!hash.trim()) return;
    
    // TODO: Integrate with smart contract verification
    // Mock response for now
    setVerificationResult({
      verified: Math.random() > 0.5,
      timestamp: Date.now() / 1000 - Math.random() * 86400,
      owner: '0x742d35Cc6634C0532925a3b844Bc9e...'
    });
  };

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
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Verify on Blockchain
              </button>
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
                  
                  <button className="w-full py-3 border border-white/10 hover:bg-white/5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    View on Etherscan
                    <ExternalLink className="w-4 h-4" />
                  </button>
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