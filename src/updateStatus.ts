import { projectConstants, tableItemName, tableStructure } from "./modules/constants";
import { toDate, toDBFormat } from "./modules/date";
import { executeQuery } from "./modules/mysql";
import { postText } from "./modules/slack";

const argv = require("minimist")(process.argv.slice(2));

export const updateStatus = async () => {
  const today = toDate((argv["_"][0] as number).toString());
  const today_threeMonthsAgo = new Date(today.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
  const today_threeMonthsAgo__dbFormat = toDBFormat(today_threeMonthsAgo);

  const results = await executeQuery<tableStructure>(
    `SELECT * FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.registrationDate} < ${today_threeMonthsAgo__dbFormat}`,
    []
  );

  let updateNeeded = true;

  for (const result of results) {
    if (result.announcement_status !== projectConstants.values.announcementStatus.OK) {
      updateNeeded = false;
    }
  }

  if (updateNeeded) {
    // 全員の割り当て状態を未割り当てに更新
    postText("全員の割り当て状態をリセット");
    await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.announcementStatus} = ?`, [
      projectConstants.values.announcementStatus.Unassigned,
    ]);
  }
};

updateStatus();
