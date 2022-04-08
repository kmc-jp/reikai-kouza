// m/d (a) の形式で日付を返す
export const toUsualFormat = (date: Date): string => {
  switch (date.getDay()) {
    case 0:
      return `${date.getMonth() + 1}/${date.getDate()} (日)`;
    case 1:
      return `${date.getMonth() + 1}/${date.getDate()} (月)`;
    case 2:
      return `${date.getMonth() + 1}/${date.getDate()} (火)`;
    case 3:
      return `${date.getMonth() + 1}/${date.getDate()} (水)`;
    case 4:
      return `${date.getMonth() + 1}/${date.getDate()} (木)`;
    case 5:
      return `${date.getMonth() + 1}/${date.getDate()} (金)`;
    case 6:
      return `${date.getMonth() + 1}/${date.getDate()} (土)`;
  }

  return "";
};

// DB格納形式に変換
export const toDBFormat = (date: Date): number => {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
};

// DB格納形式からDate型に変換
export const toDate = (dbFormat: number | string): Date => {
  let dbFormat__str: string;

  if (typeof dbFormat === "number") {
    dbFormat__str = dbFormat.toString();
  } else {
    dbFormat__str = dbFormat;
  }

  const year = Number.parseInt(dbFormat__str.substring(0, 4));
  const month = Number.parseInt(dbFormat__str.substring(4, 6));
  const date = Number.parseInt(dbFormat__str.substring(6, 8));

  // year/month/date 00:00:00
  const data = new Date(year, month - 1, date);
  return data;
};

// 次回の例会日を返す
export const getNextDate = (baseDate: Date): Date => {
  // 次回の例会日
  // 月曜日なら3日後、木曜日なら4日後
  // 月木以外でも動く
  switch (baseDate.getDay()) {
    case 1:
    case 2:
    case 3:
      return new Date(baseDate.getTime() + (3 - baseDate.getDay() + 1) * 24 * 60 * 60 * 1000);
    case 4:
    case 5:
    case 6:
      return new Date(baseDate.getTime() + (4 - baseDate.getDay() + 4) * 24 * 60 * 60 * 1000);
    case 0:
      return new Date(baseDate.getTime() + (1 - baseDate.getDay()) * 24 * 60 * 60 * 1000);
    default:
      return new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000);
  }
};
