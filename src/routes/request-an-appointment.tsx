import { createFileRoute, redirect } from "@tanstack/react-router";

/** Friendly alias: the booking page lives at /request-appointment. */
export const Route = createFileRoute("/request-an-appointment")({
  staticData: { sitemap: false },
  beforeLoad: () => {
    throw redirect({ to: "/request-appointment", replace: true, statusCode: 301 });
  },
});
