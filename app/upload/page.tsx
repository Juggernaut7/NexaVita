'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProgressWithLabel } from '@/components/shared/progress-with-label'
import { PrivacyBadge } from '@/components/shared/privacy-badge'
import { ZKTooltip } from '@/components/shared/zk-tooltip'
import { PRIVACY_TOOLTIPS } from '@/lib/constants'
import { HealthMetrics, EncryptedBlob } from '@/lib/types'
import { generateKeyPair, encryptMetrics, hashEncryptedData } from '@/lib/encryption/elgamal'
import { generateZKProof, ProofStatement, getProofDescription } from '@/lib/zk-proofs/prover'
import { uploadEncryptedData } from '@/lib/ipfs/client'
import { useWallet } from '@/features/auth/useWallet'
import { toast } from 'sonner'
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react'

type Step = 'input' | 'encrypt' | 'review' | 'confirm'

interface UploadState {
  metrics: HealthMetrics | null
  encrypted: EncryptedBlob | null
  proof: any | null
  proofStatement: ProofStatement
  ipfsHash: string
  dataHash: string
}

export default function UploadPage() {
  const router = useRouter()
  const { isConnected, address } = useWallet()
  const [step, setStep] = useState<Step>('input')
  const [isLoading, setIsLoading] = useState(false)
  const [state, setState] = useState<UploadState>({
    metrics: null,
    encrypted: null,
    proof: null,
    proofStatement: {
      heartRateMin: 70,
      heartRateMax: 100,
      stepsMin: 8000,
      sleepHoursMin: 6,
    },
    ipfsHash: '',
    dataHash: '',
  })

  // Form inputs
  const [heartRate, setHeartRate] = useState('85')
  const [steps, setSteps] = useState('12000')
  const [sleepHours, setSleepHours] = useState('7.5')

  if (!isConnected) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)]">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Please connect your wallet to upload health data.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  const handleInputSubmit = () => {
    const metrics: HealthMetrics = {
      heartRateAvg: parseInt(heartRate),
      steps: parseInt(steps),
      sleepHours: parseFloat(sleepHours),
    }

    setState((prev) => ({ ...prev, metrics }))
    setStep('encrypt')
  }

  const handleEncrypt = async () => {
    setIsLoading(true)
    try {
      const { publicKey, privateKey } = generateKeyPair()
      const encrypted = encryptMetrics(state.metrics!, publicKey)
      const dataHash = await hashEncryptedData(encrypted)

      setState((prev) => ({
        ...prev,
        encrypted,
        dataHash,
      }))

      // Generate proof
      const proof = await generateZKProof(state.metrics!, state.proofStatement, 2000)
      setState((prev) => ({ ...prev, proof }))

      // Upload to IPFS
      const ipfsHash = await uploadEncryptedData(encrypted)
      setState((prev) => ({ ...prev, ipfsHash }))

      setStep('review')
      toast.success('Encryption and proof generation complete!')
    } catch (error: any) {
      toast.error(error.message || 'Encryption failed')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = () => {
    toast.success('Data commitment submitted to blockchain!')
    // In production: call contract to commit
    setStep('confirm')
  }

  return (
    <AppShell>
      <section className="py-12 px-4 md:py-20 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-12">
            {(['input', 'encrypt', 'review', 'confirm'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${['input', 'encrypt', 'review', 'confirm'].indexOf(step) >= i
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-card text-muted-foreground'
                    }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {['input', 'encrypt', 'review', 'confirm'].indexOf(step) > i ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </motion.div>
                {i < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${['input', 'encrypt', 'review', 'confirm'].indexOf(step) > i
                      ? 'bg-accent'
                      : 'bg-card'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step: Input */}
          {step === 'input' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Enter Your Health Metrics</CardTitle>
                  <CardDescription>
                    Your data will be encrypted client-side and never transmitted in plaintext
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="heart-rate">Average Heart Rate (bpm)</Label>
                      <ZKTooltip text={PRIVACY_TOOLTIPS.encryption} />
                    </div>
                    <Input
                      id="heart-rate"
                      type="number"
                      placeholder="e.g., 85"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="steps">Daily Steps</Label>
                    <Input
                      id="steps"
                      type="number"
                      placeholder="e.g., 12000"
                      value={steps}
                      onChange={(e) => setSteps(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sleep">Sleep Hours</Label>
                    <Input
                      id="sleep"
                      type="number"
                      placeholder="e.g., 7.5"
                      step="0.5"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>

                  <Button
                    onClick={handleInputSubmit}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    Next: Encrypt Data
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step: Encrypt & Prove */}
          {step === 'encrypt' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Encrypting and Proving</CardTitle>
                  <CardDescription>
                    Your data is being encrypted and a ZK-STARK proof is being generated
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* If not started yet, show Start button */}
                  {!state.encrypted && !isLoading ? (
                    <div className="space-y-6">
                      <p className="text-sm text-muted-foreground">
                        Click below to start the local encryption and ZK-STARK proof generation process.
                      </p>
                      <Button onClick={handleEncrypt} className="w-full bg-accent hover:bg-accent/90">
                        Start Process
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <ProgressWithLabel
                        label="Client-side Encryption"
                        value={isLoading ? 33 : 100}
                        isLoading={isLoading && !state.encrypted}
                        sublabel="ElGamal homomorphic encryption"
                      />

                      <ProgressWithLabel
                        label="ZK-STARK Proof Generation"
                        value={isLoading ? 66 : 100}
                        isLoading={isLoading && !state.proof}
                        sublabel="Verifying criteria without revealing values"
                      />

                      <ProgressWithLabel
                        label="IPFS Upload"
                        value={isLoading ? 90 : 100}
                        isLoading={isLoading && !state.ipfsHash}
                        sublabel="Uploading encrypted blob"
                      />

                      {!isLoading && state.encrypted && (
                        <Button
                          onClick={() => setStep('review')}
                          className="w-full bg-accent hover:bg-accent/90"
                        >
                          Review & Confirm
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      )}

                      {isLoading && (
                        <Button disabled className="w-full">
                          Processing...
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step: Review */}
          {step === 'review' && state.encrypted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Review & Confirm</CardTitle>
                  <CardDescription>
                    Your data will be committed to the blockchain. This action is permanent.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Data Hash</p>
                      <p className="font-mono text-sm break-all">{state.dataHash.slice(0, 16)}...</p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <p className="text-xs text-muted-foreground mb-1">IPFS Hash</p>
                      <p className="font-mono text-sm break-all">{state.ipfsHash.slice(0, 16)}...</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-3">Your Privacy Badge</p>
                    <PrivacyBadge
                      category="fitness"
                      description={getProofDescription(state.proofStatement)}
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-success/10 border border-success/30 flex gap-3">
                    <Lock className="w-5 h-5 text-success flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-success">Your data is protected</p>
                      <p className="text-muted-foreground">
                        Only the hash and encrypted data are committed on-chain
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setStep('input')
                        setState({
                          metrics: null,
                          encrypted: null,
                          proof: null,
                          proofStatement: state.proofStatement,
                          ipfsHash: '',
                          dataHash: '',
                        })
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="flex-1 bg-accent hover:bg-accent/90"
                    >
                      Confirm & Commit
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step: Confirm */}
          {step === 'confirm' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardContent className="pt-12 pb-8 text-center space-y-6">
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
                  <div>
                    <h3 className="text-2xl font-bold">Success!</h3>
                    <p className="text-muted-foreground">
                      Your health data has been committed to the blockchain
                    </p>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Wallet</p>
                    <p className="font-mono">{address}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push('/dashboard')}
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90"
                      onClick={() => router.push('/marketplace')}
                    >
                      Browse Marketplace
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </AppShell>
  )
}
