module.exports = {
  settings: {
    cors: {
      enabled: false,
      origin: "*",
      headers: [
        "Content-Type",
        "Authorization",
        "X-Frame-Options",
        "Origin",
        "Access-Control-Allow-Headers",
        "access-control-allow-origin",
        "organization",
        "locale",
      ],
    },
  },
};
