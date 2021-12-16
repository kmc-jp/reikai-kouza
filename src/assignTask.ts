import { assign } from "./assign";
import { toDate } from "./modules/date";
import { postText, postText2Log } from "./modules/slack";

const argv = require("minimist")(process.argv.slice(2));

// 割り当て
// https://github.com/kmc-jp/reikai-kouza/wiki/%E4%BB%95%E6%A7%98%E6%9B%B8#%E5%89%B2%E3%82%8A%E5%BD%93%E3%81%A6
const assignTask = async () => {
  await postText2Log("割り当てを開始します。");

  const today_str = (argv["_"][0] as number).toString();
  const today = toDate(today_str);

  // 今日が月曜日か木曜日でなかった場合は終了
  if (today.getDay() != 1 && today.getDay() != 4) {
    await postText("月曜・木曜日ではないので割り当ては行いません。");
    return;
  }

  // 3週間後の日付
  const assignedDate = new Date(today.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);

  // 割り当てを行う
  assign(today, assignedDate);
};

assignTask();
