import type { MetadataRoute } from "next";

const SITE_URL = "https://thecalchub.org";

export default function robots(): MetadataRoute.Robots {
  const aiRules = [
    "GPTBot", "OAI-SearchBot", "ChatGPT-User",
    "ClaudeBot", "Claude-SearchBot", "Claude-User",
    "Google-Extended", "Google-CloudVertexBot",
    "PerplexityBot", "Perplexity-User",
    "Applebot-Extended",
    "Amazonbot",
    "Meta-ExternalAgent", "Meta-ExternalFetcher", "FacebookBot",
    "CCBot",
    "AI2Bot",
    "Bytespider",
    "Diffbot",
    "YouBot",
    "Cohere-ai",
    "anthropic-ai",
    "Owler",
    "PetalBot",
    "Timpibot",
  ].map((bot) => ({
    userAgent: bot,
    allow: ["/"],
    disallow: [] as string[],
  }));

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/"],
      },
      ...aiRules,
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
