const { spawn, fork } = require("child_process");
const chokidar = require("chokidar");

const { name } = require("./package.json");

const activeEnv =
  process.env.GATSBY_ENV || process.env.NODE_ENV || "development";

const restartProcess = ({ reporter }) => {
  try {
    const [_, command, ...args] = process.argv;
    console.log(process.argv);
    console.log(command, args);
    spawn(command, args, {
      detached: true,
      stdio: "inherit",
    }).unref();
  } catch (err) {
    reporter.panic(err);
  } finally {
    process.exit();
  }
};

let watcher;

exports.onPreInit = ({ reporter }, { watch = [] }) => {
  if (activeEnv !== "development") {
    return;
  }
  reporter.info(`[${name}] running on PID: ${process.pid}`);

  watcher = chokidar.watch([...watch], { awaitWriteFinish: true });
  watcher.on("add", path => {
    reporter.info(`[${name}] add ${path}`);
  });
};

exports.onPostBootstrap = ({ reporter }) => {
  if (activeEnv !== "development") {
    return;
  }
  watcher.on("change", path => {
    restartProcess({ reporter });
    console.log("something changed: ", path);
  });
};
