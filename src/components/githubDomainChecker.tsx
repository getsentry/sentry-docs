'use client';

import {useState} from 'react';

const MAX_COMPONENTS_ON_PAGE = 100;

export function GitHubDomainChecker() {
  const [domain, setDomain] = useState('');
  const [isValidDomain, setIsValidDomain] = useState(false);
  
  const isGitHubCom = domain.toLowerCase().trim() === 'github.com' || domain.toLowerCase().trim() === 'https://github.com';
  const hasInput = domain.trim().length > 0;
  
  // Validate domain format
  const validateDomain = (inputDomain: string) => {
    const trimmedDomain = inputDomain.trim();
    if (!trimmedDomain) {
      setIsValidDomain(false);
      return;
    }
    
    // Check if it's github.com (valid)
    if (trimmedDomain.toLowerCase() === 'github.com' || trimmedDomain.toLowerCase() === 'https://github.com') {
      setIsValidDomain(true);
      return;
    }
    
    // For enterprise, check if it's a valid URL or domain format
    const urlPattern = /^(https?:\/\/)?([\w\-\.]+\.[\w]{2,})(\/.*)?$/;
    const isValidUrl = urlPattern.test(trimmedDomain);
    setIsValidDomain(isValidUrl);
  };
  
  const handleDomainChange = (ev) => {
    const newDomain = ev.target.value;
    setDomain(newDomain);
    validateDomain(newDomain);
  };
  
  const inputClassName =
    'form-input w-full rounded-md border-[1.5px] focus:ring-2 focus:ring-accent-purple/20 border-gray-200';
  
  // This is to avoid in case multiple instances of this component are used on the page
  const randomCounter = Math.round(Math.random() * MAX_COMPONENTS_ON_PAGE);

  return (
    <div className="space-y-4 p-6 border border-gray-100 rounded">
      <div className="flex w-full">
        <div className="flex items-center min-w-[16ch] px-4">
          <label htmlFor={`gh-domain-${randomCounter}`} className="text-nowrap">
            GitHub Domain
          </label>
        </div>
        <input
          id={`gh-domain-${randomCounter}`}
          value={domain}
          placeholder="https://github.com or https://ghe.example.com"
          className={inputClassName}
          onChange={handleDomainChange}
        />
      </div>

      {hasInput && (
        <div className="mt-4 p-4 rounded-md border">
          <div className="text-sm font-medium mb-2">
            Recommended Installation:
          </div>
          {isValidDomain ? (
            isGitHubCom ? (
              <div className="text-green-700 bg-green-50 p-3 rounded-md">
                <div className="mb-2">
                  <strong>GitHub</strong> - Use the standard GitHub integration for github.com
                </div>
              </div>
            ) : (
              <div className="text-blue-700 bg-blue-50 p-3 rounded-md">
                <div className="mb-2">
                  <strong>GitHub Enterprise</strong> - Use GitHub Enterprise integration for your domain
                </div>
              </div>
            )
          ) : (
            <div className="text-red-700 bg-red-50 p-3 rounded-md">
              <strong>Invalid Domain</strong> - Please enter a valid GitHub domain or URL
            </div>
          )}
        </div>
      )}
    </div>
  );
}
