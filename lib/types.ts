// Health metrics data model
export interface HealthMetrics {
  heartRateAvg: number
  steps: number
  sleepHours: number
  caloriesBurned?: number
  workoutMinutes?: number
  [key: string]: number | undefined
}

// Data commitment on-chain
export interface DataCommitment {
  id: string
  seller: string
  dataHash: string
  proofHash: string
  ipfsHash: string
  timestamp: number
  metricsPreview: {
    category: string
    description: string
  }
}

// Marketplace listing
export interface MarketplaceListing {
  id: string
  seller: string
  commitment: DataCommitment
  minBidAmount: bigint
  active: boolean
  bids: Bid[]
}

// Sealed bid
export interface Bid {
  id: string
  bidder: string
  encryptedAmount: string
  timestamp: number
  revealed?: boolean
}

// ZK proof
export interface ZKProof {
  proof: string
  publicInputs: string[]
  proofType: 'S2' | 'Groth16'
  verified: boolean
}

// Encrypted data blob
export interface EncryptedBlob {
  ciphertext: string
  nonce: string
  publicKey: string
}
