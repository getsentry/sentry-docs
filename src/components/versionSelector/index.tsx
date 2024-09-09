'use client';
import {useState} from 'react';
import {ChevronDownIcon} from '@radix-ui/react-icons';
import * as RadixSelect from '@radix-ui/react-select';
import {usePathname, useRouter} from 'next/navigation';

import {VERSION_INDICATOR} from 'sentry-docs/versioning';

import styles from './style.module.scss';

const stripTrailingSlash = (url: string) => {
  return url.replace(/\/$/, '');
};

export function VersionSelector({versions}: {versions: string[]}) {
  const availableVersions = ['latest', ...versions];
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentVersion = () => {
    if (pathname?.includes(VERSION_INDICATOR)) {
      const segments = pathname.split(VERSION_INDICATOR);
      return segments[segments.length - 1];
    }

    return 'latest';
  };

  const [selectedVersion, setSelectedVersion] = useState(getCurrentVersion());

  const getVersionedPathname = (version: string) => {
    if (pathname) {
      if (version === 'latest') {
        return pathname?.split(VERSION_INDICATOR)[0];
      }

      return `${stripTrailingSlash(pathname.split(VERSION_INDICATOR)[0])}${VERSION_INDICATOR}${version}`;
    }

    return '';
  };

  const handleVersionChange = (newVersion: string) => {
    setSelectedVersion(newVersion);
    router.push(getVersionedPathname(newVersion));
  };

  return (
    <div>
      <RadixSelect.Root value={selectedVersion} onValueChange={handleVersionChange}>
        <RadixSelect.Trigger aria-label="Version" className={styles.select}>
          <RadixSelect.Value placeholder="Version">
            Version: {selectedVersion}
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
