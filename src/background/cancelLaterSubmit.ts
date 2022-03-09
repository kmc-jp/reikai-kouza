import { projectConstants } from "../modules/constants";
import { toDate, toDBFormat, toUsualFormat } from "../modules/date";
import { executeQuery, tableItemName } from "../modules/mysql";
import { postText, postText2Log, updateByResponseURL } from "../modules/slack";

import type { tableStructure__announcementStatus } from "../@types/mysql";

export const cancelLaterSubmit = async (payload: any) => {
  /*** TEST CODE!!! */
  await postText2Log("DEBUG: " + JSON.stringify(payload));

  const announcementStatus = (
    await executeQuery<tableStructure__announcementStatus>(
      `SELECT ${tableItemName.announcementStatus} FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.id} = ?;`,
      [payload["user"]["id"]]
    )
  )[0].announcement_status;

  /*** TEST CODE!!! */
  await postText2Log("DEBUG: " + announcementStatus.toString());

  // 当日以前のものはキャンセルできない。
  // (当日もできない)
  if (toDBFormat(toDate(payload["actions"][0].value as string)) <= toDBFormat(new Date())) {
    await updateByResponseURL(
      payload["response_url"],
      `${toUsualFormat(
        toDate(payload["actions"][0].value as string)
      )} の例会講座をキャンセルできませんでした。担当のキャンセルは担当日の前日まで可能です。`
    );
    return;
  }

  // 割り当て状態が10または0でない場合はキャンセルできない
  if (
    announcementStatus !== projectConstants.values.announcementStatus.OK &&
    announcementStatus !== projectConstants.values.announcementStatus.Unassigned
  ) {
    await updateByResponseURL(
      payload["response_url"],
      `${toUsualFormat(toDate(payload["actions"][0].value as string))} の例会講座をキャンセルできませんでした。`
    );
    return;
  }

  // 9:45~10:15の間はキャンセルできない
  const now = new Date();
  if ((now.getHours() === 9 && now.getMinutes() >= 45) || (now.getHours() === 10 && now.getMinutes() <= 15)) {
    await updateByResponseURL(
      payload["response_url"],
      `${toUsualFormat(
        toDate(payload["actions"][0].value as string)
      )} の例会講座をキャンセルできませんでした。9:45から10:15までの間はキャンセルの手続きができません。`
    );
    return;
  }

  // 担当の取り消し処理
  await updateByResponseURL(
    payload["response_url"],
    `${toUsualFormat(toDate(payload["actions"][0].value as string))} の例会講座をキャンセルしました。`
  );
  await executeQuery(
    `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignedDate} = ${projectConstants.values.assignedDate.None}, ${tableItemName.announcementStatus} = ${projectConstants.values.announcementStatus.AdditionalAssignmentNeeded} WHERE ${tableItemName.id} = ?;`,
    [payload["user"]["id"]]
  );
  await postText(
    `:spiral_calendar_pad: <@${payload["user"]["id"]}> ${toUsualFormat(
      toDate(payload["actions"][0].value as string)
    )} の例会講座をキャンセル`
  );
};
