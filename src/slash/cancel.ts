import { projectConstants } from "../modules/constants";
import { toDate, toDBFormat, toUsualFormat } from "../modules/date";
import { executeQuery, tableItemName } from "../modules/mysql";
import { post2DM } from "../modules/slack";

import type { tableStructure__announcementStatus, tableStructure__assignedDate } from "../@types/mysql";
import type { SlashCommandResponse } from "../@types/slack";

export const cancel = async (commandMessage: SlashCommandResponse) => {
  const assignedInfo = (
    await executeQuery<tableStructure__assignedDate & tableStructure__announcementStatus>(
      `SELECT ${tableItemName.assignedDate}, ${tableItemName.announcementStatus} FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.id} = ?;`,
      [commandMessage.user_id]
    )
  )[0];

  // 当日以前のものはキャンセルできない。
  // (当日もできない)
  if (assignedInfo.assigned_date <= toDBFormat(new Date())) {
    await post2DM(
      `${commandMessage.user_id}`,
      JSON.stringify([
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "キャンセル可能な例会講座担当日はありません。",
          },
        },
      ])
    );
    return;
  }

  // 割り当て状態が10または0でない場合はキャンセルできない
  if (
    assignedInfo.announcement_status !== projectConstants.values.announcementStatus.OK &&
    assignedInfo.announcement_status !== projectConstants.values.announcementStatus.Unassigned
  ) {
    await post2DM(
      `${commandMessage.user_id}`,
      JSON.stringify([
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "キャンセル可能な例会講座担当日はありません。担当のキャンセルは、登録日の翌日から担当日の前日まで可能です。",
          },
        },
      ])
    );
    return;
  }

  // 9:45~10:15の間はキャンセルできない
  const now = new Date();
  if ((now.getHours() === 9 && now.getMinutes() >= 45) || (now.getHours() === 10 && now.getMinutes() <= 15)) {
    await post2DM(
      `${commandMessage.user_id}`,
      JSON.stringify([
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "9:45から10:15までの間はキャンセルの手続きができません。",
          },
        },
      ])
    );
    return;
  }

  await post2DM(
    `${commandMessage.user_id}`,
    JSON.stringify([
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${toUsualFormat(
            toDate(assignedInfo.assigned_date)
          )} の例会講座をキャンセルしますか？\nキャンセルする場合は、「キャンセルする」を押してください。キャンセルしない場合は、このメッセージを放置したままにしてください。`,
        },
      },
      {
        type: "actions",
        block_id: `${projectConstants.interactivity.blockID.cancelLaterSubmit}`,
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "キャンセルする",
              emoji: true,
            },
            value: `${toDBFormat(toDate(assignedInfo.assigned_date))}`,
          },
        ],
      },
    ])
  );
};
