import { getAgentById } from "@/lib/agents";

/**
 * Full SVG badge endpoint (300x80px)
 * Shows agent name, score, grade, tier, and attribution
 * Usage: <img src="https://spiritindex.org/badge/{id}/full" />
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

function truncateName(name: string, maxLen: number): string {
  if (name.length <= maxLen) return name;
  return name.slice(0, maxLen - 1) + "\u2026";
}

function generateFullBadge(
  name: string,
  pct: number,
  grade: string,
  gradeColor: string,
  tier: "indexed" | "tracked"
): string {
  const displayName = escapeXml(truncateName(name, 24));
  const tierLabel = tier === "indexed" ? "INDEXED" : "TRACKED";
  const tierColor = tier === "indexed" ? "#00FF00" : "#666666";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80" role="img" aria-label="${escapeXml(name)}: ${pct}% ${grade}">
  <title>${escapeXml(name)} - Spirit Index Score: ${pct}% (${grade})</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d0a2e"/>
      <stop offset="100%" stop-color="#141040"/>
    </linearGradient>
    <clipPath id="card">
      <rect width="300" height="80" rx="6"/>
    </clipPath>
  </defs>
  <g clip-path="url(#card)">
    <!-- Background -->
    <rect width="300" height="80" fill="url(#bg)"/>
    <!-- Subtle border -->
    <rect width="300" height="80" rx="6" fill="none" stroke="#1e1b4b" stroke-width="1"/>
    <!-- Score section background -->
    <rect x="220" y="0" width="80" height="80" fill="rgba(0,255,0,0.04)"/>
    <line x1="220" y1="8" x2="220" y2="72" stroke="#1e1b4b" stroke-width="1"/>

    <!-- Left side: Agent info -->
    <g font-family="'Courier New',Consolas,Monaco,monospace">
      <!-- Spirit Index label -->
      <text x="14" y="22" font-size="10" fill="#00FF00" font-weight="bold" letter-spacing="1">SPIRIT INDEX</text>
      <!-- Agent name -->
      <text x="14" y="42" font-size="14" fill="#ffffff" font-weight="bold">${displayName}</text>
      <!-- Tier badge -->
      <rect x="14" y="50" width="${tierLabel.length * 6.5 + 10}" height="16" rx="3" fill="none" stroke="${tierColor}" stroke-width="1"/>
      <text x="19" y="62" font-size="9" fill="${tierColor}" letter-spacing="0.5">${tierLabel}</text>
    </g>

    <!-- Right side: Score -->
    <g font-family="'Courier New',Consolas,Monaco,monospace" text-anchor="middle">
      <!-- Letter grade -->
      <text x="260" y="36" font-size="24" fill="${gradeColor}" font-weight="bold">${grade}</text>
      <!-- Percentage -->
      <text x="260" y="52" font-size="12" fill="#cccccc">${pct}%</text>
    </g>

    <!-- Attribution -->
    <text x="286" y="74" font-family="'Courier New',Consolas,Monaco,monospace" font-size="8" fill="#444" text-anchor="end">spiritindex.org</text>
  </g>
</svg>`;
}

function generateNotFoundFullBadge(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80" role="img" aria-label="Spirit Index: Not Rated">
  <title>Spirit Index - Agent Not Rated</title>
  <defs>
    <clipPath id="card">
      <rect width="300" height="80" rx="6"/>
    </clipPath>
  </defs>
  <g clip-path="url(#card)">
    <rect width="300" height="80" fill="#0d0a2e"/>
    <rect width="300" height="80" rx="6" fill="none" stroke="#1e1b4b" stroke-width="1"/>
    <g font-family="'Courier New',Consolas,Monaco,monospace">
      <text x="14" y="22" font-size="10" fill="#6b7280" font-weight="bold" letter-spacing="1">SPIRIT INDEX</text>
      <text x="14" y="46" font-size="14" fill="#9ca3af">Agent not rated</text>
      <text x="14" y="64" font-size="10" fill="#4b5563">Submit at spiritindex.org/submit</text>
    </g>
    <text x="286" y="74" font-family="'Courier New',Consolas,Monaco,monospace" font-size="8" fill="#444" text-anchor="end">spiritindex.org</text>
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
    const svg = generateNotFoundFullBadge();
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

  const svg = generateFullBadge(
    agent.name,
    pct,
    grade,
    gradeColor,
    agent.index_tier
  );

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
