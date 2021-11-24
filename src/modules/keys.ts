import { readFile } from "fs/promises";
const path = require("path");

// keys.jsonの内容を取得
export const getKeys = async (): Promise<Keys> => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  return JSON.parse(await keyReader);
};

export interface Keys {
  slack: {
    bot_user_oauth_token: string;
    signing_secret: string;
  };
  mysql: {
    root_password: string;
  };
}
