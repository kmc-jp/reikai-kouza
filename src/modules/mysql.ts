import { readFile } from "fs/promises";
import { projectConstants } from "./constants";
import { postText } from "./slack";
const mysql = require('mysql');
const path = require("path");

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

export const executeQuery= async (query: string) => {
  await postText(`以下のクエリを発行\n${query}`);

  const connection = await connect();
  connection.connect();

  connection.query(`SELECT * FROM ${projectConstants.mysql.tableName};`, async (error: any, results: Array<object>) => {
    if (error) {
      await postText(`発行前の確認でエラー`);
    }

    // あまりにログが見づらいのでやめた
    // await postText(`発行前のテーブル\n${results.map(x => JSON.stringify(x)).join("\n")}`);
  });

  connection.query(query, (error: any, results: any) => {
    if(error) {
      postText(`発行時エラー\n${error}`);
    }

    return results;
  });

  connection.query(`SELECT * FROM ${projectConstants.mysql.tableName};`, async (error: any, results: Array<Object>) => {
    if (error) {
      await postText(`発行後の確認でエラー`);
    }

    // あまりにログが見づらいのでやめた
    // await postText(`発行後のテーブル\n${results.map(x => JSON.stringify(x)).join("\n")}`);
  });

  connection.end();
}

export const executeQueries = async (queries: string[]) => {
  await postText(`以下のクエリを実行\n${queries.join("\n")}`);

  const connection = await connect();
  connection.connect();
  
  connection.query(`SELECT * FROM ${projectConstants.mysql.tableName};`, async (error: any, results: Array<object>) => {
    if (error) {
      await postText(`発行前の確認でエラー`);
    }

    // あまりにログが見づらいのでやめた
    // await postText(`発行前のテーブル\n${results.map(x => JSON.stringify(x)).join("\n")}`);
  });

  for (let q of queries) {
    connection.query(q, (error: any, results: any) => {
      if(error) {
        postText(`発行時エラー\n${error}`);
      }

      return results;
    });
  }

  connection.query(`SELECT * FROM ${projectConstants.mysql.tableName};`, async (error: any, results: Array<Object>) => {
    if (error) {
      await postText(`発行後の確認でエラー`);
    }

    // あまりにログが見づらいのでやめた
    // await postText(`発行後のテーブル\n${results.map(x => JSON.stringify(x)).join("\n")}`);
  });

  connection.end();
}
