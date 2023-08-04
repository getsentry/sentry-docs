// import {useEffect, useState} from 'react';

import React from 'react';

import RedocComponent from './redocComponent';

export default function RedocDemo() {
  console.log('gets to the component loader');
  // const [redocDemo, setRedocDemo] = useState(() => <div>Waiting...</div>);
  // useEffect(() => {
  //   import('./redocComponent.js').then(loadedComponent =>
  //     setRedocDemo(() => loadedComponent.default)
  //   );
  // });
  return <RedocComponent />;
}
