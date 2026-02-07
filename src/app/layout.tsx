// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import IsomorphicNavbar from '@/components/IsomorphicNavbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProofOfWork - Blockchain Timestamping',
  description: 'Immutable proof for your intellectual property on Ethereum',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Providers>
          <IsomorphicNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}