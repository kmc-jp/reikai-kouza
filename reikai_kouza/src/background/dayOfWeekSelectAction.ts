import { projectConstants } from "../modules/constants";
import { executeQuery, tableItemName } from "../modules/mysql";

// 希望曜日選択
export const dayOfWeekSelectAction = async (payload: any) => {
  // 選択状態に変更が合った段階で、DBに更新がかかる
  // 送信ボタンを押した際にはDBへの登録は行われない
  switch (payload["actions"][0]["selected_option"]["value"]) {
    // 月曜日
    case projectConstants.interactivity.values.dayOfWeekSelect.Monday:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.preferredDayOfWeek} = ? WHERE ${tableItemName.id} = ?;`,
        [projectConstants.values.preferredDayOfWeek.Monday.value, payload["user"]["id"]]
      );
      break;

    // 木曜日
    case projectConstants.interactivity.values.dayOfWeekSelect.Thursday:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.preferredDayOfWeek} = ? WHERE ${tableItemName.id} = ?;`,
        [projectConstants.values.preferredDayOfWeek.Thursday.value, payload["user"]["id"]]
      );
      break;

    // どちらでも
    case projectConstants.interactivity.values.dayOfWeekSelect.Both:
      await executeQuery(
        `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.preferredDayOfWeek} = ? WHERE ${tableItemName.id} = ?;`,
        [projectConstants.values.preferredDayOfWeek.Both.value, payload["user"]["id"]]
      );
      break;
  }
};
