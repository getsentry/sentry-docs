'use client';

import {useState, type KeyboardEvent} from 'react';
import {Button} from '@radix-ui/themes';

const MAX_COMPONENTS_ON_PAGE = 100;

export function GitHubDomainChecker() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<{
    type: 'github' | 'enterprise' | null;
    message: string;
  }>({type: null, message: ''});

  const checkDomain = () => {
    if (!domain.trim()) {
      setResult({type: null, message: 'Please enter a domain'});
      return;
    }

    const cleanDomain = domain.trim().toLowerCase();
    
    // Remove protocol if present
    const domainWithoutProtocol = cleanDomain.replace(/^https?:\/\//, '');
    
    // Remove trailing slash and path
    const baseDomain = domainWithoutProtocol.split('/')[0];

    if (baseDomain === 'github.com' || baseDomain === 'www.github.com') {
      setResult({
        type: 'github',
        message: 'You should use the regular GitHub integration. This is GitHub.com, the public GitHub service.',
      });
    } else if (baseDomain.includes('github')) {
      setResult({
        type: 'enterprise',
        message: 'You should use GitHub Enterprise integration. This appears to be a GitHub Enterprise Server instance.',
      });
    } else {
      setResult({
        type: 'enterprise',
        message: 'You should use GitHub Enterprise integration. This appears to be a custom GitHub Enterprise Server domain.',
      });
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkDomain();
    }
  };

  const inputClassName =
    'form-input w-full rounded-md border-[1.5px] focus:ring-2 focus:ring-accent-purple/20 border-gray-200';
  
  // This is to avoid conflicts in case multiple instances of this component are used on the page
  const randomCounter = Math.round(Math.random() * MAX_COMPONENTS_ON_PAGE);

  return (
    <div className="space-y-4 p-6 border border-gray-100 rounded bg-gray-50">
      <div>
        <h3 className="text-lg font-medium mb-2">GitHub Domain Checker</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter your GitHub domain below to determine whether you should use the GitHub or GitHub Enterprise integration.
        </p>
      </div>
      
      <div className="flex w-full gap-2">
        <div className="flex-1">
          <label htmlFor={`github-domain-${randomCounter}`} className="sr-only">
            GitHub Domain
          </label>
          <input
            id={`github-domain-${randomCounter}`}
            type="text"
            value={domain}
            placeholder="e.g., github.com or github.yourcompany.com"
            className={inputClassName}
            onChange={ev => setDomain(ev.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button
          type="button"
          size="3"
          onClick={checkDomain}
          className="rounded-md"
        >
          Check Domain
        </Button>
      </div>

      {result.message && (
        <div className={`p-4 rounded-md ${
          result.type === 'github' 
            ? 'bg-green-50 border border-green-200' 
            : result.type === 'enterprise'
            ? 'bg-blue-50 border border-blue-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 w-5 h-5 rounded-full mr-3 mt-0.5 ${
              result.type === 'github'
                ? 'bg-green-500'
                : result.type === 'enterprise'
                ? 'bg-blue-500'
                : 'bg-yellow-500'
            }`} />
            <div>
              <p className={`font-medium ${
                result.type === 'github'
                  ? 'text-green-800'
                  : result.type === 'enterprise'
                  ? 'text-blue-800'
                  : 'text-yellow-800'
              }`}>
                {result.type === 'github' ? 'Use GitHub Integration' : 
                 result.type === 'enterprise' ? 'Use GitHub Enterprise Integration' : 
                 'Domain Check'}
              </p>
              <p className={`text-sm mt-1 ${
                result.type === 'github'
                  ? 'text-green-700'
                  : result.type === 'enterprise'
                  ? 'text-blue-700'
                  : 'text-yellow-700'
              }`}>
                {result.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}