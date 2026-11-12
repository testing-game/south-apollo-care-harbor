import { Facebook, Instagram, Linkedin, MessageCircle, Twitter, Youtube, type LucideIcon } from "lucide-react";
import type { SocialPlatform } from "@/lib/social-links";

export const SOCIAL_ICONS: Record<SocialPlatform, LucideIcon> = {
  facebook: Facebook,
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  whatsapp: MessageCircle,
};
