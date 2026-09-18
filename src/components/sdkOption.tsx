import {hasBrowserCategory, hasServerCategory} from 'sentry-docs/categories';
import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {PlatformCategory} from 'sentry-docs/types';

import {SdkDefinition, SdkDefinitionTable} from './sdkDefinition';

type Props = {
  name: string;
  type: string;
  availableSince?: string;
  categorySupported?: PlatformCategory[];
  children?: React.ReactNode;
  defaultNote?: string;
  defaultValue?: string;
  envVar?: string;
};

export function SdkOption({
  name,
  children,
  type,
  availableSince,
  defaultValue,
  defaultNote,
  envVar,
  categorySupported = [],
}: Props) {
  const {showBrowserOnly, showServerLikeOnly} = getPlatformHints(categorySupported);
  const {rootNode, path} = serverContext();
  const currentPlatformOrGuide = getCurrentPlatformOrGuide(rootNode, path);
  const shouldShowEnvVar = () => {
    if (!currentPlatformOrGuide) return false;

    const isServerPlatform = hasServerCategory(currentPlatformOrGuide.categories);

    const isExcludedPlatform =
      currentPlatformOrGuide.key === 'javascript.nextjs' ||
      currentPlatformOrGuide.key === 'javascript.sveltekit';

    return isServerPlatform && !isExcludedPlatform;
  };

  return (
    <SdkDefinition name={name} categorySupported={categorySupported}>
      <SdkDefinitionTable>
        {availableSince && (
          <OptionDefRow label="Available since" value={availableSince} />
        )}
        {type && <OptionDefRow label="Type" value={type} />}
        {defaultValue && (
          <OptionDefRow label="Default" value={defaultValue} note={defaultNote} />
        )}

        {shouldShowEnvVar() && envVar && (
          <OptionDefRow label="ENV Variable" value={envVar} />
        )}

        {showBrowserOnly && <OptionDefRow label="Only available on" value="Client" />}
        {showServerLikeOnly && <OptionDefRow label="Only available on" value="Server" />}
      </SdkDefinitionTable>

      {children}
    </SdkDefinition>
  );
}

function OptionDefRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <tr>
      <th>{label}</th>
      <td>
        <code>{value}</code>
        {note && <small> ({note})</small>}
      </td>
    </tr>
  );
}

export function getPlatformHints(categorySupported: PlatformCategory[]) {
  const {rootNode, path} = serverContext();
  const currentPlatformOrGuide = getCurrentPlatformOrGuide(rootNode, path);
  const currentCategories = currentPlatformOrGuide?.categories || [];

  const hasCategorySupported = categorySupported.length > 0;
  const supportedBrowserOnly =
    hasBrowserCategory(categorySupported) && !hasServerCategory(categorySupported);
  const supportedServerLikeOnly =
    !hasBrowserCategory(categorySupported) && hasServerCategory(categorySupported);

  const showBrowserOnly =
    hasCategorySupported && supportedBrowserOnly && hasServerCategory(currentCategories);
  const showServerLikeOnly =
    hasCategorySupported && supportedServerLikeOnly && hasBrowserCategory(currentCategories);

  return {showBrowserOnly, showServerLikeOnly};
}
