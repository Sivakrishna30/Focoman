# PowerShell Git Push Shortcut Script
param (
    [string]$Message = ""
)

Write-Host ">>> [GitPush] Checking repository status..." -ForegroundColor Cyan
git status -s

if (-not $Message) {
    $Message = Read-Host "Enter commit message (or press Enter for auto-timestamp commit)"
    if (-not $Message) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        $Message = "feat: automated update ($timestamp)"
    }
}

Write-Host ">>> [GitPush] Staging all tracked & new files..." -ForegroundColor Cyan
git add -A

Write-Host ">>> [GitPush] Committing with message: '$Message'..." -ForegroundColor Cyan
git commit -m "$Message"

Write-Host ">>> [GitPush] Pushing to remote repository..." -ForegroundColor Cyan
git push

Write-Host ">>> [GitPush] Done! Successfully pushed to remote." -ForegroundColor Green
