import fs from "node:fs";
import path from "node:path";

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

// GitHub Issue Form body looks like:
// ### Some Label
// value
function parseIssueBody(body) {
  const re = /^###\s+(.*?)\n([\s\S]*?)(?=\n###\s+|\n?$)/gm;
  const out = {};
  let m;
  while ((m = re.exec(body)) !== null) {
    const rawLabel = m[1].trim();
    const key = normalizeKey(rawLabel);
    const value = (m[2] || "").trim();
    out[key] = value === "_No response_" ? "" : value;
  }
  return out;
}

function normalizeKey(label) {
  // Normalize labels to stable keys: lowercase, underscores
  return label
    .toLowerCase()
    .replace(/[“”‘’"']/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function slugify(input) {
  const s = (input || "").trim().toLowerCase();
  if (!s) return "";
  return s
    .replace(/[“”‘’"']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Minimal templating: {{key}} and {{#key}}...{{/key}} optional blocks
function renderTemplate(tpl, data) {
  tpl = tpl.replace(/{{#([a-zA-Z0-9_]+)}}([\s\S]*?){{\/\1}}/g, (_, key, block) => {
    const v = data[key];
    if (!v) return "";
    return block.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, k) => (data[k] ?? ""));
  });

  return tpl.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => (data[key] ?? ""));
}

function writeGithubOutput(name, value) {
  const outPath = process.env.GITHUB_OUTPUT;
  if (!outPath) return;
  fs.appendFileSync(outPath, `${name}=${value}\n`, "utf8");
}

// Try multiple possible keys, return the first non-empty value
function pick(fields, keys) {
  for (const k of keys) {
    const v = (fields[k] || "").trim();
    if (v) return v;
  }
  return "";
}

// Extract link title from a markdown bullet like: - [Title](...)
// Returns "" if not match.
function extractBulletTitle(line) {
  const m = line.match(/^\s*-\s*\[([^\]]+)\]\([^)]+\)\s*$/);
  return m ? m[1].trim() : "";
}

// Detect link style in index:
// - relative folder links: (./slug/)
// - absolute docs links: (/organization/integrations/.../slug/)
// Default to relative.
function detectLinkStyle(indexText) {
  const lines = indexText.split("\n");
  for (const line of lines) {
    if (line.trim().startsWith("- [")) {
      if (line.includes("](/organization/integrations/")) return "absolute";
      if (line.includes("](./")) return "relative";
    }
  }
  return "relative";
}

function buildLinkLine(style, category, slug, title) {
  if (style === "absolute") {
    return `- [${title}](/organization/integrations/${category}/${slug}/)`;
  }
  // relative
  return `- [${title}](./${slug}/)`;
}

// Insert into an already-alphabetical bullet list (stable insertion point).
// We do NOT reorder existing lines; we just insert at the right spot.
function insertAlphabetically(lines, newLine) {
  const newTitle = extractBulletTitle(newLine);
  if (!newTitle) return { lines, changed: false };

  // Identify all bullet lines in the file
  const bulletIdx = [];
  const bulletTitles = [];
  for (let i = 0; i < lines.length; i++) {
    const t = extractBulletTitle(lines[i]);
    if (t) {
      bulletIdx.push(i);
      bulletTitles.push(t);
    }
  }

  // If no bullets exist, append at end with spacing
  if (bulletIdx.length === 0) {
    const appended = [...lines];
    if (appended.length && appended[appended.length - 1].trim() !== "") appended.push("");
    appended.push(newLine);
    appended.push("");
    return { lines: appended, changed: true };
  }

  // Find insertion point among existing bullets by title comparison
  const cmp = (a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base", numeric: true });

  // Prevent duplicate (exact line already present)
  if (lines.some((l) => l.trim() === newLine.trim())) return { lines, changed: false };

  let insertAt = bulletIdx[bulletIdx.length - 1] + 1; // default: after last bullet
  for (let j = 0; j < bulletTitles.length; j++) {
    if (cmp(bulletTitles[j], newTitle) > 0) {
      insertAt = bulletIdx[j];
      break;
    }
  }

  const out = [...lines];
  out.splice(insertAt, 0, newLine);
  return { lines: out, changed: true };
}

// -------- Template (embedded; no new templates/ folder) --------
const TEMPLATE = `---
title: {{title}}
---

{{learn_about_sentence}}

{{overview}}

**Maintained by:** {{maintainedby}}

**Support:** {{supportcontact}}

---

## Install and Configure

{{installsteps}}

---

## Configuration

{{configurationdetails}}

{{#verify}}
## Verify It Works

{{verify}}
{{/verify}}

{{#troubleshooting}}
## Troubleshooting

{{troubleshooting}}
{{/troubleshooting}}

{{#include_platform_link}}
---

For more details, check out our [Integration Platform documentation](/organization/integrations/integration-platform/).
{{/include_platform_link}}
`;

// ------------------ main ------------------
const issueBodyPath = process.argv[2];
if (!issueBodyPath) fail("Usage: node scripts/generate-integration-doc.mjs <issue-body-file>");

const issueBody = fs.readFileSync(issueBodyPath, "utf8");
const fields = parseIssueBody(issueBody);

// REQUIRED fields (per your requirement)
const title = pick(fields, ["title", "integration_name", "integration_name_title", "integration"]);
const learn_about_sentence = pick(fields, ["learn_about_sentence", "lead_sentence_learn_about", "lead_sentence_learn_about_sentence", "lead_sentence"]);
const overview = pick(fields, ["overview"]);
const maintainedby = pick(fields, ["maintainedby", "maintained_by"]);
const supportcontact = pick(fields, ["supportcontact", "support_contact"]);
const installsteps = pick(fields, ["installsteps", "install_and_configure_steps", "install_and_configure"]);
const configurationdetails = pick(fields, ["configurationdetails", "configuration_details", "configuration"]);

// OPTIONAL fields
const slugInput = pick(fields, ["slug"]);
const categoryInput = pick(fields, ["category", "integration_category"]);
const verify = pick(fields, ["verify", "verify_it_works"]);
const troubleshooting = pick(fields, ["troubleshooting"]);
const includePlatformRaw = pick(fields, ["include_platform_link"]);
const include_platform_link =
  includePlatformRaw.toLowerCase().includes("integration platform") ||
  includePlatformRaw.toLowerCase().includes("add");

// Defaults
const category = (categoryInput || "other").trim() || "other";
const slug = slugInput ? slugify(slugInput) : slugify(title);

if (!title || !learn_about_sentence || !overview || !maintainedby || !supportcontact || !installsteps || !configurationdetails) {
  fail(
    [
      "Missing required fields. Required: title, learn_about_sentence, overview, maintainedby, supportcontact, installsteps, configurationdetails.",
      `Parsed keys: ${Object.keys(fields).join(", ")}`,
      "Tip: Parsed keys are derived from the Issue Form field labels (the 'label:' text).",
    ].join("\n")
  );
}
if (!slug) fail("Could not derive a slug. Provide slug, or ensure title is valid.");

const categoryDir = path.join("docs", "organization", "integrations", category);
if (!fs.existsSync(categoryDir)) {
  fail(`Category folder does not exist: ${categoryDir}`);
}

// Folder-based integration doc structure:
// docs/organization/integrations/<category>/<slug>/index.mdx
const integrationDir = path.join(categoryDir, slug);
const docPath = path.join(integrationDir, "index.mdx");

fs.mkdirSync(integrationDir, { recursive: true });

if (fs.existsSync(docPath)) {
  fail(`Doc already exists: ${docPath}`);
}

const rendered = renderTemplate(TEMPLATE, {
  title,
  learn_about_sentence,
  overview,
  maintainedby,
  supportcontact,
  installsteps,
  configurationdetails,
  verify,
  troubleshooting,
  include_platform_link: include_platform_link ? "yes" : "",
});

fs.writeFileSync(docPath, rendered, "utf8");
console.log(`Wrote ${docPath}`);

// Update category index (index.mdx preferred, fallback index.md)
const indexMdx = path.join(categoryDir, "index.mdx");
const indexMd = path.join(categoryDir, "index.md");
const indexPath = fs.existsSync(indexMdx) ? indexMdx : (fs.existsSync(indexMd) ? indexMd : null);

if (!indexPath) {
  console.warn(`No category index found at ${indexMdx} or ${indexMd}; skipping index update.`);
} else {
  const before = fs.readFileSync(indexPath, "utf8");
  const style = detectLinkStyle(before);
  const linkLine = buildLinkLine(style, category, slug, title);

  if (before.includes(linkLine)) {
    console.log(`Index already contains link: ${linkLine}`);
  } else {
    const lines = before.split("\n");
    const { lines: updated, changed } = insertAlphabetically(lines, linkLine);

    if (changed) {
      fs.writeFileSync(indexPath, updated.join("\n"), "utf8");
      console.log(`Updated ${indexPath} (inserted alphabetically)`);
    } else {
      console.warn(`Did not update index (no changes). Intended line: ${linkLine}`);
    }
  }
}

// Expose outputs for workflow branch naming
writeGithubOutput("slug", slug);
writeGithubOutput("category", category);
