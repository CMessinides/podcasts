const fs = require("fs");
const path = require("path");
const https = require("https");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

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
    throw new Error(
      `ERROR: Environment variable ${key} is required, but not set.
Make sure ${key} is set to the desired value before retrying.`
    );
  }
});

https.get(
  "https://api.figma.com/v1/files/" + ENV.FIGMA_MASTER_FILE_KEY,
  {
    headers: {
      "X-Figma-Token": ENV.FIGMA_ACCESS_TOKEN
    }
  },
  res => {
    const { statusCode } = res;

    if (statusCode !== 200) {
      console.error(
        `ERROR: Figma API responded with an error.
Expected a status code of 200; got ${statusCode}`
      );
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
        try {
          const colorMap = toColorMap(JSON.parse(rawData));
          const dest = path.resolve(
            __dirname,
            "../src/tokens/data/colors.json"
          );
          const json = JSON.stringify(colorMap, null, 4);
          fs.writeFileSync(dest, json);
          console.log("Color tokens retrieved from Figma:");
          console.log(json);
          console.log("Color tokens saved to: " + dest);
        } catch (e) {
          console.error(`ERROR: ${e}`);
          process.exitCode = 1;
        }
      })
      .on("error", e => {
        console.error(`ERROR: ${e.message}`);
        process.exitCode = 1;
      });
  }
);

function toColorMap(fileData) {
  const canvas = fileData.document.children.find(
    c => c.id === ENV.FIGMA_COLORS_CANVAS_ID
  );

  if (!canvas) {
    throw new Error(
      `No Figma canvas found for ID: ${ENV.FIGMA_COLORS_CANVAS_ID}`
    );
  }

  return canvas.children
    .filter(child => isColorScale(child))
    .map(scale => {
      return {
        name: scale.name.toLowerCase(),
        scale: toColorScaleMap(scale)
      };
    })
    .reduce((acc, current) => {
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

      return {
        name: swatch.name.toLowerCase(),
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

function isColorScale(node) {
  return isInstanceOf(node, ENV.FIGMA_COLOR_SCALE_ID);
}

function isColorSwatch(node) {
  return isInstanceOf(node, ENV.FIGMA_COLOR_SWATCH_ID);
}

function isInstanceOf(node, componentId) {
  return node.type === "INSTANCE" && node.componentId === componentId;
}
