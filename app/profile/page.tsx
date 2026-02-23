'use client'

import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useWallet } from '@/features/auth/useWallet'
import { Separator } from '@/components/ui/separator'
import { Shield, Bell, Eye, Lock, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { isConnected, address, disconnectWallet } = useWallet()
  const [copied, setCopied] = useState(false)
  const [preferences, setPreferences] = useState({
    publicProfile: false,
    allowBids: true,
    emailNotifications: true,
    dataSharing: false,
  })

  if (!isConnected) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)]">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Please connect your wallet to view your profile.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success('Address copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <AppShell>
      <section className="py-12 px-4 md:py-20 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account and privacy preferences</p>
          </motion.div>

          {/* Wallet Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  Connected Wallet
                </CardTitle>
                <CardDescription>Your Starknet wallet information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Wallet Address</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 rounded-lg bg-primary/10 border border-border font-mono text-sm break-all">
                      {address}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyAddress}
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Network</p>
                    <p className="font-semibold">Starknet Sepolia</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <p className="font-semibold">Connected</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    disconnectWallet()
                    toast.success('Wallet disconnected')
                  }}
                >
                  Disconnect Wallet
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-accent" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control how your data is shared</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Public Profile */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-border">
                  <div>
                    <p className="font-semibold mb-1">Public Profile</p>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see your profile and listings
                    </p>
                  </div>
                  <Switch
                    checked={preferences.publicProfile}
                    onCheckedChange={() => togglePreference('publicProfile')}
                  />
                </div>

                {/* Allow Bids */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-border">
                  <div>
                    <p className="font-semibold mb-1">Allow Bids</p>
                    <p className="text-sm text-muted-foreground">
                      Accept bids on your health data listings
                    </p>
                  </div>
                  <Switch
                    checked={preferences.allowBids}
                    onCheckedChange={() => togglePreference('allowBids')}
                  />
                </div>

                {/* Data Sharing */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-border">
                  <div>
                    <p className="font-semibold mb-1">Advanced Data Sharing</p>
                    <p className="text-sm text-muted-foreground">
                      Opt into specialized research partnerships
                    </p>
                  </div>
                  <Switch
                    checked={preferences.dataSharing}
                    onCheckedChange={() => togglePreference('dataSharing')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-accent" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage how you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-border">
                  <div>
                    <p className="font-semibold mb-1">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about bids and auction activity
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={() => togglePreference('emailNotifications')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data & Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-card border-border backdrop-blur-md bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-accent" />
                  Data & Privacy
                </CardTitle>
                <CardDescription>Your data is always encrypted and protected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                  <p className="text-sm text-muted-foreground mb-2">
                    Your health data is protected by:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" />
                      ElGamal homomorphic encryption
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" />
                      Zero-knowledge proofs (ZK-STARK)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" />
                      Decentralized IPFS storage
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" />
                      Sealed auction bids
                    </li>
                  </ul>
                </div>

                <Separator className="bg-border" />

                <div className="space-y-3">
                  <h4 className="font-semibold">Your Rights</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Your data is encrypted before leaving your device</li>
                    <li>✓ You maintain full control over your listings</li>
                    <li>✓ You can withdraw listings at any time</li>
                    <li>✓ No third party access to raw health metrics</li>
                    <li>✓ Transparent ZK proof verification</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-error/30 bg-error/5">
              <CardHeader>
                <CardTitle className="text-error">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  These actions cannot be undone. Proceed with caution.
                </p>
                <Button variant="outline" className="w-full border-error/30 text-error hover:bg-error/10">
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </AppShell>
  )
}
