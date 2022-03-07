import { projectConstants } from "../modules/constants";
import { toDate, toDBFormat, toUsualFormat } from "../modules/date";
import { executeQuery, tableItemName } from "../modules/mysql";
import { post2DM } from "../modules/slack";

import type { tableStructure__assignedDate } from "../@types/mysql";
import type { SlashCommandResponse } from "../@types/slack";

export const check = async (commandMessage: SlashCommandResponse) => {
  const assignedDate = (
    await executeQuery<tableStructure__assignedDate>(
      `SELECT ${tableItemName.assignedDate} FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.id} = ?;`,
      [commandMessage.user_id]
    )
  )[0];

  await post2DM(
    `${commandMessage.user_id}`,
    JSON.stringify([
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            assignedDate.assigned_date < toDBFormat(new Date())
              ? "現在登録されている例会講座の担当日はありません。"
              : `${toUsualFormat(toDate(assignedDate.assigned_date))} の例会講座に登録されています。`,
        },
      },
    ])
  );
};
