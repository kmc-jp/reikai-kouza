import { toDate, toUsualFormat, toUsualFormatWithTime } from "../modules/date";
import { getAssignmentStatus } from "../slash/getAssignmentStatus";

export const getAppHomeView = async (id: string) => {
  const status = await getAssignmentStatus(id);
  if (id === "U01U7S3UFAB") {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*担当日：${status.isNowAssigned ? "なし" : toUsualFormat(toDate(status.lastAssignedDate))}*`,
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
            text: `最終更新 ${toUsualFormatWithTime(new Date())}`,
            emoji: true,
          },
        ],
      },
    ];
  }

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "新しいUIを準備中です。V2アップデートをお楽しみに。",
      },
    },
  ];
};
