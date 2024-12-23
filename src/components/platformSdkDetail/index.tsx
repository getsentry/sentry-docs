import getPackageRegistry from 'sentry-docs/build/packageRegistry';
import {getCurrentPlatformOrGuide, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import styles from './styles.module.scss';

import {SmartLink} from '../smartLink';

export async function PlatformSdkDetail() {
  const {rootNode, path} = serverContext();
  const platformOrGuide = getCurrentPlatformOrGuide(rootNode, path);
  if (!platformOrGuide) {
    return null;
  }

  const node = nodeForPath(rootNode, path);
  const sdk = node?.frontmatter.sdk ?? platformOrGuide.sdk;
  const packageRegistry = await getPackageRegistry();
  const allSdks = packageRegistry.data;
  const entries = Object.entries(allSdks || {});
  const pair = entries.find(([sdkName]) => sdkName === sdk);
  if (!pair) {
    return null;
  }
  const [, sdkData] = pair;
  if (!sdkData) {
    return null;
  }

  const {
    package_url: url,
    canonical,
    version,
    repo_url: repoUrl,
    api_docs_url: apiDocsUrl,
  } = sdkData;

  return (
    <div className={styles.PackageDetail}>
      <h3>Package Details</h3>
      <ul>
        <li>Latest version: {version}</li>
        <li>{url ? <SmartLink to={url}>{canonical}</SmartLink> : canonical}</li>
        <li>
          <SmartLink to={repoUrl} target="_blank">
            Repository on GitHub
          </SmartLink>
        </li>
        {apiDocsUrl && (
          <li>
            <SmartLink to={apiDocsUrl} target="_blank">
              API documentation
            </SmartLink>
          </li>
        )}
      </ul>
    </div>
  );
}
