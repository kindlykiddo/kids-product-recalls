# KindlyKiddo Kids’ Product Recall Data

[![Update recall data](https://github.com/kindlykiddo/kids-product-recalls/actions/workflows/update-data.yml/badge.svg)](https://github.com/kindlykiddo/kids-product-recalls/actions/workflows/update-data.yml)

Machine-readable CPSC, NHTSA, and FDA recall records for products made for or primarily used by children. The dataset is normalized by [KindlyKiddo](https://www.kindlykiddo.com/kids-product-recalls/) and refreshed weekly from official U.S. federal sources.

## Downloads

| Format | Repository | Live copy |
|---|---|---|
| JSON | [`data/kids-product-recalls.json`](data/kids-product-recalls.json) | [kindlykiddo.com JSON](https://www.kindlykiddo.com/data/kids-product-recalls.json) |
| CSV | [`data/kids-product-recalls.csv`](data/kids-product-recalls.csv) | [kindlykiddo.com CSV](https://www.kindlykiddo.com/data/kids-product-recalls.csv) |

```bash
curl -fsSL https://www.kindlykiddo.com/data/kids-product-recalls.json
curl -fsSL https://www.kindlykiddo.com/data/kids-product-recalls.csv
```

The JSON file includes refresh time, record count, date coverage, source metadata, and the normalized recall records. The CSV contains one record per row.

## Fields

| Field | Meaning |
|---|---|
| `id` | Agency recall or campaign identifier |
| `agency` | `CPSC`, `NHTSA`, or `FDA` |
| `date` | Recall announcement date in `YYYY-MM-DD` format |
| `title` | Official or normalized recall title |
| `category` | KindlyKiddo child-product category |
| `hazard` | Concise hazard summary from the official record |
| `remedy` | Concise consumer remedy summary |
| `url` | Official federal recall or enforcement-record URL |

## Methodology

The live KindlyKiddo pipeline checks:

- [Consumer Product Safety Commission recalls](https://www.cpsc.gov/Recalls)
- [National Highway Traffic Safety Administration recalls](https://www.nhtsa.gov/recalls)
- [Food and Drug Administration enforcement reports](https://www.accessdata.fda.gov/scripts/ires/)

Records are normalized, deduplicated, categorized, sorted newest first, and limited to products made for or primarily used by children. The live tracker covers a rolling 24-month window and links every row to its official federal record.

The public repository runs a scheduled GitHub Actions workflow that downloads the latest live JSON and CSV, validates them, and commits only substantive data changes.

## Important limitations

- This is a reference index, not a certification, legal notice, or substitute for an official agency record.
- Automated child-relevance filtering can omit or misclassify edge cases.
- Agency feeds can be delayed, unavailable, corrected, or withdrawn.
- Always use the linked official notice for product identifiers, photos, remedy instructions, and current status.

## Citation

Suggested attribution:

> KindlyKiddo. “Kids’ Product Recall Data.” Updated weekly from U.S. Consumer Product Safety Commission, National Highway Traffic Safety Administration, and U.S. Food and Drug Administration records. https://www.kindlykiddo.com/kids-product-recalls/

Machine-readable citation metadata is available in [`CITATION.cff`](CITATION.cff).

## Licensing

Official U.S. federal recall records are generally public-domain government works under [17 U.S.C. §105](https://www.usa.gov/government-works). See [`LICENSE-DATA.md`](LICENSE-DATA.md) for the data notice. Repository scripts are available under the [MIT License](LICENSE-CODE).

## Corrections

If a normalized entry differs from its official notice, use the official record and report the discrepancy through [KindlyKiddo’s corrections process](https://www.kindlykiddo.com/corrections/).
