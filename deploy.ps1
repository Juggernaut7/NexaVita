param(
    [string]$AccountAddress = "0x03ea13695f3f5268409ac655541991c85655060865e44a95610dc1898fd42f6e",
    [string]$PrivateKey = "0x0820d676959e024fb4622a453ae58f83b3ce13d05a4bc20b9a197332c365f5",
    [string]$RpcUrl = "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/B1bxShMC8AN292cRbfHCo"
)

$SierraFile = "target/dev/nexavita_Marketplace.sierra.json"
$CasmFile = "target/dev/nexavita_Marketplace.casm.json"

function Write-Status {
    param([string]$Message)
    Write-Host "[+] $Message" -ForegroundColor Green
}

function Write-Error-Msg {
    param([string]$Message)
    Write-Host "[-] $Message" -ForegroundColor Red
    exit 1
}

function Invoke-RpcCall {
    param(
        [string]$Method,
        [hashtable]$Params
    )
    
    $body = @{
        jsonrpc = "2.0"
        method = $Method
        params = $Params
        id = [int](Get-Date -UFormat %s)
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-WebRequest -Uri $RpcUrl -Method Post -Body $body `
            -ContentType "application/json" -UseBasicParsing -TimeoutSec 30
        $result = $response.Content | ConvertFrom-Json
        return $result
    } catch {
        Write-Error-Msg "RPC call failed: $_"
    }
}

function Check-Balance {
    Write-Host ""
    Write-Host "Checking account balance..."
    
    $result = Invoke-RpcCall -Method "starknet_getBalance" -Params @{
        address = $AccountAddress
        block_id = "latest"
    }
    
    if ($result.result) {
        $balanceHex = $result.result
        $balance = [convert]::ToInt64($balanceHex.Replace("0x", ""), 16)
        $balanceStrk = $balance / 1e18
        
        $balanceFormatted = "{0:F4}" -f $balanceStrk
        Write-Status "Balance: $balanceFormatted STRK"
        
        if ($balance -gt 1e15) {
            return $true
        } else {
            Write-Error-Msg "Insufficient balance! Need at least 0.01 STRK (have: $balanceFormatted)"
        }
    } else {
        $errMsg = $result.error.message
        Write-Error-Msg "Could not fetch balance: $errMsg"
    }
}

function Read-ContractFiles {
    Write-Host ""
    Write-Host "Reading contract files..."
    
    if (-not (Test-Path $SierraFile)) {
        Write-Error-Msg "Sierra file not found: $SierraFile"
    }
    if (-not (Test-Path $CasmFile)) {
        Write-Error-Msg "CASM file not found: $CasmFile"
    }
    
    $sierra = Get-Content $SierraFile -Raw | ConvertFrom-Json
    $casm = Get-Content $CasmFile -Raw | ConvertFrom-Json
    
    Write-Status "Sierra file loaded"
    Write-Status "CASM file loaded"
    
    return $sierra, $casm
}

function Declare-Contract {
    param([PSObject]$Sierra, [PSObject]$Casm)
    
    Write-Host ""
    Write-Host "Declaring contract class..."
    Write-Host "   Account: $AccountAddress"
    Write-Host "   RPC: $RpcUrl"
    
    $result = Invoke-RpcCall -Method "starknet_addDeclareTransaction" -Params @{
        contract_class = $Sierra
        compiled_class_definition = $Casm
    }
    
    if ($result.result) {
        $classHash = $result.result.class_hash
        $txHash = $result.result.transaction_hash
        
        Write-Status "Declaration successful"
        Write-Host "   Class Hash: $classHash"
        Write-Host "   TX Hash: $txHash"
        
        Start-Sleep -Seconds 3
        return $classHash
    } else {
        $errMsg = $result.error.message
        Write-Error-Msg "Declaration failed: $errMsg"
    }
}

function Deploy-Contract {
    param([string]$ClassHash)
    
    Write-Host ""
    Write-Host "Deploying contract instance..."
    Write-Host "   Class Hash: $ClassHash"
    
    $result = Invoke-RpcCall -Method "starknet_addDeployAccountTransaction" -Params @{
        class_hash = $ClassHash
        constructor_calldata = @()
        contract_address_salt = "0x0"
    }
    
    if ($result.result) {
        $contractAddress = $result.result.contract_address
        $txHash = $result.result.transaction_hash
        
        Write-Status "Deployment successful"
        Write-Host "   Contract Address: $contractAddress"
        Write-Host "   TX Hash: $txHash"
        
        return $contractAddress
    } else {
        $errMsg = $result.error.message
        Write-Error-Msg "Deployment failed: $errMsg"
    }
}

function Update-EnvFile {
    param([string]$ContractAddress)
    
    Write-Host ""
    Write-Host "Updating .env.local..."
    
    $lines = @()
    $lines += "# Starknet Configuration"
    $lines += "NEXT_PUBLIC_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io"
    $lines += "NEXT_PUBLIC_STARKNET_CHAIN_ID=SN_SEPOLIA"
    $lines += ""
    $lines += "# Marketplace Contract"
    $lines += "NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=$ContractAddress"
    $lines += ""
    $lines += "# IPFS Gateway"
    $lines += "NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud"
    
    $envContent = $lines -join "`n"
    Set-Content -Path ".env.local" -Value $envContent -Encoding UTF8
    Write-Status ".env.local updated"
}

# Main deployment flow
Write-Host ""
Write-Host "======================================================================"
Write-Host "NexaVita Marketplace Contract Deployment"
Write-Host "======================================================================"

# Step 1: Read contracts
$sierra, $casm = Read-ContractFiles

# Step 2: Declare
$classHash = Declare-Contract -Sierra $sierra -Casm $casm
if (-not $classHash) { 
    Write-Error-Msg "Deployment aborted"
}

Start-Sleep -Seconds 2

# Step 3: Deploy
$contractAddress = Deploy-Contract -ClassHash $classHash
if (-not $contractAddress) {
    Write-Error-Msg "Deployment aborted"
}

# Step 4: Update config
Update-EnvFile -ContractAddress $contractAddress

# Final summary
Write-Host ""
Write-Host "======================================================================"
Write-Host "DEPLOYMENT SUCCESSFUL" -ForegroundColor Green
Write-Host "======================================================================"
Write-Host "Contract Address: $contractAddress"
Write-Host "Class Hash: $classHash"
Write-Host "Network: Starknet Sepolia"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. npm install  (install dependencies)"
Write-Host "2. npm run dev  (start dev server)"
Write-Host "3. Test contract on the app"
Write-Host "======================================================================"
