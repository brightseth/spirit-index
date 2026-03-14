import { getAgentById } from "@/lib/agents";

/**
 * SVG badge endpoint (shields.io style)
 * Usage: <img src="https://spiritindex.org/badge/{id}" />
 *
 * Query params:
 *   - style:  "compact" (default) | "minimal"
 *   - theme:  "dark" (default) | "light"
 */

type BadgeTheme = "dark" | "light";
type BadgeStyle = "compact" | "minimal";

interface ThemeColors {
  labelBg: string;
  valueBg: string;
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
    valueText: "#111",
    shadowColor: "#fff",
    shadowOpacity: ".2",
    notFoundLabelText: "#9ca3af",
    notFoundValueBg: "#e5e7eb",
    notFoundValueText: "#6b7280",
  },
};

// Simplified 6-level grade scale for compact badge display.
// Intentionally coarser than lib/agents.ts getGrade() (12-step academic scale)
// because badges need to be legible at 20px height.
function badgeGrade(pct: number): string {
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
    if (pct >= 80) return "#15803d";
    if (pct >= 60) return "#166534";
    if (pct >= 40) return "#92400e";
    return "#b91c1c";
  }
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

function gradientStops(theme: BadgeTheme): string {
  return theme === "light"
    ? `<stop offset="0" stop-color="#000" stop-opacity=".03"/><stop offset="1" stop-color="#000" stop-opacity=".06"/>`
    : `<stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-opacity=".1"/>`;
}

// ---------------------------------------------------------------------------
// Compact style (~200x20px, shields.io two-panel)
// ---------------------------------------------------------------------------

function generateCompactBadge(
  label: string,
  value: string,
  labelColor: string,
  valueTextColor: string,
  theme: BadgeTheme,
  isTracked: boolean = false
): string {
  const colors = THEMES[theme];
  const labelWidth = label.length * 6.6 + 12;
  const valueWidth = value.length * 6.6 + 12;
  const totalWidth = Math.ceil(labelWidth + valueWidth);

  const trackedDot = isTracked
    ? `<circle cx="${totalWidth - 6}" cy="4" r="2" fill="#666" opacity="0.8"><title>Auto-scored</title></circle>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${escapeXml(label)}: ${escapeXml(value)}">
  <title>${escapeXml(label)}: ${escapeXml(value)}</title>
  <linearGradient id="s" x2="0" y2="100%">${gradientStops(theme)}</linearGradient>
  <clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${Math.ceil(labelWidth)}" height="20" fill="${colors.labelBg}"/>
    <rect x="${Math.ceil(labelWidth)}" width="${Math.ceil(valueWidth)}" height="20" fill="${colors.valueBg}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="${colors.valueText}" text-anchor="middle" font-family="'Courier New',Consolas,Monaco,monospace" text-rendering="geometricPrecision" font-size="11">
    <text x="${Math.ceil(labelWidth / 2)}" y="14" fill="${labelColor}" font-weight="bold">${escapeXml(label)}</text>
    <text aria-hidden="true" x="${Math.ceil(labelWidth + valueWidth / 2)}" y="15" fill="${colors.shadowColor}" fill-opacity="${colors.shadowOpacity}">${escapeXml(value)}</text>
    <text x="${Math.ceil(labelWidth + valueWidth / 2)}" y="14" fill="${valueTextColor}" font-weight="bold">${escapeXml(value)}</text>
  </g>
  ${trackedDot}
</svg>`;
}

// ---------------------------------------------------------------------------
// Minimal style (~80x20px, just score in a single box)
// ---------------------------------------------------------------------------

function generateMinimalBadge(
  value: string,
  textColor: string,
  theme: BadgeTheme
): string {
  const colors = THEMES[theme];
  const valueWidth = value.length * 7 + 14;
  const totalWidth = Math.ceil(valueWidth);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="Spirit Index: ${escapeXml(value)}">
  <title>Spirit Index: ${escapeXml(value)}</title>
  <clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)"><rect width="${totalWidth}" height="20" fill="${colors.valueBg}"/></g>
  <text x="${Math.ceil(totalWidth / 2)}" y="14" fill="${textColor}" text-anchor="middle" font-family="'Courier New',Consolas,Monaco,monospace" text-rendering="geometricPrecision" font-size="11" font-weight="bold">${escapeXml(value)}</text>
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

  const style: BadgeStyle = url.searchParams.get("style") === "minimal" ? "minimal" : "compact";
  const theme: BadgeTheme = url.searchParams.get("theme") === "light" ? "light" : "dark";

  const agent = await getAgentById(id);
  const headers = {
    "Content-Type": "image/svg+xml",
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
  };

  if (!agent) {
    const colors = THEMES[theme];
    const svg = style === "minimal"
      ? generateMinimalBadge("n/a", colors.notFoundValueText, theme)
      : generateCompactBadge("Spirit Index", "not rated", colors.notFoundLabelText, colors.notFoundValueText, theme);
    return new Response(svg, { headers });
  }

  const pct = agent.comparable_pct;
  const grade = badgeGrade(pct);
  const gradeColor = getGradeColor(pct, theme);
  const isTracked = agent.index_tier === "tracked";

  const svg = style === "minimal"
    ? generateMinimalBadge(`${pct}% ${grade}`, gradeColor, theme)
    : generateCompactBadge("Spirit Index", `${pct}% ${grade}`, gradeColor, THEMES[theme].valueText, theme, isTracked);

  return new Response(svg, { headers });
}
