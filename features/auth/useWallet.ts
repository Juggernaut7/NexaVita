'use client'

import { useCallback } from 'react'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { toast } from 'sonner'

/**
 * Custom hook for wallet management
 * Provides wallet connection utilities and state management
 */
export function useWallet() {
  const { address, status, account, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const connectWallet = useCallback(async () => {
    if (connectors.length === 0) {
      toast.error('No Starknet wallet detected. Install Braavos or Argent X and refresh.')
      return
    }

    try {
      await connect({ connector: connectors[0] })
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'Failed to connect wallet')
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
