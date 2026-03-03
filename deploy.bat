@echo off
REM NexaVita Starkli Deployment Script

setlocal enabledelayedexpansion

set ACCOUNT_FILE=account.json
set SIERRA_FILE=target/dev/nexavita_Marketplace.sierra.json
set CASM_FILE=target/dev/nexavita_Marketplace.casm.json
set RPC_URL=https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/B1bxShMC8AN292cRbfHCo
set NETWORK=sepolia

echo.
echo ============================================================
echo NexaVita Marketplace Contract Deployment
echo ============================================================
echo.

REM Step 1: Declare
echo Declaring contract...
starkli declare %SIERRA_FILE% --account %ACCOUNT_FILE% --network %NETWORK% --rpc %RPC_URL%

if errorlevel 1 (
    echo Declaration failed!
    exit /b 1
)

echo.
echo ============================================================
echo Declare successful! Now deploy using the class hash above.
echo Run: starkli deploy [CLASS_HASH] --account account.json --network sepolia
echo ============================================================
echo.

pause
