# Supprime le media kit de l'historique Git : un seul commit avec l'état actuel.
# À lancer depuis le dossier Site. Après ça, "git push --force origin main" enverra ~20 Mo au lieu de ~195 Mo.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# 1. Créer une branche sans parent (aucun historique)
git checkout --orphan temp-main

# 2. Tout ajouter (le .gitignore exclut déjà "Revolut media kit/")
git add -A

# 3. Un seul commit avec l'état actuel
git commit -m "Site parrainage Revolut (SEO, A11y, assets/media uniquement)"

# 4. Remplacer main par cette branche
git branch -D main
git branch -m main

# 5. Push (écrase l'historique distant)
Write-Host "Maintenant lance: git push --force origin main"
Write-Host "Tu n'enverras plus que l'etat actuel (~20 Mo), pas les 195 Mo du media kit."
