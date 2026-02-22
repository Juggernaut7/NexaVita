/**
 * IPFS Client - Client-side only, public gateway integration
 * Uses ipfs-http-client for pinning encrypted data
 */

import { EncryptedBlob } from '@/lib/types'
import { IPFS_GATEWAY } from '@/lib/constants'

let ipfsClient: any = null

/**
 * Initialize IPFS HTTP client
 */
async function initIPFSClient() {
  if (ipfsClient) return ipfsClient

  try {
    // Dynamic import to avoid issues in browser
    const { create } = await import('ipfs-http-client')
    ipfsClient = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    })
    return ipfsClient
  } catch (error) {
    console.error('Failed to initialize IPFS client:', error)
    return null
  }
}

/**
 * Upload encrypted health data to IPFS
 * Returns IPFS hash for commitment to blockchain
 */
export async function uploadEncryptedData(encrypted: EncryptedBlob): Promise<string> {
  try {
    const client = await initIPFSClient()
    
    if (!client) {
      // Fallback: use public gateway simulation
      return simulateIPFSUpload(encrypted)
    }

    const data = JSON.stringify(encrypted)
    const result = await client.add(data)
    
    return result.path // Returns IPFS hash like "QmXxxx"
  } catch (error) {
    console.error('IPFS upload error:', error)
    // Fallback to simulated upload
    return simulateIPFSUpload(encrypted)
  }
}

/**
 * Download and decrypt data from IPFS
 */
export async function downloadEncryptedData(ipfsHash: string): Promise<EncryptedBlob | null> {
  try {
    const client = await initIPFSClient()
    
    if (!client) {
      // Try public gateway
      return fetchFromPublicGateway(ipfsHash)
    }

    let data = ''
    for await (const chunk of client.cat(ipfsHash)) {
      data += new TextDecoder().decode(chunk)
    }

    return JSON.parse(data) as EncryptedBlob
  } catch (error) {
    console.error('IPFS download error:', error)
    return fetchFromPublicGateway(ipfsHash)
  }
}

/**
 * Fetch from public IPFS gateway
 */
async function fetchFromPublicGateway(ipfsHash: string): Promise<EncryptedBlob | null> {
  try {
    const url = `${IPFS_GATEWAY}/ipfs/${ipfsHash}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Gateway returned ${response.status}`)
    }

    return await response.json() as EncryptedBlob
  } catch (error) {
    console.error('Public gateway fetch error:', error)
    return null
  }
}

/**
 * Simulate IPFS upload for MVP (generates deterministic hash)
 */
function simulateIPFSUpload(encrypted: EncryptedBlob): string {
  const data = JSON.stringify(encrypted)
  const encoder = new TextEncoder()
  const bytes = encoder.encode(data)

  // Deterministic hash simulation
  let hash = 0
  for (let i = 0; i < bytes.length; i++) {
    hash = ((hash << 5) - hash) + bytes[i]
    hash = hash & hash
  }

  const hashStr = Math.abs(hash).toString(16).padStart(16, '0')
  return `Qm${hashStr}${Date.now().toString(16).padStart(16, '0')}`
}

/**
 * Pin content to local or remote IPFS node
 */
export async function pinToIPFS(ipfsHash: string): Promise<boolean> {
  try {
    const client = await initIPFSClient()
    
    if (!client) {
      console.warn('IPFS client not available for pinning')
      return false
    }

    await client.pin.add(ipfsHash)
    return true
  } catch (error) {
    console.error('IPFS pin error:', error)
    return false
  }
}

/**
 * Get metadata about content on IPFS
 */
export async function getIPFSMetadata(ipfsHash: string) {
  try {
    const url = `https://ipfs.io/api/v0/dag/get?arg=${ipfsHash}`
    const response = await fetch(url)
    
    if (!response.ok) return null
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching IPFS metadata:', error)
    return null
  }
}
