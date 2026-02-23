'use client'

import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/features/auth/useWallet'
import { TrendingUp, DollarSign, Eye, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const dashboardData = [
  { name: 'Mon', earnings: 40 },
  { name: 'Tue', earnings: 30 },
  { name: 'Wed', earnings: 20 },
  { name: 'Thu', earnings: 27 },
  { name: 'Fri', earnings: 18 },
  { name: 'Sat', earnings: 23 },
  { name: 'Sun', earnings: 34 },
]

const userListings = [
  {
    id: '1',
    category: 'High Activity Fitness',
    status: 'Active',
    views: 42,
    bids: 3,
    earnings: 150,
  },
  {
    id: '2',
    category: 'Sleep Recovery Data',
    status: 'Sold',
    views: 28,
    bids: 1,
    earnings: 120,
  },
  {
    id: '3',
    category: 'Wellness Profile',
    status: 'Active',
    views: 18,
    bids: 0,
    earnings: 0,
  },
]

export default function DashboardPage() {
  const { isConnected, address } = useWallet()

  if (!isConnected) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)]">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Please connect your wallet to view your dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <section className="py-12 px-4 md:py-20 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-muted-foreground">{address}</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-3xl font-bold">270 STRK</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Listings</p>
                    <p className="text-3xl font-bold">2</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Profile Views</p>
                    <p className="text-3xl font-bold">88</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                    <p className="text-3xl font-bold">2.4h</p>
                  </div>
                  <Clock className="w-8 h-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chart */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle>Weekly Earnings</CardTitle>
                <CardDescription>Your income trends this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(18, 24, 38, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      dataKey="earnings"
                      fill="#00A3FF"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Listings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Listings</h2>
              <Link href="/upload">
                <Button size="sm" className="bg-accent hover:bg-accent/90">
                  New Upload
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {userListings.map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                >
                  <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
                    <CardContent className="flex items-center justify-between py-6">
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{listing.category}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {listing.views} views
                          </span>
                          <span>{listing.bids} bids</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${listing.status === 'Active'
                                ? 'bg-success/20 text-success'
                                : 'bg-muted/20 text-muted-foreground'
                              }`}
                          >
                            {listing.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent">{listing.earnings} STRK</p>
                        <Button variant="ghost" size="sm">
                          View <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </AppShell>
  )
}
