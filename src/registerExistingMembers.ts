import { projectConstants } from "./modules/constants";
import { toDate, toDBFormat } from "./modules/date";
import { filterNormalMembers } from "./modules/member";
import { executeQueries } from "./modules/mysql";
import { getMemberList, Member, postText } from "./modules/slack";
const argv = require("minimist")(process.argv.slice(2));

// 既存の部員の登録
// 引数として、日付をYYYYMMDDの形式で与える必要がある
const register = async () => {
  try {
    // ユーザー一覧情報を取得
    const responseJson = await getMemberList();

    // 実際の日付の6ヶ月前の日付を求める。
    // 実際の日付は引数で指定する。
    const date_str = (argv["_"][0] as number).toString();
    const date = toDate(date_str);

    // 6ヶ月前 (簡単に180日前) の時刻を取得
    // ミリ秒単位であることに注意
    // 実際は時差があり9時間ずれているがどうでもいいので無視
    const date_halfYearAgo = new Date(date.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);

    const date_halfYearAgo__dbFormat = toDBFormat(date_halfYearAgo);

    if (responseJson.ok) {
      await executeQueries(
        `INSERT INTO ${projectConstants.mysql.tableName} VALUES (?, ?, ?, ?, ?, ?, ?);`,
        filterNormalMembers(responseJson.members as Array<Member>)
          // 表示名は設定されていない場合がある
          .map((member) => {
            return [
              member.id,
              date_halfYearAgo__dbFormat,
              projectConstants.values.preferredDayOfWeek.Unanswered.value,
              projectConstants.values.assignedDate.None,
              date_halfYearAgo__dbFormat,
              date_halfYearAgo__dbFormat,
              projectConstants.values.announcementStatus.Unassigned,
            ];
          })
      );
    } else {
      await postText("メンバー情報の取得に失敗しました。");
    }
  } catch (error) {
    await postText(`部員の登録処理でエラーが発生しました。\n${error}`);
  }
};

register();
