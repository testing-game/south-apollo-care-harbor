import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import LandingPage from "@/figma/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "South Apollo Medical College Hospital" },
      {
        name: "description",
        content:
          "South Apollo Medical College Hospital — find a doctor, book appointments, health check packages and world-class specialities.",
      },
      { property: "og:title", content: "South Apollo Medical College Hospital" },
      {
        property: "og:description",
        content: "Find a doctor, book appointments and explore our specialities and health packages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const DESIGN_WIDTH = 1920;

function Index() {
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const update = () => {
      const s = window.innerWidth / DESIGN_WIDTH;
      setScale(s);
      if (inner.current) setHeight(inner.current.offsetHeight * s);
    };
    update();
    const ro = new ResizeObserver(update);
    if (inner.current) ro.observe(inner.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <main className="w-full overflow-hidden" style={{ height }}>
      <div ref={inner} className="page-scaler font-inter" style={{ transform: `scale(${scale})` }}>
        <LandingPage />
      </div>
    </main>
  );
}
