import { z } from "zod";

export const SOCIAL_PLATFORMS = ["facebook", "youtube", "instagram", "linkedin", "twitter", "whatsapp"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  youtube: "YouTube",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  whatsapp: "WhatsApp",
};

export type SocialLink = { platform: string; url: string; is_active: boolean; display_order: number };

/** Trims and validates a pasted profile URL; adds https:// when the scheme is missing. Empty input stays empty. */
export function normalizeSocialUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return "";
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  if (/\s/.test(withScheme)) return null;
  try {
    const u = new URL(withScheme);
    if (!/^https?:$/.test(u.protocol) || !u.hostname.includes(".")) return null;
    return withScheme;
  } catch {
    return null;
  }
}

/** Only links that are switched on and have a URL are shown in the footer, in display order. */
export function visibleSocialLinks<T extends SocialLink>(links: T[]): T[] {
  return links
    .filter((l) => l.is_active && l.url.trim() !== "" && (SOCIAL_PLATFORMS as readonly string[]).includes(l.platform))
    .sort((a, b) => a.display_order - b.display_order);
}

export const socialLinkSchema = z.object({
  url: z.string().transform((v, ctx) => {
    const n = normalizeSocialUrl(v);
    if (n === null) { ctx.addIssue({ code: "custom", message: "Enter a valid web address" }); return z.NEVER; }
    return n;
  }),
  is_active: z.boolean(),
}).refine((v) => !v.is_active || v.url !== "", { message: "Add a link before switching it on", path: ["url"] });
