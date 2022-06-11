type baseType = {
  ok: boolean;
  ts: number;
};

const apiResponse = {
  error: <T extends baseType>(response: Omit<T, "ok" | "ts">): T => {
    return { ok: false, ts: Date.now(), ...response } as T;
  },
  ok: <T extends baseType>(response: Omit<T, "ok" | "ts">): T => {
    return { ok: true, ts: Date.now(), ...response } as T;
  },
};

export default apiResponse;
