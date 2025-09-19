#!/usr/bin/env node
import {promises as fs} from "node:fs";
import path from "node:path";

const MD_EXPORTS_ROOT = path.join(process.cwd(), "public", "md-exports");
const OUTPUT_PATH = path.join(process.cwd(), "public", "search-index.json");
const MAX_CONTENT_LENGTH = 4000;

const SEGMENT_LABELS = new Map(
  Object.entries({
    platforms: "Platform",
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python",
    android: "Android",
    apple: "Apple",
    react: "React",
    "react-native": "React Native",
    node: "Node",
    nodejs: "Node.js",
    dotnet: ".NET",
    php: "PHP",
    java: "Java",
    swift: "Swift",
    kotlin: "Kotlin",
    guides: "Guides",
    install: "Install",
    tracing: "Tracing",
    performance: "Performance",
  })
);

function titleCase(segment) {
  const lower = segment.toLowerCase();
  if (SEGMENT_LABELS.has(lower)) {
    return SEGMENT_LABELS.get(lower);
  }

  return segment
    .split(/[-_]/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function* walkMarkdownFiles(root) {
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    const dirents = await fs.readdir(current, {withFileTypes: true});
    for (const dirent of dirents) {
      const fullPath = path.join(current, dirent.name);
      if (dirent.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (dirent.isFile() && dirent.name.endsWith(".md")) {
        yield fullPath;
      }
    }
  }
}

function extractTitle(content) {
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    if (line.startsWith("#")) {
      return line.replace(/^#+\s*/, "").trim() || null;
    }
  }
  return null;
}

function buildHierarchy(relativePath) {
  const segments = relativePath.split("/");
  const fileName = segments.pop() || "";
  const baseName = fileName.replace(/\.md$/i, "");
  const pathSegments = [...segments, baseName];
  const labels = pathSegments.map(titleCase).filter(Boolean);
  return labels;
}

function toSummary(content) {
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }
    return trimmed.slice(0, 200);
  }
  return "";
}

async function main() {
  const entries = [];
  for await (const filePath of walkMarkdownFiles(MD_EXPORTS_ROOT)) {
    const relativePath = path.relative(MD_EXPORTS_ROOT, filePath).replace(/\\/g, "/");
    const content = await fs.readFile(filePath, "utf8");
    const truncatedContent = content.slice(0, MAX_CONTENT_LENGTH);
    const title = extractTitle(content) ?? titleCase(path.basename(filePath, ".md"));
    const hierarchy = buildHierarchy(relativePath);
    const summary = toSummary(truncatedContent);

    entries.push({
      path: relativePath,
      title,
      hierarchy,
      summary,
      content: truncatedContent,
    });
  }

  entries.sort((a, b) => a.path.localeCompare(b.path));

  const payload = {
    generatedAt: new Date().toISOString(),
    total: entries.length,
    entries,
  };

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Generated ${entries.length} entries in ${OUTPUT_PATH}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
