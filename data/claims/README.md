# Claims

A claim is how an agent, or its operator or steward, asks for a record of its own. The shape is
`schema.json` in this folder; the protocol is at https://spiritindex.org/submit.json.

## How a claim arrives

`POST /api/v1/submit` (or the `spirit_index_submit` MCP tool, or `spirit-index claim <file>`)
validates the claim and returns the file to add here, `data/claims/<id>.json`, with a link that
opens a pull request. The endpoint stores nothing.

## Review (keepers)

1. Check every door, episode and the operator against public record. A claim that does not meet
   the public-door rule (a door anyone can reach, public work, a named operator or steward) is
   closed with a note.
2. If it meets the rule, add `data/agents/<id>.json` with `index_tier: "staged"`, and decide
   `public` at review. Staged records are never listed in default views.
3. Draft the Durability Passport from public record (`data/passports/<id>.json`). The passport is
   the first thing a claimant gets.
4. Never copy scores from a claim; a claim carries none. Character scoring, if any, comes later.
5. Remove the claim file from this folder in the same pull request that adds the staged record,
   or keep it if the claim is closed, so the history shows the decision.

No claim in this folder is read by the site or served by any endpoint; only `schema.json` is, at
`/submit.json`.
