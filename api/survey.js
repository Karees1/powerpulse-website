const { Resend } = require('resend');
const {
  createRateLimiter,
  getClientIp,
  isAllowedOrigin,
  cleanText,
  escapeHtml,
  parseJsonBody,
} = require('./_lib/security');

const MAX_SHORT = 200;
const MAX_LONG = 4000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isRateLimited = createRateLimiter();

// [field name, label, required, "short" | "long"]
const FIELDS = [
  ['submitter_name', 'Filled in by (name & role)', true, 'short'],
  ['business_name', 'Business / brand name', true, 'short'],
  ['tagline', 'Tagline / one-line positioning', false, 'short'],
  ['industry', 'What the business does (one line)', true, 'short'],
  ['brand_color', 'Brand color (hex or description)', false, 'short'],
  ['whatsapp_number', 'WhatsApp number (with country code)', true, 'short'],
  ['phone_numbers', 'Other phone number(s)', false, 'long'],
  ['contact_email', 'Contact email', true, 'short'],
  ['address', 'Physical address / location', false, 'long'],
  ['hours', 'Business hours', false, 'short'],
  ['social_links', 'Social media links (one per line)', false, 'long'],
  ['founded_year', 'Founded / years in operation', false, 'short'],
  ['about_text', 'About the business (a few sentences)', true, 'long'],
  ['mission_vision_values', 'Mission / vision / values', false, 'long'],
  ['differentiators', 'Why choose us (one per line)', false, 'long'],
  ['services_offered', 'Services / products offered (one per line)', true, 'long'],
  ['target_industries', 'Who you serve (industries / customer types)', false, 'long'],
  ['key_stats', 'Key stats (e.g. "20+ years", "500+ projects")', false, 'long'],
  ['testimonials', 'Testimonials (quote — name, company)', false, 'long'],
  ['cta_wording', 'Preferred call-to-action wording', false, 'short'],
  ['notes', 'Anything else we should know', false, 'long'],
];

function validate(body) {
  const honeypot = cleanText(body.website).slice(0, MAX_SHORT);
  const data = {};

  for (const [name, label, required, kind] of FIELDS) {
    const cap = kind === 'short' ? MAX_SHORT : MAX_LONG;
    const raw = typeof body[name] === 'string' ? body[name] : '';
    const value = kind === 'short' ? cleanText(raw).slice(0, cap) : raw.trim().slice(0, cap);
    if (required && !value) return { error: `Please fill in: ${label}` };
    data[name] = value;
  }

  if (!EMAIL_RE.test(data.contact_email)) return { error: 'Please enter a valid contact email.' };

  return { data, honeypot };
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
    res.status(429).json({ ok: false, error: 'Too many requests — please wait a bit and try again.' });
    return;
  }

  const body = parseJsonBody(req);
  const { data, honeypot, error } = validate(body);
  if (error) {
    res.status(400).json({ ok: false, error });
    return;
  }

  if (honeypot) {
    res.status(200).json({ ok: true });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.SURVEY_RECIPIENT || process.env.CONTACT_RECIPIENT || 'boilertechniques@gmail.com';
  const fromAddress = process.env.CONTACT_FROM || 'PowerPulse Website <onboarding@resend.dev>';

  if (!apiKey) {
    res.status(503).json({ ok: false, error: 'Email is not configured yet — please try again later.' });
    return;
  }

  const resend = new Resend(apiKey);
  const rows = FIELDS.map(([name, label]) => {
    const value = data[name] ? escapeHtml(data[name]).replace(/\n/g, '<br>') : '<em>—</em>';
    return `<tr><td style="padding:8px 12px;border:1px solid #ddd;vertical-align:top;white-space:nowrap;"><strong>${escapeHtml(label)}</strong></td><td style="padding:8px 12px;border:1px solid #ddd;">${value}</td></tr>`;
  }).join('');

  const { error: sendError } = await resend.emails.send({
    from: fromAddress,
    to: recipient,
    replyTo: data.contact_email,
    subject: `New site content survey — ${data.business_name}`,
    html: `
      <h2>New site content survey submission</h2>
      <p><strong>Business:</strong> ${escapeHtml(data.business_name)}</p>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">${rows}</table>
    `,
  });

  if (sendError) {
    res.status(502).json({ ok: false, error: 'Could not send the survey. Please try again shortly.' });
    return;
  }

  res.status(200).json({ ok: true });
};
