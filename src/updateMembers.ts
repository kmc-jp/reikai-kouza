import { readFile } from "fs/promises";
import { projectConstants } from "./modules/constants";
import { executeQueries, executeQuery } from "./modules/mysql";
import { postText, postText2Log } from "./modules/slack";
const axios = require("axios"); 
const path = require("path");
const argv = require("minimist")(process.argv.slice(2));

// 新規の部員の登録・既存の部員のプロフィール変更への追従・部員情報の削除
// 引数として、日付をYYYYMMDDの形式で与える必要がある
// 処理に時間がかかるので注意
const update = async () => {
  try
  {
    // key.jsonの内容を読み出し
    const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
    const data = await keyReader;

    // ユーザー一覧情報を取得
    const response = await axios.get("https://slack.com/api/users.list", {headers: {Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`}})
    const responseJson = response["data"];

    // 実際の日付の6ヶ月前の日付を求める。
    // 実際の日付は引数で指定する。
    const date_str = (argv["_"][0] as number).toString();
    const date = new Date();
    date.setFullYear(Number.parseInt(date_str.substring(0, 4)))
    date.setMonth(Number.parseInt(date_str.substring(4, 6)) - 1)
    date.setDate(Number.parseInt(date_str.substring(6, 8)))

    // 6ヶ月前 (簡単に180日前) の時刻を取得
    // ミリ秒単位であることに注意
    // 実際は時差があり9時間ずれているがどうでもいいので無視
    const date_halfYearAgo = new Date(date.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);

    const date__dbFormat = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const date_halfYearAgo__dbFormat = date_halfYearAgo.getFullYear() * 10000 + (date_halfYearAgo.getMonth() + 1) * 100 + date_halfYearAgo.getDate();

    if (responseJson["ok"]) {
      // 全部員の最新のIDリスト
      const allMembers= new Map<string, string>();
      
      (responseJson["members"] as Array<any>)
        .filter(member => member["id"] !== "USLACKBOT")                   // Slack Botを除外
        .filter(member => !member["is_bot"])                              // botを除外
        .filter(member => member["is_restricted"] === false)              // 制限されたユーザーを除外
        .forEach(member => {
          allMembers.set(member["id"], member["profile"]["display_name"] === "" ? member["profile"]["real_name"] : member["profile"]["display_name"]);
        })

      const allMembersInDB: Array<any> = await executeQuery(`SELECT id FROM ${projectConstants.mysql.tableName};`);
      const registeredMembers: string[] = allMembersInDB.map(x => x["id"]);

      // 新規部員の登録
      const registerNewMembers = async () => {
        // 新規の部員をチェック
        await Promise.all(Array.from(allMembers.keys()).map(async id => {
          // DBにIDが登録されていなかった場合
          if (!registeredMembers.includes(id)) {
            await postText(`新規の部員を追加します。\n<@${allMembers.get(id)}>, ID: ${id}`);

            // 時間がかかってしまうが、メンバー一覧からIDが一致するまで探してくる
            // TODO: 後ろから探査したほうが確実に早い
            // TODO: 見つけたらbreak
            return Promise.all((responseJson["members"] as Array<any>).map(async x => {
              if (x["id"] === id) {
                const r = await executeQuery(`INSERT INTO ${projectConstants.mysql.tableName} VALUES (`
                  + `'${x["id"]}',`
                  + `'${x["profile"]["display_name"] === "" ? x["profile"]["real_name"].replace(/'/g, "\\'") : x["profile"]["display_name"].replace(/'/g, "\\'")}',`
                  + `${date__dbFormat},`
                  + `${projectConstants.values.preferredDayOfWeek.Unanswered.value},`
                  + `${projectConstants.values.assignedDate.None},`
                  + `${date_halfYearAgo__dbFormat},`
                  + `${date_halfYearAgo__dbFormat},`
                  + `${projectConstants.values.announcementStatus.Unassigned}`
                  + `);`);
                return r;
              }
            }));
          }
        }));
      }

      // 表示名の更新
      const updateDisplayName = async () => {
        const allMembersDisplayNameInDB = await executeQueries(Array.from(allMembers.keys()).map(id => {
          return `SELECT id, display_name FROM ${projectConstants.mysql.tableName} WHERE id = '${id}';`;
        }))

        allMembersDisplayNameInDB!.forEach(async db => {
          if (db[0]["display_name"] !== allMembers.get(db[0]["id"])) {
            await postText(`表示名を更新します。\n<@${allMembers.get(db[0]["id"])}>`);
            await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET display_name='${allMembers.get(db[0]["id"])!.replace(/'/g, "\\'")}' WHERE id = '${db[0]["id"]}';`);
          }
        })
      }

      // 登録情報の削除
      const deleteMembers = async () => {
        registeredMembers.forEach(async id => {
          // Slackの非制限ユーザーリストに入っていなかった場合は、DBから削除
          if (allMembers.get(id) == null) {
            const deletingMemberDisplayName = await executeQuery(`SELECT display_name FROM ${projectConstants.mysql.tableName} WHERE id = '${id}';`)
            await postText(`登録情報を削除します。\n<@${deletingMemberDisplayName[0]["display_name"]}>, ID: ${id}`);
            await executeQuery(`DELETE FROM ${projectConstants.mysql.tableName} WHERE id = '${id}';`);
          }
        })
      }

      await registerNewMembers();
      await updateDisplayName();
      await deleteMembers();
    }
    else
    {
      await postText("メンバー情報の取得に失敗しました。");
    }
  } catch (error) {
    await postText(`部員情報の更新でエラーが発生しました。\n${error}`);
  }
}

update();
