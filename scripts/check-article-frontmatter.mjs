#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const articlesDir = path.join(root, 'content', 'articles');
const publicDir = path.join(root, 'public');

const requiredFields = [
  'title',
  'slug',
  'summary',
  'publishedAt',
  'complexity',
  'topics',
  'coverImage',
  'coverAlt',
  'ogImage',
];

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return null;

  const data = {};
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return data;
}

function publicAssetExists(assetPath) {
  if (!assetPath || !assetPath.startsWith('/')) return false;
  return fs.existsSync(path.join(publicDir, assetPath));
}

function validateArticle(file) {
  const fullPath = path.join(articlesDir, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const data = parseFrontmatter(raw);
  const errors = [];

  if (!data) {
    return [`${file}: missing YAML frontmatter block`];
  }

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`${file}: missing required frontmatter field "${field}"`);
    }
  }

  if (data.slug && data.slug !== file.replace(/\.md$/, '')) {
    errors.push(`${file}: slug "${data.slug}" must match the filename`);
  }

  if (data.topics && data.topics.startsWith('[')) {
    errors.push(`${file}: topics must be a comma-separated line, not a YAML array`);
  }

  for (const field of ['coverImage', 'ogImage']) {
    if (!data[field]) continue;
    if (!data[field].startsWith('/')) {
      errors.push(`${file}: ${field} must be a root-relative public path`);
      continue;
    }
    if (!publicAssetExists(data[field])) {
      errors.push(`${file}: ${field} asset does not exist at public${data[field]}`);
    }
  }

  return errors;
}

if (!fs.existsSync(articlesDir)) {
  console.error(`Missing articles directory: ${articlesDir}`);
  process.exit(1);
}

const files = fs.readdirSync(articlesDir).filter((file) => file.endsWith('.md')).sort();
const errors = files.flatMap(validateArticle);

if (errors.length > 0) {
  console.error('Article frontmatter check failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Article frontmatter check passed (${files.length} article${files.length === 1 ? '' : 's'}).`);
