import { Member } from "../@types/slack";

// Bot権限でないBotユーザー
// https://github.com/kmc-jp/reikai-kouza/pull/15
const botsAsUsers = [
  "U3KJNDAHL", // ako2
  "U037YB0U2", // kmc
  "U07FN02MQ", // channel-watcher
];

// 部員でないユーザーを除外
export const filterNormalMembers = (members: Array<Member>) => {
  return members
    .filter((member) => !botsAsUsers.includes(member.id!)) // 歴史的経緯でユーザーなbotを除外
    .filter((member) => member.id !== "USLACKBOT") // Slack Botを除外
    .filter((member) => !member.is_bot) // botを除外
    .filter((member) => member.is_restricted === false); // 制限されたユーザーを除外
};
