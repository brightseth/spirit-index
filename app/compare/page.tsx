"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Agent, DIMENSIONS, DimensionKey } from "@/lib/types";

const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  // Get selected IDs from URL
  const selectedIds = searchParams.get("ids")?.split(",").filter(Boolean) || [];

  // Fetch all agents on mount
  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => {
        setAllAgents(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Update selected agents when URL or allAgents changes
  useEffect(() => {
    if (allAgents.length > 0 && selectedIds.length > 0) {
      const selected = selectedIds
        .map((id) => allAgents.find((a) => a.id === id))
        .filter(Boolean) as Agent[];
      setSelectedAgents(selected);
    } else {
      setSelectedAgents([]);
    }
  }, [allAgents, searchParams]);

  // Update URL when selection changes
  const updateSelection = (ids: string[]) => {
    if (ids.length > 0) {
      router.push(`/compare?ids=${ids.join(",")}`);
    } else {
      router.push("/compare");
    }
  };

  const addAgent = (id: string) => {
    if (!selectedIds.includes(id) && selectedIds.length < 4) {
      updateSelection([...selectedIds, id]);
    }
  };

  const removeAgent = (id: string) => {
    updateSelection(selectedIds.filter((i) => i !== id));
  };

  const availableAgents = allAgents.filter((a) => !selectedIds.includes(a.id));

  return (
    <div className="min-h-screen">
      {/* Masthead */}
      <header className="masthead">
        <div className="container">
          <Link href="/" className="no-underline">
            <h1 className="masthead-title">The Spirit Index</h1>
          </Link>
          <p className="masthead-subtitle">
            A reference index of autonomous cultural agents
          </p>

          <nav className="nav mt-6">
            <Link href="/" className="nav-link">
              Index
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/rubric" className="nav-link">
              Rubric
            </Link>
            <Link href="/compare" className="nav-link active">
              Compare
            </Link>
            <Link href="/submit" className="nav-link">
              Submit
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container section">
        <h2 className="text-3xl font-bold text-white mb-2">Compare Entities</h2>
        <p className="text-muted mb-8">
          Select up to 4 entities to compare side-by-side across all 7
          dimensions.
        </p>

        {/* Entity Selector */}
        <div className="mb-8">
          <label className="text-dim text-sm block mb-2">Add entity:</label>
          <select
            className="bg-blue text-white border border-subtle rounded px-4 py-2 w-full max-w-xs"
            value=""
            onChange={(e) => {
              if (e.target.value) addAgent(e.target.value);
            }}
            disabled={loading || selectedIds.length >= 4}
          >
            <option value="">
              {loading
                ? "Loading..."
                : selectedIds.length >= 4
                ? "Max 4 entities"
                : "Select an entity..."}
            </option>
            {availableAgents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.total}/70)
              </option>
            ))}
          </select>
        </div>

        {/* Selected Entities Pills */}
        {selectedAgents.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {selectedAgents.map((agent) => (
              <span
                key={agent.id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue border border-subtle rounded text-sm"
              >
                <span className="text-white">{agent.name}</span>
                <button
                  onClick={() => removeAgent(agent.id)}
                  className="text-dim hover:text-white"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Comparison Table */}
        {selectedAgents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-subtle">
                  <th className="text-left py-3 pr-4 text-dim font-mono sticky left-0 bg-black">
                    Dimension
                  </th>
                  {selectedAgents.map((agent) => (
                    <th
                      key={agent.id}
                      className="text-center py-3 px-4 text-white min-w-[140px]"
                    >
                      <Link
                        href={`/${agent.id}`}
                        className="hover:text-green"
                      >
                        {agent.name}
                      </Link>
                      <div className="text-dim text-xs font-normal mt-1">
                        {agent.total}/70
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Total Row */}
                <tr className="border-b border-subtle bg-blue/30">
                  <td className="py-3 pr-4 text-white font-bold sticky left-0 bg-blue/30">
                    TOTAL
                  </td>
                  {selectedAgents.map((agent) => (
                    <td
                      key={agent.id}
                      className="py-3 px-4 text-center text-green font-bold text-lg"
                    >
                      {agent.total}
                    </td>
                  ))}
                </tr>

                {/* Dimension Rows */}
                {dimensions.map((dim) => {
                  const meta = DIMENSIONS[dim];
                  const maxScore = Math.max(
                    ...selectedAgents.map((a) => a.scores[dim].value)
                  );

                  return (
                    <tr key={dim} className="border-b border-subtle/50">
                      <td className="py-3 pr-4 sticky left-0 bg-black">
                        <Link
                          href={`/rubric#${dim}`}
                          className="text-white hover:text-green"
                        >
                          {meta.label}
                        </Link>
                        <div className="text-dim text-xs mt-1 max-w-[200px]">
                          {meta.description}
                        </div>
                      </td>
                      {selectedAgents.map((agent) => {
                        const score = agent.scores[dim];
                        const isMax =
                          score.value === maxScore && selectedAgents.length > 1;

                        return (
                          <td
                            key={agent.id}
                            className={`py-3 px-4 text-center ${
                              isMax ? "text-green font-bold" : "text-muted"
                            }`}
                          >
                            <span className="text-lg">{score.value}</span>
                            <span
                              className={`ml-2 inline-block w-2 h-2 rounded-full confidence-${score.confidence}`}
                              title={`Confidence: ${score.confidence}`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Metadata Rows */}
                <tr className="border-b border-subtle/50">
                  <td className="py-3 pr-4 text-dim sticky left-0 bg-black">
                    Status
                  </td>
                  {selectedAgents.map((agent) => (
                    <td key={agent.id} className="py-3 px-4 text-center">
                      <span
                        className={`status-badge status-${agent.status.toLowerCase()}`}
                      >
                        <span className="status-dot" />
                        {agent.status}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-subtle/50">
                  <td className="py-3 pr-4 text-dim sticky left-0 bg-black">
                    Category
                  </td>
                  {selectedAgents.map((agent) => (
                    <td
                      key={agent.id}
                      className="py-3 px-4 text-center text-muted text-xs"
                    >
                      {agent.category}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-subtle/50">
                  <td className="py-3 pr-4 text-dim sticky left-0 bg-black">
                    Inception
                  </td>
                  {selectedAgents.map((agent) => (
                    <td
                      key={agent.id}
                      className="py-3 px-4 text-center text-muted"
                    >
                      {agent.inception_date}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 border border-subtle rounded">
            <p className="text-dim mb-4">No entities selected</p>
            <p className="text-muted text-sm">
              Use the dropdown above to add entities for comparison
            </p>
          </div>
        )}

        {/* Quick Compare Presets */}
        <div className="mt-12">
          <h3 className="section-title">Quick Comparisons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/compare?ids=plantoid,botto,terra0"
              className="p-4 border border-subtle rounded hover:border-green transition-colors"
            >
              <h4 className="text-white font-bold mb-1">The Elders</h4>
              <p className="text-dim text-sm">
                Plantoid, Botto, terra0 — Pre-2022 pioneers
              </p>
            </Link>
            <Link
              href="/compare?ids=truth-terminal,ai16z,freysa"
              className="p-4 border border-subtle rounded hover:border-green transition-colors"
            >
              <h4 className="text-white font-bold mb-1">The New Wave</h4>
              <p className="text-dim text-sm">
                Truth Terminal, ai16z, Freysa — 2024 emergence
              </p>
            </Link>
            <Link
              href="/compare?ids=solienne,abraham"
              className="p-4 border border-subtle rounded hover:border-green transition-colors"
            >
              <h4 className="text-white font-bold mb-1">Spirit Native</h4>
              <p className="text-dim text-sm">
                Solienne, Abraham — Spirit Protocol agents
              </p>
            </Link>
            <Link
              href="/compare?ids=botto,abraham,solienne"
              className="p-4 border border-subtle rounded hover:border-green transition-colors"
            >
              <h4 className="text-white font-bold mb-1">Autonomous Artists</h4>
              <p className="text-dim text-sm">
                Comparing artistic autonomy approaches
              </p>
            </Link>
            <Link
              href="/compare?ids=replika,tay"
              className="p-4 border border-subtle rounded hover:border-green transition-colors"
            >
              <h4 className="text-white font-bold mb-1">Platform vs Agent</h4>
              <p className="text-dim text-sm">
                Replika, Tay — Boundary cases
              </p>
            </Link>
            <Link
              href="/compare?ids=plantoid,truth-terminal"
              className="p-4 border border-subtle rounded hover:border-green transition-colors"
            >
              <h4 className="text-white font-bold mb-1">
                Governance Extremes
              </h4>
              <p className="text-dim text-sm">
                Plantoid (9) vs Truth Terminal (1)
              </p>
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12">
          <Link href="/" className="nav-link">
            &larr; Back to Index
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-8 border-t border-subtle">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-dim text-sm">
          <span>Published by the Spirit initiative</span>
          <a
            href="https://spiritprotocol.io"
            className="nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spirit Protocol
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted">Loading comparison...</p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
