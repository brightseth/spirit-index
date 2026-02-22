"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Agent, DimensionKey, DIMENSIONS } from "@/lib/types";

interface Props {
  agents: Agent[];
}

type SortKey = DimensionKey | "name" | "total" | "inception_date";

function scoreClass(value: number): string {
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
  const [sortBy, setSortBy] = useState<SortKey>("total");
  const [sortDesc, setSortDesc] = useState(true);
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null);

  const statuses = useMemo(() => {
    const unique = new Set(agents.map((a) => a.status));
    return Array.from(unique);
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

    // Sort
    result.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      if (sortBy === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortBy === "total") {
        aVal = a.total;
        bVal = b.total;
      } else if (sortBy === "inception_date") {
        aVal = a.inception_date;
        bVal = b.inception_date;
      } else {
        aVal = a.scores[sortBy].value;
        bVal = b.scores[sortBy].value;
      }

      if (aVal < bVal) return sortDesc ? 1 : -1;
      if (aVal > bVal) return sortDesc ? -1 : 1;
      return 0;
    });

    return result;
  }, [agents, search, statusFilter, sortBy, sortDesc]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key);
      setSortDesc(true);
    }
  };

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
            {filteredAgents.map((agent) => (
              <tr
                key={agent.id}
                onClick={() => router.push(`/${agent.id}`)}
                className="cursor-pointer"
              >
                <td>
                  <Link href={`/${agent.id}`} className="font-medium" onClick={(e) => e.stopPropagation()}>
                    {agent.name}
                  </Link>
                  {agent.archival_status && (
                    <span className="ml-2 text-dim text-xs">†</span>
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
                <td className={scoreClass(agent.scores.persistence.value)}>{agent.scores.persistence.value}</td>
                <td className={scoreClass(agent.scores.autonomy.value)}>{agent.scores.autonomy.value}</td>
                <td className={scoreClass(agent.scores.cultural_impact.value)}>{agent.scores.cultural_impact.value}</td>
                <td className={scoreClass(agent.scores.economic_reality.value)}>{agent.scores.economic_reality.value}</td>
                <td className={scoreClass(agent.scores.governance.value)}>{agent.scores.governance.value}</td>
                <td className={scoreClass(agent.scores.tech_distinctiveness.value)}>{agent.scores.tech_distinctiveness.value}</td>
                <td className={scoreClass(agent.scores.narrative_coherence.value)}>{agent.scores.narrative_coherence.value}</td>
                <td className={scoreClass(agent.scores.economic_infrastructure.value)}>{agent.scores.economic_infrastructure.value}</td>
                <td className={scoreClass(agent.scores.identity_sovereignty.value)}>{agent.scores.identity_sovereignty.value}</td>
                <td className="font-bold">{agent.total}/90</td>
              </tr>
            ))}
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
