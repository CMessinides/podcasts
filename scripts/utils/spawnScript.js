const path = require("path");
const spawn = require("child_process").spawn;
const log = require("./log");

function prefixOutput(pre, preColorFn, output) {
  return (
    log.dim("[") +
    preColorFn(pre) +
    log.dim("] ") +
    output.toString().trimRight()
  );
}

function createParentLogger(parentName, childName) {
  function fmtChildOutput(output, colorFn = log.info) {
    return prefixOutput(childName, colorFn, output);
  }
  function fmtParentOutput(output, colorFn = log.info) {
    return prefixOutput(
      parentName,
      colorFn,
      `Script ${log.emph(childName)} ${output}`
    );
  }

  return {
    logStart() {
      console.log(fmtParentOutput("started"));
    },
    logStdout(stdout) {
      stdout
        .toString()
        .split("\n")
        .forEach(line => {
          if (line) {
            console.log(fmtChildOutput(line));
          }
        });
    },
    logStderr(stderr) {
      stderr
        .toString()
        .split("\n")
        .forEach(line => {
          if (line) {
            console.error(fmtChildOutput(line, log.error));
          }
        });
    },
    logError(err) {
      console.error(
        fmtParentOutput(`encountered ${log.error("error")}:\n${err}`)
      );
    },
    logExit(code) {
      console.log(
        fmtParentOutput(
          `exited with code ${log.emph(code)}`,
          code === 0 ? log.success : log.error
        )
      );
    }
  };
}

module.exports = {
  spawnScript(
    scriptPath,
    parentName,
    { name, argv = process.argv.slice(2), ext = ".js" } = {}
  ) {
    const childName = name || path.basename(scriptPath, ext);
    const logger = createParentLogger(parentName, childName);
    const child = spawn("node", [scriptPath, "--color", ...argv]);

    logger.logStart();

    child.stdout.on("data", logger.logStdout);

    child.stderr.on("data", logger.logStderr);

    child.on("error", logger.logError);

    child.on("close", logger.logExit);
  }
};
