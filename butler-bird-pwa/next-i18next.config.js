const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "hr", "da"],
  },
  localePath: path.resolve("./public/static/locales"),
};
