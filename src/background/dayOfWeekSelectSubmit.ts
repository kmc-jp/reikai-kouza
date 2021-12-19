import { projectConstants } from "../modules/constants";
import { executeQuery, tableItemName } from "../modules/mysql";
import { postText, updateByResponseURL } from "../modules/slack";
import { postDateSelection } from "../postDateSelection";
import { tableStructure__preferredDayOfWeek } from "../@types/mysql";

// 希望曜日選択 送信ボタン
export const dayOfWeekSelectSubmit = async (payload: any) => {
  const registeredData = (
    await executeQuery<tableStructure__preferredDayOfWeek>(
      `SELECT ${tableItemName.preferredDayOfWeek} from ${projectConstants.mysql.tableName} WHERE ${tableItemName.id} = ? ;`,
      [payload["user"]["id"]]
    )
  )[0].preferred_day_of_week;
  let dayOfWeek = "";

  switch (registeredData) {
    // 未回答の場合はフォームを再送信
    case projectConstants.values.preferredDayOfWeek.Unanswered.value:
      await updateByResponseURL(
        payload["response_url"],
        `希望曜日が未回答のまま送信されました。\n再度回答し直してください。`
      );
      // 希望曜日の回答フォームを送信
      postDateSelection(payload["user"]["id"]);
      return;

    // 月・木・どちらでものうちいずれかが登録されていればOK
    case projectConstants.values.preferredDayOfWeek.Monday.value:
      dayOfWeek = projectConstants.values.preferredDayOfWeek.Monday.text;
      break;
    case projectConstants.values.preferredDayOfWeek.Thursday.value:
      dayOfWeek = projectConstants.values.preferredDayOfWeek.Thursday.text;
      break;
    case projectConstants.values.preferredDayOfWeek.Both.value:
      dayOfWeek = projectConstants.values.preferredDayOfWeek.Both.text;
      break;
  }

  await updateByResponseURL(
    payload["response_url"],
    `<@${payload["user"]["id"]}> 「${dayOfWeek}」で登録が完了しました。`
  );
  await postText(`:muscle: <@${payload["user"]["id"]}> 「${dayOfWeek}」で登録`);
};
