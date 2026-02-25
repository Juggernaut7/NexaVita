'use client'

import Link from 'next/link'
import { useWallet } from '@/features/auth/useWallet'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function Header() {
  const { isConnected, address, getShortAddress, connectWallet, disconnectWallet, status } =
    useWallet()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/" label="Home" />
          <NavLink href="/upload" label="Upload" />
          <NavLink href="/marketplace" label="Marketplace" />
          <NavLink href="/dashboard" label="Dashboard" />
        </nav>

        {/* Wallet Connect */}
        <div>
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">
                {getShortAddress()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnectWallet()}
                className="text-xs"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => connectWallet()}
              disabled={status === 'connecting'}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {status === 'connecting' ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
    </Link>
  )
}
