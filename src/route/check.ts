import { postText2Log } from "../modules/slack";

import type { SlackRequest, SlackResponse } from "../@types/slack";

const router = require("express").Router();

// check

router.get("/", async (request: SlackRequest, response: SlackResponse) => {
  await postText2Log(":large_green_circle: OK");
  response.end();
});
