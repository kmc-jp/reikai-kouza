import axios, { AxiosError } from "axios";
import { stringify } from "flatted";

import { projectConstants } from "./constants";
import { getKeys } from "./keys";

import type { Channel, ChatPostMessageResponse, ConversationsListResponse, UsersListResponse } from "../@types/slack";

const postText = async (channel: string, message: string, postFunction?: Function) => {
  try {
    const data = await getKeys();

    const result = await axios.post<ChatPostMessageResponse>(
      "https://slack.com/api/chat.postMessage",
      {
        channel: channel,
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (typeof postFunction === "function") {
      await postFunction(message);
    }

    return result.data;
  } catch (error) {
    // 正常に投稿できなかった場合
    await postText2OwnerChannel(
      `<@ryokohbato>\n:red_circle: <#${channel}> への出力に失敗しました。 Status: ${
        (error as AxiosError).response?.status
      }\n${(error as AxiosError).message}\n${stringify(message)}`
    );
    return;
  }
};

const postBlocks = async (channel: string, blocks: string, postFunction?: Function) => {
  try {
    const data = await getKeys();

    const result = await axios.post<ChatPostMessageResponse>(
      "https://slack.com/api/chat.postMessage",
      {
        channel: channel,
        blocks: blocks,
      },
      {
        headers: {
          Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (typeof postFunction === "function") {
      await postFunction(blocks);
    }

    return result.data;
  } catch (error) {
    // 正常に投稿できなかった場合
    await postText2OwnerChannel(
      `<@ryokohbato>\n:red_circle: <#${channel}> への出力に失敗しました。 Status: ${
        (error as AxiosError).response?.status
      }\n${(error as AxiosError).message}\n${stringify(blocks)}`
    );
    return;
  }
};

// 例会講座用 公開Slackチャンネルに指定したメッセージを投稿
export const postText2MemberChannel = async (message: string) => {
  return postText(projectConstants.slack.memberChannelName, message, postText2OwnerChannel);
};

// 例会講座用 公開Slackチャンネルに指定したメッセージブロックを投稿
export const postBlocks2MemberChannel = async (blocks: string) => {
  return postBlocks(projectConstants.slack.memberChannelName, blocks, postBlocks2OwnerChannel);
};

// 例会講座 運営用Slackチャンネルに指定したメッセージを投稿
// このメッセージは全てログチャンネルにも投稿する。
export const postText2OwnerChannel = async (message: string) => {
  return postText(projectConstants.slack.ownerChannelName, message, postText2LogChannel);
};

// 例会講座 運営用Slackチャンネルに指定したメッセージブロックを投稿
// 全てログチャンネルにも投稿する。
export const postBlocks2OwnerChannel = async (blocks: string) => {
  return postText(projectConstants.slack.ownerChannelName, blocks, postBlocks2LogChannel);
};

// 例会講座 ログ用Slackチャンネルに指定したメッセージを投稿
export const postText2LogChannel = async (message: string) => {
  return postText(projectConstants.slack.logChannelName, message);
};

// 例会講座 ログ用Slackチャンネルに指定したメッセージブロックを投稿
export const postBlocks2LogChannel = async (blocks: string) => {
  return postText(projectConstants.slack.logChannelName, blocks);
};

// アプリからのメッセージを直接送信
export const post2DM = async (id: string, blocks: string) => {
  const data = await getKeys();

  try {
    const result = await axios.post<ChatPostMessageResponse>(
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
    await postText2LogChannel(`:large_green_circle: Status: ${result.status}\n${stringify(result.data)}`);
    return result.data;
  } catch (error) {
    // DMが正常に行えなかった場合
    await postText2OwnerChannel(
      `<@ryokohbato>\n:red_circle: <@${id}> さんへのDMの送信に失敗しました。 Status: ${
        (error as AxiosError).response?.status
      }\n${(error as AxiosError).message}\n${stringify(blocks)}`
    );
    return;
  }
};

// メッセージを更新
export const updateDMMessage = async (id: string, timeStamp: string, text: string) => {
  const data = await getKeys();

  const conversationsChannels = (await getDMList()).filter((x) => {
    return x.is_im === true && x.user === id;
  });

  if (conversationsChannels.length === 0) {
    await postText2OwnerChannel(`<@ryokohbato>\n:red_circle: <@${id}> さんのDMのIDの取得に失敗しました。`);
    return;
  }

  try {
    await axios.post(
      "https://slack.com/api/chat.update",
      {
        channel: `${conversationsChannels[0]!.id}`,
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
  } catch (error) {
    await postText2OwnerChannel(
      `<@ryokohbato>\n:red_circle: メッセージの更新に失敗しました。(chat.update) Status: ${
        (error as AxiosError).response?.status
      }\n${(error as AxiosError).message}\n${stringify((error as AxiosError).response?.data)}`
    );
  }
};

const getDMList = async () => {
  const data = await getKeys();
  let result: any;
  let responses: Array<Channel> = [];
  let requestCount = 0;
  let cursor = "";

  do {
    result = await axios.get("https://slack.com/api/conversations.list", {
      headers: {
        Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
        "Content-Type": "application/json",
      },
      params: {
        types: "im",
        limit: 500,
        cursor: cursor,
      },
    });

    if (!(result.data as ConversationsListResponse).ok) {
      await postText2OwnerChannel("<@ryokohbato>\n:red_circle: conversations list の取得に失敗しました。");
    }

    if ((result.data as ConversationsListResponse).channels != null) {
      responses = [...(result.data as ConversationsListResponse).channels!];
    }

    if ((result.data as ConversationsListResponse).response_metadata?.next_cursor == null) {
      await postText2OwnerChannel("<@ryokohbato>\n:red_circle: next_cursor の取得に失敗しました。");
      break;
    }

    cursor = (result.data as ConversationsListResponse).response_metadata?.next_cursor!;

    await postText2LogChannel(`:compression: next cursor: ${cursor}`);

    // 20リクエスト/min のAPI制限を超えないようにするための措置 (完全ではないもののほぼ防がれるはず)
    requestCount++;
    if (requestCount > 10) {
      await postText2OwnerChannel("<@ryokohbato>\n:red_circle: リクエスト数が10を超えました。1分間実行を停止します。");
      await new Promise((resolve) => {
        setTimeout(resolve, 60 * 1000);
      });
      requestCount = 0;
    }
  } while (cursor !== "");

  return responses;
};

// response URL を用いたメッセージの更新を行う
export const updateByResponseURL = async (responseURL: string, message: string) => {
  const data = await getKeys();

  try {
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
  } catch (error) {
    await postText2OwnerChannel(
      `<@ryokohbato>\n:red_circle: メッセージの更新に失敗しました。(response URL) Status: ${
        (error as AxiosError).response?.status
      }\n${(error as AxiosError).message}\n${stringify((error as AxiosError).response?.data)}`
    );
  }
};

// ワークスペースの全ユーザーを取得
export const getMemberList = async () => {
  const data = await getKeys();

  try {
    const userList = await axios.get<UsersListResponse>("https://slack.com/api/users.list", {
      headers: { Authorization: `Bearer ${data.slack.bot_user_oauth_token}` },
    });
    return userList.data;
  } catch (error) {
    await postText2OwnerChannel(
      `<@ryokohbato>\n:red_circle: ユーザーの取得に失敗しました。 Status: ${(error as AxiosError).response?.status}\n${
        (error as AxiosError).message
      }\n${stringify((error as AxiosError).response?.data)}`
    );
    return;
  }
};

export const updateAppHome = async (id: string, view: string) => {
  const data = await getKeys();

  try {
    await axios.post(
      "https://slack.com/api/views.publish",
      {
        user_id: id,
        view: view,
      },
      {
        headers: {
          Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    await postText2OwnerChannel(
      `<@ryokohbato>\n:red_circle: AppHomeの更新に失敗しました。 Status: ${(error as AxiosError).response?.status}\n${
        (error as AxiosError).message
      }\n${stringify((error as AxiosError).response?.data)}`
    );
  }
};
