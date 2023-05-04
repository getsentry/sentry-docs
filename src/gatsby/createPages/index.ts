import createApiDocPages from './createApiDocPages';
import createApiPages from './createApiPages';
import createApiReference from './createApiReference';
import createDocPages from './createDocPages';
import createPlatformPages from './createPlatformPages';
import createWizardDebugPages from './createWizardDebugPages';

export default async function createPages(params) {
  const promises: Promise<void>[] = [
    createDocPages(params),
    createPlatformPages(params),
    createApiPages(params),
    createApiDocPages(params),
    createApiReference(params),
  ];
  if (process.env.NODE_ENV !== 'production') {
    promises.push(createWizardDebugPages(params));
  }
  await Promise.all(promises);
}
