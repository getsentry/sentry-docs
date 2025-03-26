'use client';

import {Fragment, useState} from 'react';
import {jsx, jsxs} from 'react/jsx-runtime';
import {MinusCircledIcon, PlusCircledIcon} from '@radix-ui/react-icons';
import {toJsxRuntime} from 'hast-util-to-jsx-runtime';
import {Nodes} from 'hastscript/lib/create-h';
import {refractor} from 'refractor/lib/core.js';

import {ParameterDef} from './sdkApi';

const codeToJsx = (code: string, lang = 'json') => {
  return toJsxRuntime(refractor.highlight(code, lang) as Nodes, {Fragment, jsx, jsxs});
};

export function RenderNestedObject({
  name,
  objProps,
  language,
}: {
  language: string;
  objProps: ParameterDef[];
  name?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <pre className="m-0 pt-1 pb-1">
        <div className="flex items-center gap-2">
          <code>{name ? name : 'Object'}</code>
          <button className="flex items-center" onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <Fragment>
                {'{'}
                <MinusCircledIcon />
              </Fragment>
            ) : (
              <Fragment>
                {'{'}
                <PlusCircledIcon />
                {'...}'}
              </Fragment>
            )}
          </button>
        </div>
        {expanded ? (
          <Fragment>
            <div className="flex flex-col gap-2 pl-4">
              {objProps.map(prop => (
                <div key={prop.name}>
                  {prop.description && (
                    <div>
                      <code>{codeToJsx(`// ${prop.description}`, language)}</code>
                    </div>
                  )}
                  {typeof prop.type === 'string' ? (
                    <code>{prop.name}: {codeToJsx(prop.type, language)},</code>
                  ) : (
                    <RenderNestedObject
                      name={prop.type.name}
                      objProps={prop.type.properties}
                      language={'json'}
                    />
                  )}
                </div>
              ))}
            </div>
            <div>{'}'}</div>
          </Fragment>
        ) : null}
      </pre>
    </div>
  );
}
