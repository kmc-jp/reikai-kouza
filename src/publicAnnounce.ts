import { projectConstants } from "./modules/constants";
import { toUsualFormat, toDate, toDBFormat } from "./modules/date";
import { executeQuery, tableItemName } from "./modules/mysql";
import { postText, postText2Members } from "./modules/slack";
import { tableStructure__assignedDate, tableStructure__ID } from "./types/mysql";

const argv = require("minimist")(process.argv.slice(2));

// 講座担当者を全体に公開
// TODO: 月木のみの告知にしたほうが、うるさすぎなくて良いかもしれない
const publicAnnounce = async () => {
  const today = toDate((argv["_"][0] as number).toString());
  const today__dbFormat = toDBFormat(today);
  const today_oneWeekAfter = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const today_oneWeekAfter__dbFormat = toDBFormat(today_oneWeekAfter);

  // 直近1週間分の担当者を取得
  const assignmentInfo = await executeQuery<tableStructure__ID & tableStructure__assignedDate>(
    `SELECT ${tableItemName.id}, ${tableItemName.assignedDate} FROM ${projectConstants.mysql.tableName} WHERE (${tableItemName.assignedDate} >= ? AND ${tableItemName.assignedDate} <= ?)`,
    [today__dbFormat, today_oneWeekAfter__dbFormat]
  );

  const assignmentInfoText = assignmentInfo.map((x) => {
    return `${toUsualFormat(toDate(x.assigned_date))}: <@${x.id}>`;
  });

  await postText("直近1週間の講座担当者を告知します。");
  await postText2Members(`直近1週間の講座担当者\n${assignmentInfoText.join("\n")}`);
};

publicAnnounce();
