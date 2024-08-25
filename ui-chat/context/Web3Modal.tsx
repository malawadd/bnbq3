'use client'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "f25128b8bcfc64fb5c124705aa9442b8"

let mainnet = {
  chainId: 5611,
  name: 'OPBNB',
  currency: 'TBNB',
  explorerUrl: 'https://opbnb-testnet.bscscan.com/',
  rpcUrl: 'https://opbnb-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5'
}
if (process.env.NEXT_PUBLIC_NETWORK === "local") {
  mainnet = {
    chainId: 1337,
    name: 'OPBNB',
    currency: 'TBNB',
    explorerUrl: 'https://opbnb-testnet.bscscan.com/',
    rpcUrl: 'http://127.0.0.1:8545'
  }
}


// 3. Create modal
const metadata = {
  name: "ChatGPT On Chain",
  description: "CHATGPT",
  // TODO:
  url: '', // origin must match your domain & subdomain
  icons: []
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})

export function Web3ModalProvider({ children }: any) {
  return children
}