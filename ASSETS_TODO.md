# Spirit Index Assets TODO

## Favicon Set (Priority: High)

Currently using default Next.js favicon. Need to create:

- [ ] **favicon.ico** (16x16, 32x32) — Simple "SI" monogram or data viz icon
- [ ] **apple-touch-icon.png** (180x180) — For iOS home screen
- [ ] **favicon-16x16.png** — Standard small favicon
- [ ] **favicon-32x32.png** — Standard medium favicon
- [ ] **android-chrome-192x192.png** — Android home screen
- [ ] **android-chrome-512x512.png** — Android splash screen

### Design Direction

**Option 1: "SI" Monogram**
- Monospace font (JetBrains Mono)
- Terminal green (#00ff00) on dark background
- Simple, institutional

**Option 2: Data Visualization Icon**
- Bar chart abstraction (3-5 bars)
- Terminal green (#00ff00)
- Represents the 7-dimension scoring

**Option 3: Grid Pattern**
- Minimal grid/matrix pattern
- Echoes the OG image background
- Very minimal, almost invisible

### Tools

- Use Figma or similar for vector design
- Export at 2x resolution for Retina displays
- Use online favicon generators for multi-size .ico file

---

## Social Sharing Improvements

### Current State ✓

- [x] OG image endpoint working (`/og-image`)
- [x] Updated with 19 entities (was showing 15)
- [x] Twitter card metadata in place
- [x] Theme color set (#0a0a14)

### Enhancements (Phase 2)

- [ ] **Entity-specific OG images** — `/og-image?entity=plantoid` with custom scores
- [ ] **Dimension-specific cards** — Share radar charts for specific dimensions
- [ ] **Badge variants** — Dark mode, light mode, square, wide

---

## Brand Assets Package

Following Higher's self-serve model, create downloadable brand kit:

- [ ] **Logo pack** — SVG wordmark in multiple sizes
- [ ] **Color swatches** — Sketch/Figma/CSS files
- [ ] **Typography samples** — Font pairing examples
- [ ] **Badge templates** — Figma/Sketch components
- [ ] **OG image templates** — Customizable Figma frames

### Distribution

- Host at `/brand` or `/assets` route
- Provide direct download links
- Include usage guidelines from BRAND.md
- Make everything CC0/public domain

---

## Inspiration: Higher's Approach

**What Higher did well:**
- Open-canvas brand identity
- Self-serve assets with no gatekeeping
- Community creates derivative works
- Brand emerges organically from usage

**Apply to Spirit Index:**
- Provide all brand assets freely
- Encourage forks and remixes
- No "brand police" — trust the community
- Focus on API/data, not visual control

---

## Timeline

**Immediate (Pre-launch):**
- Favicon.ico replacement (use Option 2: Data viz)
- Apple touch icon

**Phase 2 (Q1 2026):**
- Full favicon set
- Entity-specific OG images
- Brand assets download page

**Phase 3 (Q2 2026):**
- Embeddable radar charts
- Interactive badge builder
- Full press kit

---

## Notes

- Keep it minimal — Spirit Index is infrastructure, not a consumer brand
- Prioritize function over aesthetics
- All assets should feel "institutional" not "startup"
- Reference: S&P, Moody's, Bloomberg (financial data oracles)

---

Last updated: January 8, 2026
