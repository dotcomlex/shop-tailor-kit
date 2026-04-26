/**
 * Color → product photo mapping, sourced directly from the live VitalWalk
 * Shopify CDN. Used by the circular color swatch and bundle thumbnail.
 */

const CDN = "https://cdn.shopify.com/s/files/1/0843/7143/9902/files";

export const COLOR_IMAGES: Record<string, string> = {
  Beige: `${CDN}/vitalwalk_color_1_compressed.jpg?v=1767493057`,
  Blue: `${CDN}/vitalwalk_color_4_compressed.jpg?v=1767493057`,
  Gray: `${CDN}/vitalwalk_color_3_compressed.jpg?v=1767493057`,
  Black: `${CDN}/vitalwalk_color_2_compressed.jpg?v=1767493057`,
};

/** Hex fallback if the photo can't load (rare). */
export const COLOR_FALLBACK_HEX: Record<string, string> = {
  Beige: "#C8A882",
  Black: "#1C1C1C",
  Gray: "#7B7B7B",
  Blue: "#3F5E91",
};

/** Pretty hero crop used as the product panel image. */
export const PRODUCT_HERO_IMAGE = `${CDN}/vitalwalk_color_1_compressed.jpg?v=1767493057&width=600`;

/** Generic product thumb for bundle stacks (uses the beige hero). */
export const BUNDLE_THUMB_IMAGE = `${CDN}/vitalwalk_color_1_compressed.jpg?v=1767493057&width=240`;

export function imageForColor(color: string, width = 200): string | null {
  const base = COLOR_IMAGES[color];
  if (!base) return null;
  // Append width param to leverage Shopify's image resizing
  return base.includes("width=") ? base : `${base}&width=${width}`;
}
