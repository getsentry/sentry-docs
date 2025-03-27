'use client';

import {Fragment, useState} from 'react';
import {MinusCircledIcon, PlusCircledIcon} from '@radix-ui/react-icons';

import {codeToJsx} from './highlightCode';
import {ParameterDef} from './sdkApi';

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

  // NOTE: For now, we always render the nested object in typescript

  return (
    <div>
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
                    <code>{codeToJsx(`// ${prop.description}`, 'typescript')}</code>
                  </div>
                )}
                <div>
                  {typeof prop.type === 'string' ? (
                    <Fragment>
                      <code>
                        {prop.name}
                        {!prop.required ? '?' : ''}:{' '}
                      </code>
                      <code>{codeToJsx(prop.type, 'typescript')},</code>
                    </Fragment>
                  ) : (
                    <RenderNestedObject
                      name={`${prop.name}${!prop.required ? '?' : ''}: ${prop.type.name || 'Object'}`}
                      objProps={prop.type.properties}
                      language={language}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div>{'}'}</div>
        </Fragment>
      ) : null}
    </div>
  );
}
