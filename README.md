# Site Parrainage Revolut

Landing page pour promouvoir votre lien de parrainage Revolut : **SEO poussé**, **accessibilité (A11y)** et style Revolut.

## Lien de parrainage

Tous les boutons CTA pointent vers le lien défini dans **`_config/referral.json`** (clé `referralCode`). Le **workflow GitHub Actions** (cron tous les lundis + déclenchement manuel) met à jour ce lien dans `index.html`, `README.md` et `script.js` à partir de ce fichier. Quand Revolut vous attribue un nouveau code (nouvelle campagne), mettez à jour `_config/referral.json` puis poussez, ou laissez le cron appliquer la config au prochain run.

- **Mise à jour manuelle** : modifiez `referralCode` (et éventuellement `linkTemplate`) dans `_config/referral.json`, puis exécutez `node scripts/update-referral-link.js` en local, ou poussez et lancez l’action « Update Revolut referral link » (workflow_dispatch).
- **Dates et étapes** : la section « Offre et étapes » et les JSON-LD (Offer, HowTo) reflètent la campagne (début/fin, étapes). Pensez à les ajuster dans `index.html` si vous changez la campagne dans `_config/referral.json`.

## Images — assets/media

Toutes les images utilisées par le site sont dans **`assets/media/`** (copies des fichiers nécessaires du media kit Revolut). **Ne déployez pas** le dossier complet **`Revolut media kit`** — il est ignoré par Git.

- **Logo header** : `assets/media/logo-header.png`
- **Hero** : `assets/media/card-visa.png`
- **Section « Une app tout-en-un »** : `assets/media/app-01-fr.png`, `app-02-fr.png`
- **Open Graph / Twitter** : `assets/media/og-image.png`

Voir `assets/README.md` pour le détail.

## Avant mise en ligne

1. **Remplacez `revolutrefferalcode.vercel.app`** par votre domaine dans :
   - `index.html` (canonical, hreflang, og:url, og:image, twitter:image, JSON-LD)
   - `robots.txt` (Sitemap)
   - `sitemap.xml` (`<loc>`)

2. **Images** : déployez uniquement le dossier **`assets/media`** avec le site. Les meta OG/Twitter pointent vers `assets/media/og-image.png`.

## Optimisations incluses

### SEO
- Titre et meta (description, keywords, abstract, subject, copyright, page-topic, rating, application-name).
- Canonical, hreflang (fr, en, x-default), geo (geo.region, geo.placename, ICBM).
- Open Graph et Twitter Card (image, alt).
- **JSON-LD** : WebPage, WebSite, Organization, Product, BreadcrumbList, **FAQPage**, **Offer** (validFrom/validThrough), **HowTo** (étapes pour obtenir la récompense).
- Section **Offre et étapes** (dates de campagne, 4 étapes) + **FAQ** (accordéon) pour requêtes longue traîne et featured snippets.

### Accessibilité (A11y)
- Skip-link, landmarks (header, main, nav, footer), hiérarchie de titres.
- ARIA (aria-label, aria-expanded, aria-controls, aria-labelledby, role="region") sur liens, boutons, menu, FAQ.
- **Réduction du mouvement** : `prefers-reduced-motion: reduce` (scroll, animations, transitions).
- **Focus visible** sur tous les éléments interactifs (boutons, liens, menu).
- **Piège au focus** dans le menu mobile (Tab / Maj+Tab) + fermeture à Escape et focus restitué sur le bouton menu.

### Performance
- Preconnect / preload (fonts, CSS).
- Pas de dépendances lourdes.

## Fichiers

- `index.html` — page unique (hero, avantages, pourquoi Revolut, offre & étapes, FAQ, CTA)
- `styles.css` — design Revolut (Shark #191C1F, Cornflower #7F84F6), FAQ, reduced-motion
- `script.js` — menu mobile (focus trap, Escape), accordéon FAQ, préparation analytics
- `_config/referral.json` — **source de vérité** : `referralCode`, `linkTemplate`, dates et étapes de la campagne (utilisé par le workflow et en doc)
- `scripts/update-referral-link.js` — script qui remplace le lien de parrainage dans tous les fichiers (utilisé par GitHub Actions)
- `.github/workflows/update-referral.yml` — cron (tous les lundis 6h UTC) + workflow_dispatch pour mettre le lien à jour depuis `_config/referral.json`
- `assets/` — `assets/media/` (images du site : logos, carte, app, og-image)
- `robots.txt`, `sitemap.xml`

## Prévisualisation

`npm run dev` puis ouvrir http://localhost:3000 — ou ouvrir `index.html` dans un navigateur.
