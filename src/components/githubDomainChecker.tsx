'use client';

import {useState} from 'react';

interface GitHubDomainCheckerProps {
  id?: string;
}

export function GitHubDomainChecker({id}: GitHubDomainCheckerProps = {}) {
  const [domain, setDomain] = useState('');
  const [isValidDomain, setIsValidDomain] = useState(false);

  // Updated to handle github.com URLs with paths (e.g., github.com/user)
  const isGitHubCom = (() => {
    const trimmedDomain = domain.toLowerCase().trim();
    if (!trimmedDomain) return false;

    // Remove protocol if present
    const domainWithoutProtocol = trimmedDomain.replace(/^https?:\/\//, '');

    // Check if it starts with github.com (with or without path)
    return domainWithoutProtocol.startsWith('github.com');
  })();

  const hasInput = domain.trim().length > 0;

  // Validate domain format
  const validateDomain = (inputDomain: string) => {
    const trimmedDomain = inputDomain.trim();
    if (!trimmedDomain) {
      setIsValidDomain(false);
      return;
    }

    // Check if it contains github.com (valid)
    if (trimmedDomain.toLowerCase().includes('github.com')) {
      setIsValidDomain(true);
      return;
    }

    // For enterprise, check if it's a valid URL or domain format
    const urlPattern = /^(https?:\/\/)?([\w\-\.]+\.[\w]{2,})(\/.*)?$/;
    const isValidUrl = urlPattern.test(trimmedDomain);
    setIsValidDomain(isValidUrl);
  };

  const handleDomainChange = ev => {
    const newDomain = ev.target.value;
    setDomain(newDomain);
    validateDomain(newDomain);
  };

  // Improved input styling with dark mode support
  const inputClassName =
    'form-input w-full rounded-md border-[1.5px] focus:ring-2 focus:ring-accent-purple/20 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400';

  // Use provided id or generate a fallback
  const inputId = id || `gh-domain-${Date.now()}`;

  return (
    <div className="space-y-4 p-6 border border-gray-100 dark:border-gray-700 rounded">
      <div className="flex w-full">
        <div className="flex items-center min-w-[16ch] px-4">
          <label htmlFor={inputId} className="text-nowrap">
            GitHub Domain
          </label>
        </div>
        <input
          id={inputId}
          value={domain}
          placeholder="https://github.com or https://ghe.example.com"
          className={inputClassName}
          onChange={handleDomainChange}
        />
      </div>

      {hasInput && (
        <div className="mt-4 p-4 rounded-md border dark:border-gray-600">
          {isValidDomain ? (
            <div>
              <div className="text-sm font-medium mb-2">Recommended Installation:</div>
              {isGitHubCom ? (
                <div className="text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-900/30 p-3 rounded-md">
                  <div className="mb-2">
                    <strong>GitHub</strong> - Use the standard GitHub integration for
                    github.com
                  </div>
                </div>
              ) : (
                <div className="text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/30 p-3 rounded-md">
                  <div className="mb-2">
                    <strong>GitHub Enterprise</strong> - Use GitHub Enterprise integration
                    for your domain
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/30 p-3 rounded-md">
              <strong>Invalid Domain</strong> - Please enter a valid GitHub domain or URL
            </div>
          )}
        </div>
      )}
    </div>
  );
}
