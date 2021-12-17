import { projectConstants } from "./constants";
import { getKeys } from "./keys";
import { postText, postText2Log } from "./slack";
const mysql = require("mysql2/promise");

export const tableItemName = {
  id: "id",
  registrationDate: "registration_date",
  preferredDayOfWeek: "preferred_day_of_week",
  assignedDate: "assigned_date",
  assignmentGroup: "assignment_group",
  announcedDate: "announced_date",
  announcementStatus: "announcement_status",
  messageTimeStamp: "message_ts",
};

// MySQLへの接続を返す
const connect = async () => {
  const data = await getKeys();

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: data.mysql.root_password,
    database: projectConstants.mysql.DBName,
  });

  return connection;
};

// 指定したクエリを実行するとともに、Slackのログチャンネルに実行したクエリ文字列を投げる。
export const executeQuery = async <T>(query: string, placeholder: any[]): Promise<T[]> => {
  await postText2Log(`:mysql: 以下のクエリを発行\n${query}\n${placeholder.join(", ")}`);

  const connection = await connect();
  connection.connect();

  try {
    return (await connection.query(query, placeholder))[0];
  } catch (error) {
    if (error) {
      await postText(`<@ryokohbato>\n:red_circle: 発行時エラー\n${error}`);
    }
    return [];
  } finally {
    connection.end();
  }
};

// 指定した複数のクエリを実行するとともに、Slackのログチャンネルに実行したクエリ文字列を投げる。
export const executeQueries = async <T>(query: string, placeholders: any[][]): Promise<T[][]> => {
  await postText2Log(
    `:mysql: 以下のクエリを実行\n${query}\n${placeholders
      .map((placeholder) => {
        return placeholder.join(", ");
      })
      .join("\n")}`
  );

  const connection = await connect();
  connection.connect();

  try {
    return Promise.all(
      placeholders.map(async (placeholder) => {
        return (await connection.query(query, placeholder))[0];
      })
    );
  } catch (error) {
    if (error) {
      await postText(`<@ryokohbato>\n:red_circle: 発行時エラー\n${error}`);
    }
    return [];
  } finally {
    connection.end();
  }
};
