import NextHead from 'next/head'

import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { avalanche, goerli, mainnet, optimism } from 'wagmi/chains'

import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

// Configuration des chaînes Ethereum et des fournisseurs de données pour Wagmi
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, optimism, avalanche],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ],
)
// Création de la configuration Wagmi avec des options par défaut et le connecteur MetaMask
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <NextHead>
        <title>Next app</title>
      </NextHead>
      {/* Configuration globale de Wagmi, y compris la connexion automatique et la configuration */}
      <WagmiConfig config={config}>
        <Component {...pageProps} />
      </WagmiConfig>
    </>
  )
}
