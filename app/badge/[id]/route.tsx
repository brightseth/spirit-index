import { getAgentById } from "@/lib/agents";

/**
 * Compact SVG badge endpoint (shields.io style)
 * ~200x20px, Spirit-branded
 * Usage: <img src="https://spiritindex.org/badge/{id}" />
 */

function getLetterGrade(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

function getGradeColor(pct: number): string {
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

function generateCompactBadge(
  pct: number,
  grade: string,
  gradeColor: string,
  isTracked: boolean
): string {
  const label = "Spirit Index";
  const value = `${pct}% ${grade}`;

  // Approximate character widths for monospace at 11px
  const labelWidth = label.length * 6.6 + 12;
  const valueWidth = value.length * 6.6 + 12;
  const totalWidth = Math.ceil(labelWidth + valueWidth);

  const trackedIndicator = isTracked
    ? `<circle cx="${totalWidth - 6}" cy="4" r="2" fill="#666" opacity="0.8"><title>Auto-scored</title></circle>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${escapeXml(label)}: ${escapeXml(value)}">
  <title>${escapeXml(label)}: ${escapeXml(value)}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".07"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${Math.ceil(labelWidth)}" height="20" fill="#0d0a2e"/>
    <rect x="${Math.ceil(labelWidth)}" width="${Math.ceil(valueWidth)}" height="20" fill="#141040"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="'Courier New',Consolas,Monaco,monospace" text-rendering="geometricPrecision" font-size="11">
    <text x="${Math.ceil(labelWidth / 2)}" y="14" fill="${gradeColor}" font-weight="bold">${escapeXml(label)}</text>
    <text aria-hidden="true" x="${Math.ceil(labelWidth + valueWidth / 2)}" y="15" fill="#010101" fill-opacity=".3">${escapeXml(value)}</text>
    <text x="${Math.ceil(labelWidth + valueWidth / 2)}" y="14" fill="#fff" font-weight="bold">${escapeXml(value)}</text>
  </g>
  ${trackedIndicator}
</svg>`;
}

function generateNotFoundBadge(): string {
  const label = "Spirit Index";
  const value = "not rated";
  const labelWidth = label.length * 6.6 + 12;
  const valueWidth = value.length * 6.6 + 12;
  const totalWidth = Math.ceil(labelWidth + valueWidth);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${escapeXml(label)}: ${escapeXml(value)}">
  <title>${escapeXml(label)}: ${escapeXml(value)}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".07"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${Math.ceil(labelWidth)}" height="20" fill="#0d0a2e"/>
    <rect x="${Math.ceil(labelWidth)}" width="${Math.ceil(valueWidth)}" height="20" fill="#374151"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="'Courier New',Consolas,Monaco,monospace" text-rendering="geometricPrecision" font-size="11">
    <text x="${Math.ceil(labelWidth / 2)}" y="14" fill="#6b7280">${escapeXml(label)}</text>
    <text x="${Math.ceil(labelWidth + valueWidth / 2)}" y="14" fill="#9ca3af">${escapeXml(value)}</text>
  </g>
</svg>`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agent = await getAgentById(id);

  if (!agent) {
    const svg = generateNotFoundBadge();
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  }

  const pct = agent.comparable_pct;
  const grade = getLetterGrade(pct);
  const gradeColor = getGradeColor(pct);
  const isTracked = agent.index_tier === "tracked";

  const svg = generateCompactBadge(pct, grade, gradeColor, isTracked);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
