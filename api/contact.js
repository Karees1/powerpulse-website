const { Resend } = require('resend');
const {
  createRateLimiter,
  getClientIp,
  isAllowedOrigin,
  cleanText,
  escapeHtml,
  parseJsonBody,
} = require('./_lib/security');

const MAX_LENGTHS = { name: 100, email: 200, phone: 30, message: 5000, honeypot: 200 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isRateLimited = createRateLimiter();

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

  const body = parseJsonBody(req);
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
