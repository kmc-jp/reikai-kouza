import apiResponse from "../modules/apiResponse";

import type { AuthResponse } from "../@types/response";
import type Express from "express";

const router = require("express").Router();

// /api/auth

router.get("/", async (_: Express.Request, response: Express.Response) => {
  response.status(401).json(
    apiResponse.error<AuthResponse>({
      reason: "Unauthorized",
    })
  );
});

module.exports = router;
