import {config} from 'dotenv';

// Load environment variables from .env.local or .env
config({path: '.env.local'});
config({path: '.env'});

// Verify ANTHROPIC_API_KEY is set
if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    'Warning: ANTHROPIC_API_KEY is not set. Evals will fail without it.\n' +
      'Set it in .env.local: ANTHROPIC_API_KEY=sk-ant-...'
  );
}
