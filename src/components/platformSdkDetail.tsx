import React from 'react';
import styled from '@emotion/styled';
import {graphql, useStaticQuery} from 'gatsby';

import {usePlatform} from './hooks/usePlatform';
import {SmartLink} from './smartLink';

const query = graphql`
  query PlatformSdkDetail {
    allPackage {
      nodes {
        id
        canonical
        url
        repoUrl
        version
      }
    }
  }
`;

const PackageDetail = styled.div`
  font-size: 0.8em;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;

  > dl {
    margin: 0;
  }

  > dl > dt,
  > dl > dd {
    margin-top: 0;
    margin-bottom: 0;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > dl > dd {
    margin-left: 0.5rem;
  }
`;

export function PlatformSdkDetail() {
  const [platform] = usePlatform();

  const {
    allPackage: {nodes: packageList},
  } = useStaticQuery(query);

  if (!platform) {
    return null;
  }
  if (!platform.sdk) {
    return null;
  }

  const packageData = packageList.find(p => p.id === platform.sdk);
  if (!packageData) {
    return null;
  }

  return (
    <PackageDetail>
      <dl>
        <dt>Package:</dt>
        <dd>
          {packageData.url ? (
            <SmartLink to={packageData.url}>{packageData.canonical}</SmartLink>
          ) : (
            packageData.canonical
          )}
        </dd>
        <dt>Version:</dt>
        <dd>{packageData.version}</dd>
        <dt>Repository:</dt>
        <dd>
          <SmartLink to={packageData.repoUrl} />
        </dd>
      </dl>
    </PackageDetail>
  );
}
