#!/usr/bin/env node

/**
 * spirit-index CLI
 *
 * Query autonomous agent scores from the Spirit Index.
 *
 * Usage:
 *   spirit-index lookup <id>              Look up a single agent by ID
 *   spirit-index search <query>           Search agents by name/network
 *   spirit-index top [--limit=N]          Show top-scoring agents (default: 10)
 *   spirit-index compare <id1> <id2>      Compare two agents side by side
 *   spirit-index badge <id>               Get the badge URL for an agent
 *   spirit-index --help                   Show this help message
 */

const API_BASE = "https://spiritindex.org/api/v1";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function die(msg, code = 1) {
  process.stderr.write(`Error: ${msg}\n`);
  process.exit(code);
}

function pad(str, len, align = "left") {
  const s = String(str);
  if (s.length >= len) return s.slice(0, len);
  const diff = len - s.length;
  if (align === "right") return " ".repeat(diff) + s;
  if (align === "center") {
    const left = Math.floor(diff / 2);
    return " ".repeat(left) + s + " ".repeat(diff - left);
  }
  return s + " ".repeat(diff);
}

function hr(len) {
  return "-".repeat(len);
}

function gradeColor(grade) {
  // ANSI colors for terminal output
  if (grade.startsWith("A")) return "\x1b[32m"; // green
  if (grade.startsWith("B")) return "\x1b[33m"; // yellow
  if (grade.startsWith("C")) return "\x1b[36m"; // cyan
  if (grade.startsWith("D")) return "\x1b[35m"; // magenta
  return "\x1b[31m"; // red
}

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

function colorGrade(grade) {
  return `${gradeColor(grade)}${BOLD}${grade}${RESET}`;
}

function colorScore(pct) {
  const grade = letterGrade(pct);
  return `${gradeColor(grade)}${pct}%${RESET}`;
}

function letterGrade(pct) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

async function apiFetch(path) {
  const url = `${API_BASE}${path}`;
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    die(`Could not reach ${url} — ${err.message}`);
  }

  if (!res.ok) {
    let body;
    try {
      body = await res.json();
    } catch {
      body = { error: res.statusText };
    }
    if (res.status === 404) {
      return { _notFound: true, ...body };
    }
    die(`API returned ${res.status}: ${body.error || res.statusText}`);
  }

  return res.json();
}

async function apiPost(path, body) {
  const url = `${API_BASE}${path}`;
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    die(`Could not reach ${url} — ${err.message}`);
  }

  if (!res.ok) {
    let data;
    try {
      data = await res.json();
    } catch {
      data = { error: res.statusText };
    }
    die(`API returned ${res.status}: ${data.error || res.statusText}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

async function cmdLookup(id) {
  if (!id) die("Usage: spirit-index lookup <id>");

  const data = await apiFetch(`/scores/${encodeURIComponent(id)}`);

  if (data._notFound) {
    die(`Agent "${id}" not found. Use "spirit-index search <query>" to find agents.`);
  }

  const a = data.agent;
  const dims = a.dimensions || {};

  console.log();
  console.log(`${BOLD}${a.name}${RESET}  ${DIM}(${a.id})${RESET}`);
  if (a.tagline) console.log(`${DIM}${a.tagline}${RESET}`);
  console.log();

  // Score header
  console.log(`  Score:     ${colorScore(a.score)} ${colorGrade(a.grade)}`);
  console.log(`  Tier:      ${a.tier}`);
  console.log(`  Network:   ${a.network}`);
  console.log(`  Status:    ${a.status}`);
  console.log(`  Category:  ${a.category}`);
  if (a.classification) console.log(`  Class:     ${a.classification}`);
  if (a.inception_date) console.log(`  Inception: ${a.inception_date}`);
  if (a.website) console.log(`  Website:   ${a.website}`);
  console.log(`  URL:       ${a.url}`);
  console.log(`  Badge:     ${a.badge}`);
  console.log();

  // Dimensions table
  const dimKeys = Object.keys(dims);
  if (dimKeys.length > 0) {
    console.log(`${BOLD}  Dimensions${RESET}`);
    console.log(`  ${hr(50)}`);
    for (const key of dimKeys) {
      const d = dims[key];
      const val = d.value !== null && d.value !== undefined ? d.value : "-";
      const conf = d.confidence ? ` (${d.confidence})` : "";
      const label = d.label || key;
      console.log(`  ${pad(label, 28)} ${pad(String(val), 6, "right")}${DIM}${conf}${RESET}`);
    }
    console.log();
  }

  // Scoring breakdown
  if (a.scoring) {
    const s = a.scoring;
    console.log(`${BOLD}  Scoring${RESET}`);
    console.log(`  ${hr(40)}`);
    console.log(`  Comparable:  ${s.comparable_score} / ${s.comparable_max} (${s.comparable_pct}%)`);
    console.log(`  Coverage:    ${s.coverage}`);
    console.log(`  Total raw:   ${s.total_raw}`);
    console.log();
  }

  // Curator notes
  if (a.curator_notes) {
    console.log(`${BOLD}  Curator Notes${RESET}`);
    console.log(`  ${hr(40)}`);
    console.log(`  ${a.curator_notes}`);
    console.log();
  }

  // Score history
  if (a.score_history && a.score_history.length > 0) {
    console.log(`${BOLD}  Score History${RESET}`);
    console.log(`  ${hr(40)}`);
    for (const entry of a.score_history.slice(-5)) {
      const date = entry.date || "—";
      const score = entry.score !== undefined ? `${entry.score}%` : "—";
      console.log(`  ${pad(date, 14)} ${score}`);
    }
    console.log();
  }
}

async function cmdSearch(query) {
  if (!query) die("Usage: spirit-index search <query>");

  // The API doesn't have a text search endpoint, so we fetch all scores
  // and filter client-side by name, network, or category.
  const data = await apiFetch("/scores?include=all");

  if (!data.agents || data.agents.length === 0) {
    die("No agents found in the index.");
  }

  const q = query.toLowerCase();
  const matches = data.agents.filter((a) => {
    return (
      a.name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      (a.network && a.network.toLowerCase().includes(q)) ||
      (a.category && a.category.toLowerCase().includes(q))
    );
  });

  if (matches.length === 0) {
    console.log(`\nNo agents matching "${query}"\n`);
    return;
  }

  console.log();
  console.log(`${BOLD}Search results for "${query}"${RESET}  (${matches.length} found)`);
  console.log();
  printAgentTable(matches);
}

async function cmdTop(limit) {
  const data = await apiFetch(`/scores?sort=score&limit=${limit}`);

  if (!data.agents || data.agents.length === 0) {
    die("No agents found in the index.");
  }

  console.log();
  console.log(`${BOLD}Spirit Index — Top ${data.agents.length} Agents${RESET}`);
  console.log();
  printAgentTable(data.agents, true);

  if (data.meta) {
    console.log(`${DIM}  ${data.meta.listed} listed / ${data.meta.total} total agents | threshold: ${data.meta.threshold}${RESET}`);
    console.log();
  }
}

async function cmdCompare(id1, id2) {
  if (!id1 || !id2) die("Usage: spirit-index compare <id1> <id2>");

  // Fetch both agents in parallel
  const [data1, data2] = await Promise.all([
    apiFetch(`/scores/${encodeURIComponent(id1)}`),
    apiFetch(`/scores/${encodeURIComponent(id2)}`),
  ]);

  if (data1._notFound) die(`Agent "${id1}" not found.`);
  if (data2._notFound) die(`Agent "${id2}" not found.`);

  const a = data1.agent;
  const b = data2.agent;

  const colW = 22;
  const labelW = 28;

  console.log();
  console.log(`${BOLD}Comparison${RESET}`);
  console.log();

  // Header
  console.log(
    `  ${pad("", labelW)} ${pad(a.name, colW, "center")} ${pad(b.name, colW, "center")}`
  );
  console.log(`  ${hr(labelW + colW * 2 + 2)}`);

  // Basic fields
  const rows = [
    ["Score", `${a.score}% ${a.grade}`, `${b.score}% ${b.grade}`],
    ["Tier", a.tier, b.tier],
    ["Network", a.network, b.network],
    ["Status", a.status, b.status],
    ["Category", a.category, b.category],
  ];

  for (const [label, v1, v2] of rows) {
    console.log(
      `  ${pad(label, labelW)} ${pad(v1, colW, "center")} ${pad(v2, colW, "center")}`
    );
  }

  console.log(`  ${hr(labelW + colW * 2 + 2)}`);

  // Dimensions comparison
  const aDims = a.dimensions || {};
  const bDims = b.dimensions || {};
  const allDimKeys = [
    ...new Set([...Object.keys(aDims), ...Object.keys(bDims)]),
  ];

  if (allDimKeys.length > 0) {
    console.log(`  ${BOLD}${pad("Dimensions", labelW)}${RESET}`);

    for (const key of allDimKeys) {
      const dA = aDims[key];
      const dB = bDims[key];
      const label = (dA && dA.label) || (dB && dB.label) || key;
      const vA = dA ? (dA.value !== null && dA.value !== undefined ? String(dA.value) : "-") : "-";
      const vB = dB ? (dB.value !== null && dB.value !== undefined ? String(dB.value) : "-") : "-";

      // Highlight winner
      const nA = parseFloat(vA);
      const nB = parseFloat(vB);
      let dispA = vA;
      let dispB = vB;
      if (!isNaN(nA) && !isNaN(nB)) {
        if (nA > nB) dispA = `${BOLD}${vA}${RESET}`;
        else if (nB > nA) dispB = `${BOLD}${vB}${RESET}`;
      }

      console.log(
        `  ${pad(label, labelW)} ${pad(dispA, colW, "center")} ${pad(dispB, colW, "center")}`
      );
    }
  }

  console.log();
}

async function cmdBadge(id) {
  if (!id) die("Usage: spirit-index badge <id>");

  const data = await apiFetch(`/scores/${encodeURIComponent(id)}`);

  if (data._notFound) {
    die(`Agent "${id}" not found.`);
  }

  const a = data.agent;

  console.log();
  console.log(`${BOLD}Badge URLs for ${a.name}${RESET}`);
  console.log();
  console.log(`  Default (compact dark):`);
  console.log(`    ${a.badge}`);
  console.log();
  console.log(`  Compact light:`);
  console.log(`    ${a.badge}?theme=light`);
  console.log();
  console.log(`  Minimal dark:`);
  console.log(`    ${a.badge}?style=minimal`);
  console.log();
  console.log(`  Minimal light:`);
  console.log(`    ${a.badge}?style=minimal&theme=light`);
  console.log();
  console.log(`${BOLD}Markdown${RESET}`);
  console.log(`  [![Spirit Index](${a.badge})](${a.url})`);
  console.log();
  console.log(`${BOLD}HTML${RESET}`);
  console.log(`  <a href="${a.url}"><img src="${a.badge}" alt="Spirit Index" /></a>`);
  console.log();
}

// ---------------------------------------------------------------------------
// Table renderer
// ---------------------------------------------------------------------------

function printAgentTable(agents, showRank = false) {
  const cols = {
    rank: 4,
    name: 24,
    score: 8,
    grade: 6,
    tier: 10,
    network: 22,
  };

  // Header
  const header = [
    showRank ? pad("#", cols.rank, "right") : null,
    pad("Name", cols.name),
    pad("Score", cols.score, "right"),
    pad("Grade", cols.grade, "center"),
    pad("Tier", cols.tier),
    pad("Network", cols.network),
  ]
    .filter(Boolean)
    .join(" ");

  const totalW = header.length;

  console.log(`  ${DIM}${header}${RESET}`);
  console.log(`  ${hr(totalW)}`);

  for (let i = 0; i < agents.length; i++) {
    const a = agents[i];
    const grade = a.grade || letterGrade(a.score);
    const row = [
      showRank ? pad(String(i + 1), cols.rank, "right") : null,
      pad(a.name, cols.name),
      pad(`${a.score}%`, cols.score, "right"),
      pad(grade, cols.grade, "center"),
      pad(a.tier || "", cols.tier),
      pad(a.network || "", cols.network),
    ]
      .filter(Boolean)
      .join(" ");

    console.log(`  ${row}`);
  }

  console.log();
}

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------

function printHelp() {
  console.log(`
${BOLD}spirit-index${RESET} — Query autonomous agent scores from the Spirit Index

${BOLD}USAGE${RESET}
  spirit-index <command> [options]

${BOLD}COMMANDS${RESET}
  lookup <id>              Look up a single agent by ID
  search <query>           Search agents by name, network, or category
  top [--limit=N]          Show top-scoring agents (default: 10)
  compare <id1> <id2>      Compare two agents side by side
  badge <id>               Get badge embed URLs for an agent

${BOLD}OPTIONS${RESET}
  --help, -h               Show this help message
  --version, -v            Show version

${BOLD}EXAMPLES${RESET}
  spirit-index lookup botto
  spirit-index search "virtuals"
  spirit-index top --limit=20
  spirit-index compare botto aixbt
  spirit-index badge botto

${BOLD}API${RESET}
  https://spiritindex.org/api/v1/scores
  https://spiritindex.org/api/v1/scores/<id>

${DIM}https://spiritindex.org${RESET}
`);
}

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = [];
  const flags = {};

  for (const arg of argv) {
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq !== -1) {
        flags[arg.slice(2, eq)] = arg.slice(eq + 1);
      } else {
        flags[arg.slice(2)] = true;
      }
    } else if (arg.startsWith("-") && arg.length === 2) {
      flags[arg.slice(1)] = true;
    } else {
      args.push(arg);
    }
  }

  return { args, flags };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { args, flags } = parseArgs(process.argv.slice(2));

  if (flags.help || flags.h) {
    printHelp();
    process.exit(0);
  }

  if (flags.version || flags.v) {
    console.log("spirit-index 0.1.0");
    process.exit(0);
  }

  const command = args[0];

  if (!command) {
    printHelp();
    process.exit(0);
  }

  switch (command) {
    case "lookup":
      await cmdLookup(args[1]);
      break;

    case "search":
      await cmdSearch(args.slice(1).join(" "));
      break;

    case "top": {
      const limit = parseInt(flags.limit) || 10;
      await cmdTop(limit);
      break;
    }

    case "compare":
      await cmdCompare(args[1], args[2]);
      break;

    case "badge":
      await cmdBadge(args[1]);
      break;

    default:
      die(
        `Unknown command: "${command}". Run "spirit-index --help" for usage.`
      );
  }
}

main().catch((err) => {
  die(err.message);
});
