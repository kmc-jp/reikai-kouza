import { ChatPostMessageResponse, UsersListResponse } from "../types/slack";
import { projectConstants } from "./constants";
import { getKeys } from "./keys";
const axios = require("axios");

// 例会講座用 公開Slackチャンネルに指定したメッセージを投稿
export const postText2Members = async (message: string) => {
  const data = await getKeys();

  const result: ChatPostMessageResponse = await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel: projectConstants.slack.memberChannelName,
      text: message,
    },
    {
      headers: {
        Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  await postText(message);
  return result;
};

// 例会講座 運営用Slackチャンネルに指定したメッセージを投稿
// このメッセージは全てログチャンネルにも投稿する。
export const postText = async (message: string) => {
  const data = await getKeys();

  const result: ChatPostMessageResponse = await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel: projectConstants.slack.ownerChannelName,
      text: message,
    },
    {
      headers: {
        Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  // ownerチャンネルへの投稿はlogチャンネルにも流す
  await post2DM("", message);
  return result;
};

// 例会講座 ログ用Slackチャンネルに指定したメッセージを投稿
export const postText2Log = async (message: string) => {
  const data = await getKeys();

  const result: ChatPostMessageResponse = await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel: projectConstants.slack.logChannelName,
      text: message,
    },
    {
      headers: {
        Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return result;
};

// アプリからのメッセージを直接送信
export const post2DM = async (id: string, blocks: string) => {
  const data = await getKeys();

  const result: ChatPostMessageResponse = await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel: `@${id}`,
      blocks: blocks,
    },
    {
      headers: {
        Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// response URL を用いたメッセージの更新を行う
export const updateByResponseURL = async (responseURL: string, message: string) => {
  const data = await getKeys();

  await axios.post(
    responseURL,
    {
      text: message,
    },
    {
      headers: {
        Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// ワークスペースの全ユーザーを取得
export const getMemberList = async (): Promise<UsersListResponse> => {
  const data = await getKeys();

  const userList = await axios.get("https://slack.com/api/users.list", {
    headers: { Authorization: `Bearer ${data.slack.bot_user_oauth_token}` },
  });

  return userList["data"] as UsersListResponse;
};
