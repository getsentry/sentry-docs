import {readFileSync} from 'fs';

const vercelConfig = JSON.parse(readFileSync('./vercel.json', 'utf8'));

if (vercelConfig.redirects && vercelConfig.redirects.length > 0) {
  throw new Error(
    '🔴 ERROR: vercel.json redirects are not recommended.\n       👉 Please add dynamic redirects to redirects.js and static redirects to ./src/middleware.ts'
  );
}
