(() => {
  'use strict';
  const root = document.querySelector('#portraits.pcs-section');
  if (!root) return;
  const lang = document.documentElement.lang === 'sl' ? 'sl' : 'en';
  const t = key => window.TINE_COPY?.[lang]?.[key] || window.TINE_COPY?.en?.[key] || key;
  const image = root.querySelector('[data-pcs-image]');
  const dissolve = root.querySelector('[data-pcs-dissolve]');
  const buttons = [...root.querySelectorAll('[data-pcs-thumb]')];
  const download = root.querySelector('[data-pcs-download]');
  const view = root.querySelector('[data-pcs-view]');
  const count = root.querySelector('[data-pcs-count]');
  const credit = root.querySelector('[data-pcs-credit]');
  const name = root.querySelector('[data-pcs-name]');
  const announcer = root.querySelector('[data-pcs-announcer]');
  const portraits = [
    {id:'warm',src:'/assets/portrait-warm.webp',original:'/assets/portrait-warm-download.jpg',credit:'Arin Rapuš Jerman',alt:'pcsAltWarm',description:'pcsGreenSweater'},
    {id:'dark',src:'/assets/hero.webp',original:'/assets/hero-download.jpg',credit:'Jakob Kastelec',alt:'pcsAltDark',description:'pcsDarkSuit'},
    {id:'black',src:'/assets/portrait-black.webp',original:'/assets/portrait-black-download.jpg',credit:'Arin Rapuš Jerman',alt:'pcsAltBlack',description:'pcsBlackTurtleneck'},
    {id:'smile',src:'/assets/about.webp',original:'/assets/about-download.jpg',credit:'Jakob Kastelec',alt:'pcsAltSmile',description:'pcsSmiling'}
  ];
  let currentId = 'warm';
  let requestedId = 'warm';
  let requestCounter = 0;
  let settleTimer = null;

  function recordFor(id) { return portraits.find(portrait => portrait.id === id); }
  function ordinal(portrait) { return String(portraits.indexOf(portrait) + 1).padStart(2,'0'); }
  function updateButtons(id, busy = false) {
    buttons.forEach(button => {
      button.setAttribute('aria-pressed',String(button.dataset.pcsThumb === id));
      if (busy && button.dataset.pcsThumb === id) button.setAttribute('aria-busy','true');
      else button.removeAttribute('aria-busy');
    });
  }
  function updateMetadata(portrait) {
    const number = ordinal(portrait);
    root.dataset.pcsSelection = portrait.id;
    count.textContent = `${number} / 04`;
    credit.textContent = `© ${portrait.credit}`;
    name.textContent = `Tine Ugrin / ${number}`;
    download.href = portrait.original;
    download.download = `Tine-Ugrin-Portrait-${number}.jpg`;
    view.href = portrait.original;
  }
  function finishDissolve() {
    if (settleTimer !== null) { window.clearTimeout(settleTimer); settleTimer = null; }
    if (!dissolve.hidden) {
      image.src = dissolve.getAttribute('src');
      image.alt = t(recordFor(currentId).alt);
      dissolve.hidden = true;
      dissolve.classList.remove('pcs-is-visible');
    }
  }
  function clearBusy() {
    root.removeAttribute('aria-busy');
    buttons.forEach(button => button.removeAttribute('aria-busy'));
  }
  async function decodedImage(src) {
    const next = new Image();
    next.decoding = 'async';
    next.src = src;
    if (typeof next.decode === 'function') await next.decode();
    else if (!next.complete) await new Promise((resolve,reject) => { next.onload = resolve; next.onerror = reject; });
    if (!next.naturalWidth) throw new Error('Portrait image unavailable');
    return next;
  }
  async function selectPortrait(id) {
    const portrait = recordFor(id);
    if (!portrait || id === requestedId) return;
    requestedId = id;
    const request = ++requestCounter;
    root.setAttribute('aria-busy','true');
    updateButtons(id,true);
    try {
      await decodedImage(portrait.src);
      if (request !== requestCounter) return;
      finishDissolve();
      currentId = id;
      updateMetadata(portrait);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        image.src = portrait.src;
        image.alt = t(portrait.alt);
        clearBusy();
        announcer.textContent = `${t('pcsPortrait')} ${ordinal(portrait)} / 04. © ${portrait.credit}`;
        return;
      }
      dissolve.src = portrait.src;
      dissolve.hidden = false;
      dissolve.classList.remove('pcs-is-visible');
      void dissolve.offsetWidth;
      window.requestAnimationFrame(() => {
        if (request === requestCounter) dissolve.classList.add('pcs-is-visible');
      });
      settleTimer = window.setTimeout(() => {
        if (request !== requestCounter) return;
        image.src = portrait.src;
        image.alt = t(portrait.alt);
        dissolve.hidden = true;
        dissolve.classList.remove('pcs-is-visible');
        settleTimer = null;
        clearBusy();
        announcer.textContent = `${t('pcsPortrait')} ${ordinal(portrait)} / 04. © ${portrait.credit}`;
      },220);
    } catch {
      if (request !== requestCounter) return;
      finishDissolve();
      requestedId = currentId;
      updateButtons(currentId);
      clearBusy();
      announcer.textContent = t('pcsLoadError');
    }
  }
  root.querySelector('[data-pcs-group]').setAttribute('aria-label',t('pcsChoosePortrait'));
  buttons.forEach(button => {
    const portrait = recordFor(button.dataset.pcsThumb);
    button.setAttribute('aria-label',`${t('pcsSelectPortrait')} ${ordinal(portrait)}: ${t(portrait.description)}`);
    button.addEventListener('click',() => selectPortrait(portrait.id));
  });
  image.alt = t(portraits[0].alt);
  view.addEventListener('click',event => {
    const open = new CustomEvent('portfolio:open-portrait',{detail:{id:currentId},cancelable:true});
    if (!document.dispatchEvent(open)) event.preventDefault();
  });
})();
