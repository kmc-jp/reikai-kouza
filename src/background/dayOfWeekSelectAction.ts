import { projectConstants } from "../modules/constants";
import { executeQuery } from "../modules/mysql";

export const dayOfWeekSelectAction = async (payload: any) => {
  switch (payload["actions"][0]["selected_option"]["value"]) {
    // 月曜日
    case projectConstants.interactivity.values.dayOfWeekSelect.Monday:
      await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET preferred_day_of_week = ? WHERE id = ?;`,
      [
        projectConstants.values.preferredDayOfWeek.Monday.value,
        payload["user"]["id"],
      ]);
      break;

    // 木曜日
    case projectConstants.interactivity.values.dayOfWeekSelect.Thursday:
      await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET preferred_day_of_week = ? WHERE id = ?;`,
      [
        projectConstants.values.preferredDayOfWeek.Thursday.value,
        payload["user"]["id"],
      ]);
      break;

    // どちらでも
    case projectConstants.interactivity.values.dayOfWeekSelect.Both:
      await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET preferred_day_of_week = ? WHERE id = ?;`,
      [
        projectConstants.values.preferredDayOfWeek.Both.value,
        payload["user"]["id"],
      ]);
      break;
  }
}
