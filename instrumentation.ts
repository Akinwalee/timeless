import type { Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.SENTRY_DSN && process.env.NODE_ENV === "production") {
    const Sentry = await import("@sentry/nextjs");
    const { sanitizeErrorEvent, errorDataCollection } = await import("./lib/monitoring");
    Sentry.init({ dsn: process.env.SENTRY_DSN, enabled: process.env.VERCEL_ENV !== "preview", dataCollection: errorDataCollection, defaultIntegrations: false, sendClientReports: false, release: process.env.SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA, beforeSend: sanitizeErrorEvent });
  }
}

export const onRequestError: Instrumentation.onRequestError = async (...args) => {
  if (!process.env.SENTRY_DSN || process.env.NODE_ENV !== "production") return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(...args);
};
