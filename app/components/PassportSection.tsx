/**
 * Durability Passport section for the agent dossier.
 * Renders nothing when an agent has no passport.
 */

import Link from "next/link";
import {
  Passport,
  PassportStatus,
  PASSPORT_FIELDS,
  PASSPORT_FIELD_ORDER,
  effectiveStatus,
  lastChecked,
} from "@/lib/passport";
import { extractDomain } from "@/lib/utils";

const STATUS_LABEL: Record<PassportStatus, string> = {
  attested: "Attested",
  stale: "Stale",
  IE: "IE",
};

const STATUS_COLOR: Record<PassportStatus, string> = {
  attested: "var(--confidence-high)",
  stale: "var(--confidence-medium)",
  IE: "var(--text-dim)",
};

export function PassportSection({ passport }: { passport: Passport | null }) {
  if (!passport) return null;

  return (
    <>
    <div className="section-divider" />
    <div id="passport" className="mb-16">
      <h3 className="section-title">Durability Passport</h3>
      <p className="text-dim text-xs font-mono mb-8">
        Six operational facts from public record. Not a score, never summed, and separate from the
        character score above. Last checked {lastChecked(passport)}.{" "}
        <Link href="/passport" className="text-muted hover:text-white">
          How the passport works &rarr;
        </Link>
      </p>

      <div className="space-y-0">
        {PASSPORT_FIELD_ORDER.map((key) => {
          const field = passport.fields[key];
          const meta = PASSPORT_FIELDS[key];
          const status = effectiveStatus(field);

          return (
            <div key={key} className="py-5 border-b border-subtle">
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <span className="text-white text-sm font-mono uppercase tracking-wider" title={meta.question}>
                  {meta.label}
                </span>
                <span
                  className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 border rounded"
                  style={{ color: STATUS_COLOR[status], borderColor: STATUS_COLOR[status] }}
                >
                  {STATUS_LABEL[status]}
                </span>
              </div>
              <p className="text-dim text-xs font-mono mb-2">{meta.question}</p>
              <p className="text-muted text-sm mb-3">{field.summary}</p>
              {field.evidence.length > 0 && (
                <ul className="space-y-1">
                  {field.evidence.map((e, i) => (
                    <li key={i} className="text-xs font-mono flex gap-3">
                      <span className="text-dim flex-grow">{e.claim}</span>
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="evidence-link flex-shrink-0"
                      >
                        {extractDomain(e.url)} &nearr;
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}
