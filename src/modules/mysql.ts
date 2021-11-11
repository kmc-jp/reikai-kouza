import { readFile } from "fs/promises";
import { projectConstants } from "./constants";
import { postText, postText2Log } from "./slack";
const mysql = require('mysql2/promise');
const path = require("path");

// MySQLへの接続を返す
const connect = async () => {
  const keyReader = readFile(path.join(__dirname, "./secret/keys.json"), "utf-8");
  const data = await keyReader;

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: JSON.parse(data)["mysql"]["root_password"],
    database: projectConstants.mysql.DBName, 
  });

  return connection;
}

// 指定したクエリを実行するとともに、Slackのログチャンネルに実行したクエリ文字列を投げる。
export const executeQuery= async (query: string) => {
  await postText2Log(`以下のクエリを発行\n${query}`);

  const connection = await connect();
  connection.connect();

  try {
    const [results, _] = await connection.query(query);
    return results;
  } catch (error) {
    if(error) {
      await postText(`発行時エラー\n${error}`);
    }
  } finally {
    connection.end();
  }
}

// 指定した複数のクエリを実行するとともに、Slackのログチャンネルに実行したクエリ文字列を投げる。
export const executeQueries = async (queries: string[]) => {
  await postText2Log(`以下のクエリを実行\n${queries.join("\n")}`);

  const connection = await connect();
  connection.connect();

  try {
    return Promise.all(queries.map(async query => {
      const [results, _] = await connection.query(query);
      return results;
    }));
  } catch (error) {
    if(error) {
      await postText(`発行時エラー\n${error}`);
    }
  } finally {
    connection.end();
  }
}
