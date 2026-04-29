// Shopify Storefront API client — VitalWalk order page
// Uses @inContext(country:) so prices come back already converted into the
// buyer's local currency by Shopify itself (same FX rates as checkout).

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "6cefa8-2.myshopify.com";
export const SHOPIFY_STOREFRONT_TOKEN = "abed53c0d22333dd9e20bb528289533b";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Three real Shopify products — Funnelish-style. The bundle products carry
// the discounted price baked into the variant, so checkout shows a single
// clean line item (e.g. "VitalWalk 2-Pair Bundle — $99.92") with the full
// strike-through compare-at, instead of "Subtotal $X − Discount $Y".
export const VITALWALK_PRODUCT_HANDLES = {
  1: "the-original-vitalwalk®-shoes-copy",
  2: "vitalwalk®-shoes-2-pair-bundle",
  3: "vitalwalk®-shoes-3-pair-bundle",
} as const;

// Backwards-compatible alias used elsewhere in the app for the 1-pair product
// (it's still the source of truth for color/size option values + imagery).
export const VITALWALK_PRODUCT_HANDLE = VITALWALK_PRODUCT_HANDLES[1];

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProductData {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: { minVariantPrice: ShopifyMoney };
  compareAtPriceRange: { minVariantPrice: ShopifyMoney };
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  options: Array<{ name: string; values: string[] }>;
}

export async function storefrontApiRequest<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<{ data?: T; errors?: Array<{ message: string }> } | null> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    console.error("Shopify billing required — Storefront API blocked.");
    return null;
  }

  if (!response.ok) {
    throw new Error(`Shopify Storefront API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    console.error("Shopify GraphQL errors:", data.errors);
  }
  return data;
}

const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    images(first: 20) {
      edges { node { url altText } }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
        }
      }
    }
    options { name values }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query ProductByHandle($handle: String!, $country: CountryCode!)
  @inContext(country: $country) {
    product(handle: $handle) { ...ProductFields }
  }
`;

const ALL_BUNDLES_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query AllBundles(
    $h1: String!
    $h2: String!
    $h3: String!
    $country: CountryCode!
  ) @inContext(country: $country) {
    p1: product(handle: $h1) { ...ProductFields }
    p2: product(handle: $h2) { ...ProductFields }
    p3: product(handle: $h3) { ...ProductFields }
  }
`;

interface RawProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: { minVariantPrice: ShopifyMoney };
  compareAtPriceRange: { minVariantPrice: ShopifyMoney };
  images: { edges: Array<{ node: ShopifyImage }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  options: Array<{ name: string; values: string[] }>;
}

function normalizeProduct(p: RawProduct | null): ShopifyProductData | null {
  if (!p) return null;
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    priceRange: p.priceRange,
    compareAtPriceRange: p.compareAtPriceRange,
    images: p.images.edges.map((e) => e.node),
    variants: p.variants.edges.map((e) => e.node),
    options: p.options,
  };
}

/**
 * Fetch the 1-pair VitalWalk product with prices localized for the given country.
 */
export async function fetchVitalWalkProduct(country: string = "US"): Promise<ShopifyProductData | null> {
  const result = await storefrontApiRequest<{ product: RawProduct | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    {
      handle: VITALWALK_PRODUCT_HANDLES[1],
      country: (country || "US").toUpperCase(),
    },
  );
  return normalizeProduct(result?.data?.product ?? null);
}

export interface BundleProducts {
  1: ShopifyProductData | null;
  2: ShopifyProductData | null;
  3: ShopifyProductData | null;
}

/**
 * Fetch all three pack products (1-pair, 2-pair bundle, 3-pair bundle) in
 * one round-trip, all localized for the given country.
 */
export async function fetchVitalWalkBundles(country: string = "US"): Promise<BundleProducts> {
  const result = await storefrontApiRequest<{
    p1: RawProduct | null;
    p2: RawProduct | null;
    p3: RawProduct | null;
  }>(ALL_BUNDLES_QUERY, {
    h1: VITALWALK_PRODUCT_HANDLES[1],
    h2: VITALWALK_PRODUCT_HANDLES[2],
    h3: VITALWALK_PRODUCT_HANDLES[3],
    country: (country || "US").toUpperCase(),
  });

  return {
    1: normalizeProduct(result?.data?.p1 ?? null),
    2: normalizeProduct(result?.data?.p2 ?? null),
    3: normalizeProduct(result?.data?.p3 ?? null),
  };
}

// ─── Cart / Checkout ────────────────────────────────────────────────

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors { field message }
    }
  }
`;

export interface CartLineInput {
  variantId: string;
  quantity: number;
  /**
   * Line-item attributes shown to the customer at checkout, on the order in
   * Shopify admin, and on the packing slip. Used to communicate the color/size
   * of additional pairs in a bundle (since the variant itself only encodes
   * Pair 1's color+size).
   */
  attributes?: Array<{ key: string; value: string }>;
}

interface CartCreateResponse {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
}

/**
 * Append the channel param required for unauthenticated checkout to load
 * without the storefront password gate.
 */
export function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

/**
 * Create a Shopify cart and return the channel-formatted checkout URL.
 * Passing `country` sets `buyerIdentity.countryCode` so checkout opens in
 * the matching Shopify Market and currency.
 */
export async function createCheckoutForLines(
  lines: CartLineInput[],
  discountCodes: string[] = [],
  country: string = "US",
  note?: string,
): Promise<{
  checkoutUrl: string | null;
  error?: string;
}> {
  if (!lines.length) return { checkoutUrl: null, error: "No items selected." };

  const input: Record<string, unknown> = {
    lines: lines.map((l) => ({
      merchandiseId: l.variantId,
      quantity: l.quantity,
      ...(l.attributes && l.attributes.length ? { attributes: l.attributes } : {}),
    })),
    buyerIdentity: {
      countryCode: (country || "US").toUpperCase(),
    },
  };
  if (discountCodes.length) input.discountCodes = discountCodes;
  if (note?.trim()) input.note = note.trim();

  const result = await storefrontApiRequest<CartCreateResponse>(CART_CREATE_MUTATION, {
    input,
  });

  const userErrors = result?.data?.cartCreate?.userErrors ?? [];
  if (userErrors.length) {
    return { checkoutUrl: null, error: userErrors.map((e) => e.message).join("; ") };
  }

  const cart = result?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) {
    return { checkoutUrl: null, error: "Could not create checkout." };
  }

  return { checkoutUrl: formatCheckoutUrl(cart.checkoutUrl) };
}

/**
 * Find the variant matching the requested color + size selection.
 * Tolerates option names with or without trailing colons (`Color` vs `Color:`).
 */
export function findVariant(
  product: ShopifyProductData,
  color: string,
  size: string,
): ShopifyVariant | undefined {
  return product.variants.find((v) => {
    const opts = Object.fromEntries(
      v.selectedOptions.map((o) => [o.name.replace(/:$/, "").toLowerCase(), o.value]),
    );
    return opts.color === color && opts.size === size;
  });
}
