'use client';

import {useState} from 'react';
import Select from 'react-select';
import styled from '@emotion/styled';

import {CodeBlock} from './codeBlock';

type RegionData = {region: string; version: string};
type LayerData = {
  accountNumber: string;
  canonical: string;
  layerName: string;
  regions: RegionData[];
};

const toOption = ({region}: RegionData) => {
  return {
    label: region,
    value: region,
  };
};

export function LambdaLayerDetailClient({
  canonical,
  layerList,
}: {
  canonical: string;
  layerList: LayerData[];
}) {
  const layer = layerList.find(l => l.canonical === canonical);
  if (!layer) {
    throw new Error(`Could not find layer for: ${canonical}`);
  }

  const {regions, layerName, accountNumber} = layer;

  const defaultOption = regions.length > 0 ? toOption(regions[0]) : undefined;

  const [regionOption, setRegion] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >(defaultOption);

  let arn: string = '';
  if (regionOption) {
    const regionData = regions.find(data => data.region === regionOption.value);
    if (regionData) {
      const {version, region} = regionData;
      arn = `arn:aws:lambda:${region}:${accountNumber}:layer:${layerName}:${version}`;
    }
  }

  return (
    <Wrapper>
      <Select
        styles={{
          control: base => ({...base, width: 300}),
        }}
        placeholder="Select Region"
        options={layer.regions.map(toOption)}
        value={regionOption}
        onChange={setRegion}
      />
      {arn && (
        <ArnWrapper>
          <ArnLabel>ARN</ArnLabel>
          <CodeBlock language="text">
            <pre className="language-text">
              <code>{arn}</code>
            </pre>
          </CodeBlock>
        </ArnWrapper>
      )}
    </Wrapper>
  );
}

const Wrapper = styled('div')`
  min-height: 50px;
`;

const ArnWrapper = styled('div')`
  margin-top: 10px;
`;

const ArnLabel = styled('div')`
  font-weight: bold;
  margin-bottom: 6px;
`;
