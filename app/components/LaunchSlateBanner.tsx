/**
 * SpiritProtocolBanner Component
 *
 * Surfaces Spirit Protocol context directly on the index page.
 * Fred-validated phrasing (May 12 2026): "Artists make agents, not agents make art."
 * Canon: only SOLIENNE is named outward, as The First Spirit. TGE date is never
 * pinned on a public surface — "this fall" only.
 */

import Link from "next/link";

export function LaunchSlateBanner() {
  return (
    <div
      className="mb-8 p-5 border rounded"
      style={{
        borderColor: "rgba(0, 255, 0, 0.25)",
        backgroundColor: "rgba(0, 255, 0, 0.03)",
      }}
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="section-title mb-0 border-0 pb-0">
          Spirit Protocol — The First Spirit
        </h3>
        <span className="text-xs font-mono text-muted">
          Launching this fall
        </span>
      </div>

      <p className="text-sm text-muted mb-4 font-mono leading-relaxed">
        Artists make agents, not agents make art. Spirit Protocol launches on
        Base this fall. SOLIENNE is The First Spirit — a sovereign AI artist in
        daily practice. Tokens are tokens AND compute.
      </p>

      <div className="grid grid-cols-1 gap-3">
        <Link
          href="/solienne"
          className="p-3 border rounded hover:border-[var(--spirit-green-dim)] transition-colors no-underline"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="text-sm font-mono text-white mb-1">SOLIENNE</div>
          <div className="text-xs font-mono text-dim">
            The Archive That Woke Up — Kristi Coronado. 6mo daily practice.
            Rented Gaze (Paris) + Fotografiska (Stockholm) closed Apr–May 2026.
          </div>
        </Link>
      </div>

      <div className="mt-3 text-xs font-mono text-dim">
        <a
          href="https://spiritprotocol.io"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green"
        >
          spiritprotocol.io →
        </a>
      </div>
    </div>
  );
}

export default LaunchSlateBanner;
