import { readFile } from "fs/promises";

import type { Keys } from "../@types/keys";

const path = require("path");

// keys.jsonの内容を取得
export const getKeys = async (): Promise<Keys> => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  return JSON.parse(await keyReader);
};
