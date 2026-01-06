/**
 * Spirit Index RSS Feed
 *
 * GET /feed.xml - Returns RSS feed of indexed agents and score updates
 */

import { getAllAgents } from '@/lib/agents';

export async function GET() {
  const agents = await getAllAgents();
  const siteUrl = 'https://spirit-index.vercel.app'; // TODO: Update to spiritindex.org when domain is configured

  // Build RSS items from agents, sorted by most recent score update
  const items = agents
    .map(agent => {
      const lastUpdate = agent.score_history[agent.score_history.length - 1];
      return {
        agent,
        date: lastUpdate ? new Date(lastUpdate.date) : new Date('2026-01-06'),
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ agent, date }) => {
      const dimensionSummary = [
        `Persistence: ${agent.scores.persistence.value}`,
        `Autonomy: ${agent.scores.autonomy.value}`,
        `Cultural Impact: ${agent.scores.cultural_impact.value}`,
        `Economic Reality: ${agent.scores.economic_reality.value}`,
        `Governance: ${agent.scores.governance.value}`,
        `Tech: ${agent.scores.tech_distinctiveness.value}`,
        `Narrative: ${agent.scores.narrative_coherence.value}`,
      ].join(' | ');

      return `
    <item>
      <title>${escapeXml(agent.name)} — ${agent.total}/70</title>
      <link>${siteUrl}/${agent.id}</link>
      <guid isPermaLink="true">${siteUrl}/${agent.id}</guid>
      <pubDate>${date.toUTCString()}</pubDate>
      <description>${escapeXml(agent.tagline)}. ${escapeXml(agent.curator_notes.substring(0, 200))}...</description>
      <category>${escapeXml(agent.category)}</category>
      <spirit:total>${agent.total}</spirit:total>
      <spirit:status>${agent.status}</spirit:status>
      <spirit:dimensions>${escapeXml(dimensionSummary)}</spirit:dimensions>
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:spirit="https://spiritprotocol.io/ns/spirit-index">
  <channel>
    <title>The Spirit Index</title>
    <link>${siteUrl}</link>
    <description>A reference index of autonomous cultural agents. Tracking which agents persist as cultural entities.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>Spirit Index v1.1</generator>
    <image>
      <url>${siteUrl}/icon.png</url>
      <title>The Spirit Index</title>
      <link>${siteUrl}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
