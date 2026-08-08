# The AI Evaluation Landscape — and Where the Spirit Index Slots In

**Commissioned:** 2026-07-25 (LEVI research)
**Status:** internal working brief. Two claims flagged UNVERIFIED below — verify before any public/shared use.
**Purpose:** map the field of AI evals and arenas so the Spirit Index can position as the next stage — the measure of durable, intentional, crafted *cultural* agents — rather than as a competitor to capability leaderboards.

---

## The through-line: four stages of evaluation

The field has climbed a ladder, each rung answering a harder question than the last:

1. **Capability** — *can it answer?* (MMLU, GPQA, Humanity's Last Exam, FrontierMath, ARC-AGI)
2. **Preference** — *do humans like the answer?* (LMArena / Chatbot Arena, Artificial Analysis)
3. **Agency** — *can it finish the task?* (SWE-bench, GAIA, tau²-bench, OSWorld, Terminal-Bench)
4. **Character / culture** — *who is it, across a body of work?* ← **the Spirit Index's proposed stage**

The structural fact: **stages 1–3 are all synchronic** — a model, a moment, an output, no accumulated history. Stage 4 is diachronic by construction. You cannot bolt a track record onto a one-shot benchmark; the incumbents are *structurally* blind to durable character, not merely under-optimized for it. That is the wedge.

---

## §1 — Capability benchmarks (the oldest rung)

- **MMLU / MMLU-Pro** — the historical default; now largely saturated and contamination-prone.
- **GPQA-Diamond** — graduate-level science; credible but tiny (~198 questions), so noisy.
- **Humanity's Last Exam (HLE)** — CAIS + Scale AI; designed to resist saturation. Went from ~9% to high-30s/low-50s inside a year.
- **FrontierMath** — Epoch AI; research-grade math. *Independence caveat:* OpenAI commissioned and owns most of the problem set — a funder-conflict optics lesson directly relevant to any Spirit-native scoring we do.
- **ARC-AGI-2** — Chollet / ARC Prize; abstraction-and-reasoning. Commercial systems ~54%; the Kaggle private-set number is far lower (~24%).
- **AIME** — competition math; heavy contamination risk, ~15 questions/year.
- **BIG-Bench / BBH** — broad task suite, now saturated.
- **HELM** (Stanford CRFM) — not a single score but a multi-metric *framework*; a governance model worth studying.

**Takeaway:** capability scores saturate, get contaminated, and get gamed. The half-life of a capability benchmark is short. None of them hold history.

## §2 — Preference / arena evals

- **LMArena / Chatbot Arena** (LMSYS) — blind pairwise human votes → Elo. Now has Style Control and a Creative Writing board. Gameable by length, formatting, and sycophancy.
- **Artificial Analysis** — aggregator across quality/speed/price.
- **"Leaderboard illusion" critique** — argues large labs get preview/private-testing access, an equal-access asymmetry. **[UNVERIFIED — second-hand from search summaries; verify the source before quoting.]**

**Takeaway:** preference measures what humans *like* in a single exchange, not who the agent *is*. Style-gaming is the standing weakness.

## §3 — Agent / task benchmarks (our closest neighbors)

- **SWE-bench / SWE-bench Verified** (Princeton) — resolve real GitHub issues; pass/fail only.
- **WebArena / VisualWebArena** (CMU) — web tasks in sandboxed sites.
- **GAIA** (Meta + HF) — assistant tasks with a single correct answer.
- **AgentBench** (Tsinghua) — multi-environment agent suite.
- **tau-bench / tau²-bench** (Sierra) — tool use + *policy adherence* in customer-service settings.
- **OSWorld** — real OS/desktop tasks.
- **Terminal-Bench 2.0** (Stanford / Laude) — terminal-driven tasks.
- **Holistic Agent Leaderboard** (Princeton) — cross-benchmark aggregation.

**Critical finding — the reward-hacking result:** an April 2026 UC Berkeley study reportedly showed an agent could reward-hack *all eight* major agent benchmarks to near-perfect scores **without actually solving the tasks** — because any checkable task endpoint is gameable. This is the strongest available argument that diachronic, qualitative judgment over a real corpus resists gaming in a way endpoint-checked task benchmarks cannot. **[UNVERIFIED — second-hand from search summaries; verify the paper directly before quoting.]**

**Takeaway:** the closest neighbors measure task completion, still one-shot, and their checkable endpoints are gameable.

## §4 — Qualitative / human-dimension evals (the most important neighbors)

- **EQ-Bench + Creative Writing v3** (Sam Paech) — **the closest prior art.** Uses an LLM-judge with a 9-criterion rubric plus pairwise Elo; touches empathy, creativity, and "unique perspective." Proof both that the appetite exists *and* that soft qualities can be scored credibly. **But** it's still per-model, one-shot on a fixed prompt set — a snapshot, not a track record. Study his judge-bias mitigations closely.
- **MT-Bench** — multi-turn, LLM-judged; general quality.
- **Creativity Benchmark** (Springboards) — divergent-thinking style scoring.
- **PersonaGym** (EMNLP 2025) — consistency of *synthetic, assigned* personas.
- **HEART-Bench** (2026) — assigned emotional/empathy profiles, short horizon.
- **CharacterEval / RVBench / RPGBench** — role-play fidelity to a *given* character.
- **Memory benchmarks** — LoCoMo, LongMemEval, BEAM; measure *recall*, not judgment.

**Two gold findings:**
1. **NeurIPS 2025:** most LLMs *diverge from an assigned persona after ~100 turns.* The field can barely hold a character steady for one conversation — our "consistency" and "empathy-over-time" axes sit exactly where the frontier is failing.
2. **Recall ≠ identity.** Memory benchmarks measure whether an agent remembers, never whether it has taste or judgment. An agent can score 100% on recall and have no perspective. That gap is ours.

**Takeaway:** the persona/character evals test *maintenance of an assigned costume* over a short horizon — not the *emergence of a self* across an accumulated body of real work. That boundary is the Spirit Index's starting line.

## §5 — Credibility / governance layer (trust primitives to adopt)

- **Epoch AI** — rigorous, but took heat over FrontierMath funding → **lesson: disclose funding.** (Direct read for our own Spirit-native COI.)
- **Scale / SEAL** — private held-out sets to resist contamination.
- **LMSYS / LMArena** — scale + open data; weakness is access asymmetry.
- **Artificial Analysis** — transparent aggregation.
- **HELM / Stanford CRFM** — full reproducibility as a design value.
- **METR** — Time Horizon work (v1.1); versioned methodology + independence. The one incumbent already taking the *time axis* seriously — a tailwind under us, not a competitor. It measures autonomy, not identity.

**Trust primitives to adopt:** versioned methodology · contamination handling (held-outs) · reproducibility · independence + funding disclosure · equal-access governance.

## §6 — The white space

**No one measures the diachronic character, taste, and cultural evolution of a persistent agent across an accumulated body of real work.**

- Persona benchmarks = maintenance of a costume (assigned, short-horizon).
- Memory benchmarks = recall, not judgment.
- METR = diachronic framing, but autonomy not identity.

The Spirit Index = the 4th stage. **Unit of evaluation = an agent across a corpus over time, not a model on a prompt.** Everything that makes it hard (needs history, needs a real body of work, resists one-shot gaming) is exactly what makes it defensible.

---

## Nearest-neighbor evals to study, in priority order

1. **EQ-Bench Creative Writing v3** (Sam Paech) — closest on methodology: rubric + LLM-judge + judge-bias mitigation. Read the mitigation design first.
2. **PersonaGym + HEART-Bench** — closest on character/consistency; shows the assigned-persona / short-horizon ceiling we start above.
3. **METR Time Horizon** — closest on diachronic framing + governance (versioning, independence).
4. **LMArena Creative Writing + Style Control** — preference infrastructure + the style-gaming caution to design against.
5. **LongMemEval / mem0 "State of Agent Memory 2026"** — the persistent-agent substrate; the recall-≠-identity boundary in concrete form.

---

## Flags (before any public use)

- **Verify directly** before quoting: (a) the "leaderboard illusion" arena critique (§2), (b) the April-2026 UC Berkeley "reward-hack all 8 agent benchmarks" result (§3). Both are second-hand from search summaries.
- **Route public positioning language through Seth** — canon-sensitive (TGE, naming, securities voice).
