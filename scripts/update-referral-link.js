#!/usr/bin/env node
/**
 * Met à jour le lien de parrainage Revolut et les dates de campagne dans le site.
 * Utilisé par le workflow GitHub Actions (cron + manuel).
 * Lit _config/referral.json et met à jour index.html, README.md, script.js (lien + dates).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, '_config', 'referral.json');
const FILES = ['index.html', 'README.md', 'script.js'];

const LINK_REGEX = /https:\/\/revolut\.com\/referral\/\?referral-code=[^"'\s&]+(?:&geo-redirect)?/g;

const MOIS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/** Formate une date ISO (YYYY-MM-DD) en français (ex. "1er mars 2025"). */
function formatDateFr(isoDate) {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
  const [y, m, d] = isoDate.split('-').map(Number);
  const jour = d === 1 ? '1er' : String(d);
  return `${jour} ${MOIS_FR[m - 1]} ${y}`;
}

function buildLink(code, template) {
  if (template && template.includes('{CODE}')) {
    return template.replace('{CODE}', encodeURIComponent(code));
  }
  return `https://revolut.com/referral/?referral-code=${encodeURIComponent(code)}&geo-redirect`;
}

function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const newLink = buildLink(config.referralCode, config.linkTemplate);

  const campaign = config.campaign || {};
  const start = campaign.start || '';
  const end = campaign.end || '';
  const startLabel = formatDateFr(start);
  const endLabel = formatDateFr(end);

  let anyChange = false;

  for (const file of FILES) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(LINK_REGEX, newLink);

    if (file === 'index.html' && start && end) {
      newContent = newContent
        .replace(/"validFrom":\s*"\d{4}-\d{2}-\d{2}"/, `"validFrom": "${start}"`)
        .replace(/"validThrough":\s*"\d{4}-\d{2}-\d{2}"/, `"validThrough": "${end}"`);
      let count = 0;
      newContent = newContent.replace(/<time datetime="[^"]+">[^<]*<\/time>/g, () => {
        count++;
        return count === 1 ? `<time datetime="${start}">${startLabel}</time>` : `<time datetime="${end}">${endLabel}</time>`;
      });
    }

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      anyChange = true;
    }
  }

  if (anyChange) {
    console.log('Lien mis à jour:', newLink);
    if (start && end) console.log('Dates campagne:', startLabel, '->', endLabel);
  } else {
    console.log('Aucun changement (lien et dates déjà à jour).');
  }
  process.exit(0);
}

main();
