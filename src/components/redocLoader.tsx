import React from 'react';
import {RedocStandalone} from 'redoc';

export function RedocLoader() {
  console.log('gets to the component');
  const isSSR = typeof window === 'undefined';
  console.log(isSSR);
  return (
    <RedocStandalone
      specUrl="http://localhost:3000/open-api-new.json"
      options={{
        nativeScrollbars: true,
        theme: {colors: {primary: {main: '#dd5522'}}},
      }}
    />
  );
}
