import {T, Var} from 'gt-next';

import getAppRegistry from 'sentry-docs/build/appRegistry';

import styles from './styles.module.scss';

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

  return (
    <table className={styles.Table}>
      <thead>
        <T>
          <tr>
            <th>
              Filename <Var name="version">(v{version})</Var>
            </th>
            <th>Integrity Checksum</th>
          </tr>
        </T>
      </thead>
      <tbody>
        {files
          .filter(file => !file.name.endsWith('.tgz'))
          .map(file => (
            <tr key={file.name}>
              <td className={styles.FileName}>{file.name}</td>
              <td className={styles.Checksum}>
                <code className={styles.ChecksumValue}>
                  {`sha384-${file.checksums.find(c => c.name === 'sha256-hex')?.value}`}
                </code>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
