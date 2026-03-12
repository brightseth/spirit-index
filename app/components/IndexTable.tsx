"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Agent, DimensionKey, DIMENSIONS, NETWORKS, NetworkAffiliation, IndexTier } from "@/lib/types";

interface AgentWithComparable extends Agent {
  scoring_coverage: number;
  comparable_score: number;
  comparable_max: number;
  comparable_pct: number;
}

interface Props {
  agents: AgentWithComparable[];
}

type SortKey = DimensionKey | "name" | "total" | "inception_date" | "network";

function scoreClass(value: number | null): string {
  if (value === null) return "text-dim";
  if (value >= 9) return "text-green font-bold";
  if (value >= 7) return "text-green";
  if (value >= 5) return "text-muted";
  if (value >= 3) return "text-dim";
  return "text-red";
}

export function IndexTable({ agents }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [networkFilter, setNetworkFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("total");
  const [sortDesc, setSortDesc] = useState(true);
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null);

  const statuses = useMemo(() => {
    const unique = new Set(agents.map((a) => a.status));
    return Array.from(unique);
  }, [agents]);

  const networkCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of agents) {
      counts[a.network] = (counts[a.network] || 0) + 1;
    }
    return counts;
  }, [agents]);

  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = { indexed: 0, tracked: 0 };
    for (const a of agents) {
      counts[a.index_tier] = (counts[a.index_tier] || 0) + 1;
    }
    return counts;
  }, [agents]);

  const filteredAgents = useMemo(() => {
    let result = [...agents];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    // Network filter
    if (networkFilter !== "all") {
      result = result.filter((a) => a.network === networkFilter);
    }

    // Tier filter
    if (tierFilter !== "all") {
      result = result.filter((a) => a.index_tier === tierFilter);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      if (sortBy === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortBy === "network") {
        aVal = a.network.toLowerCase();
        bVal = b.network.toLowerCase();
      } else if (sortBy === "total") {
        aVal = a.comparable_pct;
        bVal = b.comparable_pct;
      } else if (sortBy === "inception_date") {
        aVal = a.inception_date;
        bVal = b.inception_date;
      } else {
        aVal = a.scores[sortBy].value ?? 0;
        bVal = b.scores[sortBy].value ?? 0;
      }

      if (aVal < bVal) return sortDesc ? 1 : -1;
      if (aVal > bVal) return sortDesc ? -1 : 1;
      return 0;
    });

    return result;
  }, [agents, search, statusFilter, networkFilter, tierFilter, sortBy, sortDesc]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key);
      setSortDesc(true);
    }
  };

  const networkInsight = useMemo(() => {
    if (networkFilter === "all") return null;
    const networkAgents = agents.filter((a) => a.network === networkFilter);
    if (networkAgents.length === 0) return null;

    const dimKeys = Object.keys(DIMENSIONS) as DimensionKey[];

    // Compute per-dimension averages for the selected network
    const networkAvgs: Record<DimensionKey, number> = {} as Record<DimensionKey, number>;
    const overallAvgs: Record<DimensionKey, number> = {} as Record<DimensionKey, number>;

    for (const dk of dimKeys) {
      const netScored = networkAgents.filter(a => a.scores[dk].value !== null);
      const allScored = agents.filter(a => a.scores[dk].value !== null);
      networkAvgs[dk] = netScored.length > 0
        ? netScored.reduce((sum, a) => sum + (a.scores[dk].value as number), 0) / netScored.length
        : 0;
      overallAvgs[dk] = allScored.length > 0
        ? allScored.reduce((sum, a) => sum + (a.scores[dk].value as number), 0) / allScored.length
        : 0;
    }

    // Find the dimension with the largest absolute deviation
    let maxDev = 0;
    let maxDim: DimensionKey = dimKeys[0];
    for (const dk of dimKeys) {
      const dev = Math.abs(networkAvgs[dk] - overallAvgs[dk]);
      if (dev > maxDev) {
        maxDev = dev;
        maxDim = dk;
      }
    }

    return {
      network: NETWORKS[networkFilter as NetworkAffiliation].label,
      dimension: DIMENSIONS[maxDim].label,
      networkAvg: networkAvgs[maxDim].toFixed(1),
      overallAvg: overallAvgs[maxDim].toFixed(1),
    };
  }, [agents, networkFilter]);

  const SortHeader = ({ column, label }: { column: SortKey; label: string }) => {
    const isDimension = column in DIMENSIONS;
    const dim = isDimension ? DIMENSIONS[column as DimensionKey] : null;

    return (
      <th
        onClick={() => handleSort(column)}
        onMouseEnter={() => setHoveredHeader(column)}
        onMouseLeave={() => setHoveredHeader(null)}
        className="cursor-pointer hover:text-green transition-colors relative"
      >
        {label}
        {sortBy === column && (
          <span className="ml-1 text-green">{sortDesc ? "↓" : "↑"}</span>
        )}
        {hoveredHeader === column && dim && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 pointer-events-none">
            <div className="bg-[#1a1a2e] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs whitespace-nowrap shadow-lg">
              <div className="font-bold text-white mb-1">{dim.label}</div>
              <div className="text-[var(--text-muted)] font-normal">{dim.description}</div>
            </div>
          </div>
        )}
      </th>
    );
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search entities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-blue border border-subtle rounded text-white placeholder-dim focus:border-green focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-blue border border-subtle rounded text-white focus:border-green focus:outline-none"
        >
          <option value="all">All Status</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Network filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setNetworkFilter("all")}
          className={`px-3 py-1 text-xs uppercase tracking-wider font-mono border transition-colors ${
            networkFilter === "all"
              ? "border-[var(--spirit-green)] text-black bg-[var(--spirit-green)]"
              : "border-[var(--border-default)] text-[var(--text-muted)] bg-transparent hover:border-[var(--spirit-green-dim)] hover:text-[var(--text-primary)]"
          }`}
        >
          All ({agents.length})
        </button>
        {(Object.keys(NETWORKS) as NetworkAffiliation[]).map((net) => {
          const count = networkCounts[net] || 0;
          if (count === 0) return null;
          const isSelected = networkFilter === net;
          return (
            <button
              key={net}
              onClick={() => setNetworkFilter(net)}
              className={`px-3 py-1 text-xs uppercase tracking-wider font-mono border transition-colors ${
                isSelected
                  ? "border-[var(--spirit-green)] text-black bg-[var(--spirit-green)]"
                  : "border-[var(--border-default)] text-[var(--text-muted)] bg-transparent hover:border-[var(--spirit-green-dim)] hover:text-[var(--text-primary)]"
              }`}
            >
              {NETWORKS[net].shortLabel} ({count})
            </button>
          );
        })}
      </div>

      {/* Tier filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "indexed", "tracked"] as const).map((tier) => {
          const label = tier === "all" ? "All" : tier === "indexed" ? "Indexed" : "Tracked";
          const count = tier === "all" ? agents.length : tierCounts[tier] || 0;
          const isSelected = tierFilter === tier;
          return (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1 text-xs uppercase tracking-wider font-mono border transition-colors ${
                isSelected
                  ? "border-[var(--spirit-green)] text-black bg-[var(--spirit-green)]"
                  : "border-[var(--border-default)] text-[var(--text-muted)] bg-transparent hover:border-[var(--spirit-green-dim)] hover:text-[var(--text-primary)]"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Network insight */}
      {networkInsight && (
        <p className="text-xs font-mono text-[var(--text-dim)] mb-4">
          {networkInsight.network} agents average {networkInsight.networkAvg}/10 on {networkInsight.dimension} (cross-network avg: {networkInsight.overallAvg})
        </p>
      )}

      {/* Results count */}
      <p className="text-dim text-sm mb-4">
        Showing {filteredAgents.length} of {agents.length} entities
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <SortHeader column="name" label="Name" />
              <th>Status</th>
              <th>Category</th>
              <SortHeader column="network" label="NET" />
              <SortHeader column="persistence" label="PER" />
              <SortHeader column="autonomy" label="AUT" />
              <SortHeader column="cultural_impact" label="IMP" />
              <SortHeader column="economic_reality" label="ECO" />
              <SortHeader column="governance" label="GOV" />
              <SortHeader column="tech_distinctiveness" label="TEC" />
              <SortHeader column="narrative_coherence" label="NAR" />
              <SortHeader column="economic_infrastructure" label="ECI" />
              <SortHeader column="identity_sovereignty" label="IDS" />
              <SortHeader column="total" label="Total" />
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((agent) => {
              const isTracked = agent.index_tier === "tracked";
              const dimKeys: DimensionKey[] = [
                "persistence", "autonomy", "cultural_impact", "economic_reality",
                "governance", "tech_distinctiveness", "narrative_coherence",
                "economic_infrastructure", "identity_sovereignty"
              ];

              return (
                <tr
                  key={agent.id}
                  onClick={() => router.push(`/${agent.id}`)}
                  className={`cursor-pointer ${isTracked ? "tracked-row" : ""}`}
                >
                  <td>
                    <Link href={`/${agent.id}`} className="font-medium" onClick={(e) => e.stopPropagation()}>
                      {agent.name}
                    </Link>
                    {agent.archival_status && (
                      <span className="ml-2 text-dim text-xs">&dagger;</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${agent.status.toLowerCase()}`}
                    >
                      <span className="status-dot" />
                      {agent.status}
                    </span>
                  </td>
                  <td className="text-muted">{agent.category}</td>
                  <td>
                    <span
                      className="text-xs font-mono"
                      style={{ color: NETWORKS[agent.network]?.color }}
                    >
                      {NETWORKS[agent.network]?.shortLabel ?? agent.network}
                    </span>
                  </td>
                  {dimKeys.map((dk) => {
                    const val = agent.scores[dk].value;
                    return (
                      <td
                        key={dk}
                        className={val === null ? "score-unscored" : scoreClass(val)}
                      >
                        {val === null ? "--" : val}
                      </td>
                    );
                  })}
                  <td className="font-bold">
                    <span className={isTracked ? "text-dim" : "text-green"}>
                      {agent.comparable_score}/{agent.comparable_max}
                    </span>
                    <span className="text-dim text-xs ml-1">{agent.comparable_pct}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAgents.length === 0 && (
        <p className="text-center text-muted py-8">
          No entities match your search.
        </p>
      )}
    </div>
  );
}
