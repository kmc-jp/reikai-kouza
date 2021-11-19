import { readFile } from "fs/promises";
import { projectConstants } from "./modules/constants";
import { toDate, toDBFormat } from "./modules/date";
import { executeQueries } from "./modules/mysql";
import { postText } from "./modules/slack";
const axios = require("axios");
const path = require("path");
const argv = require("minimist")(process.argv.slice(2));

// 既存の部員の登録
// 引数として、日付をYYYYMMDDの形式で与える必要がある
const register = async () => {
  try {
    // key.jsonの内容を読み出し
    const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
    const data = await keyReader;

    // ユーザー一覧情報を取得
    const response = await axios.get("https://slack.com/api/users.list", {
      headers: { Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}` },
    });
    const responseJson = response["data"];

    // 実際の日付の6ヶ月前の日付を求める。
    // 実際の日付は引数で指定する。
    const date_str = (argv["_"][0] as number).toString();
    const date = toDate(date_str);

    // 6ヶ月前 (簡単に180日前) の時刻を取得
    // ミリ秒単位であることに注意
    // 実際は時差があり9時間ずれているがどうでもいいので無視
    const date_halfYearAgo = new Date(date.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);

    const date_halfYearAgo__dbFormat = toDBFormat(date_halfYearAgo);

    if (responseJson["ok"]) {
      executeQueries(
        `INSERT INTO ${projectConstants.mysql.tableName} VALUES (?, ?, ?, ?, ?, ?, ?);`,
        (responseJson["members"] as Array<any>)
          .filter((member) => member["id"] !== "USLACKBOT") // Slack Botを除外
          .filter((member) => !member["is_bot"]) // botを除外
          .filter((member) => member["is_restricted"] === false) // 制限されたユーザーを除外
          // 表示名は設定されていない場合がある
          .map((member) => {
            return [
              member["id"],
              date_halfYearAgo__dbFormat,
              projectConstants.values.preferredDayOfWeek.Unanswered.value,
              projectConstants.values.assignedDate.None,
              date_halfYearAgo__dbFormat,
              date_halfYearAgo__dbFormat,
              projectConstants.values.announcementStatus.Unassigned,
            ];
          })
      );
    } else {
      await postText("メンバー情報の取得に失敗しました。");
    }
  } catch (error) {
    await postText(`部員の登録処理でエラーが発生しました。\n${error}`);
  }
};

register();
