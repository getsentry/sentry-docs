export interface SearchResult {
  id: string;
  relevance: number;
  snippet: string;
  title: string;
  url: string;
}

export interface SearchResponse {
  results: SearchResult[];
  error?: string;
}

export interface DocTreeNode {
  path: string;
  title: string;
  children?: DocTreeNode[];
}

export interface PlatformInfo {
  slug: string;
  title: string;
  guides?: Array<{
    slug: string;
    title: string;
  }>;
  guidesCount?: number;
}
