import apiResponse from "./modules/apiResponse";
import constants from "./modules/constants";

import type { NotFoundResponse } from "./@types/response";
import type Express from "express";

const express = require("express");

const app = express();

app.use(constants.path.auth, require("./route/auth"));

app.use((request: Express.Request, response: Express.Response) => {
  response.status(404).json(
    apiResponse.error<NotFoundResponse>({
      reason: "Not found",
    })
  );
});

app.listen(constants.server.port);
