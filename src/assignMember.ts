import { projectConstants, tableItemName } from "./modules/constants";
import { toUsualFormat, getNextDate, toDBFormat } from "./modules/date";
import { executeQuery } from "./modules/mysql";
import { post2DM } from "./modules/slack";

// 部員のIDと担当日を指定し、割り当て時の処理を行う
export const assignMember = async (id: string, today: Date, assignedDate: Date) => {
  // 選ばれた担当者にメッセージを送信
  await post2DM(id, getAssignMessage(assignedDate));

  // 割り当てグループ、割り当て日、割り当て状態を更新
  await executeQuery(
    `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignmentGroup} = ?, ${tableItemName.announcedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?`,
    [projectConstants.values.announcementStatus.NoReply, toDBFormat(assignedDate), toDBFormat(today), id]
  );
};

// 割り当てられた部員に送信するメッセージを取得
const getAssignMessage = (assignedDate: Date): string => {
  const postpone1Date = getNextDate(assignedDate);
  const postpone2Date = getNextDate(postpone1Date);
  const postpone3Date = getNextDate(postpone2Date);
  const postpone4Date = getNextDate(postpone3Date);

  const assignMessage = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${toUsualFormat(assignedDate)} の担当に指名されました。`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "直近2週間までは延期できます。選択欄から担当日を選んでください。担当を断る場合は、「 *担当しない* 」を選択してください。",
      },
      accessory: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "担当日を選択",
          emoji: true,
        },
        options: [
          {
            text: {
              type: "plain_text",
              text: `${toUsualFormat(assignedDate)}`,
              emoji: true,
            },
            value: projectConstants.interactivity.values.assign.OK,
          },
          {
            text: {
              type: "plain_text",
              text: `${toUsualFormat(postpone1Date)} に延期`,
              emoji: true,
            },
            value: projectConstants.interactivity.values.assign.Postpone1,
          },
          {
            text: {
              type: "plain_text",
              text: `${toUsualFormat(postpone2Date)} に延期`,
              emoji: true,
            },
            value: projectConstants.interactivity.values.assign.Postpone2,
          },
          {
            text: {
              type: "plain_text",
              text: `${toUsualFormat(postpone3Date)} に延期`,
              emoji: true,
            },
            value: projectConstants.interactivity.values.assign.Postpone3,
          },
          {
            text: {
              type: "plain_text",
              text: `${toUsualFormat(postpone4Date)} に延期`,
              emoji: true,
            },
            value: projectConstants.interactivity.values.assign.Postpone4,
          },
          {
            text: {
              type: "plain_text",
              text: "担当しない",
              emoji: true,
            },
            value: projectConstants.interactivity.values.assign.Cancel,
          },
        ],
        action_id: `${projectConstants.interactivity.actionID.assignmentSelect}`,
      },
    },
    {
      type: "actions",
      block_id: `${projectConstants.interactivity.blockID.assignmentSelectSubmit}`,
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "送信",
            emoji: true,
          },
          value: "value--submit", // この値にあまり意味はない
        },
      ],
    },
  ];

  return JSON.stringify(assignMessage);
};
