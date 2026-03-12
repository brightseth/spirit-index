import { NextResponse } from "next/server";
import { getAllAgents } from "@/lib/agents";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const agents = await getAllAgents();

  // Sort by comparable_pct descending
  agents.sort((a, b) => b.comparable_pct - a.comparable_pct);

  // Simple text format for basic agents/scripts
  const lines = [
    "# Spirit Index - Autonomous Cultural Agents",
    `# ${agents.length} entities (${agents.filter(a => a.index_tier === 'indexed').length} indexed, ${agents.filter(a => a.index_tier === 'tracked').length} tracked)`,
    `# Last updated: ${new Date().toISOString().split("T")[0]}`,
    "# Format: ID | Score | Pct | Tier | Name | Category | Network | Status",
    "#",
    "# API: https://spiritindex.org/api/agents",
    "# MCP: npx spirit-index-mcp",
    "# Web: https://spiritindex.org",
    "",
    ...agents.map(
      (a) => `${a.id} | ${a.comparable_score}/${a.comparable_max} | ${a.comparable_pct}% | ${a.index_tier} | ${a.name} | ${a.category} | ${a.network} | ${a.status}`
    ),
    "",
    "# Submit: https://spiritindex.org/submit",
    "# Rubric: https://spiritindex.org/rubric",
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
