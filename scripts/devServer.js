const http = require("http");
const path = require("path");
const log = require("./utils/log");

const routeMap = {
  "/proxy": {
    module: "../api/proxy"
  }
};
const routes = Object.keys(routeMap);
routes.forEach(r => {
  routeMap[r].handler = require(routeMap[r].module);
});

const { Logger } = log;
const logger = new Logger();

const port = process.env.DEV_SERVER_PORT || 4000;

function handler(req, res) {
  for (let i = 0; i < routes.length; i++) {
    if (req.url.startsWith(routes[i])) {
      return routeMap[i].handler(req, res);
    }
  }

  res.setHeader("Content-Type", "text/plain");
  res.writeHead(200);
  res.end("OK");
  return;
}

logger.alwaysLog(
  `Development server started at ${log.emph("http://localhost:" + port)}`
);
const routeLogLines = ["Routes:"];
routes.forEach((r, i) => {
  const { module: modulePath } = routeMap[r];
  routeLogLines.push(
    `${log.dim(i === routes.length - 1 ? "└─" : "├─")}${log.emph(r)} ${log.dim(
      "->"
    )} ${path.basename(modulePath, ".js")} ${log.dim(
      "(" + path.resolve(__dirname, modulePath) + ")"
    )}`
  );
});
logger.log(routeLogLines.join("\n"));
http.createServer(handler).listen(port);
