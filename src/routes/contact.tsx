import { createFileRoute, redirect } from "@tanstack/react-router";

/** Friendly alias: the contact form lives at /send-query. */
export const Route = createFileRoute("/contact")({
  staticData: { sitemap: false },
  beforeLoad: () => {
    throw redirect({ to: "/send-query", replace: true, statusCode: 301 });
  },
});
