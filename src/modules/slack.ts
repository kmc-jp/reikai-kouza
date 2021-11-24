import { projectConstants } from "./constants";
import { getKeys } from "./keys";
const axios = require("axios");

// 例会講座用 公開Slackチャンネルに指定したメッセージを投稿
export const postText2Members = async (message: string) => {
  const data = await getKeys();

  await axios.post(
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
};

// 例会講座 運営用Slackチャンネルに指定したメッセージを投稿
// このメッセージは全てログチャンネルにも投稿する。
export const postText = async (message: string) => {
  const data = await getKeys();

  await axios.post(
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
};

// 例会講座 ログ用Slackチャンネルに指定したメッセージを投稿
export const postText2Log = async (message: string) => {
  const data = await getKeys();

  await axios.post(
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
};

// アプリからのメッセージを直接送信
export const post2DM = async (id: string, blocks: string) => {
  const data = await getKeys();

  await axios.post(
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

// 型定義は以下のリポジトリから
// https://github.com/slackapi/node-slack-sdk

export interface Member {
  id?: string;
  team_id?: string;
  name?: string;
  deleted?: boolean;
  color?: string;
  real_name?: string;
  tz?: string;
  tz_label?: string;
  tz_offset?: number;
  profile?: Profile;
  is_admin?: boolean;
  is_owner?: boolean;
  is_primary_owner?: boolean;
  is_restricted?: boolean;
  is_ultra_restricted?: boolean;
  is_bot?: boolean;
  is_app_user?: boolean;
  updated?: number;
  is_email_confirmed?: boolean;
  who_can_share_contact_card?: string;
  is_workflow_bot?: boolean;
  has_2fa?: boolean;
  locale?: string;
  enterprise_user?: EnterpriseUser;
  is_invited_user?: boolean;
}

interface EnterpriseUser {
  id?: string;
  enterprise_id?: string;
  enterprise_name?: string;
  is_admin?: boolean;
  is_owner?: boolean;
  teams?: string[];
}

interface Profile {
  title?: string;
  phone?: string;
  skype?: string;
  real_name?: string;
  real_name_normalized?: string;
  display_name?: string;
  display_name_normalized?: string;
  status_text?: string;
  status_emoji?: string;
  status_emoji_display_info?: StatusEmojiDisplayInfo[];
  status_expiration?: number;
  avatar_hash?: string;
  image_original?: string;
  is_custom_image?: boolean;
  email?: string;
  pronouns?: string;
  first_name?: string;
  last_name?: string;
  image_24?: string;
  image_32?: string;
  image_48?: string;
  image_72?: string;
  image_192?: string;
  image_512?: string;
  image_1024?: string;
  status_text_canonical?: string;
  team?: string;
  api_app_id?: string;
  bot_id?: string;
  always_active?: boolean;
  guest_invited_by?: string;
  guest_expiration_ts?: number;
}

interface StatusEmojiDisplayInfo {
  emoji_name?: string;
  display_alias?: string;
  display_url?: string;
}

export type UsersListResponse = WebAPICallResult & {
  ok?: boolean;
  members?: Member[];
  cache_ts?: number;
  offset?: string;
  response_metadata?: ResponseMetadata;
  error?: string;
  needed?: string;
  provided?: string;
};

interface WebAPICallResult {
  ok: boolean;
  error?: string;
  response_metadata?: {
    warnings?: string[];
    next_cursor?: string;

    scopes?: string[];
    acceptedScopes?: string[];
    retryAfter?: number;
    messages?: string[];
  };
  [key: string]: unknown;
}

export interface ResponseMetadata {
  next_cursor?: string;
}
