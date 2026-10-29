if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_DEPLOYMENT_ENV !== "preview") {
  void Promise.all([import("@sentry/nextjs"), import("./lib/monitoring")]).then(([Sentry, { sanitizeErrorEvent, errorDataCollection }]) => {
    Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, dataCollection: errorDataCollection, defaultIntegrations: false, integrations: [Sentry.globalHandlersIntegration(), Sentry.browserApiErrorsIntegration()], sendClientReports: false, beforeSend: sanitizeErrorEvent });
  });
}
