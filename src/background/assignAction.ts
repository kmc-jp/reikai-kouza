import { projectConstants } from "../modules/constants";
import { getNextDate, toDate, toDBFormat } from "../modules/date";
import { executeQuery } from "../modules/mysql";

export const assignAction = async (payload: any) => {
  const assignedGroup: number = (
    await executeQuery(`SELECT assignment_group FROM ${projectConstants.mysql.tableName} WHERE id = ?`, [
      payload["user"]["id"],
    ])
  )[0]["assignment_group"];

  switch (payload["actions"][0]["selected_option"]["value"]) {
    case projectConstants.interactivity.values.assign.OK:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET assigned_date = ?, announcement_status = ? WHERE id = ?`,
        [assignedGroup, 10, payload["user"]["id"]]
      );
      break;
    case projectConstants.interactivity.values.assign.Postpone1:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET assigned_date = ?, announcement_status = ? WHERE id = ?`,
        [toDBFormat(getNextDate(toDate(assignedGroup))), 3, payload["user"]["id"]]
      );
      break;
    case projectConstants.interactivity.values.assign.Postpone2:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET assigned_date = ?, announcement_status = ? WHERE id = ?`,
        [toDBFormat(getNextDate(getNextDate(toDate(assignedGroup)))), 3, payload["user"]["id"]]
      );
      break;
    case projectConstants.interactivity.values.assign.Postpone3:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET assigned_date = ?, announcement_status = ? WHERE id = ?`,
        [toDBFormat(getNextDate(getNextDate(getNextDate(toDate(assignedGroup))))), 3, payload["user"]["id"]]
      );
      break;
    case projectConstants.interactivity.values.assign.Postpone4:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET assigned_date = ?, announcement_status = ? WHERE id = ?`,
        [
          toDBFormat(getNextDate(getNextDate(getNextDate(getNextDate(toDate(assignedGroup)))))),
          3,
          payload["user"]["id"],
        ]
      );
      break;
    case projectConstants.interactivity.values.assign.Cancel:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET assigned_date = ?, announcement_status = ? WHERE id = ?`,
        [projectConstants.values.assignedDate.None, 2, payload["user"]["id"]]
      );
      break;
  }
};
