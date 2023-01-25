const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = function override(config, env) {
  if (env === "production") {
    config.plugins.push(
      new SentryWebpackPlugin({
        release: process.env.REACT_APP_ENV,
        include: ["build/static/js"],
        urlPrefix: "~/static/js",
        configFile: "sentry.properties",
      })
    );
  }
  return config;
};
