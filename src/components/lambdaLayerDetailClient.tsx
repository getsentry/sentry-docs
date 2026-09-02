'use client';

import styled from '@emotion/styled';
import {useState} from 'react';
import Select from 'react-select';
import type {LayerData, SdkVersionIndex} from 'sentry-docs/build/awsLambdaLayerRegistry';
import type {Runtime} from 'sentry-docs/build/awsLambdaRuntimes';
import {BASE_REGISTRY_URL} from 'sentry-docs/build/shared';

import {CodeBlock} from './codeBlock';
import {CodeTabs} from './codeTabs';
import {
  formatRuntimeOption,
  formatRuntimeRanges,
  type Layer,
  makeLayerArn,
  normalizeLayer,
  sortRuntimes,
  sortSdkVersions,
} from './lambdaLayerUtils';

type SelectOption = {label: string; value: string};

const toRegionOption = ({region}: Layer['regions'][number]): SelectOption => ({
  label: region,
  value: region,
});

function getSdkVersionMetadata(sdkVersionIndex: SdkVersionIndex, sdkVersion: string) {
  const metadata = sdkVersionIndex.version_metadata[sdkVersion];
  if (!metadata) {
    throw new Error(`Could not find layer metadata for SDK version ${sdkVersion}`);
  }
  return metadata;
}

function sdkVersionSupportsRuntime(
  sdkVersionIndex: SdkVersionIndex,
  sdkVersion: string,
  runtime: string
): boolean {
  return getSdkVersionMetadata(sdkVersionIndex, sdkVersion).compatible_runtimes.includes(
    runtime
  );
}

export function LayerDetailClient({
  runtimes,
  defaultLayer,
  sdkVersionIndex,
}: {
  runtimes: Runtime[];
  defaultLayer: Layer;
  sdkVersionIndex: SdkVersionIndex;
}) {
  const latestSdkVersion = defaultLayer.sdkVersion;
  const sdkMajorVersion =
    defaultLayer.canonical.match(/:v(\d+)$/)?.[1] ??
    (defaultLayer.canonical === 'aws-layer:node'
      ? defaultLayer.sdkVersion.split('.')[0]
      : undefined);
  const availableSdkVersions = sortSdkVersions(sdkVersionIndex.versions).filter(
    sdkVersion => !sdkMajorVersion || sdkVersion.split('.')[0] === sdkMajorVersion
  );
  const runtime = defaultLayer.runtime;
  const initialRuntimes = sortRuntimes(defaultLayer.compatibleRuntimes);
  const [selectedSdkVersion, setSelectedSdkVersion] = useState(latestSdkVersion);
  const [selectedLayer, setSelectedLayer] = useState<Layer>(defaultLayer);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const [selectedRuntime, setSelectedRuntime] = useState<string | undefined>(
    initialRuntimes[0]
  );
  const [selectedRegion, setSelectedRegion] = useState<string>();

  const applyLayerSelection = (
    layer: Layer,
    preferredRuntime?: string,
    preferredRegion?: string
  ) => {
    const compatibleRuntimes = sortRuntimes(layer.compatibleRuntimes);
    const nextRuntime =
      preferredRuntime && compatibleRuntimes.includes(preferredRuntime)
        ? preferredRuntime
        : compatibleRuntimes[0];

    setSelectedLayer(layer);
    setSelectedRuntime(nextRuntime);
    setSelectedRegion(
      layer.regions.some(item => item.region === preferredRegion)
        ? preferredRegion
        : undefined
    );
  };

  const loadSdkVersion = async (sdkVersion: string, preferredRuntime?: string) => {
    const preferredRegion = selectedRegion;
    setSelectedSdkVersion(sdkVersion);
    setLoadError(undefined);

    if (sdkVersion === latestSdkVersion) {
      applyLayerSelection(defaultLayer, preferredRuntime, preferredRegion);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_REGISTRY_URL}/aws-lambda-layers/${runtime}/${encodeURIComponent(sdkVersion)}`
      );
      if (!response.ok) {
        throw new Error(`The release registry returned HTTP ${response.status}.`);
      }
      const layer = normalizeLayer((await response.json()) as LayerData);
      applyLayerSelection(layer, preferredRuntime, preferredRegion);
    } catch {
      applyLayerSelection(defaultLayer, preferredRuntime, preferredRegion);
      setSelectedSdkVersion(latestSdkVersion);
      setLoadError(
        'Unable to load that SDK version. Showing the latest available layer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const compatibleRuntimes = sortRuntimes(selectedLayer.compatibleRuntimes);
  const availableRuntimes = sortRuntimes(
    availableSdkVersions.flatMap(
      sdkVersion => getSdkVersionMetadata(sdkVersionIndex, sdkVersion).compatible_runtimes
    )
  );
  const compatibleSdkVersions = availableSdkVersions.filter(
    sdkVersion =>
      !selectedRuntime ||
      sdkVersionSupportsRuntime(sdkVersionIndex, sdkVersion, selectedRuntime)
  );
  const sdkVersionOptions: SelectOption[] = compatibleSdkVersions.map(sdkVersion => ({
    label: sdkVersion === latestSdkVersion ? `Latest (${sdkVersion})` : sdkVersion,
    value: sdkVersion,
  }));

  const handleRuntimeChange = (runtimeIdentifier: string | undefined) => {
    setSelectedRuntime(runtimeIdentifier);
    if (
      !runtimeIdentifier ||
      sdkVersionSupportsRuntime(sdkVersionIndex, selectedSdkVersion, runtimeIdentifier)
    ) {
      return;
    }

    const compatibleSdkVersion = availableSdkVersions.find(sdkVersion =>
      sdkVersionSupportsRuntime(sdkVersionIndex, sdkVersion, runtimeIdentifier)
    );
    if (compatibleSdkVersion) {
      void loadSdkVersion(compatibleSdkVersion, runtimeIdentifier);
    }
  };

  const {regions, layerName, accountNumber} = selectedLayer;
  const selectedSdkVersionOption = sdkVersionOptions.find(
    option => option.value === selectedSdkVersion
  ) ?? {
    label:
      selectedSdkVersion === latestSdkVersion
        ? `Latest (${selectedSdkVersion})`
        : selectedSdkVersion,
    value: selectedSdkVersion,
  };
  const runtimeOptions: SelectOption[] = availableRuntimes.map(runtimeIdentifier => ({
    label: formatRuntimeOption(
      runtimeIdentifier,
      runtimes.find(runtimeData => runtimeData.identifier === runtimeIdentifier)
    ),
    value: runtimeIdentifier,
  }));
  const selectedRuntimeOption = runtimeOptions.find(
    option => option.value === selectedRuntime
  );
  const regionOptions = regions.map(toRegionOption);
  const regionOption = regionOptions.find(option => option.value === selectedRegion);
  const selectedRegionData = regions.find(data => data.region === selectedRegion);
  const arn = selectedRegionData
    ? makeLayerArn({
        accountNumber,
        layerName,
        layerVersion: selectedRegionData.layerVersion,
        region: selectedRegionData.region,
      })
    : '';

  const runtimeSummary = compatibleRuntimes.length
    ? formatRuntimeRanges(compatibleRuntimes)
    : undefined;

  return (
    <div>
      <SelectionGrid>
        <SelectionField>
          <SelectionLabel htmlFor="layer-region">Region</SelectionLabel>
          <Select
            instanceId="layer-region"
            inputId="layer-region"
            placeholder="Select a region"
            isDisabled={isLoading}
            options={regionOptions}
            value={regionOption ?? null}
            onChange={option => setSelectedRegion(option?.value)}
          />
        </SelectionField>
        <SelectionField>
          <SelectionLabel htmlFor="layer-runtime">Runtime</SelectionLabel>
          <Select
            instanceId="layer-runtime"
            inputId="layer-runtime"
            placeholder="Runtime compatibility unavailable"
            isDisabled={isLoading || !runtimeOptions.length}
            options={runtimeOptions}
            value={selectedRuntimeOption}
            onChange={option => handleRuntimeChange(option?.value)}
          />
        </SelectionField>
        <SelectionField>
          <SelectionLabel htmlFor="layer-sdk-version">SDK version</SelectionLabel>
          <Select<SelectOption>
            instanceId="layer-sdk-version"
            inputId="layer-sdk-version"
            isDisabled={isLoading}
            options={sdkVersionOptions}
            value={selectedSdkVersionOption}
            onChange={option =>
              option && void loadSdkVersion(option.value, selectedRuntime)
            }
          />
        </SelectionField>
      </SelectionGrid>
      {loadError ? <ErrorBlock>{loadError}</ErrorBlock> : null}
      {arn && (
        <LayerResult>
          <LayerDetails>
            <strong>{layerName}</strong>
            {runtimeSummary ? <span>Runtimes: {runtimeSummary}</span> : null}
          </LayerDetails>
          <ArnWrapper>
            <CodeTabs>
              <CodeBlock language="text" title="ARN">
                <pre>
                  <code>{arn}</code>
                </pre>
              </CodeBlock>
            </CodeTabs>
          </ArnWrapper>
          <CompatibilityNote>
            AWS might show a compatibility warning or outdated layer information. The ARN
            shown above is still correct to use.
          </CompatibilityNote>
        </LayerResult>
      )}
    </div>
  );
}

const LayerDetails = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.95em;
`;

const SelectionGrid = styled('div')`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const SelectionField = styled('div')`
  position: relative;
  min-width: 0;

  &:focus-within {
    z-index: 1;
  }
`;

const SelectionLabel = styled('label')`
  display: block;
  font-size: 0.875em;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const ErrorBlock = styled('p')`
  margin: 0.5rem 0;
  color: #b42318;
`;

const LayerResult = styled('div')`
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--accent-6);
  border-radius: 6px;
  background: var(--accent-2);
`;

const ArnWrapper = styled('div')`
  width: 100%;
  margin-top: 0.75rem;
`;

const CompatibilityNote = styled('p')`
  margin: 0.75rem 0 0;
  font-size: 0.85em;
  color: var(--foreground-secondary);
`;
