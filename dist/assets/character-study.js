(() => {
  'use strict';
  const study = document.querySelector('.cs-study');
  if (!study) return;
  const lang = document.documentElement.lang === 'sl' ? 'sl' : 'en';
  const fallback = {
    csFeatureFilm: 'Feature film', csShortFilm: 'Short film', csJon: 'Jon', csPeter: 'Peter', csTvActor: 'TV actor',
    csGepackTitle: 'Gepack', csBreatheTitle: 'Don’t Forget to Breathe', csLegendTitle: 'Legenda o bejbi',
    csDirectedBy: 'Directed by', csWatchTrailer: 'Watch trailer', csAboutFilm: 'About the film',
    csLoading: 'Loading frame…', csLoadFailed: 'This frame could not load. Select the character again to retry.',
    csSelected: 'Selected: {character} — {title}.', csProjectCount: 'Project {index} of {total}',
    csWatchTrailerFor: 'Watch the trailer for {title}', csAboutFilmFor: 'Read about {title}',
    csStillCredit: 'Film still © {photographer}', csSelectRole: 'Select a character',
    csAltGepack: 'Tine Ugrin and the cast of Gepack in a car',
    csAltBreathe: 'Tine Ugrin and Klara Kuk in Don’t Forget to Breathe',
    csAltLegend: 'Tine Ugrin in Legenda o bejbi',
    csGepackStory: 'Jon, one of four friends on a road trip to the Croatian coast.',
    csBreatheStory: 'Peter, in Martin Turk’s coming-of-age film about two brothers and one summer.',
    csLegendStory: 'A television actor in Leon Pučnik’s short film Legenda o bejbi.'
  };
  const dictionary = (window.TINE_COPY && window.TINE_COPY[lang]) || {};
  const text = (key, values = {}) => {
    let value = dictionary[key] || fallback[key] || key;
    Object.entries(values).forEach(([name,replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const roles = {
    gepack: { index: 1, image: '/assets/gepack.webp', width: 1920, height: 797, titleKey: 'csGepackTitle', characterKey: 'csJon', formatKey: 'csFeatureFilm', storyKey: 'csGepackStory', altKey: 'csAltGepack', director: 'Žiga Kukovič', year: '2024', photographer: 'Matic Gabriel', trailer: true },
    breathe: { index: 2, image: '/assets/breathe.webp', width: 1620, height: 1080, titleKey: 'csBreatheTitle', characterKey: 'csPeter', formatKey: 'csFeatureFilm', storyKey: 'csBreatheStory', altKey: 'csAltBreathe', director: 'Martin Turk', year: '2019', photographer: 'Željko Stevanić', trailer: true },
    legend: { index: 3, image: '/assets/legend.webp', width: 1920, height: 1080, titleKey: 'csLegendTitle', characterKey: 'csTvActor', formatKey: 'csShortFilm', storyKey: 'csLegendStory', altKey: 'csAltLegend', director: 'Leon Pučnik', year: '2024', photographer: 'Teo Toth', trailer: false }
  };
  const picture = study.querySelector('#cs-picture');
  const stage = study.querySelector('#cs-stage');
  const controls = [...study.querySelectorAll('.cs-role-button')];
  const action = study.querySelector('#cs-open-film');
  const loading = study.querySelector('#cs-loading');
  const status = study.querySelector('#cs-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentId = 'gepack';
  let currentImage = study.querySelector('#cs-stage-image');
  let requestCounter = 0;
  let cleanupTimer = 0;

  function setCopy(selector, key) {
    const element = study.querySelector(selector);
    element.dataset.i18n = key;
    element.textContent = text(key);
  }
  function setBusy(id) {
    stage.setAttribute('aria-busy', String(Boolean(id)));
    loading.hidden = !id;
    controls.forEach(button => button.classList.toggle('cs-is-pending', button.dataset.selectRole === id));
  }
  function writeLocation(id) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('role', id);
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    } catch (_) {
      // Selection remains usable when a host restricts History API writes.
    }
    document.dispatchEvent(new CustomEvent('portfolio:role-change', { detail: { id } }));
  }
  function renderContext(id) {
    const role = roles[id];
    const title = text(role.titleKey);
    setCopy('#cs-character', role.characterKey);
    setCopy('#cs-project-title', role.titleKey);
    setCopy('#cs-format', role.formatKey);
    setCopy('#cs-story', role.storyKey);
    setCopy('#cs-action-label', role.trailer ? 'csWatchTrailer' : 'csAboutFilm');
    study.querySelector('#cs-project-detail').textContent = `${text('csDirectedBy')} ${role.director} / ${role.year}`;
    study.querySelector('#cs-photo-credit').textContent = text('csStillCredit', { photographer: role.photographer });
    const count = study.querySelector('#cs-frame-count');
    count.textContent = `${String(role.index).padStart(2, '0')} / 03`;
    count.setAttribute('aria-label', text('csProjectCount', { index: role.index, total: 3 }));
    action.setAttribute('aria-label', text(role.trailer ? 'csWatchTrailerFor' : 'csAboutFilmFor', { title }));
    controls.forEach(button => {
      const selected = button.dataset.selectRole === id;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('cs-is-selected', selected);
    });
    study.dataset.currentRole = id;
  }
  function prepareImage(role) {
    const image = new Image();
    image.decoding = 'async';
    image.width = role.width;
    image.height = role.height;
    image.alt = text(role.altKey);
    image.className = 'cs-image';
    return new Promise((resolve, reject) => {
      const loaded = () => {
        if (!image.naturalWidth) { reject(new Error('Image unavailable')); return; }
        if (typeof image.decode === 'function') {
          image.decode().then(() => resolve(image)).catch(() => {
            if (image.complete && image.naturalWidth) resolve(image);
            else reject(new Error('Image unavailable'));
          });
        } else resolve(image);
      };
      image.onload = loaded;
      image.onerror = () => reject(new Error('Image unavailable'));
      image.src = role.image;
    });
  }
  function swapImage(image) {
    const previous = currentImage;
    previous.classList.add('cs-image-visible');
    clearTimeout(cleanupTimer);
    picture.querySelectorAll('.cs-image').forEach(node => { if (node !== previous) node.remove(); });
    previous.removeAttribute('id');
    previous.setAttribute('aria-hidden', 'true');
    image.id = 'cs-stage-image';
    picture.insertBefore(image, picture.firstChild);
    currentImage = image;
    if (reducedMotion.matches) {
      image.classList.add('cs-image-visible');
      previous.remove();
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (image !== currentImage) return;
      image.classList.add('cs-image-visible');
      previous.classList.remove('cs-image-visible');
      cleanupTimer = window.setTimeout(() => { if (previous !== currentImage) previous.remove(); }, 270);
    }));
  }
  async function selectRole(id, { updateURL = true, announce = true } = {}) {
    if (!Object.prototype.hasOwnProperty.call(roles, id)) return;
    const request = ++requestCounter;
    status.classList.remove('cs-error');
    status.textContent = '';
    if (id === currentId) {
      setBusy(null);
      if (updateURL) writeLocation(id);
      return;
    }
    setBusy(id);
    try {
      const image = await prepareImage(roles[id]);
      if (request !== requestCounter) return;
      currentId = id;
      swapImage(image);
      renderContext(id);
      setBusy(null);
      if (updateURL) writeLocation(id);
      if (announce) status.textContent = text('csSelected', { character: text(roles[id].characterKey), title: text(roles[id].titleKey) });
    } catch (_) {
      if (request !== requestCounter) return;
      setBusy(null);
      status.classList.add('cs-error');
      status.textContent = text('csLoadFailed');
    }
  }

  study.classList.add('cs-enhanced');
  controls.forEach(button => { button.disabled = false; });
  action.disabled = false;
  study.querySelector('.cs-role-list').setAttribute('aria-label', text('csSelectRole'));
  loading.textContent = text('csLoading');
  currentImage.alt = text(roles.gepack.altKey);
  renderContext(currentId);
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest('[data-select-role]');
    if (!trigger) return;
    const id = trigger.dataset.selectRole;
    if (Object.prototype.hasOwnProperty.call(roles, id)) selectRole(id);
  });
  action.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('portfolio:open-film', { detail: { id: currentId } }));
  });
  function readLocation() {
    try {
      const requested = new URL(window.location.href).searchParams.get('role');
      const id = requested && Object.prototype.hasOwnProperty.call(roles, requested) ? requested : 'gepack';
      selectRole(id, { updateURL: false, announce: false });
    } catch (_) { /* The useful default selection stays in place. */ }
  }
  readLocation();
  window.addEventListener('popstate', readLocation);

  if ('IntersectionObserver' in window) {
    const preload = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      Object.values(roles).forEach(role => {
        if (role.image === currentImage.getAttribute('src')) return;
        const image = new Image(); image.decoding = 'async'; image.src = role.image;
      });
      preload.disconnect();
    }, { rootMargin: '400px 0px' });
    preload.observe(study);
  }
})();
