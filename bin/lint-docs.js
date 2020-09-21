#!/usr/bin/env node

const fs = require("fs");

const fetchGuideList = async platformName => {
  const path = `src/platforms/${platformName}/guides`;
  let results = [];
  let dir;
  try {
    dir = fs.opendirSync(path);
  } catch (err) {
    return results;
  }
  for await (const dirent of dir) {
    if (dirent.isDirectory() && dirent.name !== "common") {
      results.push({
        name: dirent.name,
      });
    }
  }
  return results;
};

const fetchPlatformList = async () => {
  let results = [];
  const dir = fs.opendirSync("src/platforms");
  for await (const dirent of dir) {
    if (dirent.isDirectory() && dirent.name !== "common") {
      results.push({
        name: dirent.name,
        guides: await fetchGuideList(dirent.name),
      });
    }
  }
  return results;
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

const main = async () => {
  let numErrors = 0;
  let platforms = await fetchPlatformList();
  platforms.forEach(platform => {
    // test for wizard
    if (!hasWizardContent(platform.name)) {
      numErrors += 1;
      console.error(`Missing wizard content for ${platform.name}`);
    }
    platform.guides.forEach(guide => {
      if (!hasWizardContent(platform.name, guide.name)) {
        numErrors += 1;
        console.error(
          `Missing wizard content for ${platform.name} -> ${guide.name}`
        );
      }
    });
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
