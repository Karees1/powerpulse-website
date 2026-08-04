const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

// Best-effort in-memory rate limit, keyed per module instance. Resets on cold
// start / differs per warm serverless instance -- a real throttle, not a
// guarantee -- but adds a cheap layer against casual spam bots.
function createRateLimiter() {
  const hits = new Map();
  return function isRateLimited(ip) {
    const now = Date.now();
    const timestamps = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    timestamps.push(now);
    hits.set(ip, timestamps);
    return timestamps.length > RATE_LIMIT_MAX;
  };
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function isAllowedOrigin(req) {
  const siteUrl = process.env.SITE_URL;
  const host = req.headers.host;
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  if (!origin && !referer) return true; // some legitimate same-origin form posts omit both
  const candidates = [origin, referer].filter(Boolean);
  return candidates.some((value) => {
    try {
      const url = new URL(value);
      if (siteUrl && url.origin === new URL(siteUrl).origin) return true;
      if (host && url.host === host) return true;
      return false;
    } catch {
      return false;
    }
  });
}

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/[\r\n]+/g, ' ').trim() : '';
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseJsonBody(req) {
  return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
}

module.exports = {
  createRateLimiter,
  getClientIp,
  isAllowedOrigin,
  cleanText,
  escapeHtml,
  parseJsonBody,
};
