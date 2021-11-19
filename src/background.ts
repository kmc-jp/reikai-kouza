import { projectConstants } from "./modules/constants";
import { executeQuery } from "./modules/mysql";
import { readFile } from "fs/promises";
import { postDateSelection } from "./postDateSelection";
import { postText } from "./modules/slack";
import { dayOfWeekSelectAction } from "./background/dayOfWeekSelectAction";
import { dayOfWeekSelectSubmit } from "./background/dayOfWeekSelectSubmit";
import { assignAction } from "./background/assignAction";
import { assignSubmit } from "./background/assignSubmit";
const axios = require('axios');
const path = require("path");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(projectConstants.server.path.interactivity, async (request: any, response: any) => {
  // 3秒以内に応答しないとエラーになってしまうので、先に応答しておく
  response.end();

  const payload = JSON.parse(request.body["payload"]);

  if (payload["actions"] != null && payload["actions"].length > 0) {
    if (payload["actions"][0]["action_id"] != null) {
      switch (payload["actions"][0]["action_id"]) {
        // 希望曜日選択
        case projectConstants.interactivity.actionID.dayOfWeekSelect:
          dayOfWeekSelectAction(payload);
          break;

        case projectConstants.interactivity.actionID.assign:
          assignAction(payload);
          break;

        default:
          break;
      }
    }
    
    if (payload["actions"][0]["block_id"] != null) {
      switch (payload["actions"][0]["block_id"]) {
        // 希望曜日選択 送信ボタン
        case projectConstants.interactivity.blockID.dayOfWeekSelectSubmit:
          dayOfWeekSelectSubmit(payload);
          break;

        case projectConstants.interactivity.blockID.assign:
          assignSubmit(payload);
          break;

        default:
          break;
      }
    }
  }
});

app.listen(projectConstants.server.port);
