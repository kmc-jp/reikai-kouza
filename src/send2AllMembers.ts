import { filterNormalMembers } from "./modules/member";
import { getMemberList, Member, postText } from "./modules/slack";
import { postAnnounce } from "./postAnnounce";
import { postDateSelection } from "./postDateSelection";

// 全部員に送信
const post = async () => {
  // ユーザー一覧情報を取得
  const responseJson = await getMemberList();

  if (responseJson.ok) {
    const allMembersID = filterNormalMembers(responseJson.members as Array<Member>)
      // 表示名は設定されていない場合がある
      .map((member) => {
        return member.id;
      }) as Array<string>;

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
    await postText("メンバー情報の取得に失敗しました。");
  }
};

post();
