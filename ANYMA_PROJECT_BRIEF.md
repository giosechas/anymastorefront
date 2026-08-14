# ANYMA BEAUTY — Storefront Project Brief

## Shopify Connection
- Store: `qa2ye9-gm.myshopify.com`
- Storefront API public token: `5f36eaa3bb0966bf235159bd31f5d104`
- API version: `2025-01` (or latest stable)
- Endpoint: `https://qa2ye9-gm.myshopify.com/api/2025-01/graphql.json`

## Brand Identity

### Colors (CSS custom properties)
```css
--nero: #231F20;        /* Primary — from logo artwork, NOT #1A1A1A */
--gold: #C8A96E;        /* Goldrose — identity accent */
--paper: #FAF9F7;       /* Background */
--fuchsia: #FF5FA0;     /* Impact only — never in UI/nav */
```

### Typography
- **Display serif:** Artezy Light (single weight only — use tracking + caps for presence, NEVER synthetic bold)
- **Sans-serif:** To be defined (use Inter or system sans as temporary)
- **Rules:** generous letter-spacing on headings, uppercase for nav/labels

### Logo
- SVG vector, themeable via CSS variables (--anyma-ink / --anyma-paper)
- Positive: nero on paper | Negative: white on nero
- File: `anyma_logo_master.svg` (included in project assets)

## Product Structure
- **3 categories:** Lipstick (Rossetto), Lip Gloss, Mascara/Eyeliner
- **6 collections (Anime/Souls):** Leopard, Panther, Candy Rosa, Candy Tiffany, Street, Urban
- **Colors per category:**
  - Lipstick: Nude, Rosso, Viola, Cherry (4)
  - Gloss: Pink, Yellow (2)
  - Mascara: Black, Lilla (2)
- **Total: 48 SKUs** (6 × 8)
- Products should be imported via CSV (ANYMA_SHOPIFY_IMPORT.csv provided)

## Languages
- Italian (primary — store is in Italy)
- English
- Spanish
- Use Shopify Markets for multi-language

## Markets
- Italy + European Union
- Currency: EUR
- VAT: Shopify OSS (One Stop Shop) regime

## Pages Needed

### 1. Home
- Hero with brand claim: "Rivela chi sei" / "Reveal your soul"
- 6 Anime (souls) as visual entry points to collections
- Featured products
- Brand story teaser

### 2. Collection pages
- Filter by Anima (soul) and category
- Product grid with open product photo as hero
- Each anima has its own visual identity (texture: leopard print, denim, paisley, etc.)

### 3. Product detail page (PDP)
- 3 images: open (hero), closed, color swatch
- Product description (from catalog)
- Anima badge
- Add to cart with color/anima variant selector
- Related products from same anima

### 4. Cart + Checkout
- Shopify-managed checkout (via Storefront API createCheckout)
- Cart drawer/sidebar

### 5. About / Brand Story
- Content from brand book sections 01-06

## Tech Stack (Recommended)
- **Framework:** Hydrogen (Shopify's Remix-based framework) or Next.js + Storefront API
- **Styling:** Tailwind CSS with brand tokens
- **Deployment:** Shopify Oxygen (if Hydrogen) or Vercel (if Next.js)
- **Font loading:** Self-hosted Artezy Light woff2

## Brand Rules (from Brand Book v25)
- No soul belongs to a physical type, age, or skin color
- Never use "perfezione", "correggere", "coprire", "sii te stessa"
- Tone: short, authoritative, magnetic — identity over product features
- The client chooses the soul, then the color — never the function
- "Volumizzante e allungante" is a formula characteristic, not a purchase variant
- Pack names ≠ soul names: Denim Azzurro = Street, Denim Blu Scuro = Urban

## Files Included
- `ANYMA_SHOPIFY_IMPORT.csv` — 48 products ready for Shopify import
- `anyma_logo_master.svg` — vector logo
- `BrandBook_v25.md` — full 22-section brand manual
- `ANYMA_PLAYBOOK_V26.html` — interactive brand playbook with all assets
