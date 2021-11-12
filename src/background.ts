import { projectConstants } from "./modules/constants";
import { executeQuery } from "./modules/mysql";
import { readFile } from "fs/promises";
import { postDateSelection } from "./postDateSelection";
import { postText } from "./modules/slack";
const axios = require('axios');
const path = require("path");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(projectConstants.server.path.interactivity, async (request: any, response: any) => {
  // 3秒以内に応答しないとエラーになってしまうので、先に応答しておく
  response.end();
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  const payload = JSON.parse(request.body["payload"]);

  if (payload["actions"] != null && payload["actions"].length > 0) {
    if (payload["actions"][0]["action_id"] != null) {
      switch (payload["actions"][0]["action_id"]) {
        // 希望曜日選択
        case projectConstants.interactivity.actionID.dayOfWeekSelect:
          switch (payload["actions"][0]["selected_option"]["value"]) {
            // 月曜日
            case projectConstants.interactivity.values.dayOfWeekSelect.Monday:
              await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET preferred_day_of_week = ? WHERE id = ?;`,
              [
                projectConstants.values.preferredDayOfWeek.Monday.value,
                payload["user"]["id"],
              ]);
              break;
            // 木曜日
            case projectConstants.interactivity.values.dayOfWeekSelect.Thursday:
              await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET preferred_day_of_week = ? WHERE id = ?;`,
              [
                projectConstants.values.preferredDayOfWeek.Thursday.value,
                payload["user"]["id"],
              ]);
              break;
            // どちらでも
            case projectConstants.interactivity.values.dayOfWeekSelect.Both:
              await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET preferred_day_of_week = ? WHERE id = ?;`,
              [
                projectConstants.values.preferredDayOfWeek.Both.value,
                payload["user"]["id"],
              ]);
              break;
          }
          break;
      
        default:
          break;
      }
    }
    
    if (payload["actions"][0]["block_id"] != null) {
      switch (payload["actions"][0]["block_id"]) {
        // 送信ボタン
        case projectConstants.interactivity.blockID.submit:
          const registeredData = (await executeQuery(`SELECT preferred_day_of_week from ${projectConstants.mysql.tableName} WHERE id = ? ;`,
          [
            payload["user"]["id"],
          ]))[0]["preferred_day_of_week"];
          let dayOfWeek = "";

          switch(registeredData) {
            // 未回答の場合はフォームを再送信
            case projectConstants.values.preferredDayOfWeek.Unanswered.value:
              await axios.post(payload["response_url"], {
                channel: projectConstants.slack.memberChannelName,
                text: `希望曜日が未回答のまま送信されました。\n再度回答し直してください。`,
                }, {
                headers: {
                  "Authorization": `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
                  "Content-Type": 'application/json',
                },
              });
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

          await axios.post(payload["response_url"], {
            channel: projectConstants.slack.memberChannelName,
            text: `<@${payload["user"]["id"]}> 「${dayOfWeek}」で登録が完了しました。`,
            }, {
            headers: {
              "Authorization": `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
              "Content-Type": 'application/json',
            },
          });
          await postText(`<@${payload["user"]["id"]}> 「${dayOfWeek}」で登録`);
          break;
      
        default:
          break;
      }
    }
  }
});

app.listen(projectConstants.server.port);
