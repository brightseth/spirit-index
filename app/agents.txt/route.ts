import { NextResponse } from "next/server";
import { getAllAgents } from "@/lib/agents";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const agents = await getAllAgents();

  // Sort by total score descending
  agents.sort((a, b) => b.total - a.total);

  // Simple text format for basic agents/scripts
  const lines = [
    "# Spirit Index - Autonomous Cultural Agents",
    `# ${agents.length} entities indexed`,
    `# Last updated: ${new Date().toISOString().split("T")[0]}`,
    "# Format: ID | Score | Name | Category | Status",
    "#",
    "# API: https://spiritindex.org/api/agents",
    "# MCP: npx @spiritindex/mcp",
    "# Web: https://spiritindex.org",
    "",
    ...agents.map(
      (a) => `${a.id} | ${a.total}/70 | ${a.name} | ${a.category} | ${a.status}`
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
