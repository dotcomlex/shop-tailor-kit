# Customer Walkthrough: CloudStrider in US, UK, CA and AU

## Goal
Go through get.vitalwalk.store/products/cloudstrider the way a real customer would, in 4 countries (US, UK, CA, AU). Check that:
- The page loads fast
- The currency is correct and stays the same all the way through
- The upsell popup picks the right size for what the customer chose
- The cart drawer shows exactly what was added
- The official Shopify checkout shows the same items, sizes and total

This is a check only. Nothing on the site changes unless a problem turns up.

## Steps for each country
1. **Open the page as a visitor from that country.** Record how long it takes to load and whether prices appear in local currency straight away, without showing USD first.
2. **Pick a shoe size, for example US Men 8, then click Add to Cart.**
3. **Check the upsell popup:**
   - Insoles: the size picked for you matches the shoe size
   - Socks: the size range is right (US M 8 should be L/XL, a small size should be S/M)
   - Prices are in local currency
4. **Accept both upsells, then open the cart drawer.** Check that each item shows the same size, color and price as the popup, and that the subtotal and savings add up.
5. **Click Checkout.** On the official Shopify checkout, check that the items, sizes, currency and total match the cart drawer.
6. **Try once more with a small size, for example US Women 6,** to make sure the sock size range and insole size switch correctly.

## What you get back
A table for each country with:
- Page load time
- Price on the product page, in the popup, in the cart and at checkout
- Shoe size, the insole size and sock size picked, and what actually landed in the cart
- Any mismatch, with a screenshot

If something doesn't match, I'll explain the fix and check with you before changing anything.

## Technical notes
- An automated browser runs against the live site, setting the country for each run. Screenshots and on-page checks are taken at every step.
- Size matching is checked against how the site currently matches insole sizes (exact size first, otherwise the nearest smaller size) and sock sizes (S/M up to US W 8, US M 7.5 or UK 6.5).
