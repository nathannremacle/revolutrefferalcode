#!/usr/bin/env node
/**
 * Met à jour le lien de parrainage Revolut dans tous les fichiers du site.
 * Utilisé par le workflow GitHub Actions (cron + manuel).
 * Lit _config/referral.json et remplace l’ancien lien par le nouveau dans index.html, README.md, script.js.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, '_config', 'referral.json');
const FILES = ['index.html', 'README.md', 'script.js'];

// Regex: lien Revolut referral avec code (évite de casser d’autres URLs revolut.com)
const LINK_REGEX = /https:\/\/revolut\.com\/referral\/\?referral-code=[^"'\s&]+(?:&geo-redirect)?/g;

function buildLink(code, template) {
  if (template && template.includes('{CODE}')) {
    return template.replace('{CODE}', encodeURIComponent(code));
  }
  return `https://revolut.com/referral/?referral-code=${encodeURIComponent(code)}&geo-redirect`;
}

function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const newLink = buildLink(config.referralCode, config.linkTemplate);

  let oldLink = null;
  let anyChange = false;

  for (const file of FILES) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(LINK_REGEX);
    if (match) oldLink = oldLink || match[0];
    const newContent = content.replace(LINK_REGEX, newLink);
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      anyChange = true;
    }
  }

  if (anyChange) {
    console.log('Lien mis à jour:', newLink);
  } else {
    console.log('Aucun changement (lien déjà à jour).');
  }
  process.exit(0);
}

main();
