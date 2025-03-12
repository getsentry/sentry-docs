'use client';

import {useState} from 'react';
import {Clipboard} from 'react-feather';
import {Checkbox} from '@radix-ui/themes';

// Import CodeBlock for reference, but we'll implement our own version
// import {CodeBlock} from '../codeBlock';

type DebugSymbolConfigProps = {
  defaultOptions?: string[];
};

// Match the pattern used by the onboarding component
const options = [
  {
    id: 'dsym',
    name: 'dSYM',
    required: true,
  },
  {
    id: 'source-maps',
    name: 'Source Maps',
    required: false,
  },
  {
    id: 'source-context',
    name: 'Source Context',
    required: false,
  },
];

export function DebugSymbolConfig({defaultOptions = ['dsym']}: DebugSymbolConfigProps) {
  // Ensure dsym is always in the selected options
  const initialOptions = [...new Set([...defaultOptions, 'dsym'])];
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialOptions);
  const [copied, setCopied] = useState(false);

  const handleOptionToggle = (optionId: string) => {
    // If it's dsym, don't allow toggling
    if (optionId === 'dsym') return;

    setSelectedOptions(prev => {
      // If already selected, remove it
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      }
      // Otherwise add it
      return [...prev, optionId];
    });
  };

  // Generate YAML content that matches the format in the screenshot
  const getYamlContent = () => {
    // Format the YAML content to match the screenshot with proper indentation and line breaks
    return `sentry:
  project: ___PROJECT_SLUG___
  org: ___ORG_SLUG___
  auth_token: sntrys_YOUR_TOKEN_HERE${selectedOptions.includes('source-maps') ? '\n  upload_source_maps: true' : ''}${selectedOptions.includes('source-context') ? '\n  upload_sources: true' : ''}`;
  };

  // Handle copy to clipboard functionality
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getYamlContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3 mb-4">
        {options.map(option => (
          <div
            key={option.id}
            className={`flex items-center px-4 py-2 rounded-md text-sm ${
              selectedOptions.includes(option.id)
                ? 'bg-[#6C5FC7] text-white font-semibold'
                : 'bg-[#f4f2f7] text-[#2b1d38]'
            } ${option.required ? '' : 'cursor-pointer'}`}
            onClick={() => !option.required && handleOptionToggle(option.id)}
            style={{
              minWidth: '160px',
              justifyContent: 'flex-start',
              padding: '10px 16px',
              borderRadius: '6px',
            }}
            role={option.required ? undefined : 'button'}
            tabIndex={option.required ? undefined : 0}
            onKeyDown={e => {
              if (!option.required && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleOptionToggle(option.id);
              }
            }}
          >
            <span className="mr-2 flex items-center">
              <Checkbox
                checked={selectedOptions.includes(option.id)}
                onCheckedChange={() => handleOptionToggle(option.id)}
                disabled={option.required}
                style={{
                  color: selectedOptions.includes(option.id) ? 'white' : undefined,
                }}
              />
            </span>
            {option.name}
          </div>
        ))}
      </div>

      {/* Custom Code Block Implementation */}
      <div className="relative mb-6">
        {/* Code Block Header */}
        <div className="flex justify-between items-center bg-[#2b1d38] px-3 py-2 rounded-t-md">
          <div className="text-white text-xs font-medium">YAML</div>
          <div className="flex items-center">
            <span className="text-white text-xs mr-3">pubspec.yaml</span>
            <button
              className="text-white hover:bg-[rgba(255,255,255,0.2)] p-1 rounded"
              onClick={handleCopy}
            >
              <Clipboard size={16} />
            </button>
          </div>
        </div>

        {/* Code Block Content */}
        <pre className="bg-[#1e1225] text-white p-4 rounded-b-md m-0 overflow-auto font-mono text-sm">
          {getYamlContent()}
        </pre>

        {/* Copied Notification */}
        {copied && (
          <div className="absolute top-2 right-2 bg-[rgba(255,255,255,0.25)] text-white px-2 py-1 rounded text-xs">
            Copied
          </div>
        )}
      </div>
    </div>
  );
}
