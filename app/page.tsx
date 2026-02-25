'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Lock, Zap, TrendingUp, ArrowRight } from 'lucide-react'
import { useWallet } from '@/features/auth/useWallet'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
}

export default function Home() {
  const { isConnected } = useWallet()

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Background Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />

          <motion.div
            className="relative z-10 grid gap-12 md:grid-cols-2 items-center"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {/* Copy */}
            <div className="space-y-8 text-center md:text-left">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                variants={fadeInUp}
              >
                <span className="bg-gradient-to-r from-foreground via-accent to-blue-500 bg-clip-text text-transparent italic">
                  NexaVita: Own Your Health, Privately.
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-3xl md:max-w-xl"
                variants={fadeInUp}
              >
                Prove you&apos;re part of a high-activity, healthy cohort without exposing raw metrics.
                ZK-STARKs, ElGamal encryption, and Starknet-powered sealed auctions, all in your browser.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                variants={fadeInUp}
              >
                <Link href="/upload">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Start Upload
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button size="lg" variant="outline">
                    Explore Marketplace
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Visual / Illustration */}
            <motion.div
              className="relative h-[320px] md:h-[380px] rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Concentric rings (static illustration, no animation) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full border border-accent/40" />
                  <div className="absolute inset-3 rounded-full border border-blue-500/30" />
                  <div className="relative z-10 w-28 h-28 rounded-3xl bg-primary/80 border border-white/10 flex flex-col items-center justify-center shadow-2xl">
                    <Lock className="w-8 h-8 text-accent mb-2" />
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      ZK-HEALTH COHORT
                    </p>
                    <p className="mt-1 text-xs font-semibold text-foreground">
                      High Activity
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics strip */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Heart Rate
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">80–100 bpm</p>
                    <p className="mt-1 text-[10px] text-success">Proven privately</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Daily Steps
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">&gt; 10,000</p>
                    <p className="mt-1 text-[10px] text-success">Meets criteria</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Sleep
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">7+ hrs</p>
                    <p className="mt-1 text-[10px] text-accent">Cohort-only view</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="px-4 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold">Privacy-First Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced cryptography ensures your health data remains yours alone
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1: ZK Proofs - Large */}
            <motion.div
              className="md:col-span-2 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border backdrop-blur-md bg-black/30 border-white/10 shadow-xl hover:shadow-2xl transition-all">
                <Zap className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-2xl font-bold mb-3">Zero-Knowledge Proofs</h3>
                <p className="text-muted-foreground mb-4">
                  Prove your health data meets criteria without revealing actual values. Buyers get verified insights, you keep your privacy.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    STARK proofs generated locally
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Under 2 seconds proof time
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Feature 2: Encryption */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border backdrop-blur-md bg-black/30 border-white/10 shadow-xl hover:shadow-2xl transition-all">
                <Lock className="w-8 h-8 text-success mb-4" />
                <h3 className="text-xl font-bold mb-3">Encrypted Storage</h3>
                <p className="text-muted-foreground text-sm">
                  ElGamal homomorphic encryption ensures your data is encrypted before leaving your device.
                </p>
              </div>
            </motion.div>

            {/* Feature 3: Smart Contracts */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border backdrop-blur-md bg-black/30 border-white/10 shadow-xl hover:shadow-2xl transition-all">
                <TrendingUp className="w-8 h-8 text-error mb-4" />
                <h3 className="text-xl font-bold mb-3">Sealed Auctions</h3>
                <p className="text-muted-foreground text-sm">
                  Encrypted bids revealed only at settlement. Fair market prices with complete anonymity.
                </p>
              </div>
            </motion.div>

            {/* Feature 4: IPFS */}
            <motion.div
              className="md:col-span-2 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border backdrop-blur-md bg-black/30 border-white/10 shadow-xl hover:shadow-2xl transition-all">
                <h3 className="text-2xl font-bold mb-3">Decentralized Storage</h3>
                <p className="text-muted-foreground mb-4">
                  Your encrypted data lives on IPFS. Only the hash is committed on-chain. You maintain full control over content lifetime and access.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Pinning</p>
                    <p className="font-semibold">Permanent</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Redundancy</p>
                    <p className="font-semibold">Global</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 5: On-Chain */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border backdrop-blur-md bg-black/30 border-white/10 shadow-xl hover:shadow-2xl transition-all">
                <div className="text-2xl font-bold mb-2 text-accent">Starknet</div>
                <p className="text-muted-foreground text-sm">
                  Built on Starknet for scalable, private settlement with Cairo smart contracts.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flow Section */}
      <section className="px-4 py-20 md:py-32 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Upload', desc: 'Input your health metrics' },
              { step: '2', title: 'Encrypt', desc: 'Client-side ElGamal encryption' },
              { step: '3', title: 'Prove', desc: 'Generate ZK-STARK proof' },
              { step: '4', title: 'Sell', desc: 'List on marketplace' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2
            className="text-3xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Own Your Data?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/upload">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                Start Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
