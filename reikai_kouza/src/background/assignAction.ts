import { projectConstants } from "../modules/constants";
import { getNextDate, toDate, toDBFormat } from "../modules/date";
import { executeQuery, tableItemName } from "../modules/mysql";

import type { tableStructure__assignmentGroup } from "../@types/mysql";

// 担当日選択
export const assignAction = async (payload: any) => {
  // 割り当てグループは、はじめに割り当てられた担当日の情報が入っており、担当日が確定するまで変更されない
  const assignedGroup: number = (
    await executeQuery<tableStructure__assignmentGroup>(
      `SELECT ${tableItemName.assignmentGroup} FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.id} = ?;`,
      [payload["user"]["id"]]
    )
  )[0]!.assignment_group;

  // 何度選択し直しても大丈夫なようになっている (はず)
  //
  // 担当日がそのまま確定された場合は、割り当てグループの日付を担当日として登録すれば良い
  // 延期された場合は、割り当てグループの値は変更せず、担当日を割り当てグループの値から求める
  // キャンセルされた場合は、担当日情報を削除しておく
  switch (payload["actions"][0]["selected_option"]["value"]) {
    // そのまま確定
    case projectConstants.interactivity.values.assign.OK:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?;`,
        [assignedGroup, projectConstants.values.announcementStatus.OK, payload["user"]["id"]]
      );
      break;
    // 割り当てられた担当日の次回の例会に延期
    case projectConstants.interactivity.values.assign.Postpone1:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?;`,
        [
          toDBFormat(getNextDate(toDate(assignedGroup))),
          projectConstants.values.announcementStatus.Postponed,
          payload["user"]["id"],
        ]
      );
      break;
    // 割り当てられた担当日の次々回の例会に延期
    case projectConstants.interactivity.values.assign.Postpone2:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?;`,
        [
          toDBFormat(getNextDate(getNextDate(toDate(assignedGroup)))),
          projectConstants.values.announcementStatus.Postponed,
          payload["user"]["id"],
        ]
      );
      break;
    // 割り当てられた担当日の3回後の例会に延期
    case projectConstants.interactivity.values.assign.Postpone3:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?;`,
        [
          toDBFormat(getNextDate(getNextDate(getNextDate(toDate(assignedGroup))))),
          projectConstants.values.announcementStatus.Postponed,
          payload["user"]["id"],
        ]
      );
      break;
    // 割り当てられた担当日の4回後の例会に延期
    case projectConstants.interactivity.values.assign.Postpone4:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?;`,
        [
          toDBFormat(getNextDate(getNextDate(getNextDate(getNextDate(toDate(assignedGroup)))))),
          projectConstants.values.announcementStatus.Postponed,
          payload["user"]["id"],
        ]
      );
      break;
    // 担当をキャンセル
    case projectConstants.interactivity.values.assign.Cancel:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?;`,
        [
          projectConstants.values.assignedDate.None,
          projectConstants.values.announcementStatus.AdditionalAssignmentNeeded,
          payload["user"]["id"],
        ]
      );
      break;
  }
};
