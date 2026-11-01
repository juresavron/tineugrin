(() => {
  'use strict';
  document.documentElement.classList.add('has-js');
  const lang = document.documentElement.lang === 'sl' ? 'sl' : 'en';
  const copy = window.TINE_COPY?.[lang] || {};
  const t = key => copy[key] || window.TINE_COPY?.en?.[key] || key;
  const page = document.body.dataset.page || 'home';
  const routes = {home:'',about:'about/',credits:'credits/',screen:'video/',portraits:'gallery/',contact:'contact/',thanks:'thank-you/'};
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  function updateLanguageLinks() {
    const suffix = routes[page] + location.search + (page === 'home' ? location.hash : '');
    document.querySelectorAll('.lang-en').forEach(a => { a.href = '/' + suffix; });
    document.querySelectorAll('.lang-sl').forEach(a => { a.href = '/sl/' + suffix; });
  }
  updateLanguageLinks();
  window.addEventListener('hashchange', updateLanguageLinks);
  if (page === 'home') {
    const legacy = {work:'credits',instagram:'portraits'};
    const destination = legacy[location.hash.slice(1)] || (new URLSearchParams(location.search).has('role') ? 'credits' : null);
    if (destination) {
      history.replaceState(history.state, '', location.pathname + location.search + '#' + destination);
      requestAnimationFrame(() => document.getElementById(destination)?.scrollIntoView());
      updateLanguageLinks();
    }
  }

  const header = document.getElementById('site-header');
  const menuButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  const hero = document.getElementById('home');
  function syncBodyLock() {
    document.body.classList.toggle('modal-open', !menu.hidden || Boolean(document.querySelector('dialog[open]')));
  }
  function updateHeader() {
    const threshold = hero ? Math.max(100, hero.clientHeight - 110) : 24;
    header.classList.toggle('is-scrolled', page !== 'home' || window.scrollY > threshold || !menu.hidden);
  }
  window.addEventListener('scroll', updateHeader, {passive:true});
  updateHeader();
  function closeMenu(restore = false) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', t('openMenu'));
    menuButton.textContent = t('menuLabel');
    main.inert = false;
    if (footer) footer.inert = false;
    syncBodyLock();
    updateHeader();
    if (restore) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    if (!menu.hidden) { closeMenu(true); return; }
    menu.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', t('closeMenu'));
    menuButton.textContent = t('menuCloseLabel');
    main.inert = true;
    if (footer) footer.inert = true;
    syncBodyLock();
    updateHeader();
    menu.querySelector('a').focus();
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
  window.addEventListener('resize', () => { if (innerWidth > 900 && !menu.hidden) closeMenu(); updateHeader(); });
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
    if (event.key === 'Tab') {
      const focusable = [...document.querySelectorAll('header a,header button,#mobile-menu a')].filter(e => e.getClientRects().length);
      const index = focusable.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); focusable.at(-1).focus(); }
      else if (!event.shiftKey && index === focusable.length - 1) { event.preventDefault(); focusable[0].focus(); }
    }
  });
  if (page === 'home' && 'IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('nav a[href^="#"]')];
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.isIntersecting);
      if (!entry) return;
      links.forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin:'-20% 0px -55% 0px',threshold:0});
    document.querySelectorAll('main>section[id]').forEach(section => observer.observe(section));
  }

  const filmDialog = document.getElementById('film-dialog');
  const portraitDialog = document.getElementById('portrait-dialog');
  const imageCredits = document.getElementById('image-credits-dialog');
  const frame = document.getElementById('video-frame');
  const openers = new WeakMap();
  function openDialog(dialog, opener) {
    openers.set(dialog, opener || document.activeElement);
    closeMenu();
    dialog.showModal();
    syncBodyLock();
    dialog.querySelector('[data-close]').focus();
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (dialog === filmDialog) frame.replaceChildren();
      syncBodyLock();
      const opener = openers.get(dialog);
      if (opener?.isConnected) opener.focus({preventScroll:true});
    });
  });
  const films = {
    gepack:{title:'Gepack',year:'2024',video:'https://www.youtube-nocookie.com/embed/iqsXFf8O_rw?rel=0&autoplay=1',watch:'https://www.youtube.com/watch?v=iqsXFf8O_rw',provider:'YouTube'},
    breathe:{title:t('breatheTitlePlain'),year:'2019',video:'https://player.vimeo.com/video/336166678?dnt=1&autoplay=1',watch:'https://vimeo.com/336166678',provider:'Vimeo'},
    nika:{title:'Nika',year:'2016',video:'https://www.youtube-nocookie.com/embed/aW7g_AE0U24?rel=0&autoplay=1',watch:'https://www.youtube.com/watch?v=aW7g_AE0U24',provider:'YouTube'}
  };
  document.querySelectorAll('[data-film]').forEach(link => {
    const film = films[link.dataset.film];
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
    {id:'warm',image:'/assets/portrait-warm.webp',download:'/assets/portrait-warm-download.jpg',credit:'© Arin Rapuš Jerman',alt:t('portraitWarmAlt')},
    {id:'dark',image:'/assets/hero.webp',download:'/assets/hero-download.jpg',credit:'© Jakob Kastelec',alt:t('portraitDarkAlt')},
    {id:'black',image:'/assets/portrait-black.webp',download:'/assets/portrait-black-download.jpg',credit:'© Arin Rapuš Jerman',alt:t('portraitBlackAlt')}
  ];
  let portraitIndex = 0;
  function showPortrait(index, opener) {
    portraitIndex = (index + portraits.length) % portraits.length;
    const portrait = portraits[portraitIndex];
    const image = document.getElementById('portrait-full');
    image.src = portrait.image;
    image.alt = portrait.alt;
    document.getElementById('portrait-credit').textContent = String(portraitIndex + 1).padStart(2,'0') + ' / 03 — ' + portrait.credit;
    const download = document.getElementById('portrait-download');
    download.href = portrait.download;
    download.download = 'Tine-Ugrin-Portrait-' + (portraitIndex + 1) + '.jpg';
    document.getElementById('announcer').textContent = t('portraitViewer') + ' ' + (portraitIndex + 1) + ' / ' + portraits.length;
    if (!portraitDialog.open) openDialog(portraitDialog, opener);
  }
  document.querySelectorAll('[data-portrait]').forEach(button => button.addEventListener('click', () => showPortrait(portraits.findIndex(p => p.id === button.dataset.portrait), button)));
  document.getElementById('portrait-prev')?.addEventListener('click', () => showPortrait(portraitIndex - 1));
  document.getElementById('portrait-next')?.addEventListener('click', () => showPortrait(portraitIndex + 1));
  portraitDialog?.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPortrait(portraitIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPortrait(portraitIndex + 1); }
  });
  document.getElementById('credits-open')?.addEventListener('click', () => openDialog(imageCredits));

  function printCredits() { document.body.classList.add('printing-credits'); window.print(); }
  document.getElementById('print-credits')?.addEventListener('click', printCredits);
  window.addEventListener('afterprint', () => document.body.classList.remove('printing-credits'));
  if (page === 'credits' && new URLSearchParams(location.search).get('print') === '1') {
    window.addEventListener('load', () => {
      const url = new URL(location.href); url.searchParams.delete('print');
      history.replaceState(history.state, '', url.pathname + url.search);
      requestAnimationFrame(printCredits);
    }, {once:true});
  }
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const button = form.querySelector('[type="submit"]');
    if (button.disabled) return;
    const status = document.getElementById('form-status');
    const data = new URLSearchParams(new FormData(form));
    button.disabled = true;
    button.textContent = t('formSending');
    status.textContent = '';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/', {method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data.toString(),signal:controller.signal});
      if (!response.ok) throw new Error('Contact form response: ' + response.status);
      window.location.assign(form.action);
    } catch {
      status.textContent = t('formError');
      button.disabled = false;
      button.textContent = t('formSend');
    } finally { clearTimeout(timeout); }
  });
})();
