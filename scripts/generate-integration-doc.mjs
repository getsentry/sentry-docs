import fs from "node:fs";
import path from "node:path";

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

// Parses GitHub Issue Form body: "### Field\nvalue"
function parseIssueBody(body) {
  const re = /^###\s+(.*?)\n([\s\S]*?)(?=\n###\s+|\n?$)/gm;
  const out = {};
  let m;
  while ((m = re.exec(body)) !== null) {
    const key = m[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const value = m[2].trim();
    out[key] = value === "_No response_" ? "" : value;
  }
  return out;
}

function slugify(input) {
  const s = (input || "").trim().toLowerCase();
  if (!s) return "";
  return s
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Tiny templater: {{key}} and {{#key}}...{{/key}} for optional blocks
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

const issueBodyPath = process.argv[2];
if (!issueBodyPath) fail("Usage: node scripts/generate-integration-doc.mjs <issue-body-file>");

const issueBody = fs.readFileSync(issueBodyPath, "utf8");
const fields = parseIssueBody(issueBody);

/**
 * IMPORTANT:
 * These keys depend on the exact *labels* in your issue form.
 * If your labels match the ones below, you're good.
 * If not, tell me your label text and I’ll map them cleanly.
 */
const title = fields.integration_name || fields.title;
const learn_about_sentence = fields.lead_sentence_learn_about || fields.learn_about_sentence;
const overview = fields.overview;
const maintainedby = fields.maintainedby || fields.maintained_by;
const supportcontact = fields.supportcontact || fields.support_contact;
const installsteps = fields.installsteps || fields.install_and_configure_steps || fields.install_and_configure_steps_;
const configurationdetails = fields.configurationdetails || fields.configuration_details;

const verify = fields.verify || fields.verify_it_works;
const troubleshooting = fields.troubleshooting;
const include_platform_link =
  (fields.include_platform_link || "").toLowerCase().includes("integration platform");

const category = (fields.category || fields.integration_category || "other").trim() || "other";
const slug = (fields.slug || "").trim() ? slugify(fields.slug) : slugify(title);

if (!title || !learn_about_sentence || !overview || !maintainedby || !supportcontact || !installsteps || !configurationdetails) {
  fail(
    `Missing required fields. I parsed these keys: ${Object.keys(fields).join(", ")}\n` +
    `Tip: field keys are derived from your issue-form labels.`
  );
}
if (!slug) fail("Could not derive a slug. Provide slug, or ensure title is non-empty.");

const categoryDir = path.join("docs", "organization", "integrations", category);
if (!fs.existsSync(categoryDir)) {
  fail(`Category folder does not exist: ${categoryDir}`);
}

// Existing structure: single file per integration in the category folder
const docPath = path.join(categoryDir, `${slug}.mdx`);
if (fs.existsSync(docPath)) fail(`Doc already exists: ${docPath}`);

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

// Update existing category index page (index.mdx preferred, fallback index.md)
const indexMdx = path.join(categoryDir, "index.mdx");
const indexMd = path.join(categoryDir, "index.md");
const indexPath = fs.existsSync(indexMdx) ? indexMdx : (fs.existsSync(indexMd) ? indexMd : null);

if (!indexPath) {
  console.warn(`No category index found at ${indexMdx} or ${indexMd}; skipping index update.`);
} else {
  const before = fs.readFileSync(indexPath, "utf8");

  // Use the most common relative link style for file-based pages:
  // - [Title](/organization/integrations/<category>/<slug>/) sometimes works too,
  // but this is safe relative-in-folder for many index pages:
  const linkLine = `- [${title}](./${slug}/)`;

  if (!before.includes(linkLine)) {
    const lines = before.split("\n");

    // Insert after the last bullet list item "- ["
    let insertAt = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim().startsWith("- [")) {
        insertAt = i + 1;
        break;
      }
    }
    if (insertAt === -1) {
      // If there wasn't a list, append a new one
      lines.push("", linkLine, "");
    } else {
      lines.splice(insertAt, 0, linkLine);
    }

    fs.writeFileSync(indexPath, lines.join("\n"), "utf8");
    console.log(`Updated ${indexPath}`);
  } else {
    console.log(`Index already contains link: ${linkLine}`);
  }
}

// Expose slug for branch naming in workflow
writeGithubOutput("slug", slug);
writeGithubOutput("category", category);

