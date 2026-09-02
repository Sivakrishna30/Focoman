# PowerShell Firebase Deploy Shortcut Script
Write-Host ">>> [Deploy] Step 1/3: Validating TypeScript build in apps/web..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\..\apps\web"
node node_modules/typescript/bin/tsc --noEmit --project tsconfig.json

if ($LASTEXITCODE -ne 0) {
    Write-Host ">>> [Deploy] FAILED: TypeScript errors detected! Fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host ">>> [Deploy] Step 2/3: Checking Firebase project configuration..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\.."
npx firebase use

Write-Host ">>> [Deploy] Step 3/3: Deploying Hosting and Firestore Rules to Firebase..." -ForegroundColor Cyan
npx firebase deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ">>> [Deploy] Successfully deployed to Firebase!" -ForegroundColor Green
    Write-Host ">>> Live URL: https://focoman.web.app" -ForegroundColor Green
} else {
    Write-Host ">>> [Deploy] Deployment error occurred. Check output above." -ForegroundColor Red
}
