const path = require("path");
const spawnScript = require("./utils/spawnScript").spawnScript;

const self = "preflight";

spawnScript(path.resolve(__dirname, "getColors.js"), self);
