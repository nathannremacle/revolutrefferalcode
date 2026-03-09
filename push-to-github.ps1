# Script : premier push vers GitHub
# À lancer dans PowerShell depuis le dossier Site (ou après cd vers ce dossier)
# Si erreur "index.lock" : fermez Cursor/VS Code ou tout autre outil Git puis relancez.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Supprimer le lock si un processus Git a planté
if (Test-Path ".git\index.lock") {
    Remove-Item ".git\index.lock" -Force
}

git add -A
git status

git commit -m "Initial commit: site parrainage Revolut (SEO, A11y, media kit)"
git branch -M main
git push -u origin main

Write-Host "Push termine. Remote 'origin' pointe vers https://github.com/nathannremacle/revolutrefferalcode.git"
Write-Host "Prochains push : git push"
