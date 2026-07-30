const { Resend } = require('resend');

const MAX_LENGTHS = { name: 100, email: 200, phone: 30, message: 5000, honeypot: 200 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

// Best-effort in-memory rate limit. Resets on cold start / differs per instance —
// a real throttle, not a guarantee — but adds a cheap layer against casual spam bots.
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
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

function validate(body) {
  const name = cleanText(body.name).slice(0, MAX_LENGTHS.name);
  const email = cleanText(body.email).slice(0, MAX_LENGTHS.email);
  const phone = cleanText(body.phone).slice(0, MAX_LENGTHS.phone);
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, MAX_LENGTHS.message) : '';
  const honeypot = cleanText(body.website).slice(0, MAX_LENGTHS.honeypot);

  if (!name) return { error: 'Please enter your name.' };
  if (!email || !EMAIL_RE.test(email)) return { error: 'Please enter a valid email address.' };
  if (!message) return { error: 'Please enter a message.' };

  return { data: { name, email, phone, message, honeypot } };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  if (!isAllowedOrigin(req)) {
    res.status(403).json({ ok: false, error: 'Request rejected.' });
    return;
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.status(429).json({ ok: false, error: 'Too many requests — please try again shortly, or reach us on WhatsApp.' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { data, error } = validate(body);
  if (error) {
    res.status(400).json({ ok: false, error });
    return;
  }

  // Honeypot filled in => almost certainly a bot. Pretend success so it doesn't learn to adapt.
  if (data.honeypot) {
    res.status(200).json({ ok: true });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_RECIPIENT || 'boilertechniques@gmail.com';
  const fromAddress = process.env.CONTACT_FROM || 'PowerPulse Website <onboarding@resend.dev>';

  if (!apiKey) {
    res.status(503).json({ ok: false, error: 'Email is not configured yet. Please WhatsApp or call us instead.' });
    return;
  }

  const resend = new Resend(apiKey);
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');

  const { error: sendError } = await resend.emails.send({
    from: fromAddress,
    to: recipient,
    replyTo: data.email,
    subject: `New enquiry from ${data.name} — PowerPulse website`,
    html: `
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${safePhone || '—'}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  });

  if (sendError) {
    res.status(502).json({ ok: false, error: 'Could not send your message. Please WhatsApp or call us instead.' });
    return;
  }

  res.status(200).json({ ok: true });
};
