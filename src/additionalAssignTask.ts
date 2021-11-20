import { assign } from "./assign";
import { projectConstants, tableStructure } from "./modules/constants";
import { toDate, toDBFormat } from "./modules/date";
import { executeQuery } from "./modules/mysql";
import { postText } from "./modules/slack";

const argv = require("minimist")(process.argv.slice(2));

const additionalAssignTask = async () => {
  const today_str = (argv["_"][0] as number).toString();
  const today = toDate(today_str);

  // 3日前の時刻を取得
  const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
  const threeDaysAgo__dbFormat = toDBFormat(threeDaysAgo);

  const results = await executeQuery<tableStructure>(
    `SELECT * FROM ${projectConstants.mysql.tableName} WHERE\
  (announced_date <= ? AND announcement_status = ?) OR announcement_status = ? OR announcement_status = ?`,
    [
      threeDaysAgo__dbFormat,
      projectConstants.values.announcementStatus.NoReply,
      projectConstants.values.announcementStatus.AdditionalAssignmentNeeded,
      projectConstants.values.announcementStatus.Postponed,
    ]
  );

  const threeWeeksAfter = new Date(today.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);
  const threeWeeksAfter__dbFormat = toDBFormat(threeWeeksAfter);
  const twoWeeksAfter = new Date(today.getTime() + 2 * 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAfter__dbFormat = toDBFormat(twoWeeksAfter);

  // 「現在の日付から3週間以内 かつ 現在の日付から2週間以上先」を満たしている場合のみ追加の割り当てを行う。
  // 満たしていない場合は、割り当ては行わないず、データベースの更新のみを行う。
  for (const result of results) {
    if (result.assignment_group <= threeWeeksAfter__dbFormat && result.assignment_group >= twoWeeksAfter__dbFormat) {
      postText(`追加の割り当てを行います (=> <@${result.id}>)`);
      assign(today, toDate(result.assignment_group));
    }

    postText(`追加の割り当てに関する登録情報を処理します (<@${result.id}>)`);
    switch (result.announcement_status) {
      case projectConstants.values.announcementStatus.NoReply:
        // TODO: ボタンを押せないようにする。
        break;
      case projectConstants.values.announcementStatus.AdditionalAssignmentNeeded:
        break;
      case projectConstants.values.announcementStatus.Postponed:
        await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET assignment_group = ? WHERE id = ?`, [
          result.assigned_date,
          result.id,
        ]);
        break;
    }

    await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET announcement_status = ? WHERE id = ?`, [
      projectConstants.values.announcementStatus.OK,
      result.id,
    ]);
  }
};

additionalAssignTask();
