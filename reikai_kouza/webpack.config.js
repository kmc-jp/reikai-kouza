const path = require("path");

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    "additionalAssignTask": "./reikai_kouza/src/additionalAssignTask.ts",
    "assignTask": "./reikai_kouza/src/assignTask.ts",
    "publicAnnounce": "./reikai_kouza/src/publicAnnounce.ts",
    "registerExistingMembers": "./reikai_kouza/src/registerExistingMembers.ts",
    "reikai_kouza": "./reikai_kouza/src/reikai_kouza.ts",
    "send2AllMembers": "./reikai_kouza/src/send2AllMembers.ts",
    "updateMembers": "./reikai_kouza/src/updateMembers.ts",
    "updateStatus": "./reikai_kouza/src/updateStatus.ts",
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "../dist/reikai_kouza"),
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
