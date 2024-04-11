'use client';

import {Fragment} from 'react';
import styled from '@emotion/styled';

import {SmartLink} from './smartLink';

const PackageDetail = styled.div`
  font-size: 0.8em;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;

  > dl {
    margin: 0;
    line-height: 1.8;
  }

  dt {
    font-weight: 500;
  }

  dd a {
    color: var(--accent-9);
    &:hover {
      text-decoration: underline;
    }
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

type Props = {
  apiDocsUrl?: string;
  canonical?: string;
  repoUrl?: string;
  url?: string;
  version?: string;
};

export function PlatformSdkDetailClient({
  url,
  canonical,
  version,
  repoUrl,
  apiDocsUrl,
}: Props) {
  return (
    <PackageDetail>
      <dl>
        <dt>Package:</dt>
        <dd>{url ? <SmartLink to={url}>{canonical}</SmartLink> : canonical}</dd>
        <dt>Version:</dt>
        <dd>{version}</dd>
        <dt>Repository:</dt>
        <dd>
          <SmartLink to={repoUrl} target="_blank" />
        </dd>
        {apiDocsUrl && (
          <Fragment>
            <dt>API Documentation:</dt>
            <dd>
              <SmartLink to={apiDocsUrl} target="_blank" />
            </dd>
          </Fragment>
        )}
      </dl>
    </PackageDetail>
  );
}
