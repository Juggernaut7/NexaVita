'use client'

import React from 'react'
import { sepolia } from '@starknet-react/chains'
import { StarknetConfig, publicProvider, argent, braavos } from '@starknet-react/core'

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={publicProvider()}
      connectors={[braavos(), argent()]}
    >
      {children}
    </StarknetConfig>
  )
}
