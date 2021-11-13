import { assign } from "./assign";
import { projectConstants } from "./modules/constants";
import { executeQuery } from "./modules/mysql";
import { postText } from "./modules/slack";

const argv = require("minimist")(process.argv.slice(2));

const assignTask = async () => {
  const today_str = (argv["_"][0] as number).toString();
  const today = new Date();
  today.setFullYear(Number.parseInt(today_str.substring(0, 4)));
  today.setMonth(Number.parseInt(today_str.substring(4, 6)) - 1);
  today.setDate(Number.parseInt(today_str.substring(6, 8)));

  // 今日が月曜日か木曜日でなかった場合は終了
  if (today.getDay() != 1 && today.getDay() != 4) {
    await postText("月曜・木曜日ではないので割り当ては行いません。");
    return;
  }

  // 3週間後の日付
  const assignedDate = new Date(today.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);

  assign(today, assignedDate);
}

assignTask();
