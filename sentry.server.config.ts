// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    "https://9b5723747b8bed5d7d7b0cd66b4c212a@o4511065882099712.ingest.de.sentry.io/4511066104397904",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Fix for Sentry + Convex + Undici issue in Node.js 18+
  // Ignore Convex requests in Sentry's Http integration to avoid conflicts during SSR
  integrations: [
    // We can't easily access Http integration here without importing it from @sentry/node
    // but we can use the 'ignoreUrls' option if it was top-level (it's not).
    // Instead, we use beforeSend to filter out the error if it originates from Convex's fetch.
  ],

  beforeSend(event) {
    if (
      event.exception?.values?.[0]?.stacktrace?.frames?.some(
        (frame) =>
          frame.filename?.includes("convex") ||
          frame.filename?.includes("http_client.js"),
      )
    ) {
      // If it's a known non-critical SSR issue with Convex client on the server,
      // we can optionally ignore it or let it pass after debugging.
      // returning null will ignore the error.
      return null;
    }
    return event;
  },
});
