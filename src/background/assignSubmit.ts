import { assignMember } from "../assignMember";
import { projectConstants, tableItemName } from "../modules/constants";
import { toUsualFormat, toDate } from "../modules/date";
import { executeQuery } from "../modules/mysql";
import { postText, updateByResponseURL } from "../modules/slack";
import {
  tableStructure__announcedDate,
  tableStructure__announcementStatus,
  tableStructure__assignedDate,
  tableStructure__assignmentGroup,
} from "../types/mysql";

// 担当日選択 送信ボタン
// 担当者にメッセージを送信
// ログも流す
export const assignSubmit = async (payload: any) => {
  // 登録された情報を取得
  // 送信ボタンを押す前に、担当日の選択が終わっていることを想定している (ただし、終わっていなくても壊れることはない)
  const registeredData = (
    await executeQuery<
      tableStructure__assignedDate &
        tableStructure__assignmentGroup &
        tableStructure__announcedDate &
        tableStructure__announcementStatus
    >(
      `SELECT ${tableItemName.assignedDate}, ${tableItemName.assignmentGroup}, ${tableItemName.announcedDate}, ${tableItemName.announcementStatus} from ${projectConstants.mysql.tableName} WHERE ${tableItemName.id} = ? ;`,
      [payload["user"]["id"]]
    )
  )[0];

  switch (registeredData.announcement_status) {
    // 未返答状態の場合は、担当日の選択フォームを再送信
    case projectConstants.values.announcementStatus.NoReply:
      await updateByResponseURL(
        payload["response_url"],
        `担当日が選択されていない状態で送信されました。\n再度選択し直してください。`
      );
      // 担当日選択フォームを再送信
      assignMember(
        payload["user"]["id"],
        toDate(registeredData.announced_date),
        toDate(registeredData.assignment_group)
      );
      return;

    // そのまま確定、または延期された場合
    case projectConstants.values.announcementStatus.OK:
    case projectConstants.values.announcementStatus.Postponed:
      await updateByResponseURL(
        payload["response_url"],
        `<@${payload["user"]["id"]}> \n${toUsualFormat(
          toDate(registeredData.assigned_date)
        )} の講座に登録しました。講座担当日の1週間前に <${projectConstants.slack.memberChannelName}> で告知されます。`
      );
      await postText(`<@${payload["user"]["id"]}> ${toUsualFormat(toDate(registeredData.assigned_date))} に登録`);
      break;
    // TODO: 延期された場合に割り当てグループを更新する処理がない

    // キャンセルされた場合
    case projectConstants.values.announcementStatus.AdditionalAssignmentNeeded:
      await updateByResponseURL(
        payload["response_url"],
        `<@${payload["user"]["id"]}> \n${toUsualFormat(
          toDate(registeredData.assignment_group)
        )} の指名をキャンセルしました。`
      );
      await postText(
        `<@${payload["user"]["id"]}> ${toUsualFormat(toDate(registeredData.assignment_group))} をキャンセル`
      );
      break;
  }
};
