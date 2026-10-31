(() => {
  'use strict';
  const dialog = document.getElementById('casting-file-dialog');
  if (!dialog) return;
  const lang = document.documentElement.lang === 'sl' ? 'sl' : 'en';
  const copy = window.TINE_COPY && window.TINE_COPY[lang] || {};
  const english = window.TINE_COPY && window.TINE_COPY.en || {};
  const t = (key, fallback) => copy[key] || english[key] || fallback;
  const closeButton = dialog.querySelector('[data-cf-close]');
  const chooser = dialog.querySelector('.cf-portrait-options');
  const portraitImage = document.getElementById('cf-portrait');
  const portraitCredit = document.getElementById('cf-photo-credit');
  const download = document.getElementById('cf-download');
  const selectionStatus = document.getElementById('cf-selection-status');
  const buttons = Array.from(dialog.querySelectorAll('[data-cf-portrait]'));
  const portraits = [
    { id:'formal', image:'/assets/hero.webp', original:'/assets/hero-download.jpg', photographer:'Jakob Kastelec', label:'cfPortraitFormal', fallback:'Portrait in a dark suit', filename:'Formal' },
    { id:'warm', image:'/assets/portrait-warm.webp', original:'/assets/portrait-warm-download.jpg', photographer:'Arin Rapuš Jerman', label:'cfPortraitWarm', fallback:'Portrait in a green sweater', filename:'Warm' },
    { id:'smile', image:'/assets/about.webp', original:'/assets/about-download.jpg', photographer:'Jakob Kastelec', label:'cfPortraitSmile', fallback:'Smiling portrait', filename:'Smile' },
    { id:'black', image:'/assets/portrait-black.webp', original:'/assets/portrait-black-download.jpg', photographer:'Arin Rapuš Jerman', label:'cfPortraitBlack', fallback:'Portrait in a black turtleneck', filename:'Black' }
  ];
  let invoker = null;
  let pendingAction = null;

  closeButton.setAttribute('aria-label', t('cfClose', 'Close casting file'));
  chooser.setAttribute('aria-label', t('cfChoosePortrait', 'Choose a portrait'));
  buttons.forEach(button => {
    const portrait = portraits.find(item => item.id === button.dataset.cfPortrait);
    if (!portrait) return;
    button.setAttribute('aria-label', `${t('cfSelectPortrait', 'Select')} ${t(portrait.label, portrait.fallback)}`);
  });
  portraitImage.alt = `${t('cfPortraitAlt', 'Tine Ugrin, photographed by')} Jakob Kastelec`;

  function selectPortrait(id, announce = true) {
    const portrait = portraits.find(item => item.id === id);
    if (!portrait) return;
    portraitImage.src = portrait.image;
    portraitImage.alt = `${t('cfPortraitAlt', 'Tine Ugrin, photographed by')} ${portrait.photographer}`;
    portraitCredit.textContent = `© ${portrait.photographer}`;
    download.href = portrait.original;
    download.download = `Tine-Ugrin-Portrait-${portrait.filename}.jpg`;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cfPortrait === id)));
    if (announce) selectionStatus.textContent = `${t('cfSelectedPortrait', 'Selected portrait:')} ${t(portrait.label, portrait.fallback)}. © ${portrait.photographer}.`;
  }

  buttons.forEach(button => button.addEventListener('click', () => selectPortrait(button.dataset.cfPortrait)));
  chooser.addEventListener('keydown', event => {
    const focusedButton = event.target.closest('[data-cf-portrait]');
    if (!focusedButton) return;
    const current = buttons.indexOf(focusedButton);
    let next = current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % buttons.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + buttons.length) % buttons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else return;
    event.preventDefault();
    selectPortrait(buttons[next].dataset.cfPortrait);
    buttons[next].focus({ preventScroll: true });
  });

  function openCastingFile(event) {
    if (dialog.open) return;
    invoker = event.currentTarget instanceof HTMLElement ? event.currentTarget : document.activeElement;
    pendingAction = null;
    document.dispatchEvent(new CustomEvent('portfolio:before-overlay'));
    dialog.showModal();
    document.body.classList.add('modal-open');
    closeButton.focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-open-casting]').forEach(button => button.addEventListener('click', openCastingFile));
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.querySelector('[data-cf-view-credits]').addEventListener('click', () => {
    dialog.close();
  });
  dialog.querySelector('[data-cf-print]').addEventListener('click', () => {
    pendingAction = 'print';
    dialog.close();
  });

  function focusCredits() {
    const heading = document.getElementById('credits-heading');
    if (!heading) return;
    if (!heading.hasAttribute('tabindex')) {
      heading.setAttribute('tabindex', '-1');
      heading.addEventListener('blur', () => heading.removeAttribute('tabindex'), { once: true });
    }
    document.getElementById('credits')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    heading.focus({ preventScroll: true });
  }

  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
    const action = pendingAction;
    pendingAction = null;
    if (action === 'print') {
      if (document.getElementById('credits')) {
        focusCredits();
        requestAnimationFrame(() => window.print());
      } else {
        window.location.assign((lang === 'sl' ? '/sl/' : '/') + 'credits/?print=1');
      }
      return;
    }
    if (invoker instanceof HTMLElement && invoker.isConnected && !invoker.closest('[inert]')) invoker.focus({ preventScroll: true });
  });
})();
