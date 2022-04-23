import { assignAction } from "../background/assignAction";
import { assignSubmit } from "../background/assignSubmit";
import { cancelLaterSubmit } from "../background/cancelLaterSubmit";
import { dayOfWeekSelectAction } from "../background/dayOfWeekSelectAction";
import { dayOfWeekSelectSubmit } from "../background/dayOfWeekSelectSubmit";
import { projectConstants } from "../modules/constants";
import { postText2OwnerChannel } from "../modules/slack";
import { verify } from "../modules/verify";

import type { SlackRequest, SlackResponse } from "../@types/slack";

const querystring = require("querystring");

const router = require("express").Router();

// /interactivity

router.post("/", async (request: SlackRequest, response: SlackResponse) => {
  // 3秒以内に応答しないとエラーになってしまうので、先に応答しておく
  response.end();

  // リクエスト署名を検証
  if (
    !(await verify(
      request.get("x-slack-signature")!,
      request.get("X-Slack-Request-Timestamp")!,
      request.text.toString("utf8")
    ))
  ) {
    await postText2OwnerChannel(":animation_police_car_light: 署名の検証に失敗しました。");
    return;
  }

  // タイムスタンプの値が整数値であることを保証
  if (Number.isInteger(request.get("X-Slack-Request-Timestamp"))) {
    return;
  }

  // 5分以上前のものは破棄
  const now = new Date();

  if (Number.parseInt(request.get("X-Slack-Request-Timestamp")!) < Math.floor(now.getTime() / 1000) - 5 * 60) {
    await postText2OwnerChannel(":animation_police_car_light: 5分以上前のリクエストを破棄します。");
    return;
  }

  // URLエンコードされているためパース処理
  const parsedPayload = querystring.parse(request.text.toString("utf8"), null, null);
  const payload = JSON.parse(parsedPayload["payload"]);

  if (payload["actions"] != null && payload["actions"].length > 0) {
    if (payload["actions"][0]["action_id"] != null) {
      switch (payload["actions"][0]["action_id"]) {
        // 希望曜日選択
        case projectConstants.interactivity.actionID.dayOfWeekSelect:
          dayOfWeekSelectAction(payload);
          break;

        // 担当日選択
        case projectConstants.interactivity.actionID.assignmentSelect:
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

        // 担当日選択 送信ボタン
        case projectConstants.interactivity.blockID.assignmentSelectSubmit:
          assignSubmit(payload);
          break;

        // 担当キャンセル 送信ボタン
        case projectConstants.interactivity.blockID.cancelLaterSubmit:
          cancelLaterSubmit(payload);
          break;

        default:
          break;
      }
    }
  }
});

module.exports = router;
