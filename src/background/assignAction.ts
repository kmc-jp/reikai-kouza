import { projectConstants, tableItemName, tableStructure__assignmentGroup } from "../modules/constants";
import { getNextDate, toDate, toDBFormat } from "../modules/date";
import { executeQuery } from "../modules/mysql";

export const assignAction = async (payload: any) => {
  const assignedGroup: number = (
    await executeQuery<tableStructure__assignmentGroup>(
      `SELECT ${tableItemName.assignmentGroup} FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.id} = ?`,
      [payload["user"]["id"]]
    )
  )[0].assignment_group;

  switch (payload["actions"][0]["selected_option"]["value"]) {
    case projectConstants.interactivity.values.assign.OK:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?`,
        [assignedGroup, 10, payload["user"]["id"]]
      );
      break;
    case projectConstants.interactivity.values.assign.Postpone1:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?`,
        [toDBFormat(getNextDate(toDate(assignedGroup))), 3, payload["user"]["id"]]
      );
      break;
    case projectConstants.interactivity.values.assign.Postpone2:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?`,
        [toDBFormat(getNextDate(getNextDate(toDate(assignedGroup)))), 3, payload["user"]["id"]]
      );
      break;
    case projectConstants.interactivity.values.assign.Postpone3:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?`,
        [toDBFormat(getNextDate(getNextDate(getNextDate(toDate(assignedGroup))))), 3, payload["user"]["id"]]
      );
      break;
    case projectConstants.interactivity.values.assign.Postpone4:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?`,
        [
          toDBFormat(getNextDate(getNextDate(getNextDate(getNextDate(toDate(assignedGroup)))))),
          3,
          payload["user"]["id"],
        ]
      );
      break;
    case projectConstants.interactivity.values.assign.Cancel:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ?, ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?`,
        [projectConstants.values.assignedDate.None, 2, payload["user"]["id"]]
      );
      break;
  }
};
