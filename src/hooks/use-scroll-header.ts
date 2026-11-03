import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 8;

export function useScrollHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollPosition = () => Math.max(0, Math.min(window.scrollY, Math.max(0, document.documentElement.scrollHeight - window.innerHeight)));
    let previousY = scrollPosition();
    let distance = 0;
    setScrolled(previousY > 0);

    const onScroll = () => {
      const currentY = scrollPosition();
      const delta = currentY - previousY;
      previousY = currentY;
      setScrolled(currentY > 0);

      if (currentY === 0) {
        distance = 0;
        setHidden(false);
        return;
      }

      if (delta === 0) return;
      distance = Math.sign(delta) === Math.sign(distance) ? distance + delta : delta;
      if (Math.abs(distance) >= SCROLL_THRESHOLD) {
        setHidden(distance > 0);
        distance = 0;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { hidden, scrolled };
}