export interface AuthResponse {
  ok: false;
  reason: "Unauthorized";
  ts: number;
}

// 400
export interface BadRequestResponse {
  ok: false;
  reason: string;
  ts: number;
}

// 404
export interface NotFoundResponse {
  ok: false;
  reason: "Not found";
  ts: number;
}
