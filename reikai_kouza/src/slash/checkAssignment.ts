import { getAssignmentStatus } from "../modules/assignmentStatus";
import { toDate, toUsualFormat } from "../modules/date";
import { post2DM } from "../modules/slack";

import type { SlashCommandResponse } from "../@types/slack";

export const checkAssignment = async (commandMessage: SlashCommandResponse) => {
  const status = await getAssignmentStatus(commandMessage.user_id);

  await post2DM(
    `${commandMessage.user_id}`,
    JSON.stringify([
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: status.isNowAssigned
            ? `${toUsualFormat(toDate(status.lastAssignedDate))} の例会講座に登録されています。`
            : "現在登録されている例会講座の担当日はありません。",
        },
      },
    ])
  );
};
