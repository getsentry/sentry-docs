interface SnippetConfig {
  defaultExpanded: boolean;
  generators: Record<string, {syntax: string; title: string}>;
  languages: GeneratorNames[] | null;
}

export type GeneratorNames = keyof typeof SNIPPET_GENERATORS;

const SNIPPET_GENERATORS = {
  curl_bash: {
    title: 'cURL (bash)',
    syntax: 'bash',
  },
  curl_powershell: {
    title: 'cURL (PowerShell)',
    syntax: 'powershell',
  },
  curl_cmd: {
    title: 'cURL (CMD)',
    syntax: 'bash',
  },
  csharp: {
    title: 'C#',
    syntax: 'csharp',
  },
  node_axios: {
    title: 'NodeJs (axios)',
    syntax: 'javascript',
  },
  python: {
    title: 'Python',
    syntax: 'python',
  },
  php: {
    title: 'PHP',
    syntax: 'php',
  },
};

export const getSnippetConfig = (
  languages: SnippetConfig['languages'] = null
): SnippetConfig => {
  return {
    defaultExpanded: true,
    generators: SNIPPET_GENERATORS,
    languages,
  };
};
