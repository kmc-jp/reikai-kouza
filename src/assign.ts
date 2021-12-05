import { assignMember } from "./assignMember";
import { projectConstants } from "./modules/constants";
import { toUsualFormat, toDBFormat } from "./modules/date";
import { executeQuery, tableItemName } from "./modules/mysql";
import { postText } from "./modules/slack";
import { tableStructure } from "./types/mysql";

// 割り当て・追加の割り当て時に使用される
export const assign = async (today: Date, assignedDate: Date) => {
  // 3ヶ月前 (簡単に90日前) の時刻を取得
  // ミリ秒単位であることに注意
  // 時差は無視
  const today_threeMonthsAgo = new Date(today.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
  const today_threeMonthsAgo__dbFormat = toDBFormat(today_threeMonthsAgo);

  // 割り当てグループで探索して、2人以上いれば割り当てない
  if (
    (
      await executeQuery(
        `SELECT * FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.assignmentGroup} = ?`,
        [toDBFormat(assignedDate)]
      )
    ).length >= 2
  ) {
    return;
  }

  // 割り当ての対象となる全部員を取得
  // 「登録日から3ヶ月以上経過している」 かつ 「希望曜日である (「未回答」は「どちらでも」と同じ扱い)」 かつ 「割り当てグループから3ヶ月以上経過している」 かつ 「割り当て状態が0」
  const targetMembers = await executeQuery<tableStructure>(
    `SELECT * FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.registrationDate} < ? AND\
    (${tableItemName.preferredDayOfWeek} = ? OR ${tableItemName.preferredDayOfWeek} = ? OR ${tableItemName.preferredDayOfWeek} = ?) AND\
    ${tableItemName.assignmentGroup} < ? AND\
    ${tableItemName.announcementStatus} = ?;`,
    [
      today_threeMonthsAgo__dbFormat,
      // どちらも
      projectConstants.values.preferredDayOfWeek.Both.value,
      // 担当日の曜日に合わせる
      assignedDate.getDay() === 1
        ? projectConstants.values.preferredDayOfWeek.Monday.value
        : projectConstants.values.preferredDayOfWeek.Thursday.value,
      // 未回答
      projectConstants.values.preferredDayOfWeek.Unanswered.value,
      today_threeMonthsAgo__dbFormat,
      projectConstants.values.announcementStatus.Unassigned,
    ]
  );

  await postText(`${toUsualFormat(assignedDate)} の講座担当者を選びます (対象人数: ${targetMembers.length})`);

  // 対象者からランダムに1人割り当てる
  // 対象者がいなかった場合は何もしない
  if (targetMembers.length > 0) {
    const assignedMember: string = targetMembers[Math.floor(Math.random() * targetMembers.length)].id;
    await postText(`<@${assignedMember}>`);

    assignMember(assignedMember, today, assignedDate);
    // DEV: ここで、誤爆を防ぐためにすべてryokohbatoに送信している
    // assignMember("U01U7S3UFAB", today, assignedDate);
  }
};
