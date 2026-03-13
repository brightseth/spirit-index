"use client";

import { useState } from "react";

interface EmbedSectionProps {
  agentId: string;
  agentName: string;
}

export function EmbedSection({ agentId, agentName }: EmbedSectionProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const siteUrl = "https://spiritindex.org";
  const badgeUrl = `${siteUrl}/badge/${agentId}`;
  const fullBadgeUrl = `${siteUrl}/badge/${agentId}/full`;
  const dossierUrl = `${siteUrl}/${agentId}`;

  const htmlSnippet = `<a href="${dossierUrl}"><img src="${badgeUrl}" alt="Spirit Index Score for ${agentName}" /></a>`;
  const htmlFullSnippet = `<a href="${dossierUrl}"><img src="${fullBadgeUrl}" alt="Spirit Index Score for ${agentName}" /></a>`;
  const markdownSnippet = `[![Spirit Index](${badgeUrl})](${dossierUrl})`;
  const markdownFullSnippet = `[![Spirit Index](${fullBadgeUrl})](${dossierUrl})`;

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }
  }

  return (
    <div className="mt-12">
      <h3 className="section-title">Embed Badge</h3>
      <p className="text-dim text-sm mb-6 font-mono">
        Display this agent&apos;s Spirit Index score on your site, README, or profile.
      </p>

      <div className="space-y-8">
        {/* Compact Badge */}
        <div className="border border-subtle rounded p-6">
          <div className="text-xs font-mono uppercase tracking-wider text-dim mb-3">
            Compact Badge
          </div>
          <div className="mb-4 p-4 rounded flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/badge/${agentId}`}
              alt={`Spirit Index Score for ${agentName}`}
              height={20}
            />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-dim">HTML</span>
                <button
                  onClick={() => copyToClipboard(htmlSnippet, "html-compact")}
                  className="text-xs font-mono px-2 py-1 border border-subtle rounded hover:border-current transition-colors"
                  style={{ color: copied === "html-compact" ? "#00FF00" : "#9ca3af" }}
                >
                  {copied === "html-compact" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="text-xs font-mono p-3 rounded overflow-x-auto" style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#9ca3af" }}>
                <code>{htmlSnippet}</code>
              </pre>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-dim">Markdown</span>
                <button
                  onClick={() => copyToClipboard(markdownSnippet, "md-compact")}
                  className="text-xs font-mono px-2 py-1 border border-subtle rounded hover:border-current transition-colors"
                  style={{ color: copied === "md-compact" ? "#00FF00" : "#9ca3af" }}
                >
                  {copied === "md-compact" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="text-xs font-mono p-3 rounded overflow-x-auto" style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#9ca3af" }}>
                <code>{markdownSnippet}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Full Badge */}
        <div className="border border-subtle rounded p-6">
          <div className="text-xs font-mono uppercase tracking-wider text-dim mb-3">
            Full Badge
          </div>
          <div className="mb-4 p-4 rounded flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/badge/${agentId}/full`}
              alt={`Spirit Index Full Score for ${agentName}`}
              width={300}
              height={80}
            />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-dim">HTML</span>
                <button
                  onClick={() => copyToClipboard(htmlFullSnippet, "html-full")}
                  className="text-xs font-mono px-2 py-1 border border-subtle rounded hover:border-current transition-colors"
                  style={{ color: copied === "html-full" ? "#00FF00" : "#9ca3af" }}
                >
                  {copied === "html-full" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="text-xs font-mono p-3 rounded overflow-x-auto" style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#9ca3af" }}>
                <code>{htmlFullSnippet}</code>
              </pre>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-dim">Markdown</span>
                <button
                  onClick={() => copyToClipboard(markdownFullSnippet, "md-full")}
                  className="text-xs font-mono px-2 py-1 border border-subtle rounded hover:border-current transition-colors"
                  style={{ color: copied === "md-full" ? "#00FF00" : "#9ca3af" }}
                >
                  {copied === "md-full" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="text-xs font-mono p-3 rounded overflow-x-auto" style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#9ca3af" }}>
                <code>{markdownFullSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
