// Standard women's / men's footwear size conversions.
// Source: industry-standard conversion (US ↔ UK ↔ EU ↔ AU/NZ).
// Length / Width (mm) sourced directly from the Shopify product size chart.
//
// Region rules:
// - US: Women and Men differ (Men ≈ Women − 1.5)
// - UK: Same numeric size for Women and Men (unisex numbering)
// - EU: Same numeric size for Women and Men (unisex numbering)
// - AU/NZ: Women = US Women number; Men = UK number

export interface SizeRow {
  usW: string;
  usM: string;
  uk: string;       // single unisex UK number
  eu: string;       // single unisex EU number
  auW: string;      // AU/NZ Women = US Women
  auM: string;      // AU/NZ Men = UK
  lengthMm: string; // foot length in mm
  widthMm: string;  // foot width in mm
}

// Master conversion table — source of truth.
const TABLE: Array<{
  usW: number;
  usM: number;
  uk: number;
  eu: number;
  lengthMm: number;
  widthMm: number;
}> = [
  { usW: 5,    usM: 3.5,  uk: 2.5,  eu: 35,   lengthMm: 235, widthMm: 87.1 },
  { usW: 5.5,  usM: 4,    uk: 3,    eu: 35.5, lengthMm: 240, widthMm: 88.2 },
  { usW: 6,    usM: 4.5,  uk: 3.5,  eu: 36,   lengthMm: 245, widthMm: 89.4 },
  { usW: 6.5,  usM: 5,    uk: 4,    eu: 37,   lengthMm: 250, widthMm: 90.6 },
  { usW: 7,    usM: 5.5,  uk: 4.5,  eu: 37.5, lengthMm: 255, widthMm: 91.7 },
  { usW: 7.5,  usM: 6,    uk: 5,    eu: 38,   lengthMm: 260, widthMm: 92.85 },
  { usW: 8,    usM: 6.5,  uk: 5.5,  eu: 38.5, lengthMm: 265, widthMm: 94 },
  { usW: 8.5,  usM: 7,    uk: 6,    eu: 39,   lengthMm: 270, widthMm: 95.15 },
  { usW: 9,    usM: 7.5,  uk: 6.5,  eu: 40,   lengthMm: 275, widthMm: 96.3 },
  { usW: 9.5,  usM: 8,    uk: 7,    eu: 40.5, lengthMm: 280, widthMm: 97.4 },
  { usW: 10,   usM: 8.5,  uk: 7.5,  eu: 41,   lengthMm: 285, widthMm: 98.6 },
  { usW: 10.5, usM: 9,    uk: 8,    eu: 42,   lengthMm: 290, widthMm: 99.75 },
  { usW: 11,   usM: 9.5,  uk: 8.5,  eu: 42.5, lengthMm: 295, widthMm: 100.9 },
  { usW: 11.5, usM: 10,   uk: 9,    eu: 43,   lengthMm: 300, widthMm: 102.05 },
  { usW: 12,   usM: 10.5, uk: 9.5,  eu: 44,   lengthMm: 305, widthMm: 103.2 },
  { usW: 12.5, usM: 11,   uk: 10,   eu: 44.5, lengthMm: 309, widthMm: 104 },
  { usW: 13,   usM: 11.5, uk: 10.5, eu: 45,   lengthMm: 313, widthMm: 106 },
  { usW: 13.5, usM: 12,   uk: 11,   eu: 46,   lengthMm: 318, widthMm: 112 },
  // Extrapolated (continues linear trend)
  { usW: 14,   usM: 12.5, uk: 11.5, eu: 46.5, lengthMm: 323, widthMm: 113.15 },
  { usW: 14.5, usM: 13,   uk: 12,   eu: 47,   lengthMm: 328, widthMm: 114.3 },
];

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const fmtMm = (n: number) => {
  // Show decimals only when meaningful (e.g. 94 → "94", 92.85 → "92.9")
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(1);
};

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

  const row =
    (Number.isFinite(wNum) && nearest(wNum, "usW")) ||
    (Number.isFinite(mNum) && nearest(mNum, "usM")) ||
    undefined;

  const usW = wRaw || (row ? fmt(row.usW) : "—");
  const usM = mRaw || (row ? fmt(row.usM) : "—");
  const uk = ukRaw || (row ? fmt(row.uk) : "—");
  const eu = row ? fmt(row.eu) : "—";
  const lengthMm = row ? fmtMm(row.lengthMm) : "—";
  const widthMm = row ? fmtMm(row.widthMm) : "—";

  return {
    usW,
    usM,
    uk,
    eu,
    auW: usW, // AU/NZ Women = US Women
    auM: uk,  // AU/NZ Men = UK
    lengthMm,
    widthMm,
  };
}
