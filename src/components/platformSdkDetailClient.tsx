'use client';

import styled from '@emotion/styled';

import {SmartLink} from './smartLink';

const PackageDetail = styled.div`
  font-size: 0.8em;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;

  h3 {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    color: inherit;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  li {
    line-height: 1.5;
    padding: 0.25em 0;
    list-style-type: disc;
    margin-left: 12px;
  }

  a {
    position: relative;
    line-height: 1.5;
    display: block;
    color: var(--desatPurple3);
    opacity: 0.8;
    transition: var(--transition-time) ease-out;

    &:hover {
      opacity: 1;
      color: var(--desatPurple3);
    }
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
    </PackageDetail>
  );
}
