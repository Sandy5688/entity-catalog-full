import axios from 'axios';
import Bottleneck from 'bottleneck';
import RobotsParser from 'robots-parser';
import { URL } from 'url';

// Per-host throttlers
const limiters = new Map();

// Retry config
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500; // initial backoff

async function getLimiterForHost(hostname) {
  if (!limiters.has(hostname)) {
    // 1 request per second max by default
    const limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 1000,
    });
    limiters.set(hostname, limiter);
  }
  return limiters.get(hostname);
}

// Cache robots.txt per host
const robotsCache = new Map();

async function fetchRobotsTxt(url) {
  try {
    const { origin } = new URL(url);
    if (robotsCache.has(origin)) return robotsCache.get(origin);

    const robotsUrl = `${origin}/robots.txt`;
    const res = await axios.get(robotsUrl, { timeout: 5000 });
    const parser = RobotsParser(robotsUrl, res.data);
    robotsCache.set(origin, parser);
    return parser;
  } catch (err) {
    // Assume allowed if robots.txt not found or network error
    return RobotsParser(url, '');
  }
}

// Retry helper
async function fetchWithRetry(url, retries = MAX_RETRIES) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const res = await axios.get(url, { timeout: 5000 });
      return res.data;
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      // Exponential backoff
      const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// Main function
export async function fetchUrl(url, userAgent = 'EntityCatalogBot/1.0') {
  const hostname = new URL(url).hostname;

  // Robots.txt check
  const robots = await fetchRobotsTxt(url);
  if (!robots.isAllowed(url, userAgent)) {
    throw new Error(`Blocked by robots.txt: ${url}`);
  }

  // Throttle per host
  const limiter = await getLimiterForHost(hostname);
  return limiter.schedule(() => fetchWithRetry(url));
}
