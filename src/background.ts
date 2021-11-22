import { projectConstants } from "./modules/constants";
import { dayOfWeekSelectAction } from "./background/dayOfWeekSelectAction";
import { dayOfWeekSelectSubmit } from "./background/dayOfWeekSelectSubmit";
import { assignAction } from "./background/assignAction";
import { assignSubmit } from "./background/assignSubmit";
import { verify } from "./modules/verify";

const express = require("express");
const app = express();
const querystring = require("querystring");
const getRawBody = require("raw-body");

app.use((request: any, result: any, next: any) => {
  getRawBody(request, (error: any, string: any) => {
    if (error) return next(error);
    request.text = string;
    next();
  });
});

app.post(projectConstants.server.path.interactivity, async (request: any, response: any) => {
  // 3秒以内に応答しないとエラーになってしまうので、先に応答しておく
  response.end();

  // リクエスト署名を検証
  if (
    !(await verify(
      request.get("x-slack-signature"),
      request.get("X-Slack-Request-Timestamp"),
      request.text.toString("utf8")
    ))
  ) {
    return;
  }

  const parsedPayload = querystring.parse(request.text.toString("utf8"), null, null);
  const payload = JSON.parse(parsedPayload["payload"]);

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
