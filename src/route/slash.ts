import { projectConstants } from "../modules/constants";
import { postText } from "../modules/slack";
import { verify } from "../modules/verify";
import { cancel } from "../slash/cancel";
import { check } from "../slash/check";

import type { SlackRequest, SlackResponse, SlashCommandResponse } from "../@types/slack";

const querystring = require("querystring");

const router = require("express").Router();

// slash

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
    await postText(":animation_police_car_light: スラッシュコマンド / 署名の検証に失敗しました。");
    return;
  }

  // タイムスタンプの値が整数値であることを保証
  if (Number.isInteger(request.get("X-Slack-Request-Timestamp"))) {
    return;
  }

  // 5分以上前のものは破棄
  const now = new Date();

  if (Number.parseInt(request.get("X-Slack-Request-Timestamp")!) < Math.floor(now.getTime() / 1000) - 5 * 60) {
    await postText(":animation_police_car_light: スラッシュコマンド / 5分以上前のリクエストを破棄します。");
    return;
  }

  // URLエンコードされているためパース処理
  const commandMessage: SlashCommandResponse = querystring.parse(request.text.toString("utf8"), null, null);

  switch (commandMessage.command) {
    case projectConstants.slash.check:
      check(commandMessage);
      break;

    case projectConstants.slash.cancel:
      cancel(commandMessage);
      break;

    default:
      break;
  }
});
