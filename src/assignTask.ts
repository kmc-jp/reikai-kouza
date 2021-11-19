import { assign } from "./assign";
import { toDate } from "./modules/date";
import { postText } from "./modules/slack";

const argv = require("minimist")(process.argv.slice(2));

const assignTask = async () => {
  const today_str = (argv["_"][0] as number).toString();
  const today = toDate(today_str);

  // 今日が月曜日か木曜日でなかった場合は終了
  if (today.getDay() != 1 && today.getDay() != 4) {
    await postText("月曜・木曜日ではないので割り当ては行いません。");
    return;
  }

  // 3週間後の日付
  const assignedDate = new Date(today.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);

  assign(today, assignedDate);
};

assignTask();
