import { toUsualFormatWithTime } from "../modules/date";

export const viewBlocks = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "新しいUIを準備中です。V2アップデートをお楽しみに。",
    },
  },
];

export const viewTestBlocks = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "新しいUIを準備中です。V2アップデートをお楽しみに。",
    },
  },
  {
    type: "divider",
  },
  {
    type: "context",
    elements: [
      {
        type: "plain_text",
        text: `最終更新 ${toUsualFormatWithTime(new Date)}`,
        emoji: true,
      },
    ],
  },
];
