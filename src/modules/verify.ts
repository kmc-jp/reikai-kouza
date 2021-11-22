import { readFile } from "fs/promises";
const crypto = require("crypto");
const path = require("path");

export const verify = async (
  xSlackSignature: string,
  xSlackRequestTimestamp: string,
  payload: string
): Promise<boolean> => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  const baseStr = `v0:${xSlackRequestTimestamp}:${payload}`;

  const hash = crypto.createHmac("sha256", JSON.parse(data)["slack"]["signing_secret"]).update(baseStr).digest("hex");

  return `v0=${hash}` === xSlackSignature;
};
