import {getChangelogsUncached} from './src/server/utils';

try {
  checkChanges();
} catch (e) {
  console.error(e);
  // build in case of errors
  process.exit(1);
}

async function checkChanges() {
  const {hash, changelogs} = await getChangelogsUncached();
  console.log({changelogs});
  // extract the hash from the body tag of the live site
  // example: <body data-content-hash="055114ed2b57063a941b3433ea44074b53e795891fe603cc87cf24b96b32f3bd">
  const prodHash = await fetch('https://sentry.io/changelog/')
    .then(r => r.text())
    .then(html => {
      const match = html.match(/data-content-hash="([^"]+)"/);
      return match ? match[1] : null;
    });

  if (prodHash === null) {
    console.error('could not find changelogs hash on on live changelog page');
    // build anyway since we are not sure
    process.exit(1);
  }

  if (prodHash !== hash) {
    console.info('⚠️  changelogs have changed since last deployment');
    // should build
    process.exit(1);
  }
  console.info('changelogs are up to date');
  // skip build
  process.exit(0);
}
