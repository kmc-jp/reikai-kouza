const path = require("path");

const config = require("../../webpack.config");

module.exports = {
  ...config,
  mode: "development",
  entry: {
    "build_api_server": "./docker/slack-api/src/server.ts",
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist/"),
  },
};
