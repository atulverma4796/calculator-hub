#!/usr/bin/env node
/**
 * Notify Bing IndexNow about URLs on thecalchub.org.
 *
 * Usage:
 *   node scripts/notify-indexnow.mjs                              # submit all sitemap URLs
 *   node scripts/notify-indexnow.mjs <url1> <url2> ...            # submit specific URLs
 *
 * IndexNow protocol: https://www.indexnow.org/documentation
 * Cloudflare Crawler Hints already auto-submits — this is a manual backup
 * for when you want to force-notify after a big content update.
 *
 * Notifies: Bing → ChatGPT/Copilot/DuckDuckGo, Yandex, Naver, Seznam, Yep.
 * Does NOT notify Google (Google ignores IndexNow).
 */

const HOST = "thecalchub.org";
const KEY = "05a6edd510604976bc0fff6b1ff1f35b";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";
const BATCH_SIZE = 10000; // IndexNow accepts up to 10,000 URLs per request

async function fetchSitemapUrls() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  // Match <loc>...</loc> entries. Skip image and other namespaces.
  const matches = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
  return matches.map((m) => m.replace(/<\/?loc>/g, "").trim()).filter((u) => u.startsWith(`https://${HOST}`));
}

async function submit(urls) {
  if (urls.length === 0) {
    console.log("No URLs to submit.");
    return;
  }
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const body = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch,
    };
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} URLs → HTTP ${res.status} ${res.statusText}`);
    if (text && text.length < 500) console.log(`Response: ${text}`);
    if (!res.ok) {
      console.error(`  ⚠ Submission failed. Common causes:`);
      console.error(`    403 → key file not reachable at ${KEY_LOCATION}`);
      console.error(`    422 → URLs don't match the host ${HOST}`);
      console.error(`    429 → Too many requests, wait and retry`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  let urls;
  if (args.length > 0) {
    urls = args;
    console.log(`Submitting ${urls.length} URLs from command line...`);
  } else {
    console.log(`Fetching URLs from ${SITEMAP_URL}...`);
    urls = await fetchSitemapUrls();
    console.log(`Found ${urls.length} URLs in sitemap.`);
  }
  await submit(urls);
  console.log("Done. Check Bing Webmaster Tools → URL Submission → see processed URLs.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
