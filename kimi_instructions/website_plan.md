# MOTO CENTER - Website Implementation Plan

**Objective:** Build a modern, premium motorcycle dealership website for "MOTO CENTER" (ΕΥΜΟΡΦΙΑΔΗΣ ΙΩΑΝΝΗΣ).
**Reference Design:** [Romans International](https://www.romansinternational.com/) (Layout & Structure replica).
**Execution Agent:** Kimi 2.5 (inside OpenCode).

---

## 1. Project Overview & Requirements

*   **Business Name:** MOTO CENTER (ΕΥΜΟΡΦΙΑΔΗΣ ΙΩΑΝΝΗΣ)
*   **Tagline:** Αντιπροσωπεία Μοτοσυκλετών SYM | Κορινθία
*   **Location:** ΛΕΩΦ.ΙΩΝΙΑΣ & M.ΜΠΟΤΣΑΡΗ 26, ΚΟΡΙΝΘΟΣ 20100
*   **Contact:** 2741083014 | motocent@otenet.gr
*   **Brands:** SYM, DAYTONA, KAWASAKI, MODENAS, QUADRO
*   **Language:** Greek (el-GR)

### Key Technical Constraints
*   **Backend:** **NONE**. Strictly client-side logic only.
*   **CMS:** **Airtable**. The client will update listings there.
*   **Data Fetching:** Direct client-side `fetch()` to Airtable API (or static JSON during dev).
*   **Framework:** Antigravity (Modern Static Stack: HTML5, CSS3, ES6 Modules).
*   **Styling:** CSS variables + Utility classes.
*   **Animations:** GSAP + ScrollTrigger (Crucial for Hero section).
*   **Icons:** Lucide Icons (via CDN/inline SVG).
*   **Fonts:** Google Fonts (Roboto + Playfair Display).

---

## 2. File Structure

```text
/
├── index.html              # Homepage
├── bikes.html              # Listings / Inventory
├── bike-detail.html        # Single listing detail
├── services.html           # Services & Parts
├── contact.html            # Contact info & Map
├── styles/
│   ├── main.css            # Global resets, variables, utilities
│   ├── layout.css          # Navbar, Footer, Grid systems
│   ├── components.css      # Card styles, Buttons, specific component styling
│   └── animations.css      # Keyframes and specific animation classes
├── js/
│   ├── main.js             # Navigation, Global initialization
│   ├── hero-animation.js   # GSAP logic for index.html hero
│   ├── listings.js         # Fetch/Filter logic for bikes.html
│   ├── detail.js           # Gallery and URL param handling for bike-detail.html
│   └── data-service.js     # Airtable API fetcher
├── data/
│   ├── bikes.json          # Mock data matching Airtable schema
│   └── parts.json          # Mock parts data
└── assets/
    ├── images/             # Placeholders and UI assets
    └── icons/              # SVG icons (if not using CDN)
```

---

## 3. Visual Design System

### Colors
*   **Primary (Backgrounds/Premium):** `#111111` (Deep Charcoal/Black) - *Matches reference site premium feel.*
*   **Secondary (surfaces):** `#F5F5F5` (Light Gray), `#1A1A1A` (Dark Card Bg).
*   **Accent:** `#E60012` (SYM Red / Racing Red) - *Used sparingly for CTAs and highlights.*
*   **Text:** `#FFFFFF` (On dark), `#111111` (On light), `#9CA3AF` (Muted text).

### Typography
*   **Headings:** `Playfair Display` (Serif, Premium feel). Weights: 700.
*   **Body:** `Roboto` (Sans-serif, Clean, Greek-compatible). Weights: 400, 500, 700.

### Spacing & Layout
*   **Container Width:** Max 1400px, centered.
*   **Base Unit:** 4px (spacing classes: `p-4` = 16px, `m-8` = 32px).
*   **Border Radius:** `2px` (Sharp, premium aesthetic - similar to Romans).

---

## 4. Component Plan

### A. Navbar (`layout.css`, `index.html`)
*   **Structure:**
    *   Left: Brand Logo (Text "MOTO CENTER" or IMG).
    *   Center/Right: Links (Home, Showroom, Services, Contact).
    *   Far Right: Phone Icon + Number (Primary CTA).
*   **Behavior:** Sticky on scroll. Background transitions from Transparent -> White (or Dark) on scroll.
*   **Mobile:** Hamburger menu slides in from right.

### B. Hero Section (`index.html`, `hero-animation.js`)
*   **Requirement:** NO static image. Scroll-triggered animation.
*   **DOM Structure:**
    *   `#hero-container` (fixed height 100vh, pinned).
    *   `.hero-bg` (Dark gradient/grid).
    *   `.hero-text-layer` ("ΚΑΛΩΣ ΟΡΙΣΑΤΕ", Tagline).
    *   `.hero-visual` (SVG Silhouette/Particle canvas).
    *   `.hero-cta` (Button).
*   **GSAP Animation:**
    *   `ScrollTrigger` pins the section.
    *   Scroll progress = Animation progress (scrub: 1).
    *   **Sequence:**
        1.  Bg darkens/zooms slightly.
        2.  Text "ΚΑΛΩΣ ΟΡΙΣΑΤΕ" scales down and fades in.
        3.  Motorcycle silhouette slides in horizontally (parallax).
        4.  Tagline & Button pulse into view at the end of pin.

### C. Quick-Link Cards (`components.css`)
*   **Structure:** Grid of 4 cards below Hero.
*   **Content:** "Current Stock", "Sell Your Bike", "Service", "Parts".
*   **Visual:**
    *   Full height image background.
    *   Dark gradient overlay at bottom.
    *   White text centered bottom with a horizontal line separator.
*   **Hover:** Image zooms slightly, text lifts up.

### D. Latest Arrivals (`index.html`)
*   **Layout:** Horizontal scroll request (CSS `overflow-x: auto` + snap points OR GSAP draggable).
*   **Card Design (Matches Reference):**
    *   Image top (aspect 16:9).
    *   Header: Brand Name (Bold), Model underneath. Price top-right.
    *   Specs: 3-col grid (Year, Color, Mileage).
    *   CTA: "View Bike" solid block bottom-right.

### E. Bike Listings (`bikes.html`, `listings.js`)
*   **Filter Bar:** Sticky top bar. Dropdowns for Brand, Category. Range slider for Price.
*   **Grid:** Responsive (1 col mobile, 2 col tablet, 3-4 col desktop).
*   **State:** "Sold" bikes show a greyed-out overlay or "SOLD" badge.

---

## 5. Data Schema & Integration

### `data/bikes.json` (Airtable-Response Replica)

```json
[
  {
    "id": "rec123456789",
    "createdTime": "2023-10-01T10:00:00.000Z",
    "fields": {
      "Title": "SYM Symphony ST 200",
      "Brand": "SYM",
      "Category": "Scooter",
      "Price": 2695,
      "Year": 2023,
      "Mileage": 0,
      "Engine_CC": 200,
      "Color": "Matte Black",
      "Description": "Brand new, ready for delivery...",
      "Status": "Available",
      "Images": [
        { "url": "path/to/image1.jpg" },
        { "url": "path/to/image2.jpg" }
      ],
      "Featured": true,
      "Car_GR_Link": "https://..."
    }
  }
]
```

### Data Fetching Layer (`js/data-service.js`)
Instead of hardcoding APIs in components, create a service module.
*   `async function fetchBikes()`: Initially returns `await fetch('/data/bikes.json')`.
*   **Future Proofing:** Later, this single function changes to `fetch('https://api.airtable.com/v0/...')` without breaking the UI code.

---

## 6. Implementation Sequence (For Kimi 2.5)

**Stage 1: Foundation (Structure & Styles)**
1.  **Project Setup:** Create folder structure and empty files.
2.  **Global Styles:** Implement `styles/main.css` with CSS variables for colors/fonts.
3.  **Core Components:** Build the static Navbar and Footer HTML/CSS.

**Stage 2: The Cinematic Homepage**
4.  **Hero Implementation:** Build the complex DOM structure for the Hero.
5.  **GSAP Integration:** Write the ScrollTrigger animation logic in `js/hero-animation.js`.
6.  **Quick Links:** Style the 4-card grid below the hero.
7.  **Latest Arrivals:** Implement horizontal scroll card section.
8.  **About Section:** Add the "About Us" split layout.

**Stage 3: Data & Listings Logic (No Backend)**
9.  **Mock Data Creation:** Build robust `bikes.json` with realistic dummy data.
10. **Data Service:** Create `js/data-service.js` to fetch this JSON (ready for Airtable swap).
11. **Grid Implementation:** Build `js/listings.js` to dynamically render cards from data.
12. **Frontend Filtering:** Add JavaScript logic to filter the JSON array in-memory.

**Stage 4: Detail Pages & Forms**
13. **Routing:** Create `bike-detail.html` that reads `?id=` from the URL.
14. **Detail View:** Fetch specific bike by ID and render full specs/gallery.
15. **Lightbox:** Add simple image gallery functionality.
16. **Contact:** simple HTML forms (using `mailto` or Formspree).

**Stage 5: Polish & Mobile Optimization**
17. **Responsive Audit:** Ensure the grid collapses correctly on mobile.
18. **Performance:** Setup lazy loading for images.
19. **Final Review:** Verify designs against the Romans International reference.

---
**Note to Builder:** Focus on the **CLIENT-SIDE** nature of this app. All data is fetched dynamically. Do not introduce any Node.js/PHP backend logic.
