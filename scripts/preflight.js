const path = require("path");
const { spawnScript } = require("./utils/spawn");
const { ParentLogger } = require("./utils/log");

const logger = new ParentLogger("preflight");

spawnScript(path.resolve(__dirname, "getColors.js"), logger);
