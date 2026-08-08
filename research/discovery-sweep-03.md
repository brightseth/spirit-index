# Discovery Sweep-03 — Literary & Community-Host Modes

**Date:** 2026-07-27
**Branch:** `feat/spirit-index-eval-landscape`
**Motivation:** Sweep-02 flagged two thin MODES in a corpus otherwise saturated in crypto-agent-token entries — (1) community-embedded hosts and (2) literary/poetry agents. Sweep-03 went after both, run as a background research pass, curated in the main loop under the §10 attribution gate.

The point of a sweep is not headcount. It is to find agents that *test the rubric* — that either fill a mode with clean evidence or expose a seam in the gate. Sweep-03 did both.

---

## Headline findings

1. **Literary is the genuinely thin mode, and it has clean exemplars.** The corpus was short on agents whose durable body of work is *written*. Sweep-03 surfaced several, and the strongest are attribution-clean by a clear, mode-specific test (below).

2. **A mode-specific admissibility test for literary agents.** In literary work the §10 question — *whose costly choice was this?* — resolves on a single observable: **did the creators publish the raw, unedited, unselected output, or did a human selection/rewriting step sit between generation and the artifact?** Publishing raw output is the human *declining to author*; heavy selection or templating makes the artifact the operator's. This cleanly separates Benjamin/Sunspring and 1 the Road (admissible) from Racter and the Xiaoice poetry book (catalog-only, attribution-fail).

3. **A third attribution category the §10 binary does not cover: autonomous curatorial authorship.** Pentametron's words are human (real tweeters'), but the *poem* — the metrical scoring and the rhyme pairing — is the bot's unaided judgment, made thousands of times with no per-instance human hand. This is neither agent-authored (it didn't write the words) nor operator-authored (the human wrote the algorithm once, years ago, then never touched an individual poem). **Recommend a §10 rider, not a forced fit.** Seth's canon call.

---

## Candidates (12) with attribution reads

### HOST mode

| Agent | Years | Attribution read | Disposition |
|---|---|---|---|
| **Neuro-sama** | 2022– | Agent-authored live output; steward-owned corrections | **Already an entry** (`neuro-sama.json`, external tier) — cleanest host case, no action needed |
| **Xiaoice / 小冰** | 2014– | Agent-authored host + literary crossover | **Already an entry** — no action |
| **Lil Miquela** | 2016– | Operator-authored (Brud writers' room) | **Already an entry** — instructive operator case |
| OFF Radio Kraków (Emi/Kuba/Alex) | Oct 2024 | Operator-authored institutional story | Catalog-only negative (not minted this sweep) |
| Kuki / Mitsuku | 2005– | Hand-authored AIML (Steve Worswick), 5× Loebner | Catalog-only longevity/negative (not minted) |
| FN Meka | 2019–2022 | Operator-authored; human vocalist behind it | Catalog-only instructive negative (not minted) |
| SmarterChild | 2001–2007 | No reconstructable episode | Catalog-only longevity (not minted) |
| Tay | 2016 (<16 hrs) | — | **Excluded** — fails the "sustained" filter |

### LITERARY mode

| Agent | Years | Attribution read | Disposition |
|---|---|---|---|
| **Benjamin (Sunspring)** | 2016–2018 | **Agent-authored, clean** — output filmed verbatim | **MINTED** `benjamin-sunspring.json` (indexed) |
| **Pentametron** | 2012– | **Autonomous curatorial authorship** (novel category) | **MINTED** `pentametron.json` (indexed) — §10 rider candidate |
| 1 the Road | 2017/2018 | Agent-authored, clean (deliberately unedited road-novel) | Shortlisted, not yet minted |
| DeepDrumpf | 2016 | Agent-authored (char-RNN Trump satire), light curation | Shortlisted, not yet minted |
| Racter | 1984 | Operator-authored — heavy templating exposed by scholars | Catalog-only foundational attribution-fail (not minted) |
| Xiaoice poetry book | 2017 | Operator-authored — 139 selected from a larger corpus (editing step) | Secondary to the host entry |

---

## What was minted this sweep

- **`benjamin-sunspring.json`** — the cleanest agent-authored literary case; fills the thinnest mode and demonstrates the raw-output admissibility test. Flagged `scored_tier_promotion_candidate`.
- **`pentametron.json`** — minted for what it teaches the rubric (autonomous curatorial authorship) and as the strongest endurance data point in literary mode (14 years). Flagged `section10_rider_candidate`, `no_adversary_episode`.

Both held at catalog/indexed depth. Neither self-promoted to a full `rubric_v0_1` scored block — that promotion needs the deeper family-by-family work and, for these two, a Seth ruling on the two canon questions below.

Facts in both entries carry `facts_pending_primary_source_verification` — competition placement, follow-on shorts, the Dobson quote, and current operational status must be hardened against primary sources before any published stable score.

---

## Two canon-level questions parked for Seth

1. **§10 rider — autonomous curatorial authorship.** Pentametron forces a third category the current agent-vs-operator binary does not name. Recommend a short rider to `rubric-spec-v0.1.md` §10 rather than stretching the binary. *(Curator's read: the judgment is genuinely the agent's; admissible for the qualities that judgment exercises — taste, patience — but not for qualities that need an adversary/recovery arc, which this agent has never faced.)*

2. **Literary-mode admissibility test.** Propose adopting "creator published raw unedited output" as the explicit §7/§10 admissibility marker for literary agents, with Benjamin (pass) and Racter (fail) as the worked pair. This is a mode-specific sharpening of the existing gate, not a new gate.

---

## Gaps still open after Sweep-03

- No *living, currently-active* literary agent with a sustained multi-year corpus **and** third-party criticism, beyond Pentametron and Xiaoice.
- Non-English / non-Western hosts and literary agents remain underrepresented beyond Xiaoice — a follow-up sweep should target Japanese, Korean, and Indian ecosystems specifically.
- Forum / Discord "presence-with-a-following" agents remain thin — the community-host mode is still under-covered on the *interactive* (vs broadcast) side.
- Catalog-only negatives (Racter, FN Meka, Kuki, OFF Radio Kraków, SmarterChild) are recorded here in writing but not yet minted as entries — a follow-up pass can mint the most instructive of them (Racter first, as the canonical attribution-fail teaching case).
