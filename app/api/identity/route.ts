/**
 * Spirit Index Identity API - List Identities
 * GET /api/identity
 *
 * List all registered identity bindings.
 * Query params:
 *   - status: Filter by status (PENDING, VERIFYING, ACTIVE, SUSPENDED, REVOKED)
 *   - limit: Number of results (default: 50)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getActiveIdentities } from '@/lib/identity';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    let identities;

    if (status) {
      identities = await prisma.identityBinding.findMany({
        where: { status: status as any },
        orderBy: { registeredAt: 'desc' },
        take: limit,
        select: {
          id: true,
          agentId: true,
          primaryWallet: true,
          verifiedDomain: true,
          status: true,
          domainVerified: true,
          walletVerified: true,
          backlinkVerified: true,
          registeredAt: true,
          lastVerifiedAt: true,
        },
      });
    } else {
      identities = await prisma.identityBinding.findMany({
        orderBy: { registeredAt: 'desc' },
        take: limit,
        select: {
          id: true,
          agentId: true,
          primaryWallet: true,
          verifiedDomain: true,
          status: true,
          domainVerified: true,
          walletVerified: true,
          backlinkVerified: true,
          registeredAt: true,
          lastVerifiedAt: true,
        },
      });
    }

    // Calculate stats
    const stats = await prisma.identityBinding.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const statusCounts = stats.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      success: true,
      meta: {
        total: identities.length,
        status: status || 'all',
        stats: statusCounts,
        generated_at: new Date().toISOString(),
      },
      data: identities.map((identity) => ({
        id: identity.id,
        agentId: identity.agentId,
        primaryWallet: identity.primaryWallet,
        verifiedDomain: identity.verifiedDomain,
        status: identity.status,
        verification: {
          wallet: identity.walletVerified,
          domain: identity.domainVerified,
          backlink: identity.backlinkVerified,
        },
        registeredAt: identity.registeredAt.toISOString(),
        lastVerifiedAt: identity.lastVerifiedAt?.toISOString(),
        dossierUrl: `https://spiritindex.org/agents/${identity.agentId}`,
      })),
    });
  } catch (error) {
    console.error('Identity list error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
