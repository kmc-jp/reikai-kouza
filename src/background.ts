import { projectConstants } from "./modules/constants";

const express = require("express");
const getRawBody = require("raw-body");

const app = express();

// 署名の検証に使用するため、生のリクエストを取得できるように
// @ts-ignore : resultは使用されない
app.use((request: any, result: any, next: any) => {
  getRawBody(request, (error: any, string: any) => {
    if (error) return next(error);
    request.text = string;
    next();
  });
});

app.use(projectConstants.server.path.check, require("./route/check"));
app.use(projectConstants.server.path.interactivity, require("./route/interactivity"));
app.use(projectConstants.server.path.slash, require("./route/slash"));
app.use(projectConstants.server.path.events, require("./route/events"));

app.listen(projectConstants.server.port);
