'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PrivacyBadge } from '@/components/shared/privacy-badge'
import { ZKTooltip } from '@/components/shared/zk-tooltip'
import { PRIVACY_TOOLTIPS } from '@/lib/constants'
import { MarketplaceListing } from '@/lib/types'
import { useWallet } from '@/features/auth/useWallet'
import { toast } from 'sonner'
import { Search, TrendingUp, Heart, Moon, Activity, ArrowRight, Lock } from 'lucide-react'

// Mock listings
const mockListings: MarketplaceListing[] = [
  {
    id: '1',
    seller: '0x1234...5678',
    commitment: {
      id: 'commit-1',
      seller: '0x1234...5678',
      dataHash: '0xabcd...',
      proofHash: '0xefgh...',
      ipfsHash: 'QmXxxx',
      timestamp: Date.now() - 86400000,
      metricsPreview: {
        category: 'fitness',
        description: 'High Activity Cohort',
      },
    },
    minBidAmount: 100n,
    active: true,
    bids: [],
  },
  {
    id: '2',
    seller: '0x5678...9012',
    commitment: {
      id: 'commit-2',
      seller: '0x5678...9012',
      dataHash: '0xijkl...',
      proofHash: '0xmnop...',
      ipfsHash: 'QmYyyy',
      timestamp: Date.now() - 172800000,
      metricsPreview: {
        category: 'sleep',
        description: 'Good Recovery Metrics',
      },
    },
    minBidAmount: 80n,
    active: true,
    bids: [],
  },
  {
    id: '3',
    seller: '0x9012...3456',
    commitment: {
      id: 'commit-3',
      seller: '0x9012...3456',
      dataHash: '0xqrst...',
      proofHash: '0xuvwx...',
      ipfsHash: 'QmZzzz',
      timestamp: Date.now() - 259200000,
      metricsPreview: {
        category: 'wellness',
        description: 'Balanced Health Profile',
      },
    },
    minBidAmount: 120n,
    active: true,
    bids: [],
  },
  {
    id: '4',
    seller: '0x3456...7890',
    commitment: {
      id: 'commit-4',
      seller: '0x3456...7890',
      dataHash: '0xyzab...',
      proofHash: '0xcdef...',
      ipfsHash: 'QmWwww',
      timestamp: Date.now() - 345600000,
      metricsPreview: {
        category: 'recovery',
        description: 'Optimal Recovery Rates',
      },
    },
    minBidAmount: 110n,
    active: true,
    bids: [],
  },
]

export default function MarketplacePage() {
  const { isConnected } = useWallet()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBid, setSelectedBid] = useState<string | null>(null)
  const [bidAmount, setBidAmount] = useState('')

  const filteredListings = mockListings.filter(
    (listing) =>
      listing.commitment.metricsPreview.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      listing.seller.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBidSubmit = (listingId: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet to place a bid')
      return
    }

    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      toast.error('Please enter a valid bid amount')
      return
    }

    toast.success(`Bid of ${bidAmount} STRK submitted for listing ${listingId}`)
    setSelectedBid(null)
    setBidAmount('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Header />

      <section className="py-12 px-4 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Health Data Marketplace</h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse anonymized health insights with verified zero-knowledge proofs. All bids are
              sealed and encrypted until auction settlement.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by profile or seller address..."
                className="pl-12 bg-input border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Listings</p>
                    <p className="text-2xl font-bold">{mockListings.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Volume</p>
                    <p className="text-2xl font-bold">8.4K STRK</p>
                  </div>
                  <Activity className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Premium</p>
                    <p className="text-2xl font-bold">+12%</p>
                  </div>
                  <Heart className="w-8 h-8 text-error" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredListings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full flex flex-col bg-card border-border backdrop-blur-md bg-black/30 border-white/10 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {listing.commitment.metricsPreview.category === 'fitness' && (
                            <Activity className="w-5 h-5 inline mr-2 text-blue-400" />
                          )}
                          {listing.commitment.metricsPreview.category === 'sleep' && (
                            <Moon className="w-5 h-5 inline mr-2 text-indigo-400" />
                          )}
                          {listing.commitment.metricsPreview.category === 'wellness' && (
                            <Heart className="w-5 h-5 inline mr-2 text-emerald-400" />
                          )}
                          {listing.commitment.metricsPreview.category === 'recovery' && (
                            <TrendingUp className="w-5 h-5 inline mr-2 text-cyan-400" />
                          )}
                          {listing.commitment.metricsPreview.description}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Posted {formatTime(listing.commitment.timestamp)}
                        </CardDescription>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30">
                        <span className="text-xs font-semibold text-accent">Active</span>
                      </div>
                    </div>

                    <PrivacyBadge
                      category={listing.commitment.metricsPreview.category as any}
                      size="sm"
                    />
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    {/* Details */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <p className="text-xs text-muted-foreground mb-1">Min Bid</p>
                          <p className="font-bold">
                            {Number(listing.minBidAmount) / 1000} STRK
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/10">
                          <p className="text-xs text-muted-foreground mb-1">Current Bids</p>
                          <p className="font-bold">{listing.bids.length}</p>
                        </div>
                      </div>

                      {/* Seller */}
                      <div className="p-3 rounded-lg bg-card border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Seller</p>
                        <p className="font-mono text-sm">{listing.seller}</p>
                      </div>

                      {/* Privacy Info */}
                      <div className="p-3 rounded-lg bg-success/10 border border-success/30 flex gap-2">
                        <Lock className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-semibold text-success">Data encrypted</p>
                          <p className="text-muted-foreground">
                            ZK proof verified
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bid Form */}
                    {selectedBid === listing.id ? (
                      <div className="space-y-3 p-4 rounded-lg border border-accent/30 bg-accent/5">
                        <Input
                          type="number"
                          placeholder="Bid amount (STRK)"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="bg-input border-border text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedBid(null)
                              setBidAmount('')
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-accent hover:bg-accent/90"
                            onClick={() => handleBidSubmit(listing.id)}
                          >
                            Submit <ZKTooltip text={PRIVACY_TOOLTIPS.sealed_bid} trigger="" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-accent hover:bg-accent/90"
                        onClick={() => setSelectedBid(listing.id)}
                      >
                        Place Bid
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No listings found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function formatTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
