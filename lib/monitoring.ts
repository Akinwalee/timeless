import type { ErrorEvent } from "@sentry/nextjs";

export const errorDataCollection = {
  userInfo: false, cookies: false, httpHeaders: false, httpBodies: [],
  urlQueryParams: false, stackFrameVariables: false, frameContextLines: 0,
  databaseQueryData: false, queues: false,
  graphQL: { document: false, variables: false },
  genAI: { inputs: false, outputs: false }, mcp: { inputs: false, outputs: false },
};

// Deliberately omit messages, requests, breadcrumbs, users and arbitrary contexts.
// Error names, source locations and release are enough to identify launch regressions.
export function sanitizeErrorEvent(event: ErrorEvent): ErrorEvent {
  return {
    type: undefined,
    event_id: event.event_id,
    timestamp: event.timestamp,
    platform: event.platform,
    level: event.level,
    release: event.release,
    environment: event.environment,
    message: "Timeless application error",
    exception: {
      values: event.exception?.values?.map(value => ({
        type: value.type,
        value: "Application error; see source location.",
        stacktrace: value.stacktrace ? { frames: value.stacktrace.frames?.map(frame => ({ filename: frame.filename?.split(/[?#]/)[0], function: frame.function, module: frame.module, lineno: frame.lineno, colno: frame.colno, in_app: frame.in_app })) } : undefined,
      })),
    },
  };
}
