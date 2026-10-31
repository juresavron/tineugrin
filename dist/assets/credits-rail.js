(() => {
  'use strict';
  const section = document.querySelector('.cr-credits');
  if (!section) return;
  const track = section.querySelector('#cr-track');
  const cards = [...track.querySelectorAll('.cr-card')];
  const previous = section.querySelector('[data-cr-previous]');
  const next = section.querySelector('[data-cr-next]');
  const counter = section.querySelector('#cr-counter');
  const status = section.querySelector('#cr-status');
  const complete = section.querySelector('#cr-complete');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const language = document.documentElement.lang === 'sl' ? 'sl' : 'en';
  const dictionary = window.TINE_COPY?.[language] || {};
  const fallback = {
    en: {
      crBrowse: 'Browse credits', crPrevious: 'Previous credits', crNext: 'Next credits',
      crListLabel: 'Selected screen credits', crProjectCount: 'Project {index} of {total}',
      crFilmDetailsFor: 'View film details for {title}',
      crProjectDetailsFor: 'View {title} in the Slovenian Film Database',
      crAltGepack: 'Tine Ugrin and the cast of Gepack in a car',
      crAltBreathe: 'Tine Ugrin and Klara Kuk in Don’t Forget to Breathe',
      crAltLegend: 'Tine Ugrin in Legenda o bejbi'
    },
    sl: {
      crBrowse: 'Brskanje po vlogah', crPrevious: 'Prejšnje vloge', crNext: 'Naslednje vloge',
      crListLabel: 'Izbrane filmske in televizijske vloge', crProjectCount: 'Projekt {index} od {total}',
      crFilmDetailsFor: 'Več o filmu {title}',
      crProjectDetailsFor: 'Več o projektu {title} v Bazi slovenskih filmov',
      crAltGepack: 'Tine Ugrin in igralska zasedba filma Gepack v avtomobilu',
      crAltBreathe: 'Tine Ugrin in Klara Kuk v filmu Ne pozabi dihati',
      crAltLegend: 'Tine Ugrin v filmu Legenda o bejbi'
    }
  };
  function text(key, values = {}) {
    let value = dictionary[key] || fallback[language][key] || key;
    for (const [name, replacement] of Object.entries(values)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
    return value;
  }
  const pad = value => String(value).padStart(2, '0');
  let renderFrame = 0;
  let currentIndex = -1;
  let detailsBeforePrint = null;

  section.querySelectorAll('[data-cr-label]').forEach(element => {
    element.setAttribute('aria-label', text(element.dataset.crLabel));
  });
  section.querySelectorAll('[data-i18n-alt]').forEach(image => {
    image.alt = text(image.dataset.i18nAlt);
  });
  previous.setAttribute('aria-label', text('crPrevious'));
  next.setAttribute('aria-label', text('crNext'));

  function cardPosition(card) {
    return card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
  }
  function visibleIndex() {
    const viewport = track.getBoundingClientRect();
    let bestIndex = 0;
    let bestVisible = -1;
    cards.forEach((card, index) => {
      const bounds = card.getBoundingClientRect();
      const visible = Math.max(0, Math.min(bounds.right, viewport.right) - Math.max(bounds.left, viewport.left));
      const fraction = visible / Math.max(1, bounds.width);
      // Prefer the first fully visible card when several cards share the rail.
      if (fraction > bestVisible + 0.01) {
        bestVisible = fraction;
        bestIndex = index;
      }
    });
    return bestIndex;
  }
  function updateControls() {
    renderFrame = 0;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll - 2;
    const index = visibleIndex();
    if (index !== currentIndex) {
      currentIndex = index;
      counter.textContent = `${pad(index + 1)} / ${pad(cards.length)}`;
      counter.setAttribute('aria-label', text('crProjectCount', { index: index + 1, total: cards.length }));
    }
  }
  function queueControls() {
    if (renderFrame) return;
    renderFrame = requestAnimationFrame(updateControls);
  }
  function scrollToCard(index, { animate = true, announce = false } = {}) {
    const target = cards[Math.max(0, Math.min(cards.length - 1, index))];
    if (!target) return;
    track.scrollTo({ left: cardPosition(target), behavior: animate && !reducedMotion.matches ? 'smooth' : 'instant' });
    if (announce) status.textContent = text('crProjectCount', { index: cards.indexOf(target) + 1, total: cards.length });
    queueControls();
  }
  function move(direction) {
    const position = track.scrollLeft;
    const candidates = cards.map((card, index) => ({ index, position: cardPosition(card) }));
    const candidate = direction > 0
      ? candidates.find(item => item.position > position + 3)
      : candidates.reverse().find(item => item.position < position - 3);
    if (candidate) scrollToCard(candidate.index, { announce: true });
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', queueControls, { passive: true });
  window.addEventListener('resize', queueControls);
  if ('ResizeObserver' in window) new ResizeObserver(queueControls).observe(track);

  // Leave wheel and touch gestures to the native scrolling surface.
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      scrollToCard(event.key === 'Home' ? 0 : cards.length - 1, { announce: true });
    }
  });
  track.addEventListener('focusin', event => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest('.cr-card');
    if (!card) return;
    const viewport = track.getBoundingClientRect();
    const bounds = card.getBoundingClientRect();
    if (bounds.left < viewport.left + 1 || bounds.right > viewport.right - 1) {
      // Adjust only the horizontal rail, preserving the reader’s vertical position.
      const left = bounds.left < viewport.left
        ? cardPosition(card)
        : track.scrollLeft + bounds.right - viewport.right;
      track.scrollTo({ left, behavior: 'instant' });
    }
    queueControls();
  });

  function selectRole(id) {
    cards.forEach(card => {
      const selected = card.dataset.crId === id;
      card.classList.toggle('cr-is-selected', selected);
      const badge = card.querySelector('.cr-selected');
      if (badge) badge.hidden = !selected;
      const button = card.querySelector('[data-cr-film]');
      if (button) {
        if (selected) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      }
    });
  }
  function writeRole(id) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('role', id);
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    } catch (_) { /* The selected credit remains available without History API access. */ }
    document.dispatchEvent(new CustomEvent('portfolio:role-change', { detail: { id } }));
  }
  section.querySelectorAll('[data-cr-film]').forEach(button => {
    const card = button.closest('.cr-card');
    const title = card.querySelector('h3').textContent.trim();
    button.disabled = false;
    button.setAttribute('aria-label', text('crFilmDetailsFor', { title }));
    button.addEventListener('click', () => {
      const id = button.dataset.crFilm;
      selectRole(id);
      writeRole(id);
      document.dispatchEvent(new CustomEvent('portfolio:open-film', { detail: { id, play: false, opener: button } }));
    });
  });
  section.querySelectorAll('[data-cr-source]').forEach(link => {
    const title = link.closest('.cr-card').querySelector('h3').textContent.trim();
    link.setAttribute('aria-label', text('crProjectDetailsFor', { title }));
  });

  function readLocation() {
    let requested = null;
    try { requested = new URL(window.location.href).searchParams.get('role'); } catch (_) { /* Use the static rail. */ }
    const index = cards.findIndex(card => card.dataset.crId === requested && card.querySelector('[data-cr-film]'));
    selectRole(index >= 0 ? requested : null);
    if (index >= 0) scrollToCard(index, { animate: false });
    else queueControls();
  }
  window.addEventListener('popstate', readLocation);
  document.addEventListener('portfolio:role-change', event => {
    if (typeof event.detail?.id === 'string') selectRole(event.detail.id);
  });

  // Closed native details are opened for printing and restored afterwards.
  window.addEventListener('beforeprint', () => {
    if (detailsBeforePrint !== null) return;
    detailsBeforePrint = complete.open;
    complete.open = true;
  });
  window.addEventListener('afterprint', () => {
    if (detailsBeforePrint === null) return;
    complete.open = detailsBeforePrint;
    detailsBeforePrint = null;
  });
  readLocation();
  updateControls();
})();
