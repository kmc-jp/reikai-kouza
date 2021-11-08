const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    "registerExistingMembers": "./src/registerExistingMembers.ts",
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
