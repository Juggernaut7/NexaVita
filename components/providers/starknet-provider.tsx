'use client'

import React from 'react'

/**
 * Simple provider wrapper for Starknet functionality
 * Starknet integration will be added via direct RPC calls and utilities
 */
export function StarknetProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
