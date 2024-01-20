import getAppRegistry from 'sentry-docs/build/appRegistry';
import {CliChecksumTableClient} from './cliChecksumTableClient';

export async function CliChecksumTable() {
  const appRegistry = await getAppRegistry();
  const appData = appRegistry && appRegistry.data && appRegistry.data['sentry-cli'];
  if (!appData) {
    return null;
  }

  const version = appData.version;
  const files = Object.entries(appData.files || []).map(([name, file]) => ({
    name,
    checksums: Object.entries(file.checksums).map(([algo, value]) => ({
      name: algo,
      value,
    })),
  }));

  return <CliChecksumTableClient version={version} files={files} />;
}
