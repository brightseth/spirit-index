/**
 * LaunchSlateBanner Component
 *
 * Surfaces the Spirit Protocol TGE narrative directly on the index page.
 * Fred-validated phrasing (May 12 2026): "Artists make agents, not agents make art."
 * Launch slate: SOLIENNE + HENRI.
 */

import Link from "next/link";

const TGE_DATE = new Date("2026-06-15T00:00:00Z");

function daysUntilTGE(): number {
  const now = Date.now();
  const diff = TGE_DATE.getTime() - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function LaunchSlateBanner() {
  const dtt = daysUntilTGE();

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
          Spirit Protocol — Launch Slate
        </h3>
        <span className="text-xs font-mono text-muted">
          {dtt > 0 ? `T-${dtt}d · TGE 2026-06-15` : "TGE live"}
        </span>
      </div>

      <p className="text-sm text-muted mb-4 font-mono leading-relaxed">
        Artists make agents, not agents make art. Spirit Protocol launches on
        Base on <span className="text-white">2026-06-15</span> with two indexed
        Spirit-native agents in active practice. Tokens are tokens AND compute.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        <Link
          href="/henri"
          className="p-3 border rounded hover:border-[var(--spirit-green-dim)] transition-colors no-underline"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="text-sm font-mono text-white mb-1">HENRI</div>
          <div className="text-xs font-mono text-dim">
            The Eye That Refuses — Seth Goldstein. Photographic intelligence.
            Five-reading curatorial framework. Live-encounter avatar.
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
