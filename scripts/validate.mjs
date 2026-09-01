import fs from 'node:fs';

const jsonPath = new URL('../data/kids-product-recalls.json', import.meta.url);
const csvPath = new URL('../data/kids-product-recalls.csv', import.meta.url);
const requiredFields = ['id', 'agency', 'date', 'title', 'category', 'hazard', 'remedy', 'url'];
const huggingFaceCardPath = new URL('../distributions/huggingface/README.md', import.meta.url);
const dataDictionaryPath = new URL('../distributions/huggingface/data-dictionary.csv', import.meta.url);
const kaggleMetadataPath = new URL('../distributions/kaggle/dataset-metadata.json', import.meta.url);
const kaggleReadmePath = new URL('../distributions/kaggle/README.md', import.meta.url);
const kaggleDictionaryPath = new URL('../distributions/kaggle/data-dictionary.csv', import.meta.url);

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

const huggingFaceCard = fs.readFileSync(huggingFaceCardPath, 'utf8');
if (!huggingFaceCard.includes('license: cc0-1.0')) {
  throw new Error('Hugging Face dataset card must declare the CC0 license.');
}
if (!huggingFaceCard.includes('https://github.com/kindlykiddo/kids-product-recalls')) {
  throw new Error('Hugging Face dataset card must link the canonical GitHub repository.');
}
if (!huggingFaceCard.includes('https://www.kindlykiddo.com/kids-product-recalls/')) {
  throw new Error('Hugging Face dataset card must link the live tracker.');
}

const dictionaryLines = fs.readFileSync(dataDictionaryPath, 'utf8').trimEnd().split('\n');
if (dictionaryLines.length !== requiredFields.length + 1) {
  throw new Error('Hugging Face data dictionary must document every recall field.');
}

const kaggleMetadata = JSON.parse(fs.readFileSync(kaggleMetadataPath, 'utf8'));
if (kaggleMetadata.id !== 'kindlykiddo/kids-product-recalls') {
  throw new Error('Kaggle metadata must use the KindlyKiddo dataset ID.');
}
if (kaggleMetadata.licenses?.[0]?.name !== 'CC0-1.0') {
  throw new Error('Kaggle metadata must declare the CC0 license.');
}
if (kaggleMetadata.expectedUpdateFrequency !== 'weekly') {
  throw new Error('Kaggle metadata must declare the weekly update cadence.');
}
if (kaggleMetadata.resources?.[0]?.schema?.fields?.length !== requiredFields.length) {
  throw new Error('Kaggle metadata must document every CSV field.');
}

const kaggleReadme = fs.readFileSync(kaggleReadmePath, 'utf8');
for (const url of [
  'https://www.kindlykiddo.com/kids-product-recalls/',
  'https://github.com/kindlykiddo/kids-product-recalls',
  'https://huggingface.co/datasets/kindlykiddo/kids-product-recalls'
]) {
  if (!kaggleReadme.includes(url)) throw new Error(`Kaggle README must link ${url}.`);
}

const kaggleDictionaryLines = fs.readFileSync(kaggleDictionaryPath, 'utf8').trimEnd().split('\n');
if (kaggleDictionaryLines.length !== requiredFields.length + 1) {
  throw new Error('Kaggle data dictionary must document every recall field.');
}

console.log(`Validated ${data.recalls.length} recall records.`);
