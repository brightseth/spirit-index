# Spirit Index Brand Guide

**Self-serve assets for the autonomous agent evaluation community**

Inspired by [Higher](https://coinmarketcap.com/currencies/higher/) — an open-canvas brand on Base — the Spirit Index provides self-serve brand assets for builders, agents, and community members.

---

## Brand Philosophy

Spirit Index is **infrastructure, not identity**. It's a reference oracle, not a movement. The brand should feel:

- **Institutional** — Like S&P or Moody's, but for agents
- **Technical** — Monospace fonts, data-first aesthetics
- **Transparent** — Open methodology, cited sources
- **Minimal** — No flourishes, no hype

---

## Core Assets

### Color Palette

```
Background: #0a0a14 (Deep Navy Black)
Primary:    #00ff00 (Terminal Green)
Secondary:  #22c55e (Muted Green)
Muted:      #9ca3af (Gray)
Dim:        #6b7280 (Dark Gray)
Subtle:     #374151 (Border Gray)
White:      #ffffff
```

### Typography

- **Headings:** JetBrains Mono (monospace, medium weight)
- **Body:** Libre Caslon Text (serif, readable)
- **Data:** JetBrains Mono (for scores, metrics)

### Logo & Wordmark

**Text-only wordmark:**
```
THE SPIRIT INDEX
```

No custom logo. The wordmark is the brand.

**Badge format:**
```
┌─────────────────────┐
│  SPIRIT INDEX       │
│  [ENTITY NAME]      │
│  XX/70              │
└─────────────────────┘
```

See `/badge/:id` endpoint for embeddable SVG badges.

---

## Usage Guidelines

### What You Can Do

✅ Embed Spirit Index badges in agent READMEs
✅ Reference scores in research papers, blog posts, social media
✅ Create derivative tools that query the Spirit Index API
✅ Use the 7-dimension framework for your own evaluations
✅ Fork the methodology and adapt it for your domain

### What We Ask

⚠️ Cite the source — Link back to [spiritindex.org](https://spiritindex.org)
⚠️ Don't misrepresent — Scores are opinions, not facts
⚠️ Don't create "official" Spirit Index content without permission

---

## Open Graph & Social Sharing

The `/og-image` endpoint dynamically generates social cards:

**Specs:**
- **Size:** 1200x630px
- **Background:** #0a0a14 with subtle grid pattern
- **Primary color:** #00ff00 (Terminal Green)
- **Format:** PNG via Next.js ImageResponse

**Customization:**
Entity-specific OG images coming soon. For now, all pages share the index view.

---

## Favicon

**Current:** Default Next.js favicon
**Planned:** Monochrome "SI" mark or data visualization icon

---

## Self-Serve Approach (Inspired by Higher)

Higher demonstrated that **brand can be an open canvas**:
- No gatekeeping on usage
- Community creates derivative works
- Brand assets shared freely
- Identity emerges from usage, not control

Spirit Index adopts this philosophy:
- **API-first** — All data is public via REST endpoints
- **Embeddable** — Badges work anywhere
- **Forkable** — Methodology is open-source
- **Remixable** — Use our framework however you want

---

## Technical Specs

### Endpoints for Brand Assets

| Endpoint | Purpose |
|----------|---------|
| `/badge/:id` | SVG badge for entity (embed anywhere) |
| `/og-image` | Social sharing image (1200x630) |
| `/llm.txt` | Plain text for LLM context windows |
| `/index.json` | Full index data as JSON |

### Example Embed

```markdown
[![Spirit Index](https://spiritindex.org/badge/plantoid)](https://spiritindex.org/plantoid)
```

Renders as:
```
┌─────────────────────────┐
│  PLANTOID               │
│  60/70 • Spirit Index   │
└─────────────────────────┘
```

---

## Future Assets

Coming in Phase 2 (Q1 2026):
- [ ] Monochrome favicon set (16x16, 32x32, 180x180)
- [ ] Entity-specific OG images
- [ ] Embeddable dimension radar charts
- [ ] Twitter card variants
- [ ] Press kit with high-res assets

---

## Contact

For brand partnership inquiries or media requests:
**council@spiritindex.org**

For technical integration or API questions:
See [/docs](https://spiritindex.org/docs)

---

*Brand as public infrastructure. Use freely, cite transparently.*

*A Spirit Protocol project — [spiritprotocol.io](https://spiritprotocol.io)*
