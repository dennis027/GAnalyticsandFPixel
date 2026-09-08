/*
  SilkTech demo — event wiring for Google Analytics (GA4) and Meta Pixel.

  This file assumes both snippets from index.html <head> are in place:
    - gtag()  -> from the GA4 snippet
    - fbq()   -> from the Meta Pixel snippet

  Until you embed those snippets, gtag/fbq won't exist, so every call
  below is wrapped in a safety check (typeof === 'function') and also
  logged to the console so you can see exactly what WOULD have fired.
*/

function track(gaEventName, gaParams, fbEventName, fbParams) {
  console.log('[analytics] GA4:', gaEventName, gaParams || {});
  console.log('[analytics] Pixel:', fbEventName, fbParams || {});

  if (typeof gtag === 'function') {
    gtag('event', gaEventName, gaParams || {});
  }
  if (typeof fbq === 'function') {
    fbq('track', fbEventName, fbParams || {});
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // Primary CTA — "Request a project quote"
  const ctaPrimary = document.getElementById('cta-primary');
  ctaPrimary.addEventListener('click', () => {
    track(
      'lead_cta_click',
      { link_text: 'Request a project quote', location: 'hero' },
      'Lead',
      { content_name: 'hero_quote_cta' }
    );
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });

  // Secondary CTA — "View sample work"
  const ctaSecondary = document.getElementById('cta-secondary');
  ctaSecondary.addEventListener('click', () => {
    track(
      'select_content',
      { content_type: 'section', item_id: 'work' },
      'ViewContent',
      { content_name: 'sample_work_section' }
    );
    document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
  });

  // Project cards
  document.querySelectorAll('.proj-card').forEach((card) => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.project;
      track(
        'project_card_click',
        { project_id: projectId },
        'ViewContent',
        { content_name: projectId, content_type: 'project' }
      );
    });
  });

  // Lead form
  const form = document.getElementById('lead-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    // This is a static demo, so we don't actually send the form anywhere.
    // On a real site this is where you'd call your backend/API, then
    // fire the tracking calls once the submission succeeds.
    track(
      'generate_lead',
      { form_id: 'lead-form' },
      'Lead',
      { content_name: 'project_inquiry_form' }
    );

    status.textContent = `Thanks${name ? ', ' + name : ''} — this is a demo form, so nothing was actually sent, but the tracking events above just fired.`;
    form.reset();
  });

  // Baseline pageview log, in case GA/Pixel snippets aren't embedded yet
  console.log('[analytics] Page loaded. Embed the GA4 and Meta Pixel snippets in index.html <head> to see real network requests fire (check the Network tab for requests to google-analytics.com and facebook.com/tr).');
});