import { verify } from "../src/modules/verify";

test("this is test", async () => {
  expect(
    await verify(
      "v0=d3a8bc60a23c9d9837d70fbbd7694f62435f5618d084f5cc5af6d776e49b777f",
      "1645650000.100000",
      "sample payload",
    )
  ).toBe(true);
});
