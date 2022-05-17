const express = require("express");

const app = express();

// @ts-ignore requestは使用しない
app.get("/", (request: any, result: any) => {
  result.send(
    JSON.stringify({
      ok: true,
    })
  );
});

app.listen(80);
