import { projectConstants } from "../modules/constants";
import { toDBFormat } from "../modules/date";
import { executeQuery, tableItemName } from "../modules/mysql";

import type { tableStructure__assignedDate } from "../@types/mysql";

export const getAssignmentStatus = async (id: string) => {
  const assignedDate = (
    await executeQuery<tableStructure__assignedDate>(
      `SELECT ${tableItemName.assignedDate} FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.id} = ?;`,
      [id]
    )
  )[0];

  return {
    isNowAssigned: assignedDate.assigned_date >= toDBFormat(new Date()),
    lastAssignedDate: assignedDate.assigned_date,
  };
};
