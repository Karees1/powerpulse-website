// Progressive-enhancement AJAX submit for the contact + footer quick-inquiry forms.
// Falls back to a normal POST (browser default) if JS fails to load.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form.pp-ajax-form').forEach((form) => {
    const statusEl = form.querySelector('.pp-form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      submitBtn.disabled = true;
      const originalLabel = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending…';
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'pp-form-status';
      }

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.ok) {
          form.reset();
          if (statusEl) {
            statusEl.textContent = "Message sent — we'll reply within one business day. You can also WhatsApp us for a faster response.";
            statusEl.className = 'pp-form-status pp-form-status-ok';
          }
        } else {
          if (statusEl) {
            statusEl.textContent = data.error || 'Something went wrong sending your message. Please try WhatsApp or call us instead.';
            statusEl.className = 'pp-form-status pp-form-status-err';
          }
        }
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = 'Network error — please try WhatsApp or call us instead.';
          statusEl.className = 'pp-form-status pp-form-status-err';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
    });
  });
});
