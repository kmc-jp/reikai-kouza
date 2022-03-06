const config = require("./webpack.config");

module.exports = {
  ...config,
  entry: {
    "try": "./src/try.ts",
  },
};
