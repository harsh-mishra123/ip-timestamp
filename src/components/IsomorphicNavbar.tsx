'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ArrowLeft } from 'lucide-react';

const PAGES_WITH_BACK = new Set(['/timestamp', '/verify', '/dashboard']);

export default function IsomorphicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const showBack = PAGES_WITH_BACK.has(pathname);

  return (
    <nav className="fixed w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : null}

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xl">
              P
            </div>
            <span className="font-bold text-xl tracking-tight">ProofOfWork</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="/timestamp" className="hover:text-white transition-colors">
            Timestamp
          </Link>
          <Link href="/verify" className="hover:text-white transition-colors">
            Verify
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
        </div>

        <ConnectButton />
      </div>
    </nav>
  );
}
