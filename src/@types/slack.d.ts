import { Request, Response } from "express";

export interface SlackRequest extends Request {
  text: any;
}

export interface SlackResponse extends Response {}

export interface SlashCommandResponse {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  api_app_id: string;
  is_enterprise_install: string;
  response_url: string;
  trigger_id: string;
}

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

export type ChatPostMessageResponse = WebAPICallResult & {
  ok?: boolean;
  channel?: string;
  ts?: string;
  message?: Message;
  error?: string;
  deprecated_argument?: string;
  response_metadata?: ResponseMetadata;
  needed?: string;
  provided?: string;
};

interface Message {
  bot_id?: string;
  type?: string;
  text?: string;
  user?: string;
  ts?: string;
  team?: string;
  bot_profile?: BotProfile;
  thread_ts?: string;
  parent_user_id?: string;
  subtype?: string;
  username?: string;
  icons?: MessageIcons;
  root?: Root;
  blocks?: MessageBlock[];
  attachments?: Attachment[];
}

interface Attachment {
  text?: string;
  id?: number;
  fallback?: string;
  blocks?: AttachmentBlock[];
  color?: string;
  msg_subtype?: string;
  callback_id?: string;
  pretext?: string;
  service_url?: string;
  service_name?: string;
  service_icon?: string;
  author_id?: string;
  author_name?: string;
  author_link?: string;
  author_icon?: string;
  from_url?: string;
  original_url?: string;
  author_subname?: string;
  channel_id?: string;
  channel_name?: string;
  bot_id?: string;
  indent?: boolean;
  is_msg_unfurl?: boolean;
  is_reply_unfurl?: boolean;
  is_thread_root_unfurl?: boolean;
  is_app_unfurl?: boolean;
  app_unfurl_url?: string;
  title?: string;
  title_link?: string;
  fields?: Field[];
  image_url?: string;
  image_width?: number;
  image_height?: number;
  image_bytes?: number;
  thumb_url?: string;
  thumb_width?: number;
  thumb_height?: number;
  video_html?: string;
  video_html_width?: number;
  video_html_height?: number;
  footer?: string;
  footer_icon?: string;
  ts?: string;
  mrkdwn_in?: string[];
  actions?: Action[];
  filename?: string;
  size?: number;
  mimetype?: string;
  url?: string;
  metadata?: Metadata;
}

interface Action {
  id?: string;
  name?: string;
  text?: string;
  style?: string;
  type?: string;
  value?: string;
  confirm?: ActionConfirm;
  options?: Option[];
  selected_options?: Option[];
  data_source?: string;
  min_query_length?: number;
  option_groups?: OptionGroup[];
  url?: string;
}

interface ActionConfirm {
  title?: string;
  text?: string;
  ok_text?: string;
  dismiss_text?: string;
}

interface OptionGroup {
  text?: string;
}

interface Option {
  text?: string;
  value?: string;
}

interface AttachmentBlock {
  type?: string;
  elements?: PurpleElement[];
  block_id?: string;
  fallback?: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  image_bytes?: number;
  alt_text?: string;
  title?: TextElement;
  text?: TextElement;
  fields?: TextElement[];
  accessory?: PurpleAccessory;
}

interface PurpleAccessory {
  type?: string;
  image_url?: string;
  alt_text?: string;
  fallback?: string;
  image_width?: number;
  image_height?: number;
  image_bytes?: number;
}

interface PurpleElement {
  type?: string;
  text?: TextElement;
  action_id?: string;
  url?: string;
  value?: string;
  style?: string;
  confirm?: ElementConfirm;
  placeholder?: TextElement;
  initial_channel?: string;
  response_url_enabled?: boolean;
  initial_conversation?: string;
  default_to_current_conversation?: boolean;
  filter?: Filter;
  initial_date?: string;
  initial_option?: InitialOption;
  min_query_length?: number;
  image_url?: string;
  alt_text?: string;
  fallback?: string;
  image_width?: number;
  image_height?: number;
  image_bytes?: number;
  initial_user?: string;
}

interface ElementConfirm {
  title?: TextElement;
  text?: TextElement;
  confirm?: TextElement;
  deny?: TextElement;
  style?: string;
}

interface TextElement {
  type?: string;
  text?: string;
  emoji?: boolean;
  verbatim?: boolean;
}

interface Filter {
  exclude_external_shared_channels?: boolean;
  exclude_bot_users?: boolean;
}

interface InitialOption {
  text?: TextElement;
  value?: string;
  description?: TextElement;
  url?: string;
}

interface Field {
  title?: string;
  value?: string;
  short?: boolean;
}

interface Metadata {
  thumb_64?: boolean;
  thumb_80?: boolean;
  thumb_160?: boolean;
  original_w?: number;
  original_h?: number;
  thumb_360_w?: number;
  thumb_360_h?: number;
  format?: string;
  extension?: string;
  rotation?: number;
  thumb_tiny?: string;
}

interface MessageBlock {
  type?: string;
  block_id?: string;
  text?: TextElement;
  accessory?: FluffyAccessory;
  elements?: FluffyElement[];
  call_id?: string;
  api_decoration_available?: boolean;
  call?: Call;
  fallback?: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  image_bytes?: number;
  alt_text?: string;
  title?: TextElement;
  fields?: TextElement[];
}

interface FluffyAccessory {
  fallback?: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  image_bytes?: number;
  type?: string;
  alt_text?: string;
  action_id?: string;
  initial_time?: string;
  placeholder?: TextElement;
}

interface Call {
  v1?: V1;
  media_backend_type?: string;
}

interface V1 {
  id?: string;
  app_id?: string;
  app_icon_urls?: AppIconUrls;
  date_start?: number;
  active_participants?: Participant[];
  all_participants?: Participant[];
  display_id?: string;
  join_url?: string;
  desktop_app_join_url?: string;
  name?: string;
  created_by?: string;
  date_end?: number;
  channels?: string[];
  is_dm_call?: boolean;
  was_rejected?: boolean;
  was_missed?: boolean;
  was_accepted?: boolean;
  has_ended?: boolean;
}

interface Participant {
  slack_id?: string;
  external_id?: string;
  avatar_url?: string;
  display_name?: string;
}

interface AppIconUrls {
  image_32?: string;
  image_36?: string;
  image_48?: string;
  image_64?: string;
  image_72?: string;
  image_96?: string;
  image_128?: string;
  image_192?: string;
  image_512?: string;
  image_1024?: string;
  image_original?: string;
}

interface FluffyElement {
  type?: string;
  action_id?: string;
  text?: TextElement | string;
  value?: string;
  verbatim?: boolean;
  emoji?: boolean;
  url?: string;
  style?: string;
  confirm?: ElementConfirm;
  placeholder?: TextElement;
  initial_channel?: string;
  response_url_enabled?: boolean;
  initial_conversation?: string;
  default_to_current_conversation?: boolean;
  filter?: Filter;
  initial_date?: string;
  initial_option?: InitialOption;
  min_query_length?: number;
  image_url?: string;
  alt_text?: string;
  fallback?: string;
  image_width?: number;
  image_height?: number;
  image_bytes?: number;
  initial_user?: string;
}

interface BotProfile {
  id?: string;
  deleted?: boolean;
  name?: string;
  updated?: number;
  app_id?: string;
  icons?: BotProfileIcons;
  team_id?: string;
}

interface BotProfileIcons {
  image_36?: string;
  image_48?: string;
  image_72?: string;
}

interface MessageIcons {
  emoji?: string;
  image_64?: string;
}

interface Root {
  type?: string;
  subtype?: string;
  text?: string;
  ts?: string;
  username?: string;
  icons?: MessageIcons;
  bot_id?: string;
  thread_ts?: string;
  parent_user_id?: string;
  reply_count?: number;
  reply_users_count?: number;
  latest_reply?: string;
  reply_users?: string[];
  subscribed?: boolean;
}

export type ConversationsListResponse = WebAPICallResult & {
  ok?: boolean;
  channels?: Channel[];
  response_metadata?: ResponseMetadata;
  error?: string;
  needed?: string;
  provided?: string;
};

interface Channel {
  id?: string;
  name?: string;
  is_channel?: boolean;
  is_group?: boolean;
  is_im?: boolean;
  created?: number;
  is_archived?: boolean;
  is_general?: boolean;
  unlinked?: number;
  name_normalized?: string;
  is_shared?: boolean;
  creator?: string;
  is_moved?: number;
  is_ext_shared?: boolean;
  is_global_shared?: boolean;
  is_org_default?: boolean;
  is_org_mandatory?: boolean;
  is_org_shared?: boolean;
  pending_shared?: string[];
  pending_connected_team_ids?: string[];
  is_pending_ext_shared?: boolean;
  conversation_host_id?: string;
  is_member?: boolean;
  is_private?: boolean;
  is_mpim?: boolean;
  topic?: Purpose;
  purpose?: Purpose;
  num_members?: number;
  shared_team_ids?: string[];
  internal_team_ids?: string[];
  previous_names?: string[];
  user?: string;
}

interface Purpose {
  value?: string;
  creator?: string;
  last_set?: number;
}
