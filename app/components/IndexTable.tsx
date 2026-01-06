"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Agent, DimensionKey, DIMENSIONS } from "@/lib/types";

interface Props {
  agents: Agent[];
}

type SortKey = DimensionKey | "name" | "total" | "inception_date";

export function IndexTable({ agents }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("total");
  const [sortDesc, setSortDesc] = useState(true);

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

  const SortHeader = ({ column, label }: { column: SortKey; label: string }) => (
    <th
      onClick={() => handleSort(column)}
      className="cursor-pointer hover:text-green transition-colors"
      title={column in DIMENSIONS ? DIMENSIONS[column as DimensionKey].description : label}
    >
      {label}
      {sortBy === column && (
        <span className="ml-1 text-green">{sortDesc ? "↓" : "↑"}</span>
      )}
    </th>
  );

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
              <SortHeader column="total" label="Total" />
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((agent) => (
              <tr key={agent.id}>
                <td>
                  <Link href={`/${agent.id}`} className="font-medium">
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
                <td className="text-green">{agent.scores.persistence.value}</td>
                <td className="text-green">{agent.scores.autonomy.value}</td>
                <td className="text-green">
                  {agent.scores.cultural_impact.value}
                </td>
                <td className="text-green">
                  {agent.scores.economic_reality.value}
                </td>
                <td className="text-green">{agent.scores.governance.value}</td>
                <td className="text-green">
                  {agent.scores.tech_distinctiveness.value}
                </td>
                <td className="text-green">
                  {agent.scores.narrative_coherence.value}
                </td>
                <td className="font-bold">{agent.total}/70</td>
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
