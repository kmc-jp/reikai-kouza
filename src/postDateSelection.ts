import { projectConstants } from "./modules/constants";
import { post2DM, postText } from "./modules/slack";

export const postDateSelection = async (id: string) => {
  const message = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "希望する曜日を選択してください。\nここで選択した曜日に優先的に割り振られます。",
      },
      accessory: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "希望曜日",
          emoji: true,
        },
        options: [
          {
            text: {
              type: "plain_text",
              text: "月曜日",
              emoji: true,
            },
            value: `${projectConstants.interactivity.values.dayOfWeekSelect.Monday}`,
          },
          {
            text: {
              type: "plain_text",
              text: "木曜日",
              emoji: true,
            },
            value: `${projectConstants.interactivity.values.dayOfWeekSelect.Thursday}`,
          },
          {
            text: {
              type: "plain_text",
              text: "どちらでも (月曜日・木曜日)",
              emoji: true,
            },
            value: `${projectConstants.interactivity.values.dayOfWeekSelect.Both}`,
          },
        ],
        action_id: `${projectConstants.interactivity.actionID.dayOfWeekSelect}`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "actions",
      block_id: `${projectConstants.interactivity.blockID.dayOfWeekSelectSubmit}`,
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "送信",
            emoji: true,
          },
          value: "value--submit",
        },
      ],
    },
  ];

  await post2DM(id, JSON.stringify(message));
  await postText(`<@${id}> さんに、希望曜日調査を送付しました。`);
};
