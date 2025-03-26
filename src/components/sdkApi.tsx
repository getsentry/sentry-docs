import {Fragment} from 'react';
import {jsx, jsxs} from 'react/jsx-runtime';
import {toJsxRuntime} from 'hast-util-to-jsx-runtime';
import {Nodes} from 'hastscript/lib/create-h';
import bash from 'refractor/lang/bash.js';
import json from 'refractor/lang/json.js';
import typescript from 'refractor/lang/typescript.js';
import {refractor} from 'refractor/lib/core.js';

import {PlatformCategory} from 'sentry-docs/types';

import {Expandable} from './expandable';
import {RenderNestedObject} from './nestedObject';
import {SdkDefinition} from './sdkDefinition';

export interface ParameterDef {
  name: string;
  type: string | ObjectParameterDef;
  defaultValue?: string;
  description?: string;
  required?: boolean;
}

type ObjectParameterDef = {
  properties: ParameterDef[];
  name?: string;
};

type Props = {
  name: string;
  parameters: ParameterDef[];
  signature: string;
  categorySupported?: PlatformCategory[];
  children?: React.ReactNode;
  language?: string;
};

refractor.register(bash);
refractor.register(json);
refractor.register(typescript);

const codeToJsx = (code: string, lang = 'json') => {
  return toJsxRuntime(refractor.highlight(code, lang) as Nodes, {Fragment, jsx, jsxs});
};

export function SdkApi({
  name,
  children,
  signature,
  parameters = [],
  // TODO: How to handle this default better?
  language = 'typescript',
  categorySupported = [],
}: Props) {
  return (
    <SdkDefinition name={name} categorySupported={categorySupported}>
      <pre className="mt-2 mb-2">{codeToJsx(signature, language)}</pre>

      {parameters.length ? (
        <Expandable title="Parameters">
          <div className="space-y-3">
            {parameters.map(param => (
              <ApiParameterDef key={param.name} language={language} {...param} />
            ))}
          </div>
        </Expandable>
      ) : null}

      {children}
    </SdkDefinition>
  );
}

function ApiParameterDef({
  name,
  type,
  description,
  required,
  language,
}: ParameterDef & {language: string}) {
  return (
    <div className="space-y-1">
      <div className="font-bold m-0">
        {name}
        {required ? <span className="text-red">*</span> : null}
      </div>
      <div className="space-y-1">
        <div>
          {typeof type === 'string' ? (
            <pre className="m-0 pt-1 pb-1">
              <code>{codeToJsx(type, language)}</code>
            </pre>
          ) : (
            <RenderNestedObject
              name={type.name}
              objProps={type.properties}
              language={language}
            />
          )}
        </div>

        {description ? <p className="m-0">{description}</p> : null}
      </div>
    </div>
  );
}
