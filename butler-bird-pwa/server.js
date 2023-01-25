const express = require("express");
const next = require("next");

const sslRedirect = (environments = ["production"], status = 302) => {
  const currentEnv = process.env.NODE_ENV;
  const isCurrentEnv = environments.includes(currentEnv);

  return (req, res, next) => {
    if (isCurrentEnv && req.headers["x-forwarded-proto"] !== "https") {
      res.redirect(status, "https://" + req.hostname + req.originalUrl);
    } else {
      next();
    }
  };
};

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(sslRedirect());
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log("Started");
  });
});
