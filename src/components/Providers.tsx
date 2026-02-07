'use client';

import * as React from 'react';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, publicClient } = configureChains([sepolia], [publicProvider()]);

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!walletConnectProjectId) {
  console.warn(
    'Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. Set it in .env.local to enable WalletConnect.'
  );
}

const { connectors } = getDefaultWallets({
  appName: 'IP Timestamp',
  projectId: walletConnectProjectId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
