import { readFile } from "fs/promises";
import { projectConstants } from "./modules/constants";
import { format, getNextDate, toDBFormat } from "./modules/date";
import { executeQuery } from "./modules/mysql";
const axios = require('axios');
const path = require("path");

export const assignMember = async (id: string, today: Date, assignedDate: Date) => {
	const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

	await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET assignment_group = ?, announced_date = ? WHERE id = ?`,
	[
		toDBFormat(assignedDate),
		toDBFormat(today),
		id,
	]);

  // 選ばれた担当者にメッセージを送信
  await axios.post("https://slack.com/api/chat.postMessage", {
      channel: `@${id}`,
      blocks: `${getAssignMessage(assignedDate)}`,
    }, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(data)["slack"]["bot_user_oauth_token"]}`,
      "Content-Type": 'application/json',
    },
  });

  // データベースの更新
	await executeQuery(`UPDATE ${projectConstants.mysql.tableName} SET announcement_status = ? WHERE id = ?`,
	[
    projectConstants.values.announcementStatus.NoReply,
		id,
	]);
}

const getAssignMessage = (assignedDate: Date): string => {
	const postpone1Date = getNextDate(assignedDate);
	const postpone2Date = getNextDate(postpone1Date);
	const postpone3Date = getNextDate(postpone2Date);
	const postpone4Date = getNextDate(postpone3Date);

  const assignMessage = [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `${format(assignedDate)} の担当に指名されました。`
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "直近2週間までは延期できます。選択欄から担当日を選んでください。担当を断る場合は、「 *担当しない* 」を選択してください。"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "担当日を選択",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": `${format(assignedDate)}`,
							"emoji": true
						},
						"value": projectConstants.interactivity.values.assign.OK
					},
					{
						"text": {
							"type": "plain_text",
							"text": `${format(postpone1Date)} に延期`,
							"emoji": true
						},
						"value": projectConstants.interactivity.values.assign.Postpone1
					},
					{
						"text": {
							"type": "plain_text",
							"text": `${format(postpone2Date)} に延期`,
							"emoji": true
						},
						"value": projectConstants.interactivity.values.assign.Postpone2
					},
					{
						"text": {
							"type": "plain_text",
							"text": `${format(postpone3Date)} に延期`,
							"emoji": true
						},
						"value": projectConstants.interactivity.values.assign.Postpone3
					},
					{
						"text": {
							"type": "plain_text",
							"text": `${format(postpone4Date)} に延期`,
							"emoji": true
						},
						"value": projectConstants.interactivity.values.assign.Postpone4
					},
					{
						"text": {
							"type": "plain_text",
							"text": "担当しない",
							"emoji": true
						},
						"value": projectConstants.interactivity.values.assign.Cancel
					}
				],
				"action_id": `${projectConstants.interactivity.actionID.assign}`
			}
		},
		{
			"type": "actions",
      "block_id": `${projectConstants.interactivity.blockID.assign}`,
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "送信",
						"emoji": true
					},
					"value": "value--submit"
				}
			]
		}
	];

	return JSON.stringify(assignMessage);
}
