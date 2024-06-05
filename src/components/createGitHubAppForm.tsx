'use client';

import {useState} from 'react';
import {Button} from '@radix-ui/themes';

const MAX_COMPONENTS_ON_PAGE = 100;

export function CreateGitHubAppForm({url, defaultOrg, defaultUrlPrefix}) {
  const [orgSlug, setOrgSlug] = useState('');
  const [urlPrefix, setUrlPrefix] = useState('');
  const renderedUrl = url
    .replace(/:org(?=\W)/g, orgSlug)
    .replace(/:url-prefix(?=\W)/g, encodeURIComponent(urlPrefix));

  const inputClassName =
    'form-input w-full rounded-md border-[1.5px] focus:ring-2 focus:ring-accent-purple/20 border-gray-200';
  // This is to avoid in case multiple instances of this component are used on the page
  const randomCounter = Math.round(Math.random() * MAX_COMPONENTS_ON_PAGE);

  return (
    <div className="space-y-4 p-6 border border-gray-100 rounded">
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
      <div className="flex w-full">
        <div className="flex items-center min-w-[16ch] px-4">
          <label htmlFor={`gh-org-slug-${randomCounter}`} className="text-nowrap">
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
            disabled={!orgSlug || !urlPrefix}
            className="rounded-md"
          >
            Create GitHub App
          </Button>
        </div>
      </div>
    </div>
  );
}
