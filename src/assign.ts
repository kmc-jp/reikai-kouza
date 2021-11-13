import { projectConstants } from "./modules/constants";
import { executeQuery } from "./modules/mysql";
import { postText } from "./modules/slack";

export const assign = async (today: Date, assignedDate: Date) => {
  // 3ヶ月前 (簡単に90日前) の時刻を取得
  // ミリ秒単位であることに注意
  // 時差は無視
  const today_threeMonthsAgo = new Date(today.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
  const today_threeMonthsAgo__dbFormat = today_threeMonthsAgo.getFullYear() * 10000 + (today_threeMonthsAgo.getMonth() + 1) * 100 + today_threeMonthsAgo.getDate();

  const targetMembers: any[] = await executeQuery(`SELECT * FROM ${projectConstants.mysql.tableName} WHERE registration_date < ? AND\
    (preferred_day_of_week = ? OR preferred_day_of_week = ? OR preferred_day_of_week = ?) AND\
    assignment_group < ? AND\
    announcement_status = ?;`,
  [
    today_threeMonthsAgo__dbFormat,
    projectConstants.values.preferredDayOfWeek.Both.value,
    assignedDate.getDay() == 1 ? projectConstants.values.preferredDayOfWeek.Monday.value : projectConstants.values.preferredDayOfWeek.Thursday.value,
    projectConstants.values.preferredDayOfWeek.Unanswered.value,
    today_threeMonthsAgo__dbFormat,
    projectConstants.values.announcementStatus.Unassigned,
  ]);

  await postText(`${targetMembers.length} 人の対象者からランダムに割り当てを行います。`);

  // 対象者からランダムに1人割り当てる
  const assignedMember: string = targetMembers[Math.floor(Math.random() * targetMembers.length)]["id"];
  await postText(`<@${assignedMember}>`);

  // TODO: 選ばれた担当者にメッセージを送信
  // TODO: データベースの更新
}
