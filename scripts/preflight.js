const path = require("path");
const execFile = require("child_process").execFile;
const chalk = require("chalk");

spawnScript("getColors");

function spawnScript(scriptName) {
  const scriptPath = path.resolve(__dirname, `./${scriptName}.js`);
  console.log(
    `${chalk.dim("Starting")} ${chalk.bold.white(scriptName)} ${chalk.dim(
      `(${scriptPath})`
    )}`
  );
  return execFile("node", [scriptPath], createLogger(scriptName));
}

function createLogger(label) {
  return function(error, stdout, stderr) {
    if (error) {
      console.error(
        chalk.red(
          `
Preflight script encountered an error in ${label} script:
${error}
        `.trim()
        )
      );
      process.exitCode = 1;
      return;
    }
    if (stdout) logOutput(label, stdout);
    if (stderr) logError(label, stderr);
  };
}

function logOutput(label, stdout) {
  console.log(
    `
${chalk.bold.yellow("LOG")} ${chalk.dim(`> ${label}`)}
${stdout}
`.trim()
  );
}

function logError(label, stderr) {
  console.error(
    `
${chalk.bold.red("ERROR")} ${chalk.dim(`> ${label}`)}
${stderr}
`.trim()
  );
}
