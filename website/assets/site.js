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
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.08});
  document.querySelectorAll('.intro > div, .feature-copy, .value, .story-row, .process-head, .steps li, .mission-vision article, .serve-story > div, .cta-line, .photo, .about-panel, .contact-panel').forEach(element => {
    if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element);
  });
  motionPreference.addEventListener('change', event => {
    if (event.matches) observer.disconnect();
  });
}
const form=document.querySelector('#inquiry-form');if(form){const phone=form.querySelector('#phone');const method=form.querySelector('#contact-method');const syncPhone=()=>{phone.required=method.value==='phone';phone.setAttribute('aria-required',String(phone.required))};method.addEventListener('change',syncPhone);syncPhone();form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const status=document.querySelector('#form-status');status.textContent='Preview complete. Your inquiry has not been sent or saved. School to provide the official admissions delivery details before this form can accept inquiries.';status.hidden=false;status.focus()})}
