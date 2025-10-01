import {Fragment} from 'react';

import {getCurrentPlatform} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {PlatformCategory} from 'sentry-docs/types';

import {Expandable} from './expandable';
import {codeToJsx} from './highlightCode';
import {SdkDefinition} from './sdkDefinition';
import {getPlatformHints} from './sdkOption';

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
  availableSince?: string;
  categorySupported?: PlatformCategory[];
  children?: React.ReactNode;
  language?: string;
};

export function SdkApi({
  name,
  children,
  signature,
  availableSince,
  parameters = [],
  language,
  categorySupported = [],
}: Props) {
  const {rootNode, path} = serverContext();
  const platform = getCurrentPlatform(rootNode, path);
  const lang = language || platform?.language || 'typescript';

  const {showBrowserOnly, showServerLikeOnly} = getPlatformHints(categorySupported);

  return (
    <SdkDefinition name={name} categorySupported={categorySupported}>
      {showBrowserOnly && <div className="italic text-sm">Only available on Client</div>}
      {showServerLikeOnly && (
        <div className="italic text-sm">Only available on Server</div>
      )}
      <pre className="mt-2 mb-2 text-sm">{codeToJsx(signature, lang)}</pre>
      {availableSince && (
        <p className="italic">
          Available Since: <code>{availableSince}</code>
        </p>
      )}
      {parameters.length ? (
        <Expandable title="Parameters">
          <div className="space-y-3">
            {parameters.map(param => (
              <ApiParameterDef key={param.name} language={lang} {...param} />
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
        <div className="flex">
          {typeof type === 'string' ? (
            <pre className="m-0 pt-1 pb-1 text-sm">
              <code>{codeToJsx(type, language)}</code>
            </pre>
          ) : (
            <pre className="m-0 pt-1 pb-1 text-sm">
              <NestedObject
                name={type.name}
                objProps={type.properties}
                language={language}
              />
            </pre>
          )}
        </div>

        {description ? <p className="m-0">{description}</p> : null}
      </div>
    </div>
  );
}

function NestedObject({
  name,
  objProps,
  language,
}: {
  language: string;
  objProps: ParameterDef[];
  name?: string;
}) {
  // NOTE: For now, we always render the nested object in typescript

  return (
    <div>
      <div>
        <code>
          {name ? name : 'Object'} {'{'}
        </code>
      </div>

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
                <NestedObject
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
    </div>
  );
}
