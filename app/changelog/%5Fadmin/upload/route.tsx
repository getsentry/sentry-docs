import crypto from 'crypto';

import {Storage} from '@google-cloud/storage';
import {GET as sessionHandler} from 'app/api/auth/[...nextauth]/route';
import {NextRequest} from 'next/server';
import {getServerSession} from 'next-auth/next';

const handler = async function handler(req: NextRequest) {
  const session = await getServerSession(sessionHandler);

  if (!session) {
    return Response.json({error: 'Unauthorized'}, {status: 401});
  }

  const {method} = req;
  const {searchParams} = new URL(req.url);
  if (method !== 'GET') {
    return Response.json({error: 'Method not allowed'}, {status: 405});
  }
  const file = searchParams.get('file');

  const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: `${process.env.GOOGLE_PRIVATE_KEY}`.split(String.raw`\n`).join('\n'),
    },
  });
  const bucket = storage.bucket(`${process.env.GOOGLE_BUCKET_NAME}`);
  const randomFilename = `${crypto.randomBytes(5).toString('base64url')}-${file}`;
  const gcsFile = bucket.file(randomFilename as string);

  const options = {
    expires: Date.now() + 5 * 60 * 1000, //  5 minutes,
    fields: {'x-goog-meta-source': `${process.env.GOOGLE_PROJECT_ID}`},
    destination: randomFilename,
  };

  const [response] = await gcsFile.generateSignedPostPolicyV4(options);

  return Response.json({response, options});
};

export {handler as GET, handler as POST};
