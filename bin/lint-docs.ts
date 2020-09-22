#!/usr/bin/env ts-node
import fs from "fs";
import PlatformRegistry from "../src/shared/platformRegistry";

enum Level {
  error,
  warn,
}

type Violation = {
  level?: Level;
  message: string;
  context: string;
};

const hasWizardContent = (platformName, guideName = null) => {
  const path = guideName
    ? `src/wizard/${platformName}/${guideName}.md`
    : `src/wizard/${platformName}/index.md`;
  try {
    fs.statSync(path);
  } catch (err) {
    return false;
  }
  return true;
};

const testConfig = config => {
  const violations = [];
  if (!config.title) {
    violations.push({ level: Level.error, message: `Missing title` });
  }
  if (!config.caseStyle) {
    violations.push({ level: Level.warn, message: `Missing caseStyle` });
  }
  if (!config.supportLevel) {
    violations.push({ level: Level.warn, message: `Missing supportLevel` });
  }
  return violations;
};

const main = async () => {
  const platformRegistry = new PlatformRegistry();
  await platformRegistry.init();

  const violations: Violation[] = [];
  platformRegistry.platforms.forEach(platform => {
    // test for wizard
    testConfig(platform).forEach(violation => {
      violations.push({ ...violation, context: platform.key });
    });
    if (!hasWizardContent(platform.name)) {
      violations.push({
        level: Level.warn,
        message: `Missing wizard content`,
        context: platform.key,
      });
    }
    platform.guides.forEach(guide => {
      testConfig(platform).forEach(violation => {
        violations.push({ ...violation, context: guide.key });
      });
      if (!hasWizardContent(platform.name, guide.name)) {
        violations.push({
          level: Level.warn,
          message: `Missing wizard content`,
          context: guide.key,
        });
      }
    });
  });

  let numErrors = 0;
  violations.forEach(({ level, message, context }) => {
    if (level === Level.error) {
      numErrors += 1;
    }
    switch (level) {
      case Level.error:
        console.error(`ERROR: ${message} in ${context}`);
        break;
      case Level.warn:
        console.warn(`WARN: ${message} in ${context}`);
        break;
      default:
        console.info(`INFO: ${message} in ${context}`);
        break;
    }
  });
  return numErrors;
};

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .then(numErrors => {
    process.exit(numErrors > 0 ? 1 : 0);
  });
