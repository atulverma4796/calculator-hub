import type { MetadataRoute } from "next";
import { CALCULATOR_LIST } from "@/lib/calculators";
import { VARIANT_LIST } from "@/lib/calculatorVariants";

const SITE_URL = "https://calculatorhub.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorPages = CALCULATOR_LIST.map((calc) => ({
    url: `${SITE_URL}/calculator/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const variantPages = VARIANT_LIST.map((v) => ({
    url: `${SITE_URL}/calculator/${v.slug}/${v.variant}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...calculatorPages,
    ...variantPages,
    {
      url: `${SITE_URL}/embed`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
