import { projectConstants, tableItemName, tableStructure__ID } from "./modules/constants";
import { toDate, toDBFormat } from "./modules/date";
import { filterNormalMembers } from "./modules/member";
import { executeQuery } from "./modules/mysql";
import { getMemberList, postText } from "./modules/slack";
import { postAnnounce } from "./postAnnounce";
const argv = require("minimist")(process.argv.slice(2));

// 新規の部員の登録・既存の部員のプロフィール変更への追従・部員情報の削除
// 引数として、日付をYYYYMMDDの形式で与える必要がある
// 処理に時間がかかるので注意
const update = async () => {
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

    const date__dbFormat = toDBFormat(date);
    const date_halfYearAgo__dbFormat = toDBFormat(date_halfYearAgo);

    if (responseJson.ok) {
      // 全部員の最新のIDリスト
      const allMembersID = filterNormalMembers(responseJson.members as Array<any>)
        // 表示名は設定されていない場合がある
        .map((member) => {
          return member.id;
        }) as Array<string>;

      const allMembersInDB = await executeQuery<tableStructure__ID>(
        `SELECT ${tableItemName.id} FROM ${projectConstants.mysql.tableName};`,
        []
      );
      const registeredMembers: string[] = allMembersInDB.map((x) => x.id);

      // 新規部員の登録
      const registerNewMembers = async () => {
        // 新規の部員をチェック
        await Promise.all(
          allMembersID.map(async (id) => {
            // DBにIDが登録されていなかった場合
            if (!registeredMembers.includes(id)) {
              await postText(`新規の部員を追加します。\n<@${id}>, ID: ${id}`);
              await postAnnounce(id);

              // 時間がかかってしまうが、メンバー一覧からIDが一致するまで探してくる
              // TODO: 後ろから探査したほうが確実に早い
              // TODO: 見つけたらbreak
              return Promise.all(
                responseJson.members!.map(async (x) => {
                  if (x.id === id) {
                    return await executeQuery(
                      `INSERT INTO ${projectConstants.mysql.tableName} VALUES (?, ?, ?, ?, ?, ?, ?);`,
                      [
                        x.id,
                        date__dbFormat,
                        projectConstants.values.preferredDayOfWeek.Unanswered.value,
                        projectConstants.values.assignedDate.None,
                        date_halfYearAgo__dbFormat,
                        date_halfYearAgo__dbFormat,
                        projectConstants.values.announcementStatus.Unassigned,
                      ]
                    );
                  }
                })
              );
            }
          })
        );
      };

      // 登録情報の削除
      const deleteMembers = async () => {
        registeredMembers.forEach(async (id) => {
          // Slackの非制限ユーザーリストに入っていなかった場合は、DBから削除
          if (!allMembersID.includes(id)) {
            await postText(`登録情報を削除します。\n<@${id}>, ID: ${id}`);
            await executeQuery(`DELETE FROM ${projectConstants.mysql.tableName} WHERE ${tableItemName.id} = ? ;`, [id]);
          }
        });
      };

      await registerNewMembers();
      await deleteMembers();
    } else {
      await postText("メンバー情報の取得に失敗しました。");
    }
  } catch (error) {
    await postText(`部員情報の更新でエラーが発生しました。\n${error}`);
  }
};

update();
