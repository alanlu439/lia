// Match the tab icon to the visitor's color scheme.
const favicon = document.querySelector('link[rel="icon"]');
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
const updateFavicon = () => {
  if (favicon) favicon.href = favicon.href.replace(/lia-logo(?:-white)?\.png/, colorScheme.matches ? 'lia-logo-white.png' : 'lia-logo.png');
};
updateFavicon();
colorScheme.addEventListener('change', updateFavicon);

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const header = document.querySelector('.header');
const mobile = window.matchMedia('(max-width: 960px)');
let menuSettleTimer;
function setMenu(open, restoreFocus = false) {
  clearTimeout(menuSettleTimer);
  if (open && !header.classList.contains('menu-active')) {
    header.style.setProperty('--menu-header-height', `${header.getBoundingClientRect().height}px`);
    header.style.setProperty('--menu-header-margin', getComputedStyle(header).marginBottom);
    header.classList.add('menu-active');
  } else if (!open && header.classList.contains('menu-active')) {
    menuSettleTimer = setTimeout(() => {
      header.classList.remove('menu-active');
      header.style.removeProperty('--menu-header-height');
      header.style.removeProperty('--menu-header-margin');
      updateHeader();
    }, 360);
  }
  toggle.setAttribute('aria-expanded', String(open));
  toggle.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
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
const updateHeader = () => { if (!header?.classList.contains('menu-active')) header?.classList.toggle('is-scrolled', window.scrollY > 12); };
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
  document.querySelectorAll('.program-heading, .program-choice, .intro > div, .feature-copy, .value, .story-row, .process-head, .steps li, .mission-vision article, .serve-story > div, .cta-line, .photo, .school-photo, .about-panel, .contact-panel, .three-values > article, .admission-fit > div, .about-description, .official-list > div, .mission-banner > .wrap, .service-statement > .wrap, .footer-manifesto').forEach(element => {
    if (element.getBoundingClientRect().top >= window.innerHeight) {
      element.classList.add('reveal-ready');
      const siblings = [...element.parentElement.children].filter(child => child.matches('.program-choice, .value, article, li, .story-row, .official-list > div'));
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
window.addEventListener('pageshow', event => {
  if (event.persisted && toggle && nav) setMenu(false);
  updateHeader();
});
// One white transition covers menu closure, navigation, and destination readiness.
let pageNavigationPending = false;
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin !== location.origin || destination.pathname === location.pathname && destination.search === location.search) return;
  if (motionPreference.matches) return;
  event.preventDefault();
  if (pageNavigationPending) return;
  pageNavigationPending = true;
  if (nav.classList.contains('open')) setMenu(false);
  try { sessionStorage.setItem('lia-page-arriving', '1'); } catch {}
  document.documentElement.classList.add('page-leaving');
  setTimeout(() => location.assign(destination.href), 280);
});
const revealArrivingPage = async () => {
  if (!document.documentElement.classList.contains('page-arriving')) return;
  const ready = [document.fonts.ready];
  if (document.readyState !== 'complete') ready.push(new Promise(resolve => window.addEventListener('load', resolve, {once:true})));
  await Promise.race([Promise.allSettled(ready), new Promise(resolve => setTimeout(resolve, 2500))]);
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove('page-arriving')));
};
revealArrivingPage();
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    pageNavigationPending = false;
    document.documentElement.classList.remove('page-leaving', 'page-arriving');
  }
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
    const gap = Math.min(40, Math.max(16, viewport.height * .04));
    opening.style.setProperty('--landing-gap', `${gap}px`);
    const titleHeight = opening.querySelector('.opening-title').offsetHeight;
    const groupTop = (viewport.height - initialSize - gap - titleHeight) / 2;
    const initialY = groupTop + initialSize / 2;
    opening.style.setProperty('--title-top', `${groupTop + initialSize + gap}px`);
    opening.style.setProperty('--initial-seal-y', `${initialY}px`);
    opening.style.setProperty('--seal-x', `${viewport.width / 2 + (target.left + target.width / 2 - viewport.width / 2) * eased}px`);
    opening.style.setProperty('--seal-y', `${initialY + (target.top + target.height / 2 - initialY) * eased}px`);
    opening.style.setProperty('--seal-size', `${initialSize + (target.width - initialSize) * eased}px`);
    opening.style.setProperty('--seal-dark', smooth(clamp((progress - .48) / .36)));
    opening.style.setProperty('--navy-fade', 1 - smooth(clamp((progress - .08) / .84)));
    const skyBlend = smooth(clamp(progress / .8));
    const skyTone = [5, 44, 96].map((channel, index) => Math.round(channel + ([16, 51, 91][index] - channel) * skyBlend)).join(' ');
    opening.style.setProperty('--opening-sky', skyTone);
    document.querySelector('.opening-space').style.setProperty('--opening-sky', skyTone);
    opening.style.setProperty('--gradient-blend', smooth(clamp(progress / .35)));
    opening.style.setProperty('--slogan-opacity', 1 - smooth(clamp(progress / .68)));
    opening.style.setProperty('--slogan-scale', 1 + smooth(progress) * 1.35);
    opening.style.setProperty('--slogan-y', `${smooth(progress) * 160}px`);
    const headerReveal = reduced ? 1 : smooth(clamp((progress - .52) / .34));
    const logoHandoff = reduced ? 1 : smooth(clamp((progress - .9) / .1));
    header.style.setProperty('--header-reveal', headerReveal);
    header.style.setProperty('--logo-handoff', logoHandoff);
    opening.style.setProperty('--logo-handoff', logoHandoff);
    document.body.style.setProperty('--welcome-reveal', reduced ? 1 : smooth(clamp((progress - .3) / .45)));
    document.body.classList.toggle('hero-visible', reduced || progress >= .58);
    document.body.classList.toggle('opening-complete', reduced || progress === 1);
    header.inert = document.documentElement.classList.contains('site-loading') || (!reduced && progress < .58);
    opening.inert = document.documentElement.classList.contains('site-loading') || (!reduced && progress === 1);
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
    form.querySelector('#phone-required').hidden = !phone.required;
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
      button.innerHTML = 'Inquire <span aria-hidden="true" class="arrow-icon arrow-diagonal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span>';
    }
  });
}

// Preserve native details semantics while animating each row in both directions.
document.querySelectorAll('.program-choice').forEach(details => {
  const summary = details.querySelector('summary');
  let animation;
  let answerAnimation;
  const answer = details.querySelector('p');
  let expanded = details.open;
  summary.addEventListener('click', event => {
    if (motionPreference.matches || !details.animate) return;
    event.preventDefault();
    const start = details.getBoundingClientRect().height;
    animation?.cancel();
    answerAnimation?.cancel();
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
      duration: 650, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both'
    });
    answerAnimation = answer.animate(expanded
      ? [{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}]
      : [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}],
      {duration:expanded ? 480 : 220, delay:expanded ? 90 : 0, easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    animation.onfinish = () => {
      answerAnimation?.cancel();
      details.open = expanded;
      animation.cancel();
      animation = null;
      details.classList.remove('is-expanding');
      delete details.dataset.expanded;
    };
  });
  details.addEventListener('toggle', () => { if (!animation) expanded = details.open; });
});

// Prepare critical first-page assets before revealing any entry page.
const entryLoader = document.querySelector('.site-loader');
const loader = document.documentElement.classList.contains('site-loading') ? entryLoader : null;
if (!loader) entryLoader?.remove();
if (loader) {
  const welcomeMessages = [
    'Preparing your welcome.',
    'A warm welcome awaits.',
    'Discover a place to grow.',
    'A new chapter begins here.',
    'Come grow in faith.',
    'Learning with purpose awaits.',
    'Heart and skill, together.',
    'Explore life at LIA.',
    'A calling to serve begins here.',
    'Welcome to our learning community.'
  ];
  let message;
  try {
    const saved = JSON.parse(sessionStorage.getItem('lia-welcome-shuffle') || 'null');
    let remaining = saved?.remaining;
    if (!Array.isArray(remaining) || !remaining.length || remaining.some(index => !Number.isInteger(index) || index < 0 || index >= welcomeMessages.length)) {
      remaining = welcomeMessages.map((_, index) => index);
      for (let index = remaining.length - 1; index > 0; index--) {
        const random = Math.floor(Math.random() * (index + 1));
        [remaining[index], remaining[random]] = [remaining[random], remaining[index]];
      }
      if (remaining[remaining.length - 1] === saved?.last) {
        [remaining[0], remaining[remaining.length - 1]] = [remaining[remaining.length - 1], remaining[0]];
      }
    }
    const index = remaining.pop();
    message = welcomeMessages[index];
    sessionStorage.setItem('lia-welcome-shuffle', JSON.stringify({remaining, last:index}));
  } catch {
    message = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  }
  loader.querySelector('.loader-content p').textContent = message;
  const roots = [...document.body.children].filter(element => element !== loader && element.tagName !== 'SCRIPT');
  roots.forEach(element => element.inert = true);
  // Decode only the landing identity and first hero; lower sections stay lazy.
  const images = [...document.querySelectorAll('.opening img, .header img, .hero-scene img')];
  const tasks = images.map(image => image.decode().catch(() => {}));
  tasks.push(document.fonts.load('400 16px Montserrat'));
  tasks.push(document.fonts.load('600 16px Montserrat'));
  tasks.push(document.fonts.ready);
  const intro = document.querySelector('.page-intro');
  if (intro) {
    const background = getComputedStyle(intro).backgroundImage;
    for (const match of background.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      const image = new Image();
      image.src = match[1];
      tasks.push(image.decode().catch(() => {}));
    }
  }
  tasks.push(new Promise(resolve => setTimeout(resolve, motionPreference.matches ? 0 : 400)));
  let finished = 0;
  const update = () => {
    const percent = Math.round(finished / tasks.length * 100);
    loader.querySelector('.loader-track span').style.width = `${percent}%`;
    loader.querySelector('.loader-progress').textContent = `${percent}%`;
  };
  const ready = Promise.allSettled(tasks.map(task => task.finally(() => { finished++; update(); })));
  let timer;
  const fallback = new Promise(resolve => { timer = setTimeout(resolve, 12000); });
  Promise.race([ready, fallback]).then(() => {
    clearTimeout(timer);
    finished = tasks.length; update();
    try { sessionStorage.setItem('lia-entry-ready', '1'); } catch {}
    document.documentElement.classList.remove('site-loading');
    loader.classList.add('loader-finished');
    roots.forEach(element => element.inert = false);
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => loader.remove(), motionPreference.matches ? 0 : 650);
  });
}

// Repeat complete phrases continuously, with an extra nudge from scrolling.
const programBanner = document.querySelector('.program-banner');
if (programBanner) {
  const track = programBanner.querySelector('.banner-top');
  const cycle = track.querySelector('.banner-cycle');
  let cycleWidth = 0, phase = 0, lastTime = 0, previousScroll = window.scrollY;
  const measureBanner = () => {
    track.querySelectorAll('[data-banner-copy]').forEach(copy => copy.remove());
    cycleWidth = cycle.getBoundingClientRect().width;
    if (!motionPreference.matches && cycleWidth > 0) {
      const copies = Math.ceil(programBanner.clientWidth / cycleWidth) + 1;
      for (let i = 0; i < copies; i++) {
        const copy = cycle.cloneNode(true);
        copy.dataset.bannerCopy = '';
        copy.setAttribute('aria-hidden', 'true');
        track.append(copy);
      }
    }
    phase = cycleWidth ? phase % cycleWidth : 0;
    if (motionPreference.matches) track.style.removeProperty('transform');
  };
  const animateBanner = time => {
    const rect = programBanner.getBoundingClientRect();
    const scrollDelta = window.scrollY - previousScroll;
    previousScroll = window.scrollY;
    if (!motionPreference.matches && cycleWidth > 0 && rect.bottom > 0 && rect.top < window.innerHeight) {
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 0;
      // Constant readable speed on every screen, regardless of phrase width.
      phase = ((phase + elapsed * .07 + scrollDelta * .7) % cycleWidth + cycleWidth) % cycleWidth;
      track.style.transform = `translateX(${-phase}px)`;
    }
    lastTime = time;
    requestAnimationFrame(animateBanner);
  };
  window.addEventListener('resize', measureBanner, {passive:true});
  motionPreference.addEventListener('change', measureBanner);
  document.fonts.ready.then(measureBanner);
  measureBanner();
  requestAnimationFrame(animateBanner);
}

const breadcrumb = document.querySelector('.breadcrumb');
const breadcrumbSlot = document.querySelector('.breadcrumb-slot');
if (breadcrumb && breadcrumbSlot) {
  let breadcrumbFrame = 0;
  const renderBreadcrumb = () => {
    breadcrumbFrame = 0;
    const slotTop = breadcrumbSlot.getBoundingClientRect().top;
    const restingTop = header.getBoundingClientRect().bottom + 12;
    breadcrumb.style.setProperty('--breadcrumb-top', `${Math.max(slotTop, restingTop)}px`);
    breadcrumb.classList.add('breadcrumb-positioned');
    breadcrumb.classList.toggle('is-floating', slotTop < restingTop);
  };
  const scheduleBreadcrumb = () => { if (!breadcrumbFrame) breadcrumbFrame = requestAnimationFrame(renderBreadcrumb); };
  window.addEventListener('scroll', scheduleBreadcrumb, {passive:true});
  window.addEventListener('resize', scheduleBreadcrumb, {passive:true});
  window.addEventListener('pageshow', scheduleBreadcrumb);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleBreadcrumb).observe(header);
  scheduleBreadcrumb();
}
