import getPackageRegistry from 'sentry-docs/build/packageRegistry';

import styles from './styles.module.scss';

export async function JsBundleList() {
  const packageRegistry = await getPackageRegistry();
  const javascriptSdk =
    packageRegistry.data && packageRegistry.data['sentry.javascript.browser'];
  if (!javascriptSdk || !javascriptSdk.files) {
    return null;
  }
  const files = Object.entries(javascriptSdk.files).map(([name, file]) => ({
    name,
    checksums: Object.entries(file.checksums).map(([algo, value]) => ({
      name: algo,
      value,
    })),
  }));

  return (
    <table className={styles.Table}>
      <thead>
        <tr>
          <th>File</th>
          <th>Integrity Checksum</th>
        </tr>
      </thead>
      <tbody>
        {files
          .filter(file => file.name.endsWith('.js'))
          .map(file => (
            <tr key={file.name}>
              <td className={styles.FileName}>{file.name}</td>
              <td className={styles.Checksum}>
                <code className={styles.ChecksumValue}>
                  {`sha384-${file.checksums.find(c => c.name === 'sha384-base64')?.value}`}
                </code>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
