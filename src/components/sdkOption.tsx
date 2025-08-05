import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {PlatformCategory} from 'sentry-docs/types';

import {PlatformCategorySection} from './platformCategorySection';
import {PlatformSection} from './platformSection';
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

    const isServerPlatform =
      currentPlatformOrGuide.categories?.includes('server') ||
      currentPlatformOrGuide.categories?.includes('serverless');

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

  // We only handle browser, server & serverless here for now
  const currentIsBrowser = currentCategories.includes('browser');
  const currentIsServer = currentCategories.includes('server');
  const currentIsServerless = currentCategories.includes('serverless');
  const currentIsServerLike = currentIsServer || currentIsServerless;

  const hasCategorySupported = categorySupported.length > 0;
  const supportedBrowserOnly =
    categorySupported.includes('browser') &&
    !categorySupported.includes('server') &&
    !categorySupported.includes('serverless');
  const supportedServerLikeOnly =
    !categorySupported.includes('browser') &&
    (categorySupported.includes('server') || categorySupported.includes('serverless'));

  const showBrowserOnly =
    hasCategorySupported && supportedBrowserOnly && currentIsServerLike;
  const showServerLikeOnly =
    hasCategorySupported && supportedServerLikeOnly && currentIsBrowser;

  return {showBrowserOnly, showServerLikeOnly};
}
