/**
 * Shared utilities for the Spirit Index
 */

/** Extract clean domain from a URL, stripping www. */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'source';
  }
}

/** Format an archival status slug into title case ("historical_test_case" → "Historical Test Case") */
export function formatArchivalStatus(status: string): string {
  return status.split("_").map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
}

/** Format an ISO date string to a readable month + year */
export function formatReviewDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
