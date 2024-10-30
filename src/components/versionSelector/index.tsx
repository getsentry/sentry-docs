'use client';
import {useCallback, useEffect, useState} from 'react';
import {ChevronDownIcon} from '@radix-ui/react-icons';
import * as RadixSelect from '@radix-ui/react-select';
import {usePathname, useRouter} from 'next/navigation';

import {stripTrailingSlash} from 'sentry-docs/utils';
import {getLocalStorageVersionKey, VERSION_INDICATOR} from 'sentry-docs/versioning';

import styles from './style.module.scss';

import {VersionBanner} from '../versionBanner';

export function VersionSelector({versions, sdk}: {sdk: string; versions: string[]}) {
  const availableVersions = ['latest', ...versions];
  const router = useRouter();
  const pathname = usePathname();

  const getLocallyStoredVersion = useCallback(() => {
    return localStorage.getItem(getLocalStorageVersionKey(sdk));
  }, [sdk]);

  const getCurrentVersion = useCallback(() => {
    if (pathname?.includes(VERSION_INDICATOR)) {
      const segments = pathname.split(VERSION_INDICATOR);
      return segments[segments.length - 1].replace('/', '');
    }

    return 'latest';
  }, [pathname]);

  const [selectedVersion, setSelectedVersion] = useState(getCurrentVersion());

  const getVersionedPathname = useCallback(
    (version: string) => {
      if (pathname) {
        if (version === 'latest') {
          return pathname?.split(VERSION_INDICATOR)[0];
        }

        return `${stripTrailingSlash(pathname.split(VERSION_INDICATOR)[0])}${VERSION_INDICATOR}${version}`;
      }

      return '';
    },
    [pathname]
  );

  /**
   * when a user has previously selected a version from the version selector
   * we want to redirect to this version again on other pages - this has to happen on client side since
   * we do not know anything about version preferences on the server
   */
  useEffect(() => {
    const pathVersion = getCurrentVersion();
    const storedSelection = getLocallyStoredVersion();
    if (
      storedSelection !== null &&
      pathVersion !== storedSelection &&
      versions.includes(storedSelection)
    ) {
      router.replace(getVersionedPathname(storedSelection));
    }
  }, [
    getCurrentVersion,
    getLocallyStoredVersion,
    getVersionedPathname,
    pathname,
    router,
    versions,
  ]);

  const handleVersionChange = useCallback(
    (newVersion: string) => {
      setSelectedVersion(newVersion);
      router.push(getVersionedPathname(newVersion));
      localStorage.setItem(getLocalStorageVersionKey(sdk), newVersion);
    },
    [getVersionedPathname, router, sdk]
  );

  return (
    <div>
      {selectedVersion !== 'latest' && (
        <VersionBanner
          version={selectedVersion}
          onClickLatest={() => {
            handleVersionChange('latest');
          }}
        />
      )}
      <RadixSelect.Root value={selectedVersion} onValueChange={handleVersionChange}>
        <RadixSelect.Trigger aria-label="Version" className={styles.select}>
          <RadixSelect.Value placeholder="Version">
            <span className="text-sm">SDK version: {selectedVersion}</span>
          </RadixSelect.Value>
          <RadixSelect.Icon>
            <ChevronDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Content
          role="dialog"
          aria-label="Versions"
          position="popper"
          className={styles.popover}
        >
          {availableVersions.map(version => (
            <RadixSelect.Item key={version} value={version} className={styles.item}>
              {version}
            </RadixSelect.Item>
          ))}
        </RadixSelect.Content>
      </RadixSelect.Root>
    </div>
  );
}
