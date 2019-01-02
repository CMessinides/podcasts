const path = require("path");
const spawn = require("child_process").spawn;

function spawnChild(cmd, logger, { args = [], name = "child" } = {}) {
  const child = spawn(cmd, args);

  logger.logStart(name);

  child.stdout.on("data", data => logger.logStdout(name, data));

  child.stderr.on("data", data => logger.logStderr(name, data));

  child.on("error", err => logger.logError(name, err));

  child.on("close", code => logger.logExit(name, code));

  return child;
}

module.exports = {
  spawnScript(
    scriptPath,
    logger,
    { name, argv = process.argv.slice(2), ext = ".js" } = {}
  ) {
    spawnChild("node", logger, {
      args: [scriptPath, "--color", ...argv],
      name: name || path.basename(scriptPath, ext)
    });
  },
  spawnCommand(cmd, args, logger, { name, argv = process.argv.slice(2) } = {}) {
    spawnChild(cmd, logger, {
      args: [...args, "--color", ...argv],
      name: name || cmd
    });
  }
};
