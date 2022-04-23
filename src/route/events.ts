import { getAppHomeView } from "../background/appHomeView";
import { updateAppHome } from "../modules/slack";

import type { AppHomeOpened, Challenge } from "../@types/events";
import type { SlackRequest, SlackResponse } from "../@types/slack";

const router = require("express").Router();

// /events

router.post("/", async (request: SlackRequest, response: SlackResponse) => {
  const parsedRequest: Challenge | AppHomeOpened = JSON.parse(request.text.toString("utf8"));
  if (parsedRequest.type === "url_verification") {
    response.write(parsedRequest.challenge);
  } else if (parsedRequest.event.type === "app_home_opened") {
    await updateAppHome(
      parsedRequest.event.user,
      JSON.stringify({
        type: "home",
        blocks: getAppHomeView(parsedRequest.event.user),
      })
    );
  }
  response.end();
});
