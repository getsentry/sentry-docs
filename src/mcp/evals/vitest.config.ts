import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    root: 'src/mcp/evals',
    include: ['**/*.eval.ts'],
    reporters: ['vitest-evals/reporter'],
    setupFiles: ['./setup.ts'],
  },
});
