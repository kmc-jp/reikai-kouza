import { projectConstants } from "./modules/constants";
import { toUsualFormat, toDate, toDBFormat } from "./modules/date";
import { executeQuery, tableItemName } from "./modules/mysql";
import { postBlocks2OwnerChannel, postBlocks2MemberChannel, postText2LogChannel } from "./modules/slack";

import type { tableStructure__assignedDate, tableStructure__ID } from "./@types/mysql";

const argv = require("minimist")(process.argv.slice(2));

// 講座担当者を全体に公開
// 月木のみ告知
const publicAnnounce = async () => {
  await postText2LogChannel(":blobsunglasses: 告知を開始します。");

  const today = toDate((argv["_"][0] as number).toString());
  const today__dbFormat = toDBFormat(today);
  const today_oneWeekAfter = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const today_oneWeekAfter__dbFormat = toDBFormat(today_oneWeekAfter);

  // 今日が月曜日か木曜日でなかった場合は終了
  if (today.getDay() != 1 && today.getDay() != 4) {
    await postText2LogChannel(":blobsunglasses: 月曜・木曜日ではないので告知は行いません。");
    return;
  }

  // 直近1週間分の担当者を取得
  const assignmentInfo = await executeQuery<tableStructure__ID & tableStructure__assignedDate>(
    `SELECT ${tableItemName.id}, ${tableItemName.assignedDate} FROM ${projectConstants.mysql.tableName} WHERE (${tableItemName.assignedDate} >= ? AND ${tableItemName.assignedDate} <= ?);`,
    [today__dbFormat, today_oneWeekAfter__dbFormat]
  );

  // 確定済みの担当者を取得
  const assignmentInfoAll = await executeQuery<tableStructure__ID & tableStructure__assignedDate>(
    `SELECT ${tableItemName.id}, ${tableItemName.assignedDate} FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.assignedDate} >= ?;`,
    [today__dbFormat]
  );

  await postText2LogChannel(":blobsunglasses: 直近1週間の講座担当者を告知します。");
  await postBlocks2MemberChannel(JSON.stringify(getPublicAnnounceBlock("直近1週間の講座担当者", assignmentInfo)));
  await postText2LogChannel(":blobsunglasses: 確定済みの全ての講座担当者を告知します。");
  await postBlocks2OwnerChannel(JSON.stringify(getPublicAnnounceBlock("確定済みの講座担当者", assignmentInfoAll)));
};

const getPublicAnnounceBlock = (
  title: string,
  assignmentInfo: (tableStructure__ID & tableStructure__assignedDate)[]
) => {
  const recentAssignment: { [key: number]: string[] } = {};
  const message = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:tada: *${title}*`,
      },
    },
  ];

  assignmentInfo.forEach((x) => {
    if (!Object.keys(recentAssignment).includes(x.assigned_date.toString())) {
      recentAssignment[x.assigned_date] = [];
    }
    recentAssignment[x.assigned_date].push(x.id);
  });

  for (const x in recentAssignment) {
    message.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${toUsualFormat(toDate(x))}*\n${recentAssignment[x]
          .map((x) => {
            return `<@${x}>`;
          })
          .join("\n")}`,
      },
    });
  }

  return message;
};

publicAnnounce();
