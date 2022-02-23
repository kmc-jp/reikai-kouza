import { verify } from "../src/modules/verify";

test("this is test", async () => {
  expect(await verify("v0=3a60c02fae9af18167fc09da32b99642ce5dcc56524f73f7ab9b486e44ce3535", "1645650000.100000", "sample payload", false)).toBe(true);
});
