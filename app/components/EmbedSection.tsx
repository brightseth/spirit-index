"use client";

import { useState } from "react";

interface EmbedSectionProps {
  agentId: string;
  agentName: string;
}

const BADGE_VARIANTS = [
  { label: "Compact Dark", style: "compact", theme: "dark", description: "Default — for dark backgrounds" },
  { label: "Compact Light", style: "compact", theme: "light", description: "For light backgrounds" },
  { label: "Minimal Dark", style: "minimal", theme: "dark", description: "Score only — dark" },
  { label: "Minimal Light", style: "minimal", theme: "light", description: "Score only — light" },
] as const;

function buildBadgePath(agentId: string, variant: typeof BADGE_VARIANTS[number]): string {
  const params = new URLSearchParams();
  if (variant.style !== "compact") params.set("style", variant.style);
  if (variant.theme !== "dark") params.set("theme", variant.theme);
  const qs = params.toString();
  return `/badge/${agentId}${qs ? `?${qs}` : ""}`;
}

export function EmbedSection({ agentId, agentName }: EmbedSectionProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const siteUrl = "https://spiritindex.org";
  const variant = BADGE_VARIANTS[selectedVariant];
  const badgePath = buildBadgePath(agentId, variant);
  const badgeUrl = `${siteUrl}${badgePath}`;
  const dossierUrl = `${siteUrl}/${agentId}`;

  const snippets = [
    { label: "Markdown", key: "md", content: `[![Spirit Index](${badgeUrl})](${dossierUrl})` },
    { label: "HTML", key: "html", content: `<a href="${dossierUrl}"><img src="${badgeUrl}" alt="Spirit Index Score for ${agentName}" /></a>` },
    { label: "CLI", key: "cli", content: `npx spirit-index lookup ${agentId}` },
  ];

  async function copyToClipboard(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="mt-16">
      <h3 className="section-title">Embed</h3>

      <div className="border border-subtle rounded p-6">
        {/* Variant selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {BADGE_VARIANTS.map((v, i) => (
            <button
              key={v.label}
              onClick={() => setSelectedVariant(i)}
              className={`px-3 py-1 text-xs uppercase tracking-wider font-mono border transition-colors ${
                i === selectedVariant
                  ? "border-[var(--spirit-green)] text-black bg-[var(--spirit-green)]"
                  : "border-[var(--border-default)] text-[var(--text-muted)] bg-transparent hover:border-[var(--spirit-green-dim)]"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <p className="text-dim text-xs font-mono mb-4">{variant.description}</p>

        {/* Preview */}
        <div
          className="mb-4 p-6 rounded flex items-center justify-center"
          style={{ backgroundColor: variant.theme === "light" ? "#f5f5f5" : "rgba(255,255,255,0.03)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={badgePath}
            alt={`Spirit Index Score for ${agentName}`}
            height={20}
          />
        </div>

        {/* Snippets */}
        {snippets.map((s) => (
          <div key={s.key} className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-dim">{s.label}</span>
              <button
                onClick={() => copyToClipboard(s.content, s.key)}
                className="text-xs font-mono px-2 py-1 border border-subtle rounded hover:border-current transition-colors"
                style={{ color: copied === s.key ? "var(--spirit-green)" : "var(--text-dim)" }}
              >
                {copied === s.key ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="text-xs font-mono p-3 rounded overflow-x-auto" style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "var(--text-dim)" }}>
              <code>{s.content}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
