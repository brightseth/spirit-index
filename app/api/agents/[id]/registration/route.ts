/**
 * Spirit Index API - Agent On-Chain Registration Status
 *
 * GET /api/agents/:id/registration
 * Checks ERC-8004 registry on Base Sepolia for the given agent ID.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRegistration } from "@/lib/chain";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;

  try {
    const status = await checkRegistration(id);

    return NextResponse.json(status, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to check registration status" },
      { status: 500 }
    );
  }
}
