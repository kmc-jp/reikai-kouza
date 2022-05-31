import { postText2LogChannel } from "../modules/slack";

import type { SlackRequest, SlackResponse } from "../@types/slack";

const router = require("express").Router();

// /check

// @ts-ignore requestは使用しない
router.get("/", async (request: SlackRequest, response: SlackResponse) => {
  await postText2LogChannel(":large_green_circle: OK");
  response.end();
});

module.exports = router;
