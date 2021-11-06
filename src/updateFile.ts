import { access, writeFile, unlink } from "fs/promises";
import { constants } from "fs";
const path = require("path");

// ファイルを指定された内容で更新する
// 存在しなければ新しく作る
export const updateFile = async (filePath: string, contents: string) => {
  try {
    // ファイルが存在していた場合、一旦消去する
    await access(path.join(__dirname, filePath), constants.R_OK | constants.W_OK);
    await unlink(path.join(__dirname, filePath));
  } catch {
    // ファイルがなかった場合は何もしない
  }

  await writeFile(path.join(__dirname, filePath), contents);
}
