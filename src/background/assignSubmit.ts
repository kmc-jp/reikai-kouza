import { readFile } from "fs/promises";
import { assignMember } from "../assignMember";
import {
  projectConstants,
  tableItemName,
  tableStructure__announcedDate,
  tableStructure__announcementStatus,
  tableStructure__assignedDate,
  tableStructure__assignmentGroup,
} from "../modules/constants";
import { format, toDate } from "../modules/date";
import { executeQuery } from "../modules/mysql";
import { postText } from "../modules/slack";
const axios = require("axios");
const path = require("path");

export const assignSubmit = async (payload: any) => {
  // 担当者にメッセージ送信
  // ログも流す
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  const registeredData = (
    await executeQuery<
      tableStructure__assignedDate &
        tableStructure__assignmentGroup &
        tableStructure__announcedDate &
        tableStructure__announcementStatus
    >(
      `SELECT ${tableItemName.assignedDate}, ${tableItemName.assignmentGroup}, ${tableItemName.announcedDate}, ${tableItemName.announcementStatus} from ${projectConstants.mysql.tableName} WHERE ${tableItemName.id} = ? ;`,
      [payload["user"]["id"]]
    )
  )[0];

  switch (registeredData.announcement_status) {
    // 未返答状態の場合は、
    case projectConstants.values.announcementStatus.NoReply:
      await axios.post(
        payload["response_url"],
        {
          channel: projectConstants.slack.memberChannelName,
          text: `担当日が選択されていない状態で送信されました。\n再度選択し直してください。`,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
            "Content-Type": "application/json",
          },
        }
      );
      // 担当日選択フォームを再送信
      assignMember(
        payload["user"]["id"],
        toDate(registeredData.announced_date),
        toDate(registeredData.assignment_group)
      );
      return;

    case projectConstants.values.announcementStatus.OK:
    case projectConstants.values.announcementStatus.Postponed:
      await axios.post(
        payload["response_url"],
        {
          channel: projectConstants.slack.memberChannelName,
          text: `<@${payload["user"]["id"]}> \n${format(
            toDate(registeredData.assigned_date)
          )} の講座に登録しました。講座担当日の1週間前に <${
            projectConstants.slack.memberChannelName
          }> で告知されます。`,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
            "Content-Type": "application/json",
          },
        }
      );
      await postText(`<@${payload["user"]["id"]}> ${format(toDate(registeredData.assigned_date))} に登録`);
      break;
    case projectConstants.values.announcementStatus.AdditionalAssignmentNeeded:
      await axios.post(
        payload["response_url"],
        {
          channel: projectConstants.slack.memberChannelName,
          text: `<@${payload["user"]["id"]}> \n${format(
            toDate(registeredData.assignment_group)
          )} の指名をキャンセルしました。`,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
            "Content-Type": "application/json",
          },
        }
      );
      await postText(`<@${payload["user"]["id"]}> ${format(toDate(registeredData.assignment_group))} をキャンセル`);
      break;
  }
};
