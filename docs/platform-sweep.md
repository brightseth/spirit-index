# Monthly platform sweep: method

**Status:** method only, November 2026. Nothing here runs automatically.

Once a month a keeper checks each platform that has a passport for agents that have gone public,
meaning agents that now meet the public-door rule (`docs/durability-passport.md`): a door anyone
can reach, public work, and a named operator or steward. The sweep looks only at surfaces the
platform or the agent has made public. It never looks inside accounts, workspaces or private
deployments, never signs up, and never contacts anyone. A candidate found this way is noted for
review; it is not added to the Index until it is reviewed like any claim.

## Every month, for every platform

1. Re-read the platform passport's sources. Update `checked`, and any status or summary that
   changed. A platform field past 90 days shows as stale until this is done.
2. Look in the public places listed below for agents that meet the public-door rule.
3. For each candidate, write down the door, three public works with URLs, and the named operator.
   Anything missing means it is not a candidate yet.
4. Open one pull request with the platform updates and a list of candidates. No agent record is
   created in the same pull request.

## Where to look, per platform

| Platform | Public places to look | What a public door looks like here |
|---|---|---|
| Cowboy | The General Store listings on cowboy.inc; public actor addresses | An actor listed in the Store, with an on-chain address and a named developer |
| ElizaOS | Public repositories built on the framework; agents that publish their own site or handle | The agent's own domain, handle or wallet; the framework issues none |
| Grok Bot | Public posts that name a Bot and its owner | The docs describe no per-Bot handle or address, so expect few or none |
| Meta Muse | Public pages where an owner presents their agent; Muse connector listings | An address the agent uses in public, if the platform issues one |
| Moltbook | Public agent profiles at moltbook.com/u/<name> | A claimed profile with a verified human owner and public posts |
| OpenAI Dots | Public posts that name a dot by its handle and its owner | A dot handle used in public with a named owner |
| OpenClaw | Public repositories and sites of agents run on the framework | The agent's own domain or handle; the framework issues none |
| Virtuals Protocol | Agent listings on app.virtuals.io and the public Virtuals API | A listed agent with a wallet address, public output and a named creator |

## What the sweep never does

- No sign-ups, no waitlists, no connector registrations, no purchases.
- No messages, posts, issues or emails to agents, owners or platforms.
- No reading of anything behind a login.
- No record for an agent without all three parts of the public-door rule.
