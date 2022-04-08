import { toUsualFormat, toDBFormat, toDate, getNextDate } from "./date";

test("TEST: Date Formatting (Monday)", () => {
  // 2022/4/11
  expect(toUsualFormat(new Date(2022, 4 - 1, 11))).toBe("4/11 (月)");
});

test("TEST: Date Formatting (Tuesday)", () => {
  // 2022/4/12
  expect(toUsualFormat(new Date(2022, 4 - 1, 12))).toBe("4/12 (火)");
});

test("TEST: Date Formatting (Wednesday)", () => {
  // 2022/4/13
  expect(toUsualFormat(new Date(2022, 4 - 1, 13))).toBe("4/13 (水)");
});

test("TEST: Date Formatting (Thursday)", () => {
  // 2022/4/14
  expect(toUsualFormat(new Date(2022, 4 - 1, 14))).toBe("4/14 (木)");
});

test("TEST: Date Formatting (Friday)", () => {
  // 2022/4/15
  expect(toUsualFormat(new Date(2022, 4 - 1, 15))).toBe("4/15 (金)");
});

test("TEST: Date Formatting (Saturday)", () => {
  // 2022/4/16
  expect(toUsualFormat(new Date(2022, 4 - 1, 16))).toBe("4/16 (土)");
});

test("TEST: Date Formatting (Sunday)", () => {
  // 2022/4/17
  expect(toUsualFormat(new Date(2022, 4 - 1, 17))).toBe("4/17 (日)");
});

test("TEST: Date Formatting For DB", () => {
  // 2022/4/11
  expect(toDBFormat(new Date(2022, 4 - 1, 11))).toBe(20220411);
});

test("TEST: Format conversion (String to Date)", () => {
  expect(toDate("20220331")).toStrictEqual(new Date(2022, 3 - 1, 31));
});

test("TEST: Format conversion (Number to Date)", () => {
  expect(toDate(20220331)).toStrictEqual(new Date(2022, 3 - 1, 31));
});

test("TEST: Get Next Reikai (Monday)", () => {
  expect(getNextDate(new Date(2022, 4 - 1, 11))).toStrictEqual(new Date(2022, 4 - 1, 14));
});

test("TEST: Get Next Reikai (Tuesday)", () => {
  expect(getNextDate(new Date(2022, 4 - 1, 12))).toStrictEqual(new Date(2022, 4 - 1, 14));
});

test("TEST: Get Next Reikai (Wednesday)", () => {
  expect(getNextDate(new Date(2022, 4 - 1, 13))).toStrictEqual(new Date(2022, 4 - 1, 14));
});

test("TEST: Get Next Reikai (Thursday)", () => {
  expect(getNextDate(new Date(2022, 4 - 1, 14))).toStrictEqual(new Date(2022, 4 - 1, 18));
});

// **

test("TEST: Get Next Reikai (Friday)", () => {
  expect(getNextDate(new Date(2022, 4 - 1, 15))).toStrictEqual(new Date(2022, 4 - 1, 18));
});

test("TEST: Get Next Reikai (Saturday)", () => {
  expect(getNextDate(new Date(2022, 4 - 1, 16))).toStrictEqual(new Date(2022, 4 - 1, 18));
});

test("TEST: Get Next Reikai (Sunday)", () => {
  expect(getNextDate(new Date(2022, 4 - 1, 17))).toStrictEqual(new Date(2022, 4 - 1, 18));
});
