import createDocPages from "./createDocPages";
import createPlatformPages from "./createPlatformPages";
import createWizardDebugPages from "./createWizardDebugPages";
import createApiPages from "./createApiPages";
import createApiDocPages from "./createApiDocPages";
import createApiReference from "./createApiReference";

export default async function(params) {
  const promises: Promise<void>[] = [
    createDocPages(params),
    createPlatformPages(params),
    createApiPages(params),
    createApiDocPages(params),
    createApiReference(params),
  ];
  if (process.env.NODE_ENV !== "production") {
    promises.push(createWizardDebugPages(params));
  }
  await Promise.all(promises);
}
