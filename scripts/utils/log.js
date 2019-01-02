const chalk = require("chalk");

const prefix = chalk.italic;
const success = prefix.bold.green;
const error = prefix.bold.red;
const info = prefix.bold.blue;
const emph = chalk.yellow;
const dim = chalk.dim;

const INDENT_SPACES = 2;

function indent(level = 0) {
  return Array(level * INDENT_SPACES)
    .fill(" ")
    .join("");
}

function printLine(value, { prefix = "", level = 0, comma = false }) {
  console.log(indent(level) + prefix + value + (comma ? dim(",") : ""));
}

function fmtGeneric(thing, opts) {
  let str = "";
  if (thing === undefined) {
    str = "undefined";
  } else if (thing === null) {
    str = "null";
  } else {
    str = "" + thing;
  }
  printLine(emph(str), opts);
}

function fmtString(s, opts) {
  printLine(emph(`"${s}"`), opts);
}

function fmtArray(a, opts) {
  printLine(dim("["), { ...opts, comma: false });

  a.forEach((item, i) => {
    debug(item, { level: opts.level + 1, comma: i !== a.length - 1 });
  });

  printLine(dim("]"), { ...opts, prefix: "" });
}

function fmtObject(o, opts) {
  printLine(dim("{"), { ...opts, comma: false });

  Object.keys(o).forEach((key, i, keys) => {
    debug(o[key], {
      prefix: chalk.dim('"') + key + chalk.dim('": '),
      level: opts.level + 1,
      comma: i !== keys.length - 1
    });
  });

  printLine(dim("}"), { ...opts, prefix: "" });
}

function debug(thing, { prefix = "", level = 0, comma = false } = {}) {
  const opts = { prefix, level, comma };
  if (Array.isArray(thing)) {
    fmtArray(thing, opts);
    return null;
  } else {
    switch (typeof thing) {
      case "object":
        if (thing === null) {
          fmtGeneric(thing, opts);
          break;
        }
        fmtObject(thing, opts);
        break;
      case "string":
        fmtString(thing, opts);
        break;
      case "function":
      case "number":
      case "boolean":
      default:
        fmtGeneric(thing, opts);
        break;
    }
  }
}

class Logger {
  constructor(
    verbose = process.argv.includes("--verbose"),
    debug = process.argv.includes("--debug")
  ) {
    this.__verbose = verbose || debug;
    this.__debug = debug;
  }

  log(output) {
    if (this.__verbose) {
      this.alwaysLog(output);
    }
  }

  alwaysLog(output) {
    console.log(output);
  }

  debug(label, obj) {
    if (this.__debug) {
      this.alwaysDebug(label, obj);
    }
  }

  alwaysDebug(label, obj) {
    this.alwaysLog(label);
    debug(obj);
  }

  error(err) {
    console.error(err);
  }
}

function prefixOutput(pre, preColorFn, output) {
  return dim("[") + preColorFn(pre) + dim("] ") + output.toString().trimRight();
}

function fmtChildOutput(childName, output, colorFn = info) {
  return prefixOutput(childName, colorFn, output);
}

function fmtParentOutput(parentName, childName, output, colorFn = info) {
  return prefixOutput(parentName, colorFn, `Task ${emph(childName)} ${output}`);
}

class ParentLogger {
  constructor(name = "parent") {
    this.name = name;
  }
  logStart(childName) {
    console.log(fmtParentOutput(this.name, childName, "started"));
  }

  logStdout(childName, stdout) {
    stdout
      .toString()
      .split("\n")
      .forEach(line => {
        if (line) {
          console.log(fmtChildOutput(childName, line));
        }
      });
  }

  logStderr(childName, stderr) {
    stderr
      .toString()
      .split("\n")
      .forEach(line => {
        if (line) {
          console.error(fmtChildOutput(childName, line, error));
        }
      });
  }

  logError(childName, err) {
    console.error(
      fmtParentOutput(
        this.name,
        childName,
        `encountered ${error("error")}:\n${err}`
      )
    );
  }

  logExit(childName, code) {
    console.log(
      fmtParentOutput(
        this.name,
        childName,
        `exited with code ${emph(code)}`,
        code === 0 ? success : error
      )
    );
  }
}

module.exports = {
  error,
  success,
  info,
  dim,
  emph,
  Logger,
  ParentLogger
};
