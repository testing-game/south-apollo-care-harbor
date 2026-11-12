import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pulse-magazine")({
  beforeLoad: () => {
    throw redirect({ to: "/health-magazine", replace: true });
  },
});
