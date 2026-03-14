import { getAgentById } from "@/lib/agents";

/**
 * SVG badge endpoint (shields.io style)
 * Usage: <img src="https://spiritindex.org/badge/{id}" />
 *
 * Query params:
 *   - style:  "compact" (default) | "minimal"
 *   - theme:  "dark" (default) | "light"
 *
 * Examples:
 *   /badge/botto                        — compact dark (default)
 *   /badge/botto?style=minimal          — minimal dark
 *   /badge/botto?theme=light            — compact light
 *   /badge/botto?style=minimal&theme=light — minimal light
 */

type BadgeTheme = "dark" | "light";
type BadgeStyle = "compact" | "minimal";

interface ThemeColors {
  labelBg: string;
  valueBg: string;
  labelText: string;
  valueText: string;
  shadowColor: string;
  shadowOpacity: string;
  notFoundLabelText: string;
  notFoundValueBg: string;
  notFoundValueText: string;
}

const THEMES: Record<BadgeTheme, ThemeColors> = {
  dark: {
    labelBg: "#0d0a2e",
    valueBg: "#141040",
    labelText: "#gradeColor", // placeholder — overridden per-badge
    valueText: "#fff",
    shadowColor: "#010101",
    shadowOpacity: ".3",
    notFoundLabelText: "#6b7280",
    notFoundValueBg: "#374151",
    notFoundValueText: "#9ca3af",
  },
  light: {
    labelBg: "#e8e8e8",
    valueBg: "#f5f5f5",
    labelText: "#gradeColor",
    valueText: "#111",
    shadowColor: "#fff",
    shadowOpacity: ".2",
    notFoundLabelText: "#9ca3af",
    notFoundValueBg: "#e5e7eb",
    notFoundValueText: "#6b7280",
  },
};

function getLetterGrade(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

function getGradeColor(pct: number, theme: BadgeTheme): string {
  if (theme === "light") {
    // Darker shades for legibility on light backgrounds
    if (pct >= 80) return "#15803d";
    if (pct >= 60) return "#166534";
    if (pct >= 40) return "#92400e";
    return "#b91c1c";
  }
  // Dark theme — bright for contrast
  if (pct >= 80) return "#00FF00";
  if (pct >= 60) return "#00CC00";
  if (pct >= 40) return "#CCAA00";
  return "#CC4444";
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ---------------------------------------------------------------------------
// Compact style (~200x20px, shields.io style)
// ---------------------------------------------------------------------------

function generateCompactBadge(
  pct: number,
  grade: string,
  gradeColor: string,
  isTracked: boolean,
  theme: BadgeTheme
): string {
  const colors = THEMES[theme];
  const label = "Spirit Index";
  const value = `${pct}% ${grade}`;

  const labelWidth = label.length * 6.6 + 12;
  const valueWidth = value.length * 6.6 + 12;
  const totalWidth = Math.ceil(labelWidth + valueWidth);

  const trackedIndicator = isTracked
    ? `<circle cx="${totalWidth - 6}" cy="4" r="2" fill="#666" opacity="0.8"><title>Auto-scored</title></circle>`
    : "";

  const gradientStops =
    theme === "light"
      ? `<stop offset="0" stop-color="#000" stop-opacity=".03"/>
    <stop offset="1" stop-color="#000" stop-opacity=".06"/>`
      : `<stop offset="0" stop-color="#fff" stop-opacity=".07"/>
    <stop offset="1" stop-opacity=".1"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${escapeXml(label)}: ${escapeXml(value)}">
  <title>${escapeXml(label)}: ${escapeXml(value)}</title>
  <linearGradient id="s" x2="0" y2="100%">
    ${gradientStops}
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${Math.ceil(labelWidth)}" height="20" fill="${colors.labelBg}"/>
    <rect x="${Math.ceil(labelWidth)}" width="${Math.ceil(valueWidth)}" height="20" fill="${colors.valueBg}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="${colors.valueText}" text-anchor="middle" font-family="'Courier New',Consolas,Monaco,monospace" text-rendering="geometricPrecision" font-size="11">
    <text x="${Math.ceil(labelWidth / 2)}" y="14" fill="${gradeColor}" font-weight="bold">${escapeXml(label)}</text>
    <text aria-hidden="true" x="${Math.ceil(labelWidth + valueWidth / 2)}" y="15" fill="${colors.shadowColor}" fill-opacity="${colors.shadowOpacity}">${escapeXml(value)}</text>
    <text x="${Math.ceil(labelWidth + valueWidth / 2)}" y="14" fill="${colors.valueText}" font-weight="bold">${escapeXml(value)}</text>
  </g>
  ${trackedIndicator}
</svg>`;
}

// ---------------------------------------------------------------------------
// Minimal style (~80x20px, just "72% B+" in a colored box)
// ---------------------------------------------------------------------------

function generateMinimalBadge(
  pct: number,
  grade: string,
  gradeColor: string,
  theme: BadgeTheme
): string {
  const value = `${pct}% ${grade}`;
  const valueWidth = value.length * 7 + 14;
  const totalWidth = Math.ceil(valueWidth);
  const height = 20;
  const colors = THEMES[theme];

  const bg = theme === "light" ? "#f5f5f5" : "#141040";
  const textFill = theme === "light" ? "#111" : "#fff";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="Spirit Index: ${escapeXml(value)}">
  <title>Spirit Index: ${escapeXml(value)}</title>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${totalWidth}" height="${height}" fill="${bg}"/>
  </g>
  <text x="${Math.ceil(totalWidth / 2)}" y="14" fill="${gradeColor}" text-anchor="middle" font-family="'Courier New',Consolas,Monaco,monospace" text-rendering="geometricPrecision" font-size="11" font-weight="bold">${escapeXml(value)}</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// Not-found badges
// ---------------------------------------------------------------------------

function generateNotFoundBadge(
  style: BadgeStyle,
  theme: BadgeTheme
): string {
  const colors = THEMES[theme];

  if (style === "minimal") {
    const value = "n/a";
    const valueWidth = value.length * 7 + 14;
    const totalWidth = Math.ceil(valueWidth);
    const bg = theme === "light" ? "#f5f5f5" : "#374151";

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="Spirit Index: not rated">
  <title>Spirit Index: not rated</title>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${totalWidth}" height="20" fill="${bg}"/>
  </g>
  <text x="${Math.ceil(totalWidth / 2)}" y="14" fill="${colors.notFoundValueText}" text-anchor="middle" font-family="'Courier New',Consolas,Monaco,monospace" text-rendering="geometricPrecision" font-size="11">${escapeXml(value)}</text>
</svg>`;
  }

  // Compact not-found
  const label = "Spirit Index";
  const value = "not rated";
  const labelWidth = label.length * 6.6 + 12;
  const valueWidth = value.length * 6.6 + 12;
  const totalWidth = Math.ceil(labelWidth + valueWidth);

  const gradientStops =
    theme === "light"
      ? `<stop offset="0" stop-color="#000" stop-opacity=".03"/>
    <stop offset="1" stop-color="#000" stop-opacity=".06"/>`
      : `<stop offset="0" stop-color="#fff" stop-opacity=".07"/>
    <stop offset="1" stop-opacity=".1"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${escapeXml(label)}: ${escapeXml(value)}">
  <title>${escapeXml(label)}: ${escapeXml(value)}</title>
  <linearGradient id="s" x2="0" y2="100%">
    ${gradientStops}
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${Math.ceil(labelWidth)}" height="20" fill="${colors.labelBg}"/>
    <rect x="${Math.ceil(labelWidth)}" width="${Math.ceil(valueWidth)}" height="20" fill="${colors.notFoundValueBg}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="'Courier New',Consolas,Monaco,monospace" text-rendering="geometricPrecision" font-size="11">
    <text x="${Math.ceil(labelWidth / 2)}" y="14" fill="${colors.notFoundLabelText}">${escapeXml(label)}</text>
    <text x="${Math.ceil(labelWidth + valueWidth / 2)}" y="14" fill="${colors.notFoundValueText}">${escapeXml(value)}</text>
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(request.url);

  const styleParam = url.searchParams.get("style") || "compact";
  const themeParam = url.searchParams.get("theme") || "dark";

  const style: BadgeStyle = styleParam === "minimal" ? "minimal" : "compact";
  const theme: BadgeTheme = themeParam === "light" ? "light" : "dark";

  const agent = await getAgentById(id);

  if (!agent) {
    const svg = generateNotFoundBadge(style, theme);
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  }

  const pct = agent.comparable_pct;
  const grade = getLetterGrade(pct);
  const gradeColor = getGradeColor(pct, theme);
  const isTracked = agent.index_tier === "tracked";

  let svg: string;

  if (style === "minimal") {
    svg = generateMinimalBadge(pct, grade, gradeColor, theme);
  } else {
    svg = generateCompactBadge(pct, grade, gradeColor, isTracked, theme);
  }

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
