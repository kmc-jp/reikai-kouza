const path = require("path");

const config = require("../webpack.config.js");

module.exports = {
  ...config,
  mode: "development",
  entry: {
    "server": "./slack-api-test-server/src/server.ts",
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist/"),
  },
};
