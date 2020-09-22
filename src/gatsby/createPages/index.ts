import createApiPages from "./createApiPages";
import createDocPages from "./createDocPages";
import createPlatformPages from "./createPlatformPages";
import createWizardDebugPages from "./createWizardDebugPages";
import createDevelopmentApiPages from "./createDevelopmentApiPages";
import createDevelopmentApiDocPages from "./createDevelopmentApiDocPages";
import createDevelopmentApiReference from "./createDevelopmentApiReference";

export default async function(params) {
  const promises: Promise<void>[] = [
    createApiPages(params),
    createDocPages(params),
    createPlatformPages(params),
    createDevelopmentApiPages(params),
    createDevelopmentApiDocPages(params),
    createDevelopmentApiReference(params),
  ];
  if (process.env.NODE_ENV !== "production") {
    promises.push(createWizardDebugPages(params));
  }
  await Promise.all(promises);
}
