import { readFile } from "fs/promises";
import { projectConstants } from "../modules/constants";
import { executeQuery } from "../modules/mysql";
import { postText } from "../modules/slack";
import { postDateSelection } from "../postDateSelection";
const axios = require("axios");
const path = require("path");

export const dayOfWeekSelectSubmit = async (payload: any) => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  const registeredData = (
    await executeQuery(`SELECT preferred_day_of_week from ${projectConstants.mysql.tableName} WHERE id = ? ;`, [
      payload["user"]["id"],
    ])
  )[0]["preferred_day_of_week"];
  let dayOfWeek = "";

  switch (registeredData) {
    // 未回答の場合はフォームを再送信
    case projectConstants.values.preferredDayOfWeek.Unanswered.value:
      await axios.post(
        payload["response_url"],
        {
          channel: projectConstants.slack.memberChannelName,
          text: `希望曜日が未回答のまま送信されました。\n再度回答し直してください。`,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
            "Content-Type": "application/json",
          },
        }
      );
      // 希望曜日の回答フォームを送信
      postDateSelection(payload["user"]["id"]);
      return;

    case projectConstants.values.preferredDayOfWeek.Monday.value:
      dayOfWeek = projectConstants.values.preferredDayOfWeek.Monday.text;
      break;
    case projectConstants.values.preferredDayOfWeek.Thursday.value:
      dayOfWeek = projectConstants.values.preferredDayOfWeek.Thursday.text;
      break;
    case projectConstants.values.preferredDayOfWeek.Both.value:
      dayOfWeek = projectConstants.values.preferredDayOfWeek.Both.text;
      break;
  }

  await axios.post(
    payload["response_url"],
    {
      channel: projectConstants.slack.memberChannelName,
      text: `<@${payload["user"]["id"]}> 「${dayOfWeek}」で登録が完了しました。`,
    },
    {
      headers: {
        Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
        "Content-Type": "application/json",
      },
    }
  );
  await postText(`<@${payload["user"]["id"]}> 「${dayOfWeek}」で登録`);
};
