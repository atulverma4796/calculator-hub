import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TheCalcHub — Free Online Calculators · thecalchub.org",
    short_name: "TheCalcHub",
    description:
      "42 free online calculators for EMI, SIP, HRA, tax regime, capital gains, compound interest, mortgage, GST, BMI, calorie, scientific, and more. Interactive charts, multi-currency support. No signup.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    orientation: "portrait",
    categories: ["finance", "business", "productivity", "utilities", "education"],
    icons: [
      { src: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
