import { Channel, ChatPostMessageResponse, ConversationsListResponse, UsersListResponse } from "../types/slack";
import { projectConstants } from "./constants";
import { stringify } from "flatted";
import { getKeys } from "./keys";
const axios = require("axios");

// 例会講座用 公開Slackチャンネルに指定したメッセージを投稿
export const postText2Members = async (message: string) => {
  const data = await getKeys();

  const result = await axios.post(
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
  return result.data as ChatPostMessageResponse;
};

// 例会講座 運営用Slackチャンネルに指定したメッセージを投稿
// このメッセージは全てログチャンネルにも投稿する。
export const postText = async (message: string) => {
  const data = await getKeys();

  const result = await axios.post(
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
  await postText2Log(message);
  return result.data as ChatPostMessageResponse;
};

// 例会講座 ログ用Slackチャンネルに指定したメッセージを投稿
export const postText2Log = async (message: string) => {
  const data = await getKeys();

  const result = await axios.post(
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

  return result.data as ChatPostMessageResponse;
};

// アプリからのメッセージを直接送信
export const post2DM = async (id: string, blocks: string) => {
  const data = await getKeys();

  const result = await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel: `@${id}`,
      blocks: blocks,
      as_user: true,
    },
    {
      headers: {
        Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  // DM の送信はログにも流す
  await postText2Log(stringify(result));
  return result.data as ChatPostMessageResponse;
};

// メッセージを更新
export const updateDMMessage = async (id: string, timeStamp: string, text: string) => {
  const data = await getKeys();

  const conversationsChannels = (await getDMList()).filter((x) => {
    return x.is_im === true && x.user === id;
  });

  if (conversationsChannels.length === 0) {
    postText(`<@${id}> さんのDMのIDの取得に失敗しました。`);
    return;
  }

  await axios.post(
    "https://slack.com/api/chat.update",
    {
      channel: `${conversationsChannels[0].id}`,
      ts: timeStamp,
      as_user: true,
      blocks: [{ type: "section", text: { type: "plain_text", text: `${text}` } }],
    },
    {
      headers: {
        Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

const getDMList = async () => {
  const data = await getKeys();
  let result: any;
  let responses: Array<Channel> = [];

  do {
    result = await axios.get("https://slack.com/api/conversations.list", {
      headers: {
        Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
        "Content-Type": "application/json",
      },
      params: {
        types: "im",
      },
    });

    if (!(result.data as ConversationsListResponse).ok) {
      await postText("conversations list の取得に失敗しました。");
    }

    if ((result.data as ConversationsListResponse).channels != null) {
      responses = [...(result.data as ConversationsListResponse).channels!];
    }
  } while ((result.data as ConversationsListResponse).response_metadata?.next_cursor !== "");

  return responses;
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
