const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const Answers = require("./answers");

const generateScreenshot = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "location",
      message: "Where would you like to save your screenshot?",
      filter: input => path.relative(process.cwd(), input.trim()),
      default: Answers.get("location"),
    },
    {
      type: "input",
      name: "filename",
      message: "What filename do you want to use for this file?",
      when: ({ location }) => !/\.(jpg|png|js)$/i.test(location),
      filter: input => input.trim(),
      default: Answers.get("filename"),
    },
    {
      type: "input",
      name: "width",
      message: "What is the width of the window?",
      default: Answers.get("width") || 1280,
      filter: input => new Number(input) || 1280,
    },
  ]);
  Answers.save(answers);

  const { location, filename, width } = answers;

  if (!location && !filename) {
    console.log("No screenshot destination provided");
    process.exit(1);
  }

  let fullPath = filename ? path.join(location, filename) : location;
  fullPath = `${fullPath.replace(/\.(jpg|png|js)$/, "")}.screenshot.js`;

  // Create the desination location if it does not exist.
  const dirname = path.dirname(fullPath);
  if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true });

  console.log(
    "Playwright will now open. Please navigate to the page you need and interact with the site to get it how you want it. When you are ready to save the screenshot, close the window."
  );

  const demo = "http://35.227.78.105:9000";
  execSync(
    `npx playwright codegen --viewport-size "${width}, 600" --target javascript -o ./${fullPath} "${demo}"`
  );

  // Doctor the result file to add screenshot
  const screenshotCode = `
  // Take a screenshot. You may also consider taking an element screenshot for more focus.
  // https://playwright.dev/docs/screenshots#element-screenshot
  const parsedPath = path.parse(__filename.replace('.screenshot', ''));
  parsedPath.ext = ".png";
  delete parsedPath.base;
  const screenshotPath = path.format(parsedPath);
  await page.screenshot({ path: screenshotPath });
`;
  const configFileBuffer = fs.readFileSync(path.join(process.cwd(), fullPath));
  let configContents = configFileBuffer.toString();
  configContents = `const path = require("path");\n${configContents}`;
  const i = configContents.indexOf("\n  // Close page");
  configContents =
    configContents.slice(0, i) + screenshotCode + configContents.slice(i);

  // Export the screenshot as a promise
  configContents = configContents.replace(
    "(async ()",
    "module.exports = (async ()"
  );

  // Set the screenshot to headless
  configContents = configContents.replace("headless: false", "headless: true");

  fs.writeFileSync(path.join(process.cwd(), fullPath), configContents);

  console.log(`Your screenshot config has been saved to ${fullPath}`);
  console.log(
    "To complete the screenshot, open this file a text editor and add the following code before the line that says `//Close page`"
  );
};

generateScreenshot();
