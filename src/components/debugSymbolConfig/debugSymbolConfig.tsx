'use client';

import {useState, useEffect} from 'react';
import styled from '@emotion/styled';
import {Checkbox} from '@radix-ui/themes';

type DebugSymbolConfigProps = {
  defaultOptions?: string[];
};

const options = [
  {
    id: 'dsym', 
    name: 'dSYM', 
    configLine: '',
    comment: 'Debug symbols (dSYM) are uploaded by default. You can disable this by setting upload_debug_symbols: false',
    required: true
  },
  {
    id: 'source-maps', 
    name: 'Source Maps', 
    configLine: '  upload_source_maps: true\n',
    comment: 'Enabling this option allows Sentry to provide readable stack traces\n  # for Flutter web apps.',
    required: false
  },
  {
    id: 'source-context', 
    name: 'Source Context', 
    configLine: '  upload_sources: true\n',
    comment: 'Source context uploads your source files to Sentry, allowing you to see\n  # the actual code around the location of errors. \n  # This only uploads Dart/Flutter code, not native code.',
    required: false
  },
];

export function DebugSymbolConfig({
  defaultOptions = ['dsym'],
}: DebugSymbolConfigProps) {
  // Ensure dsym is always in the selected options
  const initialOptions = [...new Set([...defaultOptions, 'dsym'])];
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialOptions);

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

  // Generate the config lines based on selected options
  const getConfigSnippet = () => {
    const baseConfig = `sentry:
  project: ___PROJECT_SLUG___
  org: ___ORG_SLUG___
  auth_token: ___ORG_AUTH_TOKEN___\n`;
    
    // Add other selected options with their comments
    const additionalConfig = options
      .filter(option => option.id !== 'dsym' && selectedOptions.includes(option.id))
      .map(option => `\n  # ${option.comment}\n${option.configLine}`)
      .join('');
    
    return baseConfig + additionalConfig;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getConfigSnippet());
  };

  return (
    <Container>
      <OptionsContainer>
        {options.map(option => (
          <OptionButton
            key={option.id}
            isActive={selectedOptions.includes(option.id)}
            onClick={() => handleOptionToggle(option.id)}
            isRequired={option.required}
          >
            <CheckboxWrapper>
              <Checkbox 
                checked={selectedOptions.includes(option.id)}
                onCheckedChange={() => handleOptionToggle(option.id)}
                disabled={option.required}
              />
            </CheckboxWrapper>
            {option.name}
          </OptionButton>
        ))}
      </OptionsContainer>
      <Content>
        <CodeBlockContainer>
          <CodeBlockHeader>
            <CodeLanguage>YAML</CodeLanguage>
            <HeaderRight>
              <FileName>pubspec.yaml</FileName>
              <CopyButton onClick={handleCopyCode}>
                <CopyIcon viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
                </CopyIcon>
              </CopyButton>
            </HeaderRight>
          </CodeBlockHeader>
          <CodeBlock>
            {getConfigSnippet()}
          </CodeBlock>
        </CodeBlockContainer>
        
        {selectedOptions.includes('dsym') && (
          <DescriptionSection>
            <DescriptionTitle>Debug Symbols (dSYM)</DescriptionTitle>
            <Description>
              Debug symbols (dSYM) are uploaded by default. You can disable this by setting the `upload_debug_symbols` option to `false`.
            </Description>
          </DescriptionSection>
        )}
      </Content>
    </Container>
  );
}

const Container = styled('div')`
  margin: 20px 0;
`;

const OptionsContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

const CheckboxWrapper = styled('span')`
  margin-right: 8px;
  display: flex;
  align-items: center;
`;

const OptionButton = styled('button')<{isActive: boolean; isRequired?: boolean}>`
  padding: 8px 16px;
  background: ${props => (props.isActive ? '#6C5FC7' : '#f4f2f7')};
  color: ${props => (props.isActive ? 'white' : '#2b1d38')};
  border: none;
  border-radius: 6px;
  cursor: ${props => (props.isRequired ? 'default' : 'pointer')};
  font-weight: ${props => (props.isActive ? 'bold' : 'normal')};
  font-size: 14px;
  display: flex;
  align-items: center;
  
  &:hover {
    background: ${props => {
      if (props.isRequired) return props.isActive ? '#6C5FC7' : '#f4f2f7';
      return props.isActive ? '#6C5FC7' : '#e7e1ef';
    }};
  }
  
  &:focus {
    outline: none;
    box-shadow: ${props => (props.isRequired ? 'none' : '0 0 0 2px rgba(108, 95, 199, 0.3)')};
  }
`;

const Content = styled('div')`
  padding: 16px;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  background: #f8f8f8;
`;

const CodeBlockContainer = styled('div')`
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
  font-family: monospace;
`;

const CodeBlockHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #211634;
  padding: 8px 16px;
  color: white;
  border-bottom: 1px solid #362a45;
`;

const CodeLanguage = styled('div')`
  font-size: 14px;
  font-weight: bold;
`;

const HeaderRight = styled('div')`
  display: flex;
  align-items: center;
`;

const FileName = styled('div')`
  font-size: 14px;
  margin-right: 12px;
`;

const CopyButton = styled('button')`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:focus {
    outline: none;
  }
`;

const CopyIcon = styled('svg')`
  width: 18px;
  height: 18px;
  fill: white;
`;

const CodeBlock = styled('pre')`
  padding: 16px;
  background: #2b1d38;
  color: white;
  overflow-x: auto;
  margin: 0;
`;

const DescriptionSection = styled('div')`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e2e2;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const DescriptionTitle = styled('h4')`
  margin: 0 0 8px 0;
`;

const Description = styled('p')`
  margin: 0 0 16px 0;
  line-height: 1.5;
`; 