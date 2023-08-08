import {GatsbyNode} from 'gatsby';

import {createApiDocPages} from './createApiDocPages';
import {createApiGuides} from './createApiGuides';
import {createApiPages} from './createApiPages';
import {createApiReference} from './createApiReference';
import {createDocPages} from './createDocPages';
import {createPlatformPages} from './createPlatformPages';
import {createWizardDebugPages} from './createWizardDebugPages';

const createPages: GatsbyNode['createPages'] = async params => {
  const promises: Promise<void>[] = [
    createDocPages(params),
    createPlatformPages(params),
    createApiPages(params),
    createApiDocPages(params),
    createApiReference(params),
    createApiGuides(params),
  ];
  if (process.env.NODE_ENV !== 'production') {
    promises.push(createWizardDebugPages(params));
  }
  await Promise.all(promises);
};

export default createPages;
