// Standard women's / men's footwear size conversions.
// Source: industry-standard conversion (US ↔ UK ↔ EU ↔ AU).

export interface SizeRow {
  usW: string;
  usM: string;
  uk: string;
  eu: string;
  au: string; // AU/NZ uses UK numbering for women, AU men is also UK-based
}

// Master conversion table indexed by (usW, usM) pair.
// Covers US Women 5-12 / US Men 4-13 — wide enough for VitalWalk's range.
const TABLE: Array<{ usW: number; usM: number; uk: number; eu: number }> = [
  { usW: 5, usM: 3.5, uk: 2.5, eu: 35 },
  { usW: 5.5, usM: 4, uk: 3, eu: 35.5 },
  { usW: 6, usM: 4.5, uk: 3.5, eu: 36 },
  { usW: 6.5, usM: 5, uk: 4, eu: 37 },
  { usW: 7, usM: 5.5, uk: 4.5, eu: 37.5 },
  { usW: 7.5, usM: 6, uk: 5, eu: 38 },
  { usW: 8, usM: 6.5, uk: 5.5, eu: 38.5 },
  { usW: 8.5, usM: 7, uk: 6, eu: 39 },
  { usW: 9, usM: 7.5, uk: 6.5, eu: 40 },
  { usW: 9.5, usM: 8, uk: 7, eu: 40.5 },
  { usW: 10, usM: 8.5, uk: 7.5, eu: 41 },
  { usW: 10.5, usM: 9, uk: 8, eu: 42 },
  { usW: 11, usM: 9.5, uk: 8.5, eu: 42.5 },
  { usW: 11.5, usM: 10, uk: 9, eu: 43 },
  { usW: 12, usM: 10.5, uk: 9.5, eu: 44 },
  { usW: 12.5, usM: 11, uk: 10, eu: 44.5 },
  { usW: 13, usM: 11.5, uk: 10.5, eu: 45 },
  { usW: 13.5, usM: 12, uk: 11, eu: 46 },
  { usW: 14, usM: 12.5, uk: 11.5, eu: 46.5 },
  { usW: 14.5, usM: 13, uk: 12, eu: 47 },
];

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

function nearest(target: number, key: "usW" | "usM"): (typeof TABLE)[number] | undefined {
  let best: (typeof TABLE)[number] | undefined;
  let bestDiff = Infinity;
  for (const row of TABLE) {
    const diff = Math.abs(row[key] - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = row;
    }
  }
  return best;
}

/**
 * Convert a Shopify size string like "US W 8 / US M 6.5 / UK 5.5"
 * into a full multi-region row. Falls back gracefully if numbers are missing.
 */
export function parseShopifySize(raw: string): SizeRow {
  const parts = raw.split("/").map((p) => p.trim());
  const wRaw = parts.find((p) => /^US\s*W/i.test(p))?.replace(/^US\s*W\s*/i, "") ?? "";
  const mRaw = parts.find((p) => /^US\s*M/i.test(p))?.replace(/^US\s*M\s*/i, "") ?? "";
  const ukRaw = parts.find((p) => /^UK/i.test(p))?.replace(/^UK\s*/i, "") ?? "";

  const wNum = parseFloat(wRaw);
  const mNum = parseFloat(mRaw);
  const ukNum = parseFloat(ukRaw);

  // Find the matching row using whichever number we have.
  const row =
    (Number.isFinite(wNum) && nearest(wNum, "usW")) ||
    (Number.isFinite(mNum) && nearest(mNum, "usM")) ||
    undefined;

  return {
    usW: wRaw || (row ? fmt(row.usW) : "—"),
    usM: mRaw || (row ? fmt(row.usM) : "—"),
    uk: ukRaw || (row ? fmt(row.uk) : "—"),
    eu: row ? fmt(row.eu) : "—",
    au: ukRaw || (row ? fmt(row.uk) : "—"), // AU = UK numerically
  };
}
