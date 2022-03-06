const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    "additionalAssignTask": "./src/additionalAssignTask.ts",
    "assignTask": "./src/assignTask.ts",
    "background": "./src/background.ts",
    "publicAnnounce": "./src/publicAnnounce.ts",
    "registerExistingMembers": "./src/registerExistingMembers.ts",
    "send2AllMembers": "./src/send2AllMembers.ts",
    "updateMembers": "./src/updateMembers.ts",
    "updateStatus": "./src/updateStatus.ts",
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist/"),
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts/,
        exclude: /node_modules/,
        use: [
          "ts-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  devtool: process.env.NODE_ENV === "production" ? false : "eval-source-map",
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      })
    ],
  },
};
