import { MetadataRoute } from "next";
import { getAllAgentIds } from "@/lib/agents";
import { DIMENSIONS, DimensionKey } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://spiritindex.org";
  const agentIds = await getAllAgentIds();
  const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/rubric`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/docs`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  // Agent dossier pages
  const agentPages = agentIds.map((id) => ({
    url: `${baseUrl}/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Leaderboard pages
  const leaderboardPages = dimensions.map((dim) => ({
    url: `${baseUrl}/leaderboard/${dim}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...agentPages, ...leaderboardPages];
}
