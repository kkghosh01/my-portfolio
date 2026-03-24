// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
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

  // Ignore Convex internal requests during Edge runtime SSR
  beforeSend(event) {
    if (event.exception?.values?.[0]?.stacktrace?.frames?.some(frame => 
      frame.filename?.includes('convex') || frame.filename?.includes('http_client.js')
    )) {
      return null;
    }
    return event;
  },
});
