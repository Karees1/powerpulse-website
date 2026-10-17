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

// [field name, label, required, "short" | "long"] — must match onboarding-2026.html's
// input `name` attributes 1:1. Keep this the single source of truth for both
// server-side validation and the field list rendered in the notification email.
const FIELDS = [
  ['existing_testimonials_check', 'Which of the 8 named "client" companies (logo strip + testimonials) are real?', true, 'long'],
  ['submitter_name', 'Filled in by (name & role)', true, 'short'],
  ['submitter_role', 'Your role', false, 'short'],
  ['legal_entity_name', 'Registered legal company name', true, 'short'],
  ['business_name', 'Trading / brand name', false, 'short'],
  ['tagline', 'Tagline / one-line positioning', false, 'short'],
  ['service_categories', 'Service categories (selected)', false, 'short'],
  ['service_categories_other', 'Other service category', false, 'short'],
  ['brand_color', 'Brand color (hex or description)', false, 'short'],
  ['brand_assets_available', 'Logo / real project photos available?', false, 'short'],
  ['social_handles', "PowerPulse's own social media handles", false, 'long'],
  ['preferred_public_contact', 'What contact info should the public site show?', true, 'long'],
  ['whatsapp_number', 'WhatsApp number (with country code)', true, 'short'],
  ['phone_numbers', 'Other phone number(s)', false, 'long'],
  ['contact_email', "Submitter's email (for our records / replies)", true, 'short'],
  ['address', 'Physical address / location', false, 'long'],
  ['hours', 'Business hours', false, 'short'],
  ['service_area_radius', 'Real service area', true, 'short'],
  ['response_time_commitment', 'Response-time commitment', false, 'short'],
  ['certifications_and_compliance', 'Certifications / compliance / licenses', false, 'long'],
  ['equipment_brands_serviced', 'Equipment brands actually serviced', false, 'long'],
  ['case_study_1_summary', 'Case study 1 — what we did', false, 'long'],
  ['case_study_1_result', 'Case study 1 — result', false, 'short'],
  ['case_study_2_summary', 'Case study 2 — what we did', false, 'long'],
  ['case_study_2_result', 'Case study 2 — result', false, 'short'],
  ['case_study_3_summary', 'Case study 3 — what we did', false, 'long'],
  ['case_study_3_result', 'Case study 3 — result', false, 'short'],
  ['differentiators', 'Why choose us (one per line, with evidence)', false, 'long'],
  ['key_stats', 'Key stats (independently checkable)', false, 'long'],
  ['founded_year', 'Founded / actual years in operation', true, 'short'],
  ['about_text', 'About the business (a few sentences)', true, 'long'],
  ['mission_vision_values', 'Mission / vision / values', false, 'long'],
  ['company_history_milestones', 'Company history / milestones', false, 'long'],
  ['service_1_name', 'Service 1 — name', true, 'short'],
  ['service_1_description', 'Service 1 — description', true, 'long'],
  ['service_2_name', 'Service 2 — name', false, 'short'],
  ['service_2_description', 'Service 2 — description', false, 'long'],
  ['service_3_name', 'Service 3 — name', false, 'short'],
  ['service_3_description', 'Service 3 — description', false, 'long'],
  ['service_4_name', 'Service 4 — name', false, 'short'],
  ['service_4_description', 'Service 4 — description', false, 'long'],
  ['service_5_name', 'Service 5 — name', false, 'short'],
  ['service_5_description', 'Service 5 — description', false, 'long'],
  ['target_industries', 'Who you serve (industries / customer types)', false, 'long'],
  ['testimonials', 'Real testimonials (only with permission)', false, 'long'],
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
  const recipient = process.env.SURVEY_RECIPIENT || process.env.CONTACT_RECIPIENT;
  const fromAddress = process.env.CONTACT_FROM || 'PowerPulse Website <onboarding@resend.dev>';

  if (!apiKey || !recipient) {
    res.status(503).json({ ok: false, error: 'Email is not configured yet — please try again later.' });
    return;
  }

  const resend = new Resend(apiKey);
  const rows = FIELDS.map(([name, label]) => {
    const value = data[name] ? escapeHtml(data[name]).replace(/\n/g, '<br>') : '<em>—</em>';
    return `<tr><td style="padding:8px 12px;border:1px solid #ddd;vertical-align:top;white-space:nowrap;"><strong>${escapeHtml(label)}</strong></td><td style="padding:8px 12px;border:1px solid #ddd;">${value}</td></tr>`;
  }).join('');
  const displayName = data.legal_entity_name || data.business_name || 'Unnamed submission';

  const { error: sendError } = await resend.emails.send({
    from: fromAddress,
    to: recipient,
    replyTo: data.contact_email,
    subject: `New site content survey — ${displayName}`,
    html: `
      <h2>New site content survey submission</h2>
      <p><strong>Business:</strong> ${escapeHtml(displayName)}</p>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">${rows}</table>
    `,
  });

  if (sendError) {
    res.status(502).json({ ok: false, error: 'Could not send the survey. Please try again shortly.' });
    return;
  }

  res.status(200).json({ ok: true });
};
