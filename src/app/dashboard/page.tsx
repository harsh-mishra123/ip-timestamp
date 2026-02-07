// app/dashboard/page.tsx
'use client';

import { useAccount } from 'wagmi';
import { FileText, Clock, Hash, Copy } from 'lucide-react';
import { useState } from 'react';

// Mock data - replace with actual contract calls
const mockDocuments = [
  {
    id: 1,
    name: 'Business_Plan.pdf',
    hash: '0x4f8b1c8a3d...e9f2a1b5c7d',
    timestamp: '2024-01-15 14:30:22',
    txHash: '0xabc123...def456'
  },
  {
    id: 2,
    name: 'Patent_Sketch.jpg',
    hash: '0x9a2b3c4d5e...f6g7h8i9j0k',
    timestamp: '2024-01-10 09:15:47',
    txHash: '0xdef456...ghi789'
  },
  {
    id: 3,
    name: 'Source_Code.zip',
    hash: '0x1l2m3n4o5p...q6r7s8t9u0v',
    timestamp: '2024-01-05 16:45:12',
    txHash: '0xghi789...jkl012'
  }
];

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-zinc-400 mb-8">Connect your wallet to view your timestamped documents</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Documents Here</h1>
            <p className="text-zinc-400">
              Wallet: <span className="font-mono text-sm">{address?.slice(0, 12)}...{address?.slice(-8)}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{mockDocuments.length}</div>
            <div className="text-sm text-zinc-400">Total Documents</div>
          </div>
        </div>

        {mockDocuments.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
            <FileText className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No documents yet</h3>
            <p className="text-zinc-400 mb-6">Timestamp your first document to get started</p>
            <a
              href="/timestamp"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Timestamp Document
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {mockDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{doc.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {doc.timestamp}
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          <span className="font-mono">{doc.hash.slice(0, 20)}...</span>
                          <button
                            onClick={() => copyToClipboard(doc.hash)}
                            className="ml-1 hover:text-white transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {copiedHash === doc.hash && (
                            <span className="text-xs text-emerald-400 ml-1">Copied!</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <a
                      href={`/verify?hash=${doc.hash}`}
                      className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg font-medium text-sm transition-colors"
                    >
                      Verify
                    </a>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${doc.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors"
                    >
                      View Transaction
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
