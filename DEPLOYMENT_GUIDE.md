# NexaVita Contract Deployment Guide

## Quick Setup (Windows)

### 1. Install Required Tools

#### Option A: Using Cargo (Recommended for Windows)
If you have Rust installed:
```bash
cargo install scarb
cargo install starkli
```

#### Option B: Manual Installation
1. **Scarb**: Download from https://github.com/software-mansion/scarb/releases
   - Download `scarb-x.x.x-x86_64-pc-windows-msvc.exe`
   - Run the installer
   - Restart your terminal

2. **Starkli**: Download from https://github.com/xjonathan/starkli/releases
   - Download `starkli-x.x.x-x86_64-pc-windows-gnu.tar.gz`
   - Extract to a folder
   - Add the folder to your PATH environment variable
   - Restart your terminal

**Verify installation:**
```bash
scarb --version
starkli --version
```

### 2. Prepare Your Wallet

You need your **Starknet Sepolia testnet account**:

**Option A: If you have an existing wallet**
```bash
# Export your private key and account address
$env:STARKNET_KEYSTORE = "~\deployer"
$env:STARKNET_ACCOUNT = "~\deployer/account.json"
```

**Option B: Create a new account**
```bash
starkli account oz init --name deployer ~/deployer
starkli account deploy ~/deployer
```

### 3. Compile the Contract

```bash
scarb build
```

This creates compiled artifacts in `target/dev/`.

### 4. Deploy the Contract

```bash
starkli declare target/dev/nexavita_Marketplace.sierra.json --account-file $env:STARKNET_KEYSTORE --network sepolia --private-key $env:PRIVATE_KEY
```

Replace `$env:PRIVATE_KEY` with your actual private key.

Then deploy:
```bash
starkli deploy <CLASS_HASH_FROM_DECLARE> --network sepolia --account-file $env:STARKNET_KEYSTORE --private-key $env:PRIVATE_KEY
```

## What I Need From You

To deploy your contract, provide:

1. **Starknet Sepolia account address** (starts with `0x`)
2. **Private key** (keep this SECRET - only share in secure channels)
3. **Ensure you have ~0.1 STRK** on Sepolia testnet for deployment fees

Get testnet STRK: https://starknet-testnet-faucet.vercel.app/

## Environment Setup

Create a `.env.local` file (optional, for frontend integration):
```
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=0x<your_deployed_contract_address>
NEXT_PUBLIC_STARKNET_CHAIN_ID=SN_SEPOLIA
NEXT_PUBLIC_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
```

## Troubleshooting

**"scarb not found"**: Add Scarb to PATH and restart terminal
**"starkli not found"**: Add Starkli to PATH and restart terminal
**Deployment fails**: Ensure you have enough STRK on testnet
