import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: SENTRY_DSN || "https://7418f4dc53184aa9a52230a4eed0e921@o293335.ingest.sentry.io/5804358",
    tracesSampleRate: 0,
  });
}
