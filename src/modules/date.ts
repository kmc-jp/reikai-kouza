// m/d (a) の形式で日付を返す
export const format = (date: Date): string => {
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
}

// DB格納形式に変換
export const toDBFormat = (date: Date): number => {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

// DB格納形式からDate型に変換
export const toDate = (dbFormat: (number | string)): Date => {
  let dbFormat__str: string;

  if (typeof dbFormat === "number") {
    dbFormat__str = dbFormat.toString();
  } else {
    dbFormat__str = dbFormat;
  }

  const data = new Date();
  data.setFullYear(Number.parseInt(dbFormat__str.substring(0, 4)));
  data.setMonth(Number.parseInt(dbFormat__str.substring(4, 6)) - 1);
  data.setDate(Number.parseInt(dbFormat__str.substring(6, 8)));

  return data;
}

// 次回の例会日を返す
export const getNextDate = (baseDate: Date): Date => {
	// 次回の例会日
	// 月曜日なら3日後、木曜日なら4日後
	return baseDate.getDay() === 1 ? new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000) : new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000);
}
