const glob = require("glob-promise");
const queue = require("queue");
const path = require("path");

const captureScreenshots = async () => {
  console.log("Finding screenshot configs…");
  const screenshotConfigs = await glob("**/*.screenshot.js");
  console.log(`Found ${screenshotConfigs.length} screenshot configs.`);
  const q = queue({ results: [] });
  q.concurrency = 5;

  screenshotConfigs.forEach(filepath => {
    q.push(async () => {
      console.log(`Capturing ${filepath}`);
      await require(path.join(process.cwd(), filepath));
    });
  });

  return new Promise((resolve, reject) => {
    q.start(err => {
      if (err) reject(err);
      resolve();
    });
  });
};

captureScreenshots();
