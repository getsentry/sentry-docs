import createApiPages from "./createApiPages";
import createDocPages from "./createDocPages";
import createPlatformPages from "./createPlatformPages";
import createWizardDebugPages from "./createWizardDebugPages";

export default async function(params) {
  let promises: Promise<void>[] = [
    createApiPages(params),
    createDocPages(params),
    createPlatformPages(params),
  ];
  if (process.env.NODE_ENV !== "production") {
    promises.push(createWizardDebugPages(params));
  }
  await Promise.all(promises);
}
