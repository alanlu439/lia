const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const header = document.querySelector('.header');
const mobile = window.matchMedia('(max-width: 960px)');
function setMenu(open, restoreFocus = false) {
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
  nav.inert = mobile.matches && !open;
  if (restoreFocus) toggle.focus();
}
if (toggle && nav) {
  setMenu(false);
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) setMenu(false, true);
  });
  document.addEventListener('click', event => {
    if (nav.classList.contains('open') && !header.contains(event.target)) setMenu(false);
  });
  header.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (nav.classList.contains('open') && !header.contains(document.activeElement)) setMenu(false);
    });
  });
  mobile.addEventListener('change', () => setMenu(false));
}
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
window.addEventListener('scroll', updateHeader, {passive:true});
updateHeader();
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        reveal(entry.target);
      }
    });
  }, {threshold:0.01, rootMargin:'0px 0px -24px 0px'});
  const reveal = element => {
    element.classList.add('reveal-in');
    observer.unobserve(element);
  };
  const revealAll = () => {
    document.querySelectorAll('.reveal-ready').forEach(reveal);
    observer.disconnect();
  };
  document.querySelectorAll('.intro > div, .feature-copy, .value, .story-row, .process-head, .steps li, .mission-vision article, .serve-story > div, .cta-line, .photo, .about-panel, .contact-panel').forEach(element => {
    if (element.getBoundingClientRect().top >= window.innerHeight) {
      element.classList.add('reveal-ready');
      observer.observe(element);
    }
  });
  motionPreference.addEventListener('change', event => {
    if (event.matches) revealAll();
  });
  document.addEventListener('focusin', event => {
    const section = event.target.closest('.reveal-ready');
    if (section) reveal(section);
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) revealAll();
  });
}
window.addEventListener('pageshow', () => {
  if (toggle && nav) setMenu(false);
  updateHeader();
});
// Scroll-linked introduction without intercepting wheel or touch scrolling.
const opening = document.querySelector('.opening');
if (opening) {
  let frame = 0;
  const clamp = value => Math.min(1, Math.max(0, value));
  const smooth = value => value * value * (3 - 2 * value);
  const renderOpening = () => {
    frame = 0;
    const reduced = motionPreference.matches;
    const progress = clamp(window.scrollY / (window.innerHeight * .82));
    const eased = smooth(progress);
    const target = header.querySelector('.official-logo').getBoundingClientRect();
    const initialSize = Math.min(260, window.innerWidth * .46);
    opening.style.setProperty('--seal-y', `${window.innerHeight * .38 + (target.top + target.height / 2 - window.innerHeight * .38) * eased}px`);
    opening.style.setProperty('--seal-size', `${initialSize + (target.width - initialSize) * eased}px`);
    opening.style.setProperty('--seal-dark', smooth(clamp((progress - .65) / .35)));
    opening.style.setProperty('--navy-fade', 1 - smooth(clamp((progress - .08) / .84)));
    opening.style.setProperty('--slogan-opacity', 1 - smooth(clamp(progress / .68)));
    opening.style.setProperty('--slogan-scale', 1 + eased * .65);
    opening.style.setProperty('--slogan-y', `${eased * 105}px`);
    document.body.classList.toggle('opening-complete', reduced || progress >= .995);
    header.inert = !reduced && progress < .995;
    opening.inert = !reduced && progress >= .995;
  };
  const scheduleOpening = () => { if (!frame) frame = requestAnimationFrame(renderOpening); };
  window.addEventListener('scroll', scheduleOpening, {passive:true});
  window.addEventListener('resize', scheduleOpening);
  window.addEventListener('pageshow', scheduleOpening);
  motionPreference.addEventListener('change', scheduleOpening);
  document.querySelector('.skip')?.addEventListener('click', () => {
    document.querySelector('#welcome').scrollIntoView({behavior:'instant'});
  });
  renderOpening();
}
const form = document.querySelector('#inquiry-form');
if (form) {
  const phone = form.querySelector('#phone');
  const method = form.querySelector('#contact-method');
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  const syncPhone = () => {
    phone.required = method.value === 'phone';
    phone.setAttribute('aria-required', String(phone.required));
  };
  method.addEventListener('change', syncPhone);
  syncPhone();
  const feedback = (message, state) => {
    status.textContent = message;
    status.dataset.state = state;
    status.hidden = false;
    status.focus();
  };
  if (new URLSearchParams(location.search).has('sent')) feedback('Thank you. Your inquiry has been received by LIA.', 'success');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || !form.reportValidity()) return;
    const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
    if (isLocal) {
      feedback('This is a local preview. Please use the published website to send your inquiry.', 'error');
      return;
    }
    button.disabled = true;
    button.textContent = 'Sending…';
    status.hidden = true;
    try {
      const response = await fetch('https://logos-international-academy.netlify.app/request-info/', {
        method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams(new FormData(form)).toString(),
        signal:AbortSignal.timeout(20000)
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      syncPhone();
      feedback('Thank you. Your inquiry has been received by LIA. We’ll reply using your contact details.', 'success');
    } catch (error) {
      feedback('We couldn’t confirm your submission. Your entries are still here. Please try again, or contact logos.chiangmai@gmail.com or 089-329-0517.', 'error');
    } finally {
      button.disabled = false;
      button.innerHTML = 'Request Information <span aria-hidden="true">↗</span>';
    }
  });
}
