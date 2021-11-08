import { readFile } from "fs/promises";
import { projectConstants } from "./modules/constants";
import { executeQueries } from "./modules/mysql";
import { postText } from "./modules/slack";
const axios = require('axios'); 
const path = require("path");

const register = async () => {
  try {
    // key.jsonの内容を読み出し
    const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
    const data = await keyReader;

    // ユーザー一覧情報を取得
    const response = await axios.get("https://slack.com/api/users.list", {headers: {Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`}})
    const responseJson = response["data"];

    const today = new Date();
    const today_ = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    if (responseJson["ok"]) {
      executeQueries((responseJson["members"] as Array<any>)
        .filter(member => member["id"] !== "USLACKBOT")                   // Slack Botを除外
        .filter(member => !member["is_bot"])                              // botを除外
        .filter(member => member["is_restricted"] === false)              // 制限されたユーザーを除外
        .map(member => `INSERT INTO ${projectConstants.mysql.tableName} VALUES (\
          '${member["id"]}',\
          '${member["profile"]["display_name"]}',\
          );`));
    }
    else
    {
      postText("メンバー情報の取得に失敗しました。");
    }
  } catch (e) {
    console.error(e);
  }
}

register();
