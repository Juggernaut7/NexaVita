# ZK-Enhanced Private Health Data Marketplace

A privacy-first decentralized health data marketplace built on Starknet with zero-knowledge proofs, homomorphic encryption, and sealed auctions. Sell your health insights while maintaining complete privacy.

## Overview

This MVP demonstrates a complete architecture for:

- **Zero-Knowledge Proofs (ZK-STARK)**: Prove your health data meets criteria without revealing actual values
- **Client-Side Encryption**: ElGamal homomorphic encryption ensures data never leaves your device in plaintext
- **Sealed Auctions**: Encrypted bids revealed only at settlement for fair pricing
- **Decentralized Storage**: IPFS for encrypted data with on-chain hash commitments
- **Smart Contracts**: Starknet Cairo contracts managing commitments and settlements
- **Privacy-First UX**: Glassmorphic UI with educational tooltips on privacy features

## Tech Stack

### Frontend
- **Next.js 15+** with App Router
- **React 19** with TypeScript
- **Starknet React** (`@starknet-react/core`) for wallet connection
- **Tailwind CSS v4** for styling with custom design tokens
- **Framer Motion** for smooth animations
- **Sonner** for toast notifications

### Backend & Web3
- **Starknet.js v6+** for blockchain interactions
- **IPFS HTTP Client** for decentralized storage
- **Cairo Smart Contracts** for marketplace logic

### Security & Cryptography
- **ElGamal Encryption** for client-side data protection
- **SHA-256 Hashing** for data commitments
- **Starknet Native Auth** for wallet-based authentication

## Project Structure

```
/
├── app/
│   ├── layout.tsx              # Root layout with Starknet provider
│   ├── globals.css             # Tailwind config + design tokens
│   ├── page.tsx                # Landing page (bento grid hero)
│   ├── upload/
│   │   └── page.tsx            # Upload flow with stepper (4 steps)
│   ├── marketplace/
│   │   └── page.tsx            # Browse listings & place sealed bids
│   ├── dashboard/
│   │   └── page.tsx            # User earnings & activity
│   └── profile/
│       └── page.tsx            # Settings & preferences
├── components/
│   ├── ui/                     # shadcn/ui components (button, card, etc.)
│   ├── layout/
│   │   ├── header.tsx          # Top nav + wallet connect
│   │   └── footer.tsx          # Footer (optional)
│   ├── providers/
│   │   └── starknet-provider.tsx # Starknet config & connectors
│   └── shared/
│       ├── privacy-badge.tsx   # Anonymized data category badge
│       ├── zk-tooltip.tsx      # Privacy feature tooltips
│       └── progress-with-label.tsx # Animated progress bars
├── features/
│   ├── auth/
│   │   └── useWallet.ts        # Wallet connection hook
│   ├── encryption/
│   │   └── elgamal.ts          # ElGamal key gen, encrypt/decrypt
│   ├── zk-proofs/
│   │   └── prover.ts           # ZK-STARK proof generation (mock)
│   └── marketplace/
│       └── (sealed bid logic)
├── lib/
│   ├── types.ts                # TypeScript interfaces (HealthMetrics, etc.)
│   ├── constants.ts            # Configuration constants
│   ├── starknet/
│   │   └── provider.ts         # Starknet RPC provider
│   ├── encryption/
│   │   └── elgamal.ts          # Encryption utilities
│   ├── zk-proofs/
│   │   └── prover.ts           # ZK proof utilities
│   └── ipfs/
│       └── client.ts           # IPFS upload/download
├── contracts/
│   └── Marketplace.cairo       # Smart contract (settlement, bids)
├── .env.example                # Environment variables template
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind customization
├── tsconfig.json               # TypeScript config
└── next.config.mjs             # Next.js config
```

## Key Features

### 1. Landing Page (`/`)
- Bento grid hero section with CTA buttons
- Feature showcase with glassmorphic cards
- How-it-works flow diagram
- Fade-in animations with Framer Motion

### 2. Upload Flow (`/upload`)
- **Step 1**: Input health metrics (heart rate, steps, sleep)
- **Step 2**: Client-side encryption + ZK proof generation (aim: <2s)
- **Step 3**: Review encrypted data & anonymized preview
- **Step 4**: Confirm commitment to blockchain
- Real-time progress tracking with animated bars

### 3. Marketplace (`/marketplace`)
- Browse anonymized health data listings
- Search by profile category or seller
- Sealed bid system (encrypted amounts)
- Privacy badges for data categories
- Stats dashboard (active listings, volume, etc.)

### 4. Dashboard (`/dashboard`)
- Total earnings & active listings
- Weekly earnings chart (Recharts bar)
- User reputation metrics
- Quick actions (new upload, view listings)

### 5. Profile (`/profile`)
- Connected wallet display
- Privacy settings toggle
- Notification preferences
- Data protection summary
- Account management

## Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- Starknet Sepolia testnet wallet (Braavos or Argent)

### Installation

```bash
# Clone or download the project
cd zk-health-marketplace

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create `.env.local`:

```
# Starknet Configuration
NEXT_PUBLIC_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
NEXT_PUBLIC_STARKNET_CHAIN_ID=SN_SEPOLIA

# IPFS Gateway
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud

# Contract Addresses (after deployment)
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=0x0
```

## Usage Flow

### For Sellers (Data Uploaders)

1. **Connect Wallet**: Click "Connect Wallet" → Select Braavos/Argent
2. **Upload Data**: Go to `/upload` → Enter health metrics
3. **Encrypt & Prove**: System auto-encrypts with ElGamal + generates ZK proof (<2s)
4. **Review**: Confirm anonymized preview
5. **Commit**: Submit to blockchain (transaction required)
6. **Monitor**: View earnings on `/dashboard`

### For Buyers (Bid Placers)

1. **Browse**: Visit `/marketplace` to see anonymized listings
2. **Review**: Read privacy badge + proof verification status
3. **Bid**: Click "Place Bid" → Enter encrypted bid amount
4. **Wait**: Auction settles with ZK reveal
5. **Access**: Download decrypted data with proof proof settlement

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│  (Landing → Upload → Marketplace → Dashboard → Profile)          │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐         ┌────▼────┐         ┌──▼──────┐
    │ Encryption        │ ZK Proofs│         │ IPFS    │
    │ (ElGamal)         │ (STARK)  │         │ Storage │
    └────┬────┘         └────┬────┘         └──┬──────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
              ┌──────────────▼─────────────────┐
              │   Starknet Smart Contracts     │
              │  (Commitment + Auction Logic)  │
              └──────────────────────────────┘
```

## Smart Contract

### Marketplace.cairo

**Key Functions:**

- `commit_data(data_hash, proof_hash, ipfs_hash)`: Submit data commitment
- `create_auction(data_hash, min_bid)`: Create sealed auction
- `place_sealed_bid(auction_id, encrypted_bid)`: Place encrypted bid
- `settle_auction(auction_id, winner, final_bid)`: Settle & pay seller
- `withdraw_earnings(amount)`: Withdraw seller income

**Events:**

- `DataCommitted`: Data + proof committed
- `AuctionCreated`: Auction started
- `BidPlaced`: Bid submitted (sealed)
- `AuctionSettled`: Winner determined, payment issued
- `EarningsWithdrawn`: Seller withdrawal

## Privacy & Security

### Encryption

- **Client-Side Only**: No server-side encryption keys
- **ElGamal Homomorphic**: Allows computation on encrypted data
- **Key Derivation**: ECDH-based public key from private seed
- **Nonce Usage**: Random 24-byte nonce per encryption

### Zero-Knowledge Proofs

- **Type**: ZK-STARK (StarkNet native)
- **Proof Time Target**: <2 seconds (browser WASM)
- **Verification**: On-chain via Cairo
- **Statement**: Conditions proven without revealing values

Example: "Average heart rate > 80 AND steps > 10,000" → Proof without showing actual metrics

### Sealed Auctions

- **Bid Encryption**: Same ElGamal scheme
- **Sealed Phase**: Bids encrypted until settlement
- **Reveal**: Only winner & price revealed post-settlement
- **Transparency**: All commitments public on-chain

## TODO: Production Integration

1. **S-two WASM Integration**: Replace mock ZK prover with official S-two browser module from https://github.com/starkware-libs/stwo
2. **Token Integration**: Add STRK token transfers for auction settlement
3. **IPFS Pinning Service**: Use Pinata or Lighthouse for permanent storage
4. **Contract Deployment**: Deploy to Starknet mainnet with formal verification
5. **Metrics Database**: Store anonymized marketplace data for analytics
6. **Rate Limiting**: Implement per-wallet proof generation limits
7. **Reputation System**: Enhance with on-chain seller ratings & dispute resolution

## Demo Script

### Quick 5-Minute Demo

```
1. [0:00] Load landing page → Explain privacy features
2. [1:00] Connect wallet (Sepolia testnet)
3. [1:30] Go to /upload → Input sample metrics
   - Heart Rate: 85 bpm
   - Steps: 12,000
   - Sleep: 7.5 hours
4. [2:00] Encrypt & Prove → Show progress bars (simulated <2s)
5. [2:30] Review privacy badge & anonymized preview
6. [3:00] Confirm commitment (simulate blockchain tx)
7. [3:30] Visit /marketplace → Show sealed auction demo
8. [4:00] Go to /dashboard → Display earnings chart
9. [4:30] Check /profile → Privacy settings overview
10. [5:00] Recap key features: Encryption, ZK Proofs, On-Chain Commitments
```

## Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start

# Lint code
pnpm lint

# Type check
pnpm tsc --noEmit
```

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Connect repo to Vercel
# → https://vercel.com/new

# Set environment variables in Vercel dashboard
# → Deploy automatically on push
```

### Cairo Contract Deployment

```bash
# Install Scarb (Cairo package manager)
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh

# Navigate to contracts folder
cd contracts

# Deploy to Sepolia
scarb build
starkli deploy target/dev/Marketplace.contract_class.json \
  --network sepolia \
  --account $ACCOUNT_ADDRESS \
  --keystore $KEYSTORE_PATH
```

## Performance Optimization

- **Next.js 16 Cache Components**: Use `'use cache'` for static marketplace listings
- **Code Splitting**: Dynamic imports for heavy crypto libraries
- **Image Optimization**: Use `next/image` for avatars & badges
- **IPFS Caching**: Browser cache + public gateway fallback
- **Proof Generation**: Web Worker for off-main-thread computation

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

Requires WebCrypto API and Web Workers for proof generation.

## License

MIT - Built for hackathons and research. Adapt freely for commercial use.

## Resources

- **Starknet Docs**: https://docs.starknet.io
- **Cairo Language**: https://docs.cairo-lang.org
- **Starknet React**: https://starknet-react.dev
- **S-two Proofs**: https://github.com/starkware-libs/stwo
- **IPFS**: https://ipfs.io
- **Next.js 15**: https://nextjs.org/blog/next-15

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Discuss on Starknet Discord #developers
- Check FAQ in `/docs/FAQ.md` (create as needed)

---

**Built with ❤️ for Privacy-First Web3**

_Note: This is an MVP demonstrating cryptographic concepts. For production: conduct security audit, integrate real token transfers, and deploy formal verification on Cairo contracts._
