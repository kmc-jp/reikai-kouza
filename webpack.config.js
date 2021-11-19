const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    "additionalAssignTask": "./src/additionalAssignTask.ts",
    "assignTask": "./src/assignTask.ts",
    "background": "./src/background.ts",
    "registerExistingMembers": "./src/registerExistingMembers.ts",
    "send2AllMembers": "./src/send2AllMembers.ts",
    "updateMembers": "/src/updateMembers.ts",
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
  devtool: "eval-source-map",
};
