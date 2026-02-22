import { STARKNET_RPC_URL } from '@/lib/constants'

/**
 * Starknet RPC provider utilities
 * Direct RPC calls without @starknet-react/core dependency
 */

export interface RpcProvider {
  nodeUrl: string
}

export function getProvider(): RpcProvider {
  return {
    nodeUrl: STARKNET_RPC_URL,
  }
}

export async function getBalance(address: string): Promise<string> {
  try {
    const provider = getProvider()
    const response = await fetch(provider.nodeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'starknet_getBalance',
        params: [address, 'latest'],
      }),
    })
    const data = await response.json()
    return data.result || '0'
  } catch (error) {
    console.error('[v0] Error fetching balance:', error)
    return '0'
  }
}
