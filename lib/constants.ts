// Starknet Configuration
export const STARKNET_RPC_URL = process.env.NEXT_PUBLIC_STARKNET_RPC_URL || 'https://starknet-sepolia.public.blastapi.io'
export const STARKNET_CHAIN_ID = process.env.NEXT_PUBLIC_STARKNET_CHAIN_ID || 'SN_SEPOLIA'
export const MARKETPLACE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS || '0x0'

// IPFS Configuration
export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud'

// UI Constants
export const PROVING_TIMEOUT_MS = 2000 // 2 second target for ZK proof generation
export const MIN_BID_AMOUNT = 0.1 // STRK

// Privacy badges categories
export const PRIVACY_CATEGORIES = {
  fitness: {
    label: 'Fitness Cohort',
    description: 'High Activity',
    icon: 'activity',
  },
  sleep: {
    label: 'Sleep Analytics',
    description: 'Good Recovery',
    icon: 'moon',
  },
  wellness: {
    label: 'Wellness Profile',
    description: 'Balanced Health',
    icon: 'heart',
  },
  recovery: {
    label: 'Recovery Metrics',
    description: 'Optimal Rates',
    icon: 'trending-up',
  },
}

// Tooltips for privacy features
export const PRIVACY_TOOLTIPS = {
  encryption: 'Your data is encrypted client-side using ElGamal homomorphic encryption. Only your wallet can decrypt it.',
  zk_proof: 'Zero-knowledge proofs verify your data meets criteria without revealing actual values.',
  sealed_bid: 'Your bid amount is encrypted and revealed only after the auction settles.',
  ipfs_private: 'Encrypted data is stored on IPFS. The hash is public, but only you can decrypt the contents.',
}
