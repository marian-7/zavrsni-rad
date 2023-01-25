const path = require("path");
const { i18n, localePath } = require("./next-i18next.config");
const withPWA = require("next-pwa");
const { withSentryConfig } = require("@sentry/nextjs");

const SentryWebpackPluginOptions = {};

const moduleExports = withPWA({
  i18n,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack", "url-loader"],
    });
    return config;
  },
  future: {
    strictPostcssConfiguration: true,
  },
  pwa: {
    dest: "public",
    disable: process.env.NEXT_PUBLIC_ENV === "development",
  },
  localePath,
});

module.exports =
  process.env.NODE_ENV === "production"
    ? withSentryConfig(moduleExports, SentryWebpackPluginOptions)
    : moduleExports;
