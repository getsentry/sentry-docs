import React from 'react';
import {RedocStandalone} from 'redoc';

export default function RedocComponent() {
  console.log('gets to the component');
  return <RedocStandalone specUrl="localhost:3000/open-api-new.json" />;
}
