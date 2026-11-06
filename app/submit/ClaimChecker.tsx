"use client";

import { useState } from "react";

interface CheckResult {
  ok: boolean;
  message: string;
  pullRequestUrl?: string;
  file?: string;
}

export function ClaimChecker({ example }: { example: string }) {
  const [text, setText] = useState(example);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function check() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/v1/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: text,
      });
      const body = await res.json();
      if (res.ok) {
        setResult({
          ok: true,
          message: `Valid. It would be filed as ${body.data.file.path}. Nothing has been stored or listed.`,
          pullRequestUrl: body.data.next.pull_request_url,
          file: body.data.file.content,
        });
      } else {
        setResult({ ok: false, message: body.error?.message ?? "The claim could not be checked." });
      }
    } catch {
      setResult({ ok: false, message: "The claim could not be checked." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label htmlFor="claim" className="text-dim text-xs font-mono block mb-2">
        Claim JSON
      </label>
      <textarea
        id="claim"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        rows={18}
        className="w-full bg-black text-green font-mono text-xs p-4 rounded border border-subtle"
      />
      <button
        type="button"
        onClick={check}
        disabled={busy}
        className="mt-3 border border-green text-green px-4 py-2 rounded text-sm font-mono hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Checking..." : "Check claim"}
      </button>
      {result && (
        <div
          className="mt-4 p-4 rounded border text-sm font-mono"
          style={{ borderColor: result.ok ? "var(--confidence-high)" : "var(--confidence-medium)" }}
          role="status"
        >
          <p className={result.ok ? "text-white" : "text-muted"}>{result.message}</p>
          {result.pullRequestUrl && (
            <p className="mt-3">
              <a
                href={result.pullRequestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green hover:underline"
              >
                Open the pull request on GitHub &rarr;
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
