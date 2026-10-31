(() => {
  'use strict';
  const section = document.getElementById('screen');
  if (!section) return;
  const language = document.documentElement.lang === 'sl' ? 'sl' : 'en';
  const copy = (window.TINE_COPY && window.TINE_COPY[language]) || {};
  const fallback = {
    en: {
      ssBreatheTitle: 'Don’t Forget to Breathe', ssGepackTitle: 'Gepack', ssAs: 'As',
      ssStill: 'Film still', ssEnglishSubtitles: 'English subtitles', ssChooseTrailer: 'Choose a trailer',
      ssSelectTrailerFor: 'Select the official trailer for {title}', ssWatchTrailerFor: 'Watch the official trailer for {title}',
      ssSelected: 'Selected: {title}.', ssAltBreathe: 'Tine Ugrin and Klara Kuk in Don’t Forget to Breathe',
      ssAltGepack: 'Tine Ugrin and the cast of Gepack in a car'
    },
    sl: {
      ssBreatheTitle: 'Ne pozabi dihati', ssGepackTitle: 'Gepack', ssAs: 'V vlogi',
      ssStill: 'Filmska fotografija', ssEnglishSubtitles: 'Angleški podnapisi', ssChooseTrailer: 'Izberite napovednik',
      ssSelectTrailerFor: 'Izberite uradni napovednik filma {title}', ssWatchTrailerFor: 'Oglej si uradni napovednik filma {title}',
      ssSelected: 'Izbrano: {title}.', ssAltBreathe: 'Tine Ugrin in Klara Kuk v filmu Ne pozabi dihati',
      ssAltGepack: 'Tine Ugrin in igralska zasedba filma Gepack v avtomobilu'
    }
  };
  function text(key, values = {}) {
    let value = copy[key] || fallback[language][key] || key;
    Object.entries(values).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, String(replacement));
    });
    return value;
  }
  const films = {
    breathe: { index: 1, title: 'ssBreatheTitle', image: '/assets/breathe.webp', width: 1620, height: 1080, alt: 'ssAltBreathe', role: 'Peter', director: 'Martin Turk', year: '2019', photographer: 'Željko Stevanić', subtitles: true },
    gepack: { index: 2, title: 'ssGepackTitle', image: '/assets/gepack.webp', width: 1920, height: 797, alt: 'ssAltGepack', role: 'Jon', director: 'Žiga Kukovič', year: '2024', photographer: 'Matic Gabriel', subtitles: false }
  };
  const controls = [...section.querySelectorAll('[data-ss-select]')];
  const watch = section.querySelector('[data-ss-watch]');
  const poster = section.querySelector('[data-ss-poster]');
  const title = section.querySelector('[data-ss-title]');
  const facts = section.querySelector('[data-ss-facts]');
  const subtitles = section.querySelector('[data-ss-subtitles]');
  const credit = section.querySelector('[data-ss-credit]');
  const announcer = section.querySelector('[data-ss-announcer]');
  let selected = 'breathe';

  function selectFilm(id, announce = true) {
    const film = films[id];
    if (!film) return;
    const filmTitle = text(film.title);
    const changed = id !== selected;
    selected = id;
    section.dataset.ssSelected = id;
    if (poster.getAttribute('src') !== film.image) poster.src = film.image;
    poster.width = film.width;
    poster.height = film.height;
    poster.alt = text(film.alt);
    title.dataset.i18n = film.title;
    title.textContent = filmTitle;
    facts.textContent = `${text('ssAs')} ${film.role} / ${film.director} / ${film.year}`;
    subtitles.hidden = !film.subtitles;
    subtitles.textContent = text('ssEnglishSubtitles');
    credit.textContent = `${text('ssStill')} © ${film.photographer} / SFC`;
    section.querySelector('[data-ss-index]').textContent = `${String(film.index).padStart(2, '0')} / 02`;
    watch.setAttribute('aria-label', text('ssWatchTrailerFor', { title: filmTitle }));
    controls.forEach(button => {
      const current = button.dataset.ssSelect === id;
      button.setAttribute('aria-pressed', String(current));
      button.setAttribute('aria-label', text('ssSelectTrailerFor', { title: text(films[button.dataset.ssSelect].title) }));
    });
    if (announce && changed) announcer.textContent = text('ssSelected', { title: filmTitle });
  }

  section.querySelector('[data-ss-selectors]').setAttribute('aria-label', text('ssChooseTrailer'));
  controls.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => selectFilm(button.dataset.ssSelect));
  });
  watch.disabled = false;
  watch.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('portfolio:open-film', { detail: { id: selected, play: true } }));
  });
  selectFilm(selected, false);
})();
