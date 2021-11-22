import { post2DM, postText } from "./modules/slack";

export const postAnnounce = async (id: string) => {
  const message = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "こんにちは、45代会長のryokohbato (<@ryokohbato>) です。",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "現在、KMCでは月曜日と木曜日の19:00からDiscordで例会が行われており、例会後に例会講座が行われています。今回この例会講座について、より気軽に講座を行うとともに、例会講座での交流を促進する目的で、指名枠を設けることにしました。ただし、あくまで参加は自由なので、指名は自由に断って大丈夫です。\n概要は以下の通りとなっているので、一度ご確認ください。",
      },
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "今後の例会講座の運用について",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*指名枠は、自由に断ることができます。*\n断るだけでなく、講座担当日を *指名された日程から延期することもできます。*\n指名枠の後ろに、 *従来どおり希望枠は残ります。* いつでも自由に例会講座を開くことができます。\n指名枠での *発表内容は完全自由* です。また、発表時間も自由です。",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "その他詳細については、 https://inside.kmc.gr.jp/wiki/?議題/2021/例会・例会講座の見直し をご覧ください。",
      },
    },
  ];

  await post2DM(id, JSON.stringify(message));
  await postText(`<@${id}> さんに、例会講座システムのアナウンスを送付しました。`);
};
