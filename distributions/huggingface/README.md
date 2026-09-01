---
license: cc0-1.0
language:
  - en
pretty_name: KindlyKiddo Kids' Product Recalls
tags:
  - child-safety
  - product-recalls
  - open-data
  - cpsc
  - nhtsa
  - fda
configs:
  - config_name: default
    data_files:
      - split: train
        path: kids-product-recalls.csv
---

# KindlyKiddo Kids’ Product Recall Data

Machine-readable CPSC, NHTSA, and FDA recall records for products made for or primarily used by children. The dataset is normalized by [KindlyKiddo](https://www.kindlykiddo.com/kids-product-recalls/) and refreshed weekly from official U.S. federal sources.

## Files

- `kids-product-recalls.csv` — flat tabular dataset used by the Hugging Face viewer.
- `kids-product-recalls.json` — records plus refresh time, coverage, source, license, and repository metadata.
- `data-dictionary.csv` — field definitions.
- `CITATION.cff` — machine-readable citation metadata.
- `LICENSE-DATA.md` — public-domain and CC0 data notice.

The canonical source repository is [kindlykiddo/kids-product-recalls](https://github.com/kindlykiddo/kids-product-recalls). Live copies are available as [JSON](https://www.kindlykiddo.com/data/kids-product-recalls.json) and [CSV](https://www.kindlykiddo.com/data/kids-product-recalls.csv).

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

## Sources and methodology

The KindlyKiddo pipeline checks:

- [Consumer Product Safety Commission recalls](https://www.cpsc.gov/Recalls)
- [National Highway Traffic Safety Administration recalls](https://www.nhtsa.gov/recalls)
- [Food and Drug Administration enforcement reports](https://www.accessdata.fda.gov/scripts/ires/)

Records are normalized, deduplicated, categorized, sorted newest first, and limited to products made for or primarily used by children. The live tracker covers a rolling 24-month window and links every row to its official federal record.

## Intended uses

- Child-product safety research
- Recall trend analysis
- Consumer-safety applications
- Retrieval and citation experiments
- Public-interest data exploration

## Limitations

- This is a reference index, not a certification, legal notice, or substitute for an official agency record.
- Automated child-relevance filtering can omit or misclassify edge cases.
- Agency feeds can be delayed, unavailable, corrected, or withdrawn.
- Always use the linked official notice for product identifiers, photos, remedy instructions, and current status.

## Citation

Suggested attribution:

> KindlyKiddo. “Kids’ Product Recall Data.” Updated weekly from U.S. Consumer Product Safety Commission, National Highway Traffic Safety Administration, and U.S. Food and Drug Administration records. https://www.kindlykiddo.com/kids-product-recalls/

## License

Official U.S. federal recall records are generally public-domain government works under [17 U.S.C. §105](https://www.usa.gov/government-works). KindlyKiddo releases its normalization, categorization, and arrangement under CC0 1.0 to the extent legally possible. See `LICENSE-DATA.md`.
