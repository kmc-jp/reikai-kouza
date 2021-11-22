import { assignMember } from "./assignMember";
import { projectConstants, tableItemName, tableStructure } from "./modules/constants";
import { format, toDBFormat } from "./modules/date";
import { executeQuery } from "./modules/mysql";
import { postText } from "./modules/slack";

export const assign = async (today: Date, assignedDate: Date) => {
  // 3ヶ月前 (簡単に90日前) の時刻を取得
  // ミリ秒単位であることに注意
  // 時差は無視
  const today_threeMonthsAgo = new Date(today.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
  const today_threeMonthsAgo__dbFormat = toDBFormat(today_threeMonthsAgo);

  const targetMembers = await executeQuery<tableStructure>(
    `SELECT * FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.registrationDate} < ? AND\
    (${tableItemName.preferredDayOfWeek} = ? OR ${tableItemName.preferredDayOfWeek} = ? OR ${tableItemName.preferredDayOfWeek} = ?) AND\
    ${tableItemName.assignmentGroup} < ? AND\
    ${tableItemName.announcementStatus} = ?;`,
    [
      today_threeMonthsAgo__dbFormat,
      projectConstants.values.preferredDayOfWeek.Both.value,
      assignedDate.getDay() === 1
        ? projectConstants.values.preferredDayOfWeek.Monday.value
        : projectConstants.values.preferredDayOfWeek.Thursday.value,
      projectConstants.values.preferredDayOfWeek.Unanswered.value,
      today_threeMonthsAgo__dbFormat,
      projectConstants.values.announcementStatus.Unassigned,
    ]
  );

  await postText(`${format(assignedDate)} の講座担当者を選びます (対象人数: ${targetMembers.length})`);

  // 対象者からランダムに1人割り当てる
  // 対象者がいなかった場合は何もしない
  if (targetMembers.length > 0) {
    const assignedMember: string = targetMembers[Math.floor(Math.random() * targetMembers.length)].id;
    await postText(`<@${assignedMember}>`);
  }

  // assignMember(assignedMember, today, assignedDate);
  assignMember("U01U7S3UFAB", today, assignedDate);
};
