import fs from 'node:fs';

const jsonPath = new URL('../data/kids-product-recalls.json', import.meta.url);
const csvPath = new URL('../data/kids-product-recalls.csv', import.meta.url);
const requiredFields = ['id', 'agency', 'date', 'title', 'category', 'hazard', 'remedy', 'url'];

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
if (!data || !Array.isArray(data.recalls) || data.recalls.length === 0) {
  throw new Error('JSON must contain at least one recall record.');
}
if (data.coverage?.recordCount !== data.recalls.length) {
  throw new Error('coverage.recordCount does not match the recalls array.');
}

for (const [index, recall] of data.recalls.entries()) {
  for (const field of requiredFields) {
    if (typeof recall[field] !== 'string' || recall[field].trim() === '') {
      throw new Error(`Record ${index} is missing ${field}.`);
    }
  }
  if (!['CPSC', 'NHTSA', 'FDA'].includes(recall.agency)) {
    throw new Error(`Record ${index} has unsupported agency ${recall.agency}.`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(recall.date)) {
    throw new Error(`Record ${index} has invalid date ${recall.date}.`);
  }
  if (!recall.url.startsWith('https://')) {
    throw new Error(`Record ${index} must link to an HTTPS official record.`);
  }
}

const csv = fs.readFileSync(csvPath, 'utf8');
const lines = csv.trimEnd().split('\n');
if (lines[0] !== requiredFields.join(',')) {
  throw new Error('CSV header does not match the documented fields.');
}
if (lines.length !== data.recalls.length + 1) {
  throw new Error('CSV row count does not match the JSON record count.');
}

console.log(`Validated ${data.recalls.length} recall records.`);
