import {Fragment} from 'react';

type Props = {
  children: JSX.Element;
  location: string;
  name: string;
};

const getDescriptiveLocation = (location: string): JSX.Element => {
  switch (location) {
    case 'env':
      return <Fragment>in System Environment</Fragment>;
    case 'yaml':
      return (
        <Fragment>
          in <code>config.yaml</code>
        </Fragment>
      );
    case 'python':
      return (
        <Fragment>
          in <code>sentry.conf.py</code>
        </Fragment>
      );
    case 'cli':
      return <Fragment>on the command line</Fragment>;
    default:
      throw new Error('Invalid location');
  }
};

export function ConfigValue({name, location, children}: Props): JSX.Element {
  return (
    <div style={{marginBottom: '2rem'}}>
      <h4 style={{marginBottom: 0, fontWeight: 'bold'}}>
        <code>{name}</code>
      </h4>
      <p>
        <small>Declared {getDescriptiveLocation(location)}</small>
      </p>
      {children}
    </div>
  );
}
