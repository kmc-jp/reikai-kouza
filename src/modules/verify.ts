import { getKeys } from "./keys";

const crypto = require("crypto");

// リクエスト署名を検証
export const verify = async (
  xSlackSignature: string,
  xSlackRequestTimestamp: string,
  payload: string,
  isNotTest = true
): Promise<boolean> => {
  const data = await getKeys(isNotTest);

  const baseStr = `v0:${xSlackRequestTimestamp}:${payload}`;

  const hash = crypto.createHmac("sha256", data.slack.signing_secret).update(baseStr).digest("hex");

  return `v0=${hash}` === xSlackSignature;
};
