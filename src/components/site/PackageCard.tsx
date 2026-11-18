import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type CardProps = { name: string; subtitle: string; image: string; id?: string };

/**
 * Full-bleed package card shared by the homepage and All Packages page.
 * With an id it opens the package's details page; the homepage's placeholder cards open the listing.
 */
export function PackageCard({ name, subtitle, image, id }: CardProps) {
  const cls = "group relative block aspect-[29/32] overflow-hidden bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2";
  const body: ReactNode = (
    <>
      {image && <img src={image} alt={`${[name, subtitle].filter(Boolean).join(" ")} health checkup package — South Apollo Medical College Hospital, Barishal`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />}
      <div className="bg-card-fade absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
        <p className="font-bold leading-snug">{name}</p>
        {subtitle && <p className="text-xs font-bold uppercase">({subtitle})</p>}
        <span className="relative mt-3 inline-block text-sm font-bold text-sky after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-sky after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100 group-hover:after:scale-x-100 motion-reduce:after:transition-none">See Package</span>
      </div>
    </>
  );
  return id ? (
    <Link to="/health-checkup-packages/$id" params={{ id }} className={cls}>{body}</Link>
  ) : (
    <Link to="/health-checkup-all-packages" className={cls}>{body}</Link>
  );
}
