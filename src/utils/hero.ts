// Hero section content, managed from the Aurèa dashboard (GET /api/content/hero)
import { DASHBOARD_API_URL } from "@/utils/catalog";

export interface HeroCopy {
  imageAlt: string;
  promoBadge: string;
  headline1: string;
  headline2: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  trustShipping: string;
  trustCod: string;
  stockBadge: string;
  customersCount: string;
  badges: { label: string; sub: string }[];
}

export interface HeroContent {
  image: string;
  rating: string;
  primaryTarget: string;
  secondaryTarget: string;
  show: { promoBadge: boolean; secondaryCta: boolean; trust: boolean; stockBadge: boolean; customers: boolean; badges: boolean };
  en: HeroCopy;
  ar: HeroCopy;
}

export async function fetchHero(): Promise<HeroContent> {
  const res = await fetch(`${DASHBOARD_API_URL}/api/content/hero`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Hero request failed (${res.status})`);
  return (await res.json()).hero;
}
