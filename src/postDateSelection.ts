import { readFile } from "fs/promises";
import { projectConstants } from "./modules/constants";
const axios = require('axios');
const path = require("path");

const post = async () => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  const message =  [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "希望する曜日を選択してください。\nここで選択した曜日に優先的に割り振られます。"
      },
      "accessory": {
        "type": "static_select",
        "placeholder": {
          "type": "plain_text",
          "text": "希望曜日",
          "emoji": true
        },
        "options": [
          {
            "text": {
              "type": "plain_text",
              "text": "月曜日",
              "emoji": true
            },
            "value": "value--Monday"
          },
          {
            "text": {
              "type": "plain_text",
              "text": "木曜日",
              "emoji": true
            },
            "value": "value--Thursday"
          },
          {
            "text": {
              "type": "plain_text",
              "text": "どちらでも (月曜日・木曜日)",
              "emoji": true
            },
            "value": "value--Both"
          }
        ],
        "action_id": "id--day-of-week-select"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "actions",
      "block_id": "id--submit",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "送信",
            "emoji": true
          },
          "value": "value--submit"
        }
      ]
    }
  ];

  await axios.post("https://slack.com/api/chat.postMessage", {
      channel: "@ryokohbato",
      blocks: JSON.stringify(message),
    }, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
      "Content-Type": 'application/json',
    },
  });
}

post();
