'use client';

import {useState} from 'react';
import Select from 'react-select';
import styled from '@emotion/styled';

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
  // if we don't find a matching layer, let the page blow up
  // cause the page is useless without it
  if (!layer) {
    throw new Error(`Could not find layer for: ${canonical}`);
  }

  const {regions, layerName, accountNumber} = layer;

  const [regionOption, setRegion] = useState<{
    label: string;
    value: string;
  }>();

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
          <code>{arn}</code>
        </ArnWrapper>
      )}
    </Wrapper>
  );
}

// need a min-height so we don't get cropped at the bottom of the page
const Wrapper = styled('div')`
  min-height: 50px;
`;

const ArnWrapper = styled('div')`
  margin-top: 10px;
`;

const ArnLabel = styled('div')`
  font-weight: bold;
`;
