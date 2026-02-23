'use client'

import { useCallback } from 'react'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'

/**
 * Custom hook for wallet management
 * Provides wallet connection utilities and state management
 */
export function useWallet() {
  const { address, status, account, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const connectWallet = useCallback(async () => {
    // Connect to the first available connector (usually what people want for quick connect)
    if (connectors.length > 0) {
      connect({ connector: connectors[0] })
    }
  }, [connect, connectors])

  const disconnectWallet = useCallback(() => {
    disconnect()
  }, [disconnect])

  const getShortAddress = useCallback(() => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [address])

  return {
    account,
    address,
    isConnected,
    status,
    connectWallet,
    disconnectWallet,
    getShortAddress,
    connectors,
    connect
  }
}
