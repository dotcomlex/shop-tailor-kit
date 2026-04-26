// Single source of truth for formatting prices.
// Always pair an amount with the ISO-4217 currency code Shopify returned.

export function formatMoney(amount: number | string, currencyCode: string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(num)) return "";
  const code = (currencyCode || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: ["JPY", "HUF", "KRW"].includes(code) ? 0 : 2,
    }).format(num);
  } catch {
    return `${num.toFixed(2)} ${code}`;
  }
}
