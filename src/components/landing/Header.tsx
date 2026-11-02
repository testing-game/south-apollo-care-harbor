import { useState } from "react";
import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { asset } from "@/lib/asset";

const NAV = ["Home", "About Us", "Specialities", "Health Check", "Online Report", "Patient Stories", "Career"];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      {/* Top bar */}
      <div className="bg-navy text-primary-foreground">
        <div className="container-site flex h-9 items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 rounded-sm bg-sky px-2 py-0.5 font-medium">
              <img src={asset("variant78.png")} alt="" className="h-3.5 w-3.5" /> SouthApollo
            </span>
            <span className="hidden sm:inline">Welcome to South Apollo Medical College Hospital.</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="hidden items-center rounded-sm bg-background px-2 py-1 text-foreground lg:flex">
              <input placeholder="Search" className="w-36 bg-transparent text-xs outline-hidden" />
              <Search className="h-3.5 w-3.5" />
            </label>
            <a href="#" className="hidden md:inline">Publications</a>
            <a href="#" className="hidden items-center gap-1 md:flex">View All Locations <ChevronDown className="h-3 w-3" /></a>
            <a href="tel:10678" className="flex items-center gap-1 font-semibold">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-background text-navy"><Phone className="h-3 w-3" /></span>10678
            </a>
            <button className="hidden items-center gap-1 sm:flex">English <ChevronDown className="h-3 w-3" /></button>
          </div>
        </div>
      </div>
      {/* Main nav */}
      <div className="container-site flex h-20 items-center justify-between gap-6 md:h-24">
        <a href="#" className="shrink-0">
          <img src={asset("logo.png")} alt="South Apollo Medical College Hospital" className="h-14 w-auto md:h-[70px]" />
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n, i) => (
            <a
              key={n}
              href="#"
              className={`flex items-center gap-1 px-3 py-2.5 text-sm transition-colors ${i === 0 ? "bg-sky text-primary-foreground" : "text-navy hover:text-sky"}`}
            >
              {n}
              {n === "Specialities" && <ChevronDown className="h-3.5 w-3.5" />}
            </a>
          ))}
          <a href="#" className="ml-4 bg-navy px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-sky">
            Send Query
          </a>
        </nav>
        <img src={asset("seal.png")} alt="JCI accredited seal" className="hidden h-14 w-auto lg:block" />
        <button className="text-navy lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-line-soft bg-background lg:hidden">
          <div className="container-site flex flex-col py-2">
            {NAV.map((n) => (
              <a key={n} href="#" className="border-b border-line-soft py-3 text-sm text-navy">{n}</a>
            ))}
            <a href="#" className="my-3 bg-navy py-3 text-center text-sm font-medium text-primary-foreground">Send Query</a>
          </div>
        </nav>
      )}
    </header>
  );
}
