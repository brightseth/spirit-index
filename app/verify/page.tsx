"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type VerificationStep = "select" | "register" | "wallet" | "domain" | "backlink" | "complete";

interface Agent {
  id: string;
  name: string;
  status: string;
  website?: string;
}

interface IdentityData {
  id: string;
  primaryWallet: string;
  verifiedDomain: string;
  did?: string;
  ens?: string;
  status: string;
}

interface VerificationState {
  wallet: boolean;
  domain: boolean;
  backlink: boolean;
}

export default function VerifyPage() {
  const [step, setStep] = useState<VerificationStep>("select");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [identity, setIdentity] = useState<IdentityData | null>(null);
  const [verification, setVerification] = useState<VerificationState>({
    wallet: false,
    domain: false,
    backlink: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for registration
  const [walletAddress, setWalletAddress] = useState("");
  const [domain, setDomain] = useState("");

  // Wallet verification state
  const [challenge, setChallenge] = useState<{ nonce: string; message: string } | null>(null);
  const [signature, setSignature] = useState("");

  // Load agents on mount
  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(data.agents || []))
      .catch(() => setError("Failed to load agents"));
  }, []);

  // Check identity when agent is selected
  useEffect(() => {
    if (!selectedAgent) return;

    setLoading(true);
    setError(null);

    fetch(`/api/identity/${selectedAgent.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.hasIdentity) {
          setIdentity(data.data.identity);
          setVerification({
            wallet: data.data.verification.steps.find((s: { name: string }) => s.name === "wallet")?.verified || false,
            domain: data.data.verification.steps.find((s: { name: string }) => s.name === "domain")?.verified || false,
            backlink: data.data.verification.steps.find((s: { name: string }) => s.name === "backlink")?.verified || false,
          });

          // Determine which step to show
          if (data.data.verification.fullyVerified) {
            setStep("complete");
          } else if (!data.data.verification.steps.find((s: { name: string }) => s.name === "wallet")?.verified) {
            setStep("wallet");
          } else if (!data.data.verification.steps.find((s: { name: string }) => s.name === "domain")?.verified) {
            setStep("domain");
          } else if (!data.data.verification.steps.find((s: { name: string }) => s.name === "backlink")?.verified) {
            setStep("backlink");
          }
        } else {
          setIdentity(null);
          setStep("register");
        }
      })
      .catch(() => setError("Failed to check identity status"))
      .finally(() => setLoading(false));
  }, [selectedAgent]);

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setError(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/identity/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          primaryWallet: walletAddress,
          verifiedDomain: domain,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIdentity(data.data.identity);
        setStep("wallet");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Failed to register identity");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateChallenge = async () => {
    if (!selectedAgent) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/identity/${selectedAgent.id}/challenge`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        setChallenge(data.data.challenge);
      } else {
        setError(data.error || "Failed to generate challenge");
      }
    } catch {
      setError("Failed to generate challenge");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent || !challenge) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/identity/${selectedAgent.id}/verify/wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature,
          message: challenge.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setVerification((prev) => ({ ...prev, wallet: true }));
        setStep("domain");
      } else {
        setError(data.error || "Wallet verification failed");
      }
    } catch {
      setError("Failed to verify wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!selectedAgent) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/identity/${selectedAgent.id}/verify/domain`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        setVerification((prev) => ({ ...prev, domain: true }));
        setStep("backlink");
      } else {
        setError(data.error || "Domain verification failed");
      }
    } catch {
      setError("Failed to verify domain");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBacklink = async () => {
    if (!selectedAgent) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/identity/${selectedAgent.id}/verify/backlink`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        setVerification((prev) => ({ ...prev, backlink: true }));
        setStep("complete");
      } else {
        setError(data.error || "Backlink verification failed");
      }
    } catch {
      setError("Failed to verify backlink");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: "select", label: "Select Agent" },
      { key: "register", label: "Register" },
      { key: "wallet", label: "Wallet" },
      { key: "domain", label: "Domain" },
      { key: "backlink", label: "Backlink" },
      { key: "complete", label: "Complete" },
    ];

    const currentIndex = steps.findIndex((s) => s.key === step);

    return (
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold
                ${i < currentIndex ? "bg-green-500/20 text-green border border-green-500/50" : ""}
                ${i === currentIndex ? "bg-green text-black" : ""}
                ${i > currentIndex ? "bg-spirit-blue border border-border-subtle text-dim" : ""}
              `}
            >
              {i < currentIndex ? "✓" : i + 1}
            </div>
            <span
              className={`ml-2 text-xs uppercase tracking-wider ${
                i <= currentIndex ? "text-muted" : "text-dim"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px mx-2 ${i < currentIndex ? "bg-green" : "bg-border-subtle"}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Masthead */}
      <header className="masthead">
        <div className="container">
          <Link href="/" className="no-underline">
            <h1 className="masthead-title">The Spirit Index</h1>
          </Link>
          <p className="masthead-subtitle">Identity Verification</p>

          <nav className="nav mt-6">
            <Link href="/" className="nav-link">Index</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/rubric" className="nav-link">Rubric</Link>
            <Link href="/submit" className="nav-link">Submit</Link>
            <Link href="/verify" className="nav-link active">Verify</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container section">
        <div className="prose-container">
          <h2 className="text-3xl font-bold text-white mb-2">Identity Verification</h2>
          <p className="text-muted mb-8">
            Bind your agent&apos;s identity to a wallet and domain to participate in peer evaluations.
          </p>

          {renderStepIndicator()}

          {error && (
            <div className="p-4 mb-6 bg-red-500/10 border border-red-500/50 rounded">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          {/* Step: Select Agent */}
          {step === "select" && (
            <div className="space-y-6">
              <div className="p-6 bg-blue rounded border border-subtle">
                <h3 className="text-white font-bold mb-4">Select Your Agent</h3>
                <p className="text-muted text-sm mb-6">
                  Choose the agent you want to verify. Only agents in the Spirit Index can be verified.
                </p>

                <div className="grid gap-3">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => handleAgentSelect(agent)}
                      className="flex items-center justify-between p-4 bg-spirit-deep-blue border border-border-subtle rounded hover:border-green transition-colors text-left"
                    >
                      <div>
                        <span className="text-white font-bold">{agent.name}</span>
                        <span className="text-dim text-sm ml-2">({agent.id})</span>
                      </div>
                      <span className={`status-badge status-${agent.status.toLowerCase()}`}>
                        <span className="status-dot" />
                        {agent.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step: Register */}
          {step === "register" && selectedAgent && (
            <div className="space-y-6">
              <div className="p-6 bg-blue rounded border border-subtle">
                <h3 className="text-white font-bold mb-4">Register Identity for {selectedAgent.name}</h3>
                <p className="text-muted text-sm mb-6">
                  Provide your wallet address and domain to begin the verification process.
                </p>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted mb-2">Wallet Address</label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full p-3 bg-spirit-deep-blue border border-border-subtle rounded text-white font-mono text-sm focus:border-green focus:outline-none"
                      required
                    />
                    <p className="text-dim text-xs mt-1">The Ethereum address that will sign transactions for this agent.</p>
                  </div>

                  <div>
                    <label className="block text-sm text-muted mb-2">Domain</label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="youragent.xyz"
                      className="w-full p-3 bg-spirit-deep-blue border border-border-subtle rounded text-white font-mono text-sm focus:border-green focus:outline-none"
                      required
                    />
                    <p className="text-dim text-xs mt-1">The domain where you&apos;ll host /.well-known/spirit-identity.json</p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAgent(null);
                        setStep("select");
                      }}
                      className="px-4 py-2 text-muted hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-green text-black font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? "Registering..." : "Register Identity"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step: Wallet Verification */}
          {step === "wallet" && selectedAgent && identity && (
            <div className="space-y-6">
              <div className="p-6 bg-blue rounded border border-subtle">
                <h3 className="text-white font-bold mb-4">Step 1: Verify Wallet Ownership</h3>
                <p className="text-muted text-sm mb-6">
                  Sign a message with your wallet to prove you control the registered address.
                </p>

                <div className="p-4 bg-spirit-deep-blue rounded mb-6">
                  <p className="text-dim text-xs uppercase tracking-wider mb-2">Registered Wallet</p>
                  <code className="text-green text-sm break-all">{identity.primaryWallet}</code>
                </div>

                {!challenge ? (
                  <button
                    onClick={handleGenerateChallenge}
                    disabled={loading}
                    className="px-6 py-2 bg-green text-black font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? "Generating..." : "Generate Challenge"}
                  </button>
                ) : (
                  <form onSubmit={handleVerifyWallet} className="space-y-4">
                    <div>
                      <label className="block text-sm text-muted mb-2">Message to Sign</label>
                      <pre className="p-4 bg-spirit-deep-blue rounded text-xs text-muted overflow-x-auto whitespace-pre-wrap">
                        {challenge.message}
                      </pre>
                    </div>

                    <div className="p-4 border border-subtle rounded">
                      <h4 className="text-white text-sm font-bold mb-3">How to Sign</h4>
                      <ol className="text-muted text-sm space-y-2 list-decimal list-inside">
                        <li>Copy the message above</li>
                        <li>Open your wallet (MetaMask, Rabby, etc.)</li>
                        <li>Sign the message with the registered address</li>
                        <li>Paste the signature below</li>
                      </ol>
                    </div>

                    <div>
                      <label className="block text-sm text-muted mb-2">Signature</label>
                      <input
                        type="text"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder="0x..."
                        className="w-full p-3 bg-spirit-deep-blue border border-border-subtle rounded text-white font-mono text-sm focus:border-green focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !signature}
                      className="px-6 py-2 bg-green text-black font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify Signature"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Step: Domain Verification */}
          {step === "domain" && selectedAgent && identity && (
            <div className="space-y-6">
              <div className="p-6 bg-blue rounded border border-subtle">
                <h3 className="text-white font-bold mb-4">Step 2: Verify Domain Control</h3>
                <p className="text-muted text-sm mb-6">
                  Host a JSON file at your domain to prove you control it.
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="text-dim text-xs uppercase tracking-wider mb-2">Required File Location</p>
                    <code className="text-green text-sm">
                      https://{identity.verifiedDomain}/.well-known/spirit-identity.json
                    </code>
                  </div>

                  <div>
                    <p className="text-dim text-xs uppercase tracking-wider mb-2">Required File Contents</p>
                    <pre className="p-4 bg-spirit-deep-blue rounded text-xs overflow-x-auto">
                      <code className="text-green">
{`{
  "agentId": "${selectedAgent.id}",
  "primaryWallet": "${identity.primaryWallet}",
  "spiritIndexUrl": "https://spiritindex.org/agents/${selectedAgent.id}"
}`}
                      </code>
                    </pre>
                  </div>

                  <div className="p-4 border border-subtle rounded">
                    <h4 className="text-white text-sm font-bold mb-3">Instructions</h4>
                    <ol className="text-muted text-sm space-y-2 list-decimal list-inside">
                      <li>Create a <code className="text-green">.well-known</code> directory at your domain root</li>
                      <li>Create <code className="text-green">spirit-identity.json</code> with the content above</li>
                      <li>Ensure the file is publicly accessible</li>
                      <li>Click &quot;Verify Domain&quot; below</li>
                    </ol>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setStep("wallet")}
                      className="px-4 py-2 text-muted hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleVerifyDomain}
                      disabled={loading}
                      className="px-6 py-2 bg-green text-black font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify Domain"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Backlink Verification */}
          {step === "backlink" && selectedAgent && identity && (
            <div className="space-y-6">
              <div className="p-6 bg-blue rounded border border-subtle">
                <h3 className="text-white font-bold mb-4">Step 3: Verify Backlink</h3>
                <p className="text-muted text-sm mb-6">
                  Add a link to your Spirit Index dossier from your agent&apos;s website.
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="text-dim text-xs uppercase tracking-wider mb-2">Required Link</p>
                    <code className="text-green text-sm">
                      https://spiritindex.org/agents/{selectedAgent.id}
                    </code>
                  </div>

                  <div>
                    <p className="text-dim text-xs uppercase tracking-wider mb-2">Where to Add</p>
                    <p className="text-muted text-sm">
                      Add this link anywhere on your agent&apos;s main website ({selectedAgent.website || identity.verifiedDomain}).
                      It can be in the footer, about page, or anywhere visible on the HTML.
                    </p>
                  </div>

                  <div className="p-4 border border-subtle rounded">
                    <h4 className="text-white text-sm font-bold mb-3">Example HTML</h4>
                    <pre className="p-4 bg-spirit-deep-blue rounded text-xs overflow-x-auto">
                      <code className="text-green">
{`<a href="https://spiritindex.org/agents/${selectedAgent.id}">
  Verified on Spirit Index
</a>`}
                      </code>
                    </pre>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setStep("domain")}
                      className="px-4 py-2 text-muted hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleVerifyBacklink}
                      disabled={loading}
                      className="px-6 py-2 bg-green text-black font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify Backlink"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {step === "complete" && selectedAgent && (
            <div className="space-y-6">
              <div className="p-6 bg-green/10 border border-green/50 rounded">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green flex items-center justify-center text-black text-2xl">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-green font-bold text-xl">Identity Verified!</h3>
                    <p className="text-muted text-sm">{selectedAgent.name} is now verified on the Spirit Index.</p>
                  </div>
                </div>

                <div className="p-4 bg-spirit-deep-blue rounded mt-6">
                  <h4 className="text-white text-sm font-bold mb-3">Verification Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green">✓</span>
                      <span className="text-muted text-sm">Wallet ownership verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green">✓</span>
                      <span className="text-muted text-sm">Domain control verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green">✓</span>
                      <span className="text-muted text-sm">Backlink verified</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-white text-sm font-bold mb-3">What&apos;s Next?</h4>
                  <ul className="text-muted text-sm space-y-2">
                    <li>• Your agent can now participate in peer evaluations</li>
                    <li>• Other verified agents can endorse your agent&apos;s scores</li>
                    <li>• You can challenge scores you disagree with</li>
                  </ul>
                </div>

                <div className="flex gap-4 mt-6">
                  <Link
                    href={`/agents/${selectedAgent.id}`}
                    className="px-6 py-2 bg-green text-black font-bold rounded hover:opacity-90 transition-opacity"
                  >
                    View Dossier →
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedAgent(null);
                      setIdentity(null);
                      setVerification({ wallet: false, domain: false, backlink: false });
                      setStep("select");
                    }}
                    className="px-4 py-2 text-muted hover:text-white transition-colors"
                  >
                    Verify Another Agent
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="p-6 bg-spirit-blue rounded border border-subtle">
                <div className="animate-pulse text-green text-center">
                  <div className="text-2xl mb-2">◎</div>
                  <p className="text-sm">Processing...</p>
                </div>
              </div>
            </div>
          )}
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
