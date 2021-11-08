import { readFile } from "fs/promises";
import { projectConstants } from "./constants";
const axios = require('axios');
const path = require("path");

export const postText2Members = async (message: string) => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  const result = await axios.post("https://slack.com/api/chat.postMessage", {
    channel: projectConstants.slack.memberChannelName,
    text: message,
    }, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
      "Content-Type": 'application/json',
    },
  });
}

export const postText = async (message: string) => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  const result = await axios.post("https://slack.com/api/chat.postMessage", {
    channel: projectConstants.slack.ownerChannelName,
    text: message,
    }, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
      "Content-Type": 'application/json',
    },
  });

  // ownerチャンネルへの投稿はlogチャンネルにも流す
  await postText2Log(message);
}

export const postText2Log = async (message: string) => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  const result = await axios.post("https://slack.com/api/chat.postMessage", {
    channel: projectConstants.slack.logChannelName,
    text: message,
    }, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
      "Content-Type": 'application/json',
    },
  });
}
