import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  omniWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Valora, CeloWallet } from "@celo/rainbowkit-celo/wallets";
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import Layout from "../components/Layout";
import { Toaster } from "react-hot-toast";

const projectId = "celo-composer-project-id" // get one at https://cloud.walletconnect.com/app

const { chains, publicClient } = configureChains(
  [Alfajores, Celo],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }) })]
);
  
// const connectors = celoGroups({chains, projectId, appName: typeof document === "object" && document.title || "Your App Name"})
const connectors = connectorsForWallets([
  {
    groupName: "Recommended with CELO",
    wallets: [
      Valora({ chains, projectId }),
      CeloWallet({ chains, projectId }),
      metaMaskWallet({ chains }),
      omniWallet({ chains }),
      walletConnectWallet({ chains, projectId }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient: publicClient,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <>  
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} coolMode={true}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
      </WagmiConfig>
      <Toaster position="top-center" />
    </>
  )
}

export default App;