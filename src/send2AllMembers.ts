import { readFile } from "fs/promises";
import { postText } from "./modules/slack";
import { postDateSelection } from "./postDateSelection";
const axios = require('axios');
const path = require("path");

// 全部員に送信
const post = async () => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  // ユーザー一覧情報を取得
  const response = await axios.get("https://slack.com/api/users.list", {headers: {Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`}})
  const responseJson = response["data"];

  if (responseJson["ok"]) {
    const allMembersID = (responseJson["members"] as Array<any>)
      .filter(member => member["id"] !== "USLACKBOT")                   // Slack Botを除外
      .filter(member => !member["is_bot"])                              // botを除外
      .filter(member => member["is_restricted"] === false)              // 制限されたユーザーを除外
      // 表示名は設定されていない場合がある
      .map(member => {
        return member["id"];
      });

    // リクエスト数超過を避けるため、3秒間隔で送信
    for (const id of allMembersID) {
      await postDateSelection(id);
      await new Promise(resolve => {
        setTimeout(resolve, 3000);
      })
    }
  }
  else
  {
    await postText("メンバー情報の取得に失敗しました。");
  }
}

post();
