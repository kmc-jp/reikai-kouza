import { readFile } from "fs/promises";
const axios = require('axios'); 
const path = require("path");
import { updateFile } from "./updateFile";

const update = async () => {
  try {
    // key.jsonの内容を読み出し
    const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
    const data = await keyReader;

    // ユーザー一覧情報を取得
    const response = await axios.get("https://slack.com/api/users.list", {headers: {Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`}})

    // userlist.txtを更新
    updateFile("./data/userlist.txt", JSON.stringify(response.data));
  } catch (e) {
    console.error(e);
  }
}

update();
