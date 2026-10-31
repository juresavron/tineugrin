(() => {
  'use strict';
  const lang = document.documentElement.lang === 'sl' ? 'sl' : 'en';
  const copy = window.TINE_COPY[lang];
  const t = key => copy[key] || window.TINE_COPY.en[key] || key;
  const page = document.body.dataset.page || 'home';
  const prefix = lang === 'sl' ? '/sl/' : '/';
  const routes = { home: '', about: 'about/', credits: 'credits/', screen: 'video/', portraits: 'gallery/', contact: 'contact/' };
  const legacy = { about: 'about', credits: 'credits', work: 'credits', screen: 'screen', portraits: 'portraits', instagram: 'portraits', contact: 'contact' };
  const oldDestination = legacy[location.hash.slice(1)] || (new URLSearchParams(location.search).has('role') ? 'credits' : null);
  if (page === 'home' && oldDestination) {
    location.replace(prefix + routes[oldDestination] + location.search);
    return;
  }
  document.querySelectorAll('.lang-en').forEach(link => { link.href = '/' + routes[page] + location.search; });
  document.querySelectorAll('.lang-sl').forEach(link => { link.href = '/sl/' + routes[page] + location.search; });
  document.querySelectorAll('[data-language-pdf]').forEach(link => {
    link.href = lang === 'sl' ? '/assets/tine-ugrin-credits-sl.pdf' : '/assets/tine-ugrin-credits-en.pdf';
    link.download = 'Tine-Ugrin-' + (lang === 'sl' ? 'Izbrane-vloge' : 'Screen-Credits') + '.pdf';
  });
  document.getElementById('year').textContent = new Date().getFullYear();

  const header = document.getElementById('site-header');
  const menuButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  const filmDialog = document.getElementById('film-dialog');
  const portraitDialog = document.getElementById('portrait-dialog');
  const imageCredits = document.getElementById('image-credits-dialog');
  const announcer = document.getElementById('announcer');
  const frame = document.getElementById('video-frame');
  const openers = new WeakMap();

  function syncBodyLock() {
    document.body.classList.toggle('modal-open', !menu.hidden || Boolean(document.querySelector('dialog[open]')));
  }
  function updateHeader() { header.classList.toggle('is-scrolled', window.scrollY > 30 || !menu.hidden); }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  function closeMenu(restore = false) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', t('openMenu'));
    menuButton.textContent = t('menuLabel');
    main.inert = false;
    footer.inert = false;
    syncBodyLock();
    updateHeader();
    if (restore) menuButton.focus();
  }
  menuButton.setAttribute('aria-label', t('openMenu'));
  menuButton.addEventListener('click', () => {
    if (!menu.hidden) { closeMenu(true); return; }
    menu.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', t('closeMenu'));
    menuButton.textContent = t('menuCloseLabel');
    main.inert = true;
    footer.inert = true;
    syncBodyLock();
    updateHeader();
    menu.querySelector('a').focus();
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  window.addEventListener('resize', () => { if (innerWidth > 980 && !menu.hidden) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
    if (event.key === 'Tab') {
      const focusable = [...document.querySelectorAll('header a, header button, #mobile-menu a')].filter(element => element.getClientRects().length);
      const index = focusable.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); focusable.at(-1).focus(); }
      else if (!event.shiftKey && index === focusable.length - 1) { event.preventDefault(); focusable[0].focus(); }
    }
  });
  function openDialog(dialog, opener) {
    openers.set(dialog, opener || document.activeElement);
    closeMenu();
    dialog.showModal();
    syncBodyLock();
    dialog.querySelector('[data-close]').focus();
  }
  [filmDialog, portraitDialog, imageCredits].forEach(dialog => {
    const close = dialog.querySelector('[data-close]');
    close.setAttribute('aria-label', t('closeViewer'));
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (dialog === filmDialog) frame.replaceChildren();
      syncBodyLock();
      const opener = openers.get(dialog);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
  });

  const films = {
    gepack: { title: 'Gepack', year: '2024', video: 'https://www.youtube-nocookie.com/embed/iqsXFf8O_rw?rel=0&autoplay=1', watch: 'https://www.youtube.com/watch?v=iqsXFf8O_rw', provider: 'YouTube' },
    breathe: { title: t('breatheTitlePlain'), year: '2019', video: 'https://player.vimeo.com/video/336166678?dnt=1&autoplay=1', watch: 'https://vimeo.com/336166678', provider: 'Vimeo' }
  };
  document.querySelectorAll('[data-film]').forEach(link => {
    const film = films[link.dataset.film];
    link.setAttribute('aria-label', t('ssWatchTrailerFor').replace('{title}', film.title));
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.getElementById('film-title').textContent = film.title + ' / ' + film.year;
      const external = document.getElementById('video-external');
      external.href = film.watch;
      external.textContent = t('openOn') + ' ' + film.provider + ' ↗';
      const iframe = document.createElement('iframe');
      iframe.title = film.title + ' — ' + t('officialTrailer');
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      iframe.src = film.video;
      frame.replaceChildren(iframe);
      openDialog(filmDialog, link);
    });
  });

  const portraits = [
    { id: 'warm', image: '/assets/portrait-warm.webp', download: '/assets/portrait-warm-download.jpg', credit: '© Arin Rapuš Jerman' },
    { id: 'dark', image: '/assets/hero.webp', download: '/assets/hero-download.jpg', credit: '© Jakob Kastelec' },
    { id: 'black', image: '/assets/portrait-black.webp', download: '/assets/portrait-black-download.jpg', credit: '© Arin Rapuš Jerman' },
    { id: 'smile', image: '/assets/about.webp', download: '/assets/about-download.jpg', credit: '© Jakob Kastelec' }
  ];
  let portraitIndex = 0;
  function showPortrait(index, opener) {
    portraitIndex = (index + portraits.length) % portraits.length;
    const portrait = portraits[portraitIndex];
    const image = document.getElementById('portrait-full');
    image.src = portrait.image;
    image.alt = 'Tine Ugrin / ' + portrait.credit;
    document.getElementById('portrait-credit').textContent = String(portraitIndex + 1).padStart(2, '0') + ' / 04 — ' + portrait.credit;
    const download = document.getElementById('portrait-download');
    download.href = portrait.download;
    download.download = 'Tine-Ugrin-Portrait-' + String(portraitIndex + 1).padStart(2, '0') + '.jpg';
    announcer.textContent = t('portraitViewer') + ' ' + (portraitIndex + 1) + ' / 4';
    if (!portraitDialog.open) openDialog(portraitDialog, opener);
  }
  document.querySelectorAll('[data-portrait]').forEach(button => button.addEventListener('click', () => showPortrait(portraits.findIndex(portrait => portrait.id === button.dataset.portrait), button)));
  const previous = document.getElementById('portrait-prev');
  const next = document.getElementById('portrait-next');
  previous.setAttribute('aria-label', lang === 'sl' ? 'Prejšnji portret' : 'Previous portrait');
  next.setAttribute('aria-label', lang === 'sl' ? 'Naslednji portret' : 'Next portrait');
  previous.addEventListener('click', () => showPortrait(portraitIndex - 1));
  next.addEventListener('click', () => showPortrait(portraitIndex + 1));
  portraitDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPortrait(portraitIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPortrait(portraitIndex + 1); }
  });
  document.getElementById('credits-open').addEventListener('click', () => openDialog(imageCredits));
  document.getElementById('print-credits')?.addEventListener('click', () => window.print());
  if (page === 'credits' && new URLSearchParams(location.search).get('print') === '1') {
    window.addEventListener('load', () => {
      const url = new URL(location.href);
      url.searchParams.delete('print');
      history.replaceState(history.state, '', url.pathname + url.search);
      requestAnimationFrame(() => window.print());
    }, { once: true });
  }
})();
