import {promises as fs} from "node:fs";
import path from "node:path";

export const MD_EXPORTS_ROOT = path.join(process.cwd(), "public", "md-exports");
export const DOCS_PUBLIC_BASE = process.env.DOCS_PUBLIC_BASE ?? "https://docs.sentry.io";

export function normalizeDocPath(inputPath: string): string {
  const trimmed = inputPath.trim();
  const withoutLeadingSlash = trimmed.replace(/^\/+/, "");
  const normalized = path.normalize(withoutLeadingSlash);

  if (normalized.startsWith("..")) {
    throw new Error("Invalid doc path: outside allowed directory");
  }

  return normalized;
}

export function buildDocUrl(docPath: string): string {
  const normalized = normalizeDocPath(docPath);
  const base = DOCS_PUBLIC_BASE.endsWith("/") ? DOCS_PUBLIC_BASE : `${DOCS_PUBLIC_BASE}/`;
  const url = new URL(normalized, base);
  return url.toString();
}

export async function readDocContent(docPath: string): Promise<string> {
  const normalized = normalizeDocPath(docPath);
  const localPath = path.join(MD_EXPORTS_ROOT, normalized);

  try {
    const file = await fs.readFile(localPath, "utf8");
    return file;
  } catch (localError) {
    const url = buildDocUrl(normalized);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch doc from ${url}: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  }
}