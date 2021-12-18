import { Channel, ChatPostMessageResponse, ConversationsListResponse, UsersListResponse } from "../types/slack";
import { projectConstants } from "./constants";
import { stringify } from "flatted";
import { getKeys } from "./keys";
import axios, { AxiosError } from "axios";

// 例会講座用 公開Slackチャンネルに指定したメッセージを投稿
export const postText2Members = async (message: string) => {
  const data = await getKeys();

  try {
    const result = await axios.post<ChatPostMessageResponse>(
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
    return result.data;
  } catch (error) {
    // 正常に投稿できなかった場合
    await postText(
      `<@ryokohbato>\n:red_circle: <#${projectConstants.slack.memberChannelName}> への出力に失敗しました。 Status: ${
        (error as AxiosError).response?.status
      }\n${(error as AxiosError).message}\n${message}`
    );
    return;
  }
};

// 例会講座用 公開Slackチャンネルに指定したメッセージブロックを投稿
export const postBlocks2Members = async (blocks: string) => {
  const data = await getKeys();

  try {
    const result = await axios.post<ChatPostMessageResponse>(
      "https://slack.com/api/chat.postMessage",
      {
        channel: projectConstants.slack.memberChannelName,
        blocks: blocks,
      },
      {
        headers: {
          Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    await postBlocks(blocks);
    return result.data;
  } catch (error) {
    // 正常に投稿できなかった場合
    await postText(
      `<@ryokohbato>\n:red_circle: <#${projectConstants.slack.memberChannelName}> への出力に失敗しました。 Status: ${
        (error as AxiosError).response?.status
      }\n${(error as AxiosError).message}\n${stringify(blocks)}`
    );
    return;
  }
};

// 例会講座 運営用Slackチャンネルに指定したメッセージを投稿
// このメッセージは全てログチャンネルにも投稿する。
export const postText = async (message: string) => {
  const data = await getKeys();

  try {
    const result = await axios.post<ChatPostMessageResponse>(
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
    return result.data;
  } catch (error) {
    // 正常に投稿できなかった場合
    await postText(
      `<@ryokohbato>\n:red_circle: <#${projectConstants.slack.ownerChannelName}> への出力に失敗しました。 Status: ${
        (error as AxiosError).response?.status
      }\n${(error as AxiosError).message}\n${message}`
    );
    return;
  }
};

// 例会講座 運営用Slackチャンネルに指定したメッセージブロックを投稿
// 全てログチャンネルにも投稿する。
export const postBlocks = async (blocks: string) => {
  const data = await getKeys();

  try {
    const result = await axios.post<ChatPostMessageResponse>(
      "https://slack.com/api/chat.postMessage",
      {
        channel: projectConstants.slack.ownerChannelName,
        blocks: blocks,
      },
      {
        headers: {
          Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // ownerチャンネルへの投稿はlogチャンネルにも流す
    await postBlocks2Log(blocks);
    return result.data;
  } catch (error) {
    // 正常に投稿できなかった場合
    await postText(
      `<@ryokohbato>\n:red_circle: <#${projectConstants.slack.ownerChannelName}> への出力に失敗しました。 Status: ${
        (error as AxiosError).response?.status
      }\n${(error as AxiosError).message}\n${stringify(blocks)}`
    );
    return;
  }
};

// 例会講座 ログ用Slackチャンネルに指定したメッセージを投稿
export const postText2Log = async (message: string) => {
  const data = await getKeys();

  try {
    const result = await axios.post<ChatPostMessageResponse>(
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
    return result.data;
  } catch (error) {
    // ログが正常に書き込めなかった場合
    await postText(
      `<@ryokohbato>\n:red_circle: ログの出力に失敗しました。 Status: ${(error as AxiosError).response?.status}\n${
        (error as AxiosError).message
      }\n${message}`
    );
    return;
  }
};

// 例会講座 ログ用Slackチャンネルに指定したメッセージブロックを投稿
export const postBlocks2Log = async (blocks: string) => {
  const data = await getKeys();

  try {
    const result = await axios.post<ChatPostMessageResponse>(
      "https://slack.com/api/chat.postMessage",
      {
        channel: projectConstants.slack.logChannelName,
        blocks: blocks,
      },
      {
        headers: {
          Authorization: `Bearer ${data.slack.bot_user_oauth_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return result.data;
  } catch (error) {
    // ログが正常に書き込めなかった場合
    await postText(
      `<@ryokohbato>\n:red_circle: ログの出力に失敗しました。 Status: ${(error as AxiosError).response?.status}\n${
        (error as AxiosError).message
      }\n${stringify(blocks)}`
    );
    return;
  }
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
    await postText2Log(`:large_green_circle: Status: ${result.status}\n${stringify(result.data)}`);
    return result.data;
  } catch (error) {
    // DMが正常に行えなかった場合
    await postText(
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
    await postText(`<@ryokohbato>\n:red_circle: <@${id}> さんのDMのIDの取得に失敗しました。`);
    return;
  }

  try {
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
  } catch (error) {
    await postText(
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
    await postText(
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
    const userList = await axios.get("https://slack.com/api/users.list", {
      headers: { Authorization: `Bearer ${data.slack.bot_user_oauth_token}` },
    });
    return userList["data"] as UsersListResponse;
  } catch (error) {
    await postText(
      `<@ryokohbato>\n:red_circle: ユーザーの取得に失敗しました。 Status: ${(error as AxiosError).response?.status}\n${
        (error as AxiosError).message
      }\n${stringify((error as AxiosError).response?.data)}`
    );
  }
};
