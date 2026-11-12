import type { ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Same search box as the Specialities directory: navy border, soft shadow, sky focus ring, X to clear. */
export function ListingSearch({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div role="search" className="speciality-search flex h-[50px] w-full shrink-0 items-center gap-2 border border-speciality-active bg-background px-[17px] text-speciality-active focus-within:ring-2 focus-within:ring-sky md:w-[300px] lg:w-[380px]">
      <input type="search" aria-label={placeholder} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-speciality-active [&::-webkit-search-cancel-button]:hidden" />
      {value ? <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Clear search" onClick={() => onChange("")}><X /></Button> : <Search aria-hidden="true" className="h-5 w-5 shrink-0" />}
    </div>
  );
}

export function ListingHeader({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-center md:gap-8">
      <h2 className="text-[28px] font-bold leading-tight text-speciality-active md:text-[39px]">{title}</h2>
      {children}
    </div>
  );
}

export function NoMatches({ message, onClear }: { message: string; onClear: () => void }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-4 border-y border-line-soft text-center text-muted-foreground">
      <Search aria-hidden="true" className="h-8 w-8 text-speciality-active/40" />
      <p>{message}</p>
      <Button variant="outline" onClick={onClear}>Clear Search</Button>
    </div>
  );
}
