/**
 * Search-engine metadata shared by every public page: titles, descriptions, keywords,
 * canonical/Open Graph tags and Schema.org JSON-LD. Pages call pageHead() from their
 * route head() so everything is in the server-rendered HTML that Google reads.
 */
export const SITE_URL = "https://sa.jahidzone.cv";
export const HOSPITAL_NAME = "South Apollo Medical College Hospital";
export const HOSPITAL_ALT_NAMES = ["South Apollo", "South Apollo Medical", "South Apollo Medical College", "South Apollo Medical College & Hospital"];
export const HOSPITAL_ID = `${SITE_URL}/#hospital`;
export const APPOINTMENT_PHONE = "+8801885941937";
export const HELPLINE_PHONE = "+8801324165631";
export const HOSPITAL_EMAIL = "info@southapollomedicalcollegehospital.com";
export const HOSPITAL_MAP_URL = "https://maps.app.goo.gl/9GDeAGMpzTN1on5z8";
export const HOSPITAL_GEO = { latitude: 22.6749324, longitude: 90.3276003 };
const LOGO_URL = `${SITE_URL}/icon-512.png`;

/** Searches the whole site should rank for; pages add their own on top. */
export const CORE_KEYWORDS = [
  "South Apollo",
  "South Apollo Medical",
  "South Apollo Medical College",
  "South Apollo Medical College Hospital",
  "Best Medical in Barishal",
  "Best Hospital in Barishal",
  "Only One Private Medical College in Barishal",
  "Private Medical College Hospital Barishal",
  "Specialist Doctors in Barishal",
  "Health Checkup Packages Barishal",
];

export const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Jagua, Barishal Sadar",
  addressLocality: "Barishal",
  addressRegion: "Barishal Division",
  addressCountry: "BD",
} as const;

export type Crumb = { name: string; path: string };
type JsonLd = Record<string, unknown>;

export type PageSeo = {
  /** Site path of this page, e.g. "/doctors/abc". Used for canonical and og:url. */
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  /** Absolute https image shown on the page; ignored otherwise. */
  image?: string;
  /** Trail after Home, e.g. [{ name: "Find a Doctor", path: "/doctors" }]. Adds BreadcrumbList JSON-LD. */
  crumbs?: Crumb[];
  jsonLd?: JsonLd[];
};

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;

const clip = (text: string, max: number) => {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
};

/** Unique keywords, page-specific first, then the site-wide set. */
export function keywordList(extra: string[] = []): string {
  const seen = new Set<string>();
  return [...extra, ...CORE_KEYWORDS]
    .map((k) => k.trim())
    .filter((k) => k && !seen.has(k.toLowerCase()) && seen.add(k.toLowerCase()))
    .join(", ");
}

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLd {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  };
}

export function pageHead(p: PageSeo) {
  const url = absoluteUrl(p.path);
  const description = clip(p.description, 160);
  const image = p.image?.startsWith("https://") ? p.image : undefined;
  const scripts = [...(p.crumbs?.length ? [breadcrumbJsonLd(p.crumbs)] : []), ...(p.jsonLd ?? [])];
  return {
    meta: [
      { title: p.title },
      { name: "description", content: description },
      { name: "keywords", content: keywordList(p.keywords) },
      { property: "og:title", content: p.title },
      { property: "og:description", content: description },
      { property: "og:type", content: p.type ?? "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: HOSPITAL_NAME },
      { property: "og:locale", content: "en_BD" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: p.title },
      { name: "twitter:description", content: description },
      ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: scripts.map((data) => ({ type: "application/ld+json", children: JSON.stringify(data) })),
  };
}

/** Head for a missing record: keeps it out of search results. */
export function unavailableHead(title: string) {
  return { meta: [{ title: `${title} | ${HOSPITAL_NAME}` }, { name: "robots", content: "noindex" }] };
}

/** Maps department names to Schema.org MedicalSpecialty values; unknown names are skipped. */
const SPECIALTY_RULES: [RegExp, string][] = [
  [/emergency|accident|trauma/i, "Emergency"],
  [/an(a)?esthe/i, "Anesthesia"],
  [/cancer|oncolog/i, "Oncologic"],
  [/cardi/i, "Cardiovascular"],
  [/dental|dentist|maxillofacial/i, "Dentistry"],
  [/dermatolog|skin/i, "Dermatology"],
  [/diabet|endocrin/i, "Endocrine"],
  [/radiolog|imaging|nuclear medicine/i, "Radiography"],
  [/diet|nutrition/i, "DietNutrition"],
  [/\bent\b|otolaryng|head neck/i, "Otolaryngologic"],
  [/gastro|hepat|liver/i, "Gastroenterologic"],
  [/surg/i, "Surgical"],
  [/hematolog|haematolog|transfusion/i, "Hematologic"],
  [/lab medicine|laborator/i, "LaboratoryScience"],
  [/patholog/i, "Pathology"],
  [/nephrolog|kidney|lithotripsy/i, "Renal"],
  [/neurolog|neurosurg/i, "Neurologic"],
  [/obstetric/i, "Obstetric"],
  [/gyn/i, "Gynecologic"],
  [/ophthalm|eye/i, "Optometric"],
  [/orthop|joint|musculo/i, "Musculoskeletal"],
  [/rheumat/i, "Rheumatologic"],
  [/p(a)?ediatric|child|neonat|newborn/i, "Pediatric"],
  [/physical medicine|rehabilit|physiother/i, "Physiotherapy"],
  [/plastic|cosmetic|reconstructive/i, "PlasticSurgery"],
  [/psychiatr|counsell/i, "Psychiatric"],
  [/respirat|pulmon|chest/i, "Pulmonary"],
  [/urolog/i, "Urologic"],
];

export function medicalSpecialties(names: (string | null | undefined)[]): string[] {
  const out = new Set<string>();
  for (const name of names) {
    if (!name) continue;
    for (const [re, value] of SPECIALTY_RULES) if (re.test(name)) out.add(`https://schema.org/${value}`);
  }
  return [...out];
}

const hospitalRef = { "@type": "Hospital", "@id": HOSPITAL_ID, name: HOSPITAL_NAME, url: `${SITE_URL}/` };

/** Homepage identity: hospital, medical organization and medical college in one entity. */
export function hospitalJsonLd(specialityNames: string[]): JsonLd {
  const specialties = medicalSpecialties(specialityNames);
  return {
    "@context": "https://schema.org",
    "@type": ["Hospital", "MedicalOrganization", "EducationalOrganization"],
    "@id": HOSPITAL_ID,
    name: HOSPITAL_NAME,
    alternateName: HOSPITAL_ALT_NAMES,
    description:
      "South Apollo Medical College Hospital in Jagua, Barishal is the only private medical college and 250-bed multi-specialty hospital in Barishal Division, with 24/7 emergency care, specialist doctors, diagnostics and health checkup packages since 2018.",
    url: `${SITE_URL}/`,
    logo: LOGO_URL,
    image: LOGO_URL,
    foundingDate: "2018",
    telephone: APPOINTMENT_PHONE,
    email: HOSPITAL_EMAIL,
    address: ADDRESS,
    geo: { "@type": "GeoCoordinates", ...HOSPITAL_GEO },
    hasMap: HOSPITAL_MAP_URL,
    areaServed: { "@type": "AdministrativeArea", name: "Barishal Division, Bangladesh" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    contactPoint: [
      { "@type": "ContactPoint", telephone: APPOINTMENT_PHONE, contactType: "appointments", areaServed: "BD", availableLanguage: ["English", "Bengali"] },
      { "@type": "ContactPoint", telephone: HELPLINE_PHONE, contactType: "customer support", areaServed: "BD", availableLanguage: ["English", "Bengali"] },
    ],
    isAcceptingNewPatients: true,
    ...(specialties.length ? { medicalSpecialty: specialties } : {}),
    ...(specialityNames.length ? { knowsAbout: specialityNames } : {}),
  };
}

/** Lets Google show "South Apollo Medical College Hospital" as the site name. */
export function websiteJsonLd(): JsonLd {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: HOSPITAL_NAME, alternateName: HOSPITAL_ALT_NAMES, url: `${SITE_URL}/`, inLanguage: "en-BD", publisher: { "@id": HOSPITAL_ID } };
}

export type DoctorSeo = { id: string; name: string; designation: string; degrees: string; institution: string; department: string; image: string; bio: string };

export function physicianJsonLd(d: DoctorSeo): JsonLd {
  const specialties = medicalSpecialties([d.department, d.designation]);
  const summary = [d.designation, d.degrees, d.department].filter(Boolean).join(" · ");
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${absoluteUrl(`/doctors/${d.id}`)}#physician`,
    name: d.name,
    url: absoluteUrl(`/doctors/${d.id}`),
    ...(d.image.startsWith("https://") ? { image: d.image } : {}),
    description: clip(d.bio || `${d.name}${summary ? `, ${summary}` : ""} at ${HOSPITAL_NAME}, Barishal.`, 300),
    ...(specialties.length ? { medicalSpecialty: specialties } : {}),
    ...(d.department ? { knowsAbout: d.department } : {}),
    ...(d.degrees ? { hasCredential: d.degrees.split(/,(?![^(]*\))/).map((n) => n.trim()).filter(Boolean).map((name) => ({ "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name })) } : {}),
    hospitalAffiliation: hospitalRef,
    ...(d.institution ? { memberOf: { "@type": "Organization", name: d.institution } } : {}),
    address: ADDRESS,
    telephone: APPOINTMENT_PHONE,
    isAcceptingNewPatients: true,
  };
}

export type ArticleSeo = { kind: "NewsArticle" | "BlogPosting"; path: string; title: string; description: string; image?: string | null; date?: string | null; author?: string | null };

export function articleJsonLd(a: ArticleSeo): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": a.kind,
    headline: clip(a.title, 110),
    description: clip(a.description, 300),
    mainEntityOfPage: absoluteUrl(a.path),
    ...(a.image?.startsWith("https://") ? { image: [a.image] } : {}),
    ...(a.date ? { datePublished: a.date } : {}),
    author: a.author ? { "@type": "Person", name: a.author } : { "@type": "Organization", name: HOSPITAL_NAME, url: `${SITE_URL}/` },
    publisher: { "@type": "Organization", "@id": HOSPITAL_ID, name: HOSPITAL_NAME, logo: { "@type": "ImageObject", url: LOGO_URL } },
  };
}
