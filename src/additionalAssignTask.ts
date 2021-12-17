import { assign } from "./assign";
import { projectConstants } from "./modules/constants";
import { toDate, toDBFormat } from "./modules/date";
import { executeQuery, tableItemName } from "./modules/mysql";
import { postText, postText2Log, updateDMMessage } from "./modules/slack";
import { tableStructure } from "./types/mysql";

const argv = require("minimist")(process.argv.slice(2));

// 追加の割り当て
// https://github.com/kmc-jp/reikai-kouza/wiki/%E4%BB%95%E6%A7%98%E6%9B%B8#%E8%BF%BD%E5%8A%A0%E3%81%AE%E5%89%B2%E3%82%8A%E5%BD%93%E3%81%A6
const additionalAssignTask = async () => {
  await postText2Log("追加の割り当てを開始します。");

  const today_str = (argv["_"][0] as number).toString();
  const today = toDate(today_str);

  // 3日前の時刻を取得
  const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
  const threeDaysAgo__dbFormat = toDBFormat(threeDaysAgo);

  // 「割り当て状態が1 かつ 割り当て日から3日が経過している」 または 「割り当て状態が2である」 または 「割り当て状態が3である」
  const results = await executeQuery<tableStructure>(
    `SELECT * FROM ${projectConstants.mysql.tableName} WHERE\
  (${tableItemName.announcedDate} <= ? AND ${tableItemName.announcementStatus} = ?) OR ${tableItemName.announcementStatus} = ? OR ${tableItemName.announcementStatus} = ?;`,
    [
      threeDaysAgo__dbFormat,
      projectConstants.values.announcementStatus.NoReply,
      projectConstants.values.announcementStatus.AdditionalAssignmentNeeded,
      projectConstants.values.announcementStatus.Postponed,
    ]
  );

  // 3週間後の日付
  const threeWeeksAfter = new Date(today.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);
  const threeWeeksAfter__dbFormat = toDBFormat(threeWeeksAfter);
  // 2週間後の日付
  const twoWeeksAfter = new Date(today.getTime() + 2 * 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAfter__dbFormat = toDBFormat(twoWeeksAfter);

  // 「現在の日付から3週間以内 かつ 現在の日付から2週間以上先」を満たしている場合のみ追加の割り当てを行う。
  // 満たしていない場合は、割り当ては行わないず、データベースの更新のみを行う。
  for (const result of results) {
    if (result.assignment_group <= threeWeeksAfter__dbFormat && result.assignment_group >= twoWeeksAfter__dbFormat) {
      await postText(`追加の割り当てを行います (<@${result.id}> =>)`);
      assign(today, toDate(result.assignment_group));
    }

    // どの場合でも割り当て状態を10に更新する処理は共通なので、それ以外の個別の処理をここで行う
    await postText(`追加の割り当てに関する登録情報を処理します (<@${result.id}>)`);
    switch (result.announcement_status) {
      case projectConstants.values.announcementStatus.NoReply:
        await postText(`<@${result.id}> 72時間以内に返信がありませんでした。`);
        // ボタンを押せないようにする。
        if (result.message_ts != null) {
          updateDMMessage(result.id, result.message_ts, `72時間以内に返信がなかったため、自動的にスキップします。`);
        } else {
          await postText(`<@${result.id}> さんのメッセージスタンプが取得できませんでした。`);
        }
        break;
      case projectConstants.values.announcementStatus.AdditionalAssignmentNeeded:
        break;
      case projectConstants.values.announcementStatus.Postponed:
        // もとの部員の割り当てグループを延期先の日付 (担当日) で更新
        await executeQuery(
          `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.assignmentGroup} = ? WHERE ${tableItemName.id} = ?;`,
          [result.assigned_date, result.id]
        );
        break;
    }

    // 割り当て状態を10に更新
    await executeQuery(
      `UPDATE ${projectConstants.mysql.tableName} SET ${tableItemName.announcementStatus} = ? WHERE ${tableItemName.id} = ?;`,
      [projectConstants.values.announcementStatus.OK, result.id]
    );
  }
};

additionalAssignTask();
