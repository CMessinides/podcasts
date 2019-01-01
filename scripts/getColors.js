const fs = require("fs");
const path = require("path");
const https = require("https");
const log = require("./utils/log");
const chalk = require("chalk");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const { Logger } = log;
const logger = new Logger(
  process.argv.includes("--verbose"),
  process.argv.includes("--debug")
);

const ENV = {
  FIGMA_ACCESS_TOKEN: null,
  FIGMA_MASTER_FILE_KEY: null,
  FIGMA_COLORS_CANVAS_ID: null,
  FIGMA_COLOR_SWATCH_ID: null,
  FIGMA_COLOR_SCALE_ID: null
};

Object.keys(ENV).forEach(key => {
  ENV[key] = process.env[key];
  if (!ENV[key]) {
    throw new Error(`
Environment variable ${log.emph(key)} is required, but not set.
${log.dim(`Make sure ${key} is set to the desired value before retrying.`)}
    `);
  }
});

logger.log(
  `Requesting data for file ${log.emph(
    ENV.FIGMA_MASTER_FILE_KEY
  )} from Figma API`
);
https.get(
  "https://api.figma.com/v1/files/" + ENV.FIGMA_MASTER_FILE_KEY,
  {
    headers: {
      "X-Figma-Token": ENV.FIGMA_ACCESS_TOKEN
    }
  },
  handleResponse
);

function handleResponse(res) {
  const { statusCode } = res;

  if (statusCode !== 200) {
    logger.error(`
Figma API responded with an error.
Expected a status code of ${log.emph(200)}; got ${log.error(statusCode)}
`);
    process.exitCode = 1;
    res.resume();
    return;
  }

  res.setEncoding("utf8");
  let rawData = "";

  res.on("data", chunk => {
    rawData += chunk;
  });

  res
    .on("end", () => {
      logger.log(
        `Received data for file ${log.emph(
          ENV.FIGMA_MASTER_FILE_KEY
        )} from Figma API`
      );
      parseResponseData(rawData);
    })
    .on("error", e => {
      throw e;
    });
}

function parseResponseData(data) {
  const file = JSON.parse(data);
  const { name, version, lastModified } = file;
  const key = ENV.FIGMA_MASTER_FILE_KEY;
  logger.debug(`Figma master file ${log.emph(key)} data:`, {
    key,
    name,
    version,
    lastModified
  });
  const colorMap = toColorMap(JSON.parse(data));

  const dest = path.resolve(__dirname, "../src/tokens/data/colors.json");
  fs.writeFileSync(dest, JSON.stringify(colorMap, null, 4));
  logger.alwaysLog("Color tokens saved to " + log.emph(dest));
}

function toColorMap(fileData) {
  const canvas = fileData.document.children.find(
    c => c.id === ENV.FIGMA_COLORS_CANVAS_ID
  );

  if (!canvas) {
    throw new Error(
      "No Figma canvas found for ID " + log.emph(ENV.FIGMA_COLORS_CANVAS_ID)
    );
  }

  const { id, name } = canvas;
  logger.debug(`Figma canvas ${log.emph(id)} data:`, {
    id,
    name,
    numChildren: canvas.children.length
  });

  return canvas.children
    .filter(child => isColorScale(child))
    .map(scale => {
      const { id, name, componentId: instanceOf } = scale;
      logger.debug(`Figma color scale instance ${log.emph(id)} data:`, {
        id,
        name,
        instanceOf,
        numChildren: scale.children.length
      });
      return {
        name: name.toLowerCase(),
        scale: toColorScaleMap(scale)
      };
    })
    .reduce((acc, current) => {
      logColor(current.name, current.scale);
      return {
        ...acc,
        [current.name]: current.scale
      };
    }, {});
}

function toColorScaleMap(scale) {
  return scale.children
    .filter(child => isColorSwatch(child))
    .map(swatch => {
      const rect = swatch.children.find(child => child.type === "RECTANGLE");
      if (!rect) {
        return null;
      }

      const fill = rect.fills.find(
        fill => fill.type === "SOLID" && fill.visible !== false
      );
      if (!fill) {
        return null;
      }

      const { id, name } = swatch;
      logger.debug(`Figma color swatch instance ${log.emph(id)} data:`, {
        id,
        name,
        fill: {
          color: fill.color,
          fromRect: { id: rect.id, name: rect.name }
        },
        scale: { id: scale.id, name: scale.name }
      });

      return {
        name: name.toLowerCase(),
        color: {
          r: fill.color.r * 255,
          g: fill.color.g * 255,
          b: fill.color.b * 255
        }
      };
    })
    .reduce((acc, current) => {
      if (current === null) return acc;
      return {
        ...acc,
        [current.name]: current.color
      };
    }, {});
}

function logColor(name, scale) {
  const levels = Object.keys(scale);
  // find the longest level name
  const padTarget = levels.reduce((target, current) => {
    return current.length > target ? current.length : target;
  }, 0);
  logger.log(
    `Received color ${log.emph(name)} ${log.dim(
      "(" + levels.length + " levels)"
    )}`
  );
  levels.forEach((level, i) => {
    const { r, g, b } = scale[level];
    logger.log(
      `${chalk.dim(i === levels.length - 1 ? "└─" : "├─")} ${chalk.rgb(r, g, b)(
        "████"
      )} ${level.padEnd(padTarget)} ${log.dim(
        `(R: ${r.toString().padStart(3)}, G: ${g
          .toString()
          .padStart(3)}, B: ${b.toString().padStart(3)})`
      )}`
    );
  });
}

function isColorScale(node) {
  return isInstanceOf(node, ENV.FIGMA_COLOR_SCALE_ID);
}

function isColorSwatch(node) {
  return isInstanceOf(node, ENV.FIGMA_COLOR_SWATCH_ID);
}

function isInstanceOf(node, componentId) {
  return node.type === "INSTANCE" && node.componentId === componentId;
}
