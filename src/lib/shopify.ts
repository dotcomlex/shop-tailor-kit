// Shopify Storefront API client — VitalWalk order page
// Includes product fetch + cart create for direct checkout handoff.

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "6cefa8-2.myshopify.com";
export const SHOPIFY_STOREFRONT_TOKEN = "abed53c0d22333dd9e20bb528289533b";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Product handle for "The Original VitalWalk® Shoes (Copy)"
export const VITALWALK_PRODUCT_HANDLE = "the-original-vitalwalk®-shoes-copy";

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

const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
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
  }
`;

interface RawProductResponse {
  product: {
    id: string;
    handle: string;
    title: string;
    description: string;
    priceRange: { minVariantPrice: ShopifyMoney };
    compareAtPriceRange: { minVariantPrice: ShopifyMoney };
    images: { edges: Array<{ node: ShopifyImage }> };
    variants: { edges: Array<{ node: ShopifyVariant }> };
    options: Array<{ name: string; values: string[] }>;
  } | null;
}

export async function fetchVitalWalkProduct(): Promise<ShopifyProductData | null> {
  const result = await storefrontApiRequest<RawProductResponse>(PRODUCT_BY_HANDLE_QUERY, {
    handle: VITALWALK_PRODUCT_HANDLE,
  });

  if (!result?.data?.product) return null;
  const p = result.data.product;
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

export function formatMoney(money: ShopifyMoney | null | undefined): string {
  if (!money) return "";
  const amount = parseFloat(money.amount);
  if (Number.isNaN(amount)) return "";
  return `$${amount.toFixed(2)}`;
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
 * Create a Shopify cart with the provided lines and return the
 * channel-formatted checkout URL.
 */
export async function createCheckoutForLines(lines: CartLineInput[]): Promise<{
  checkoutUrl: string | null;
  error?: string;
}> {
  if (!lines.length) return { checkoutUrl: null, error: "No items selected." };

  const result = await storefrontApiRequest<CartCreateResponse>(CART_CREATE_MUTATION, {
    input: {
      lines: lines.map((l) => ({
        merchandiseId: l.variantId,
        quantity: l.quantity,
      })),
    },
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
