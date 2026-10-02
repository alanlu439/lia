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
  document.querySelectorAll('.intro > div, .feature-copy, .value, .story-row, .process-head, .steps li, .mission-vision article, .serve-story > div, .cta-line, .photo, .school-photo, .about-panel, .contact-panel, .three-values > article, .admission-fit > div, .about-description, .official-list > div, .mission-banner > .wrap, .service-statement > .wrap, .footer-manifesto').forEach(element => {
    if (element.getBoundingClientRect().top >= window.innerHeight) {
      element.classList.add('reveal-ready');
      const siblings = [...element.parentElement.children].filter(child => child.matches('.value, article, li, .story-row, .official-list > div'));
      element.style.setProperty('--reveal-delay', `${Math.max(0, siblings.indexOf(element)) * 75}ms`);
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
  const main = document.querySelector('#main');
  const footer = document.querySelector('footer');
  let focusWelcome = false;
  let frame = 0;
  let displayedProgress = null;
  let previousTime = 0;
  const clamp = value => Math.min(1, Math.max(0, value));
  const smooth = value => value * value * (3 - 2 * value);
  const renderOpening = (time = performance.now()) => {
    frame = 0;
    const reduced = motionPreference.matches;
    const openingHeight = document.querySelector('.opening-space').offsetHeight || window.innerHeight;
    const destination = clamp(window.scrollY / (openingHeight * .82));
    const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
    previousTime = time;
    if (displayedProgress === null || reduced) displayedProgress = destination;
    displayedProgress += (destination - displayedProgress) * (1 - Math.exp(-elapsed / 85));
    if (Math.abs(destination - displayedProgress) < .0001) displayedProgress = destination;
    const progress = displayedProgress;
    // Finish the seal's movement before exchanging the two identical navy images.
    const eased = smooth(clamp(progress / .88));
    const target = header.querySelector('.official-logo').getBoundingClientRect();
    const viewport = opening.getBoundingClientRect();
    const initialSize = Math.min(260, viewport.width * .46, viewport.height * .3);
    const titleHeight = opening.querySelector('.opening-title').offsetHeight;
    const gap = Math.min(40, Math.max(16, viewport.height * .035));
    const groupTop = (viewport.height - initialSize - gap - titleHeight) / 2;
    const initialY = groupTop + initialSize / 2;
    opening.style.setProperty('--title-top', `${groupTop + initialSize + gap}px`);
    opening.style.setProperty('--initial-seal-y', `${initialY}px`);
    opening.style.setProperty('--seal-x', `${viewport.width / 2 + (target.left + target.width / 2 - viewport.width / 2) * eased}px`);
    opening.style.setProperty('--seal-y', `${initialY + (target.top + target.height / 2 - initialY) * eased}px`);
    opening.style.setProperty('--seal-size', `${initialSize + (target.width - initialSize) * eased}px`);
    opening.style.setProperty('--seal-dark', smooth(clamp((progress - .48) / .36)));
    opening.style.setProperty('--navy-fade', 1 - smooth(clamp((progress - .08) / .84)));
    opening.style.setProperty('--slogan-opacity', 1 - smooth(clamp(progress / .68)));
    opening.style.setProperty('--slogan-scale', 1 + smooth(progress) * 1.35);
    opening.style.setProperty('--slogan-y', `${smooth(progress) * 160}px`);
    const headerReveal = reduced ? 1 : smooth(clamp((progress - .52) / .34));
    const logoHandoff = reduced ? 1 : smooth(clamp((progress - .9) / .1));
    header.style.setProperty('--header-reveal', headerReveal);
    header.style.setProperty('--logo-handoff', logoHandoff);
    opening.style.setProperty('--logo-handoff', logoHandoff);
    document.body.style.setProperty('--welcome-reveal', reduced ? 1 : smooth(clamp((progress - .45) / .55)));
    document.body.classList.toggle('opening-complete', reduced || progress === 1);
    header.inert = !reduced && progress < .9;
    opening.inert = !reduced && progress === 1;
    main.inert = !reduced && progress < .9;
    footer.inert = !reduced && progress < .9;
    if (focusWelcome && (reduced || progress >= .9)) {
      main.focus({preventScroll:true});
      focusWelcome = false;
    }
    if (displayedProgress !== destination) frame = requestAnimationFrame(renderOpening);
  };
  const scheduleOpening = () => { if (!frame) frame = requestAnimationFrame(renderOpening); };
  window.addEventListener('scroll', scheduleOpening, {passive:true});
  window.addEventListener('resize', scheduleOpening);
  window.visualViewport?.addEventListener('resize', scheduleOpening);
  window.addEventListener('pageshow', scheduleOpening);
  motionPreference.addEventListener('change', scheduleOpening);
  const enterSite = event => {
    event.preventDefault();
    focusWelcome = true;
    const welcome = document.querySelector('#welcome');
    const openingHeight = document.querySelector('.opening-space').offsetHeight;
    const top = Math.max(openingHeight * .84, welcome.getBoundingClientRect().top + window.scrollY - header.offsetHeight);
    window.scrollTo({top, behavior:motionPreference.matches ? 'instant' : 'smooth'});
    scheduleOpening();
  };
  document.querySelector('.skip')?.addEventListener('click', enterSite);
  document.querySelector('.opening-enter')?.addEventListener('click', enterSite);
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
    // GitHub Pages has no server; a normal POST avoids cross-origin fetch restrictions.
    if (location.hostname.endsWith('.github.io')) {
      form.action = 'https://logos-international-academy.netlify.app/request-info/?sent=1';
      return;
    }
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

// Preserve native details semantics while animating each row in both directions.
document.querySelectorAll('.program-choice').forEach(details => {
  const summary = details.querySelector('summary');
  let animation;
  let expanded = details.open;
  summary.addEventListener('click', event => {
    if (motionPreference.matches || !details.animate) return;
    event.preventDefault();
    const start = details.getBoundingClientRect().height;
    animation?.cancel();
    expanded = !expanded;
    details.dataset.expanded = String(expanded);
    details.style.height = '';
    details.open = true;
    const style = getComputedStyle(details);
    const collapsed = summary.getBoundingClientRect().height +
      parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    const end = expanded ? details.getBoundingClientRect().height : collapsed;
    details.classList.add('is-expanding');
    animation = details.animate([{height: `${start}px`}, {height: `${end}px`}], {
      duration: 520, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both'
    });
    animation.onfinish = () => {
      details.open = expanded;
      animation.cancel();
      animation = null;
      details.classList.remove('is-expanding');
      delete details.dataset.expanded;
    };
  });
  details.addEventListener('toggle', () => { if (!animation) expanded = details.open; });
});
