const path = require("path");
const { spawnScript, spawnCommand } = require("./utils/spawn");
const { ParentLogger } = require("./utils/log");

const logger = new ParentLogger("dev");

spawnScript(path.resolve(__dirname, "devServer.js"), logger);
spawnCommand("./node_modules/.bin/react-scripts", ["start"], logger, {
  name: "react-scripts start"
});
