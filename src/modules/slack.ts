import { readFile } from "fs/promises";
import { projectConstants } from "./constants";
const axios = require("axios");
const path = require("path");

// 例会講座用 公開Slackチャンネルに指定したメッセージを投稿
export const postText2Members = async (message: string) => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel: projectConstants.slack.memberChannelName,
      text: message,
    },
    {
      headers: {
        Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
        "Content-Type": "application/json",
      },
    }
  );

  await postText(message);
};

// 例会講座 運営用Slackチャンネルに指定したメッセージを投稿
// このメッセージは全てログチャンネルにも投稿する。
export const postText = async (message: string) => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel: projectConstants.slack.ownerChannelName,
      text: message,
    },
    {
      headers: {
        Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
        "Content-Type": "application/json",
      },
    }
  );

  // ownerチャンネルへの投稿はlogチャンネルにも流す
  await postText2Log(message);
};

// 例会講座 ログ用Slackチャンネルに指定したメッセージを投稿
export const postText2Log = async (message: string) => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel: projectConstants.slack.logChannelName,
      text: message,
    },
    {
      headers: {
        Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
        "Content-Type": "application/json",
      },
    }
  );
};
