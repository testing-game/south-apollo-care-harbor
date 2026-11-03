import { useState } from "react";
import { Menu, Phone, Search, X } from "lucide-react";
import { asset } from "@/lib/asset";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { Button } from "@/components/ui/button";

const NAV = ["Home", "About Us", "Specialities", "Health Check", "Online Report", "Patient Stories", "Career"];
const REPORT_URL = "https://report.southapollomedicalcollegehospital.com";

export function Header() {
  const [open, setOpen] = useState(false);
  const { hidden, scrolled } = useScrollHeader();
  return (
    <>
    <div aria-hidden="true" className="h-[117px] md:h-[133px]" />
    <header
      inert={hidden}
      className={`fixed inset-x-0 top-0 z-50 border-b border-line-soft bg-background transition-transform duration-300 ease-in-out motion-reduce:transition-none ${hidden ? "-translate-y-full pointer-events-none" : "translate-y-0"} ${scrolled ? "shadow-card backdrop-blur-sm" : "shadow-sm"}`}
    >
      {/* Top bar */}
      <div className="bg-navy text-primary-foreground">
        <div className="container-site flex h-9 items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 rounded-sm bg-sky px-2 py-0.5 font-medium">
              <img src={asset("variant78.png")} alt="" className="h-3.5 w-3.5" /> SouthApollo
            </span>
            <span className="hidden sm:inline">Welcome to South Apollo Medical College Hospital.</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <label className="hidden items-center gap-2 rounded-sm bg-background px-2 py-1 text-foreground lg:flex">
              <input placeholder="Search" className="w-36 bg-transparent text-xs outline-hidden" />
              <Search className="h-3.5 w-3.5" />
            </label>
            <a
              href="https://www.samcb.edu.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="topbar-college-link hidden md:inline"
            >
              College Website
            </a>
            <a href="tel:01913240139" className="topbar-phone flex items-center gap-1 font-semibold">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-background text-navy"><Phone className="h-3 w-3" /></span>01913240139
            </a>
          </div>
        </div>
      </div>
      {/* Main nav */}
      <div className="container-site flex h-20 items-center justify-between gap-6 md:h-24">
        <a href="#" className="shrink-0" aria-label="South Apollo Medical College Hospital — Home">
          <img src={asset("logoo.png")} alt="South Apollo Medical College Hospital" className="h-14 w-auto md:h-[68px]" />
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n, i) => {
            const className = `flex items-center gap-1 px-3 py-2.5 text-sm ${
              i === 0 ? "is-active bg-sky text-primary-foreground" : "main-nav-link text-navy"
            }`;
            const label = <>{n}</>;
            return n === "Online Report" ? (
              <a key={n} href={REPORT_URL} target="_blank" rel="noopener noreferrer" className={className}>
                {label}
              </a>
            ) : (
              <a key={n} href="#" className={className}>
                {label}
              </a>
            );
          })}
          <a href="#" className="ml-4 bg-navy px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-sky">
            Send Query
          </a>
        </nav>
        {/* DGHS approval notice */}
        <div
          className="hidden shrink-0 items-center justify-center rounded-full border border-dghs-line bg-dghs-tint px-5 py-2 lg:flex"
          title="Approved by the Directorate General of Health Services (DGHS)"
        >
          <span className="text-center text-[11px] font-semibold leading-[1.35] tracking-wide text-navy">
            Directorate General of<br />
            Health Services (DGHS)<br />
            Approved
          </span>
        </div>
        <Button variant="ghost" size="icon" className="text-navy lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation">
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="max-h-[calc(100dvh-133px)] overflow-y-auto border-t border-line-soft bg-background lg:hidden">
          <div className="container-site flex flex-col py-2">
            {NAV.map((n) =>
              n === "Online Report" ? (
                <a
                  key={n}
                  href={REPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-line-soft py-3 text-sm text-navy"
                >
                  {n}
                </a>
              ) : (
                <a key={n} href="#" className="border-b border-line-soft py-3 text-sm text-navy">{n}</a>
              ),
            )}
            <a href="#" className="my-3 bg-navy py-3 text-center text-sm font-medium text-primary-foreground">Send Query</a>
          </div>
        </nav>
      )}
    </header>
    </>
  );
}
