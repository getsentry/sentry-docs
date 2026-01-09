'use client';

import {useState} from 'react';
import {Button} from '@radix-ui/themes';

const MAX_COMPONENTS_ON_PAGE = 100;

type AccountType = 'personal' | 'organization';

export function CreateGitHubAppForm({url, defaultOrg, defaultUrlPrefix}) {
  const [accountType, setAccountType] = useState<AccountType>('organization');
  const [orgSlug, setOrgSlug] = useState('');
  const [urlPrefix, setUrlPrefix] = useState('');

  const isPersonal = accountType === 'personal';

  const renderedUrl = (() => {
    let processedUrl = url;
    if (isPersonal) {
      // For personal accounts, remove the organizations/:org/ path segment
      processedUrl = processedUrl
        .replace('organizations/:org/', '')
        .replace(':org-Sentry', 'Sentry');
    } else {
      processedUrl = processedUrl.replace(/:org(?=\W)/g, orgSlug);
    }
    return processedUrl.replace(/:url-prefix(?=\W)/g, encodeURIComponent(urlPrefix));
  })();

  const inputClassName =
    'form-input w-full rounded-md border-[1.5px] focus:ring-2 focus:ring-accent-purple/20 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500';
  // This is to avoid in case multiple instances of this component are used on the page
  const randomCounter = Math.round(Math.random() * MAX_COMPONENTS_ON_PAGE);

  const isValid = isPersonal ? !!urlPrefix : !!orgSlug && !!urlPrefix;

  return (
    <div className="space-y-4 p-6 border border-gray-200 dark:border-gray-700 rounded">
      <div className="flex w-full">
        <div className="flex items-center min-w-[16ch] px-4">
          <span className="text-nowrap">Account Type</span>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`account-type-${randomCounter}`}
              value="organization"
              checked={accountType === 'organization'}
              onChange={() => setAccountType('organization')}
              className="accent-accent-purple"
            />
            Organization
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`account-type-${randomCounter}`}
              value="personal"
              checked={accountType === 'personal'}
              onChange={() => setAccountType('personal')}
              className="accent-accent-purple"
            />
            Personal
          </label>
        </div>
      </div>
      {!isPersonal && (
        <div className="flex w-full">
          <div className="flex items-center min-w-[16ch] px-4">
            <label htmlFor={`gh-org-slug-${randomCounter}`} className="text-nowrap">
              GitHub Org Slug
            </label>
          </div>
          <input
            id={`gh-org-slug-${randomCounter}`}
            value={orgSlug}
            placeholder={defaultOrg}
            className={inputClassName}
            onChange={ev => setOrgSlug(ev.target.value)}
          />
        </div>
      )}
      <div className="flex w-full">
        <div className="flex items-center min-w-[16ch] px-4">
          <label htmlFor={`sentry-url-prefix-${randomCounter}`} className="text-nowrap">
            Sentry <code>url-prefix</code>
          </label>
        </div>
        <input
          id={`sentry-url-prefix-${randomCounter}`}
          placeholder={defaultUrlPrefix}
          value={urlPrefix}
          className={inputClassName}
          onChange={ev => setUrlPrefix(ev.target.value)}
        />
      </div>

      <div>
        <div className="text-right w-full">
          <Button
            type="button"
            size="3"
            onClick={() => window.open(renderedUrl, '_blank', 'noopener')}
            disabled={!isValid}
            className="rounded-md"
          >
            Create GitHub App
          </Button>
        </div>
      </div>
    </div>
  );
}
