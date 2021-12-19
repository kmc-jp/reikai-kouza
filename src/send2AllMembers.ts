import { filterNormalMembers } from "./modules/member";
import { getMemberList, postText } from "./modules/slack";
import { postAnnounce } from "./postAnnounce";
import { postDateSelection } from "./postDateSelection";
import { Member } from "./@types/slack";

// 全部員に送信
const post = async () => {
  // ユーザー一覧情報を取得
  const responseJson = await getMemberList();

  if (responseJson?.ok) {
    const allMembersID = filterNormalMembers(responseJson.members as Array<Member>)
      // 表示名は設定されていない場合がある
      .map((member) => {
        return member.id;
      }) as Array<string>;

    // DEV: 特定の部員にのみ送信
    // DB 側には以下のSQLを実行した
    // delete from reikai_kouza WHERE id != "U4U6U1FT8" AND id != "U5AKH1946" AND id != "U01T8E7LQ4F"
    // AND id != "U04CT9785" AND id != "U01T0KGTL5U" AND id != "USC6TDFM0" AND id != "UHPHQHC78"
    // AND id != "U01TYAVASG4" AND id != "U048GKER0" AND id != "U01U7S3UFAB" AND id != "U70CV2E56";

    // const allMembersID: Array<string> = [
    //   "U4U6U1FT8",
    //   "U5AKH1946",
    //   "U01T8E7LQ4F",
    //   "U04CT9785",
    //   "U01T0KGTL5U",
    //   "USC6TDFM0",
    //   "UHPHQHC78",
    //   "U01TYAVASG4",
    //   "U048GKER0",
    //   "U01U7S3UFAB",
    //   "U70CV2E56",
    // ];

    // リクエスト数超過を避けるため、3秒間隔で送信
    for (const id of allMembersID) {
      // 例会講座システムのアナウンスを送付
      await postAnnounce(id);
      // 希望曜日選択を送信
      await postDateSelection(id);
      await new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
    }
  } else {
    await postText("<@ryokohbato>\n:red_circle: メンバー情報の取得に失敗しました。");
  }
};

post();
