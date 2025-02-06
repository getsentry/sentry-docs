import {Fragment} from 'react';
import {jsx, jsxs} from 'react/jsx-runtime';
import {toJsxRuntime} from 'hast-util-to-jsx-runtime';
import {Nodes} from 'hastscript/lib/create-h';
import bash from 'refractor/lang/bash.js';
import json from 'refractor/lang/json.js';
import {refractor} from 'refractor/lib/core.js';

import {PlatformCategory} from 'sentry-docs/types';

import {Expandable} from './expandable';
import {SdkDefinition, SdkDefinitionTable} from './sdkDefinition';

interface ParameterDef {
  name: string;
  type: string | ParameterDef[];
  defaultValue?: string;
  description?: string;
  required?: boolean;
}

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
          <SdkDefinitionTable className="bg-white">
            {parameters.map(param => (
              <ApiParameterDef key={param.name} {...param} />
            ))}
          </SdkDefinitionTable>
        </Expandable>
      ) : null}

      {children}
    </SdkDefinition>
  );
}

function ApiParameterDef({name, type, description, required}: ParameterDef) {
  return (
    <tr>
      <th>
        {name}
        {required ? <span className="text-red">*</span> : null}
      </th>
      <td>
        {typeof type === 'string' ? (
          <code>{type}</code>
        ) : (
          <RenderNestedObject objProps={type} />
        )}

        {description ? <p className="m-0">{description}</p> : null}
      </td>
    </tr>
  );
}

function RenderNestedObject({objProps}: {objProps: ParameterDef[]}) {
  return (
    <Fragment>
      <div>
        <code>Object:</code>
      </div>
      <SdkDefinitionTable className="mt-1">
        {objProps.map(prop => (
          <ApiParameterDef key={prop.name} {...prop} />
        ))}
      </SdkDefinitionTable>
    </Fragment>
  );
}
