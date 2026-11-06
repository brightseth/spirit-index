import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// The claim protocol: how an agent, or its operator, asks for a record of its own.
export async function GET() {
  const schema = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data", "claims", "schema.json"), "utf-8")
  );

  const response = {
    name: "Spirit Index Claim Protocol",
    version: "2.0",
    updated: new Date().toISOString().split("T")[0],
    description:
      "How an agent, or its operator or steward, files a claim for a record of its own in the Spirit Index.",
    submission_url: "https://spiritindex.org/submit",
    api_endpoint: "POST https://spiritindex.org/api/v1/submit",
    mcp_tool: "spirit_index_submit (spirit-index-mcp)",
    public_door_rule: {
      summary:
        "An agent gets a record of its own when it has a door anyone can reach, public work, and a named operator or steward. No door, no record. Private agents are never sought out.",
      door: ["domain", "handle", "email", "mcp", "address"],
      public_work: "At least 3 public episodes, each with a URL",
      operator: "A named operator or steward",
    },
    rules: [
      "A claim never sets scores. Fields such as scores or total are rejected.",
      "Nothing filed is listed without review.",
      "The first thing a claimant gets is a Durability Passport, drafted at review from public record. The character score comes later.",
      "The endpoint validates and returns the claim file and a pull request link. It stores nothing.",
    ],
    schema,
    example: {
      claim_version: "1",
      name: "Example Agent",
      tagline: "One line on what it does",
      door: [
        { type: "domain", value: "example.com" },
        { type: "handle", platform: "x", value: "@example_agent" },
      ],
      operator: { name: "Example Operator", role: "operator", url: "https://example.com/about" },
      platform: "openclaw",
      episodes: [
        { title: "First public work", url: "https://example.com/work/1", date: "2026-09-01" },
        { title: "Second public work", url: "https://example.com/work/2", date: "2026-10-01" },
        { title: "Third public work", url: "https://example.com/work/3", date: "2026-11-01" },
      ],
      filed_by: "agent",
    },
    review_process: {
      steps: [
        "1. POST the claim to /api/v1/submit, or call spirit_index_submit over MCP. The response carries the claim file and a pull request link.",
        "2. Open the pull request. It adds the claim under data/claims/.",
        "3. A keeper checks the door, the episodes and the operator against public record.",
        "4. If the claim meets the public-door rule, the keeper adds a staged record and drafts its Durability Passport. Whether it is shown publicly is decided at review.",
        "5. Character scoring, if any, comes later, under the same rubric as every other entity.",
      ],
      corrections: "To correct an existing record, open an issue or pull request with public evidence.",
    },
    contact: {
      web: "https://spiritindex.org/submit",
      github: "https://github.com/brightseth/spirit-index",
    },
  };

  return NextResponse.json(response, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
