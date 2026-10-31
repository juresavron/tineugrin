(() => {
  'use strict';
  const lang=document.documentElement.lang==='sl'?'sl':'en';
  const copy=window.TINE_COPY[lang];
  const t=key=>copy[key]||window.TINE_COPY.en[key]||key;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const header=document.getElementById('site-header');
  const menuButton=document.getElementById('menu-toggle');
  const menu=document.getElementById('mobile-menu');
  const filmDialog=document.getElementById('film-dialog');
  const portraitDialog=document.getElementById('portrait-dialog');
  const creditsDialog=document.getElementById('image-credits-dialog');
  const frame=document.getElementById('video-frame');
  const announcer=document.getElementById('announcer');
  const openers=new WeakMap();
  const sections=[...document.querySelectorAll('main > section[id],footer#contact')];
  const navLinks=[...document.querySelectorAll('.desktop-nav a[href^="#"],#mobile-menu a[href^="#"]')];
  let scrollFrame=0,activeSection='';
  function syncBodyLock(){document.body.classList.toggle('modal-open',!menu.hidden||Boolean(document.querySelector('dialog[open]')));}
  function updateHeader(){
    header.classList.toggle('is-scrolled',window.scrollY>50||!menu.hidden);
    const max=document.documentElement.scrollHeight-window.innerHeight;
    header.style.setProperty('--reading-progress',String(max>0?Math.min(1,Math.max(0,window.scrollY/max)):0));
    const atEnd=window.scrollY>100&&window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-8;
    const current=atEnd?document.getElementById('contact'):[...sections].reverse().find(section=>section.getBoundingClientRect().top<window.innerHeight*.38);
    if(current&&current.id!==activeSection){
      activeSection=current.id;
      navLinks.forEach(link=>{if(link.hash==='#'+activeSection)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    }
  }
  function queueHeader(){if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;updateHeader();});}
  window.addEventListener('scroll',queueHeader,{passive:true});
  window.addEventListener('resize',queueHeader);
  updateHeader();
  function closeMenu(restore=false){
    menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label',t('openMenu'));
    document.querySelector('main').inert=false;document.querySelector('footer').inert=false;
    syncBodyLock();updateHeader();if(restore)menuButton.focus();
  }
  menuButton.setAttribute('aria-label',t('openMenu'));
  menuButton.addEventListener('click',()=>{
    if(!menu.hidden){closeMenu();return;}
    menu.hidden=false;menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label',t('closeMenu'));
    document.querySelector('main').inert=true;document.querySelector('footer').inert=true;syncBodyLock();updateHeader();
  });
  function focusSection(section){
    const target=section.querySelector('h1,h2')||section;
    target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
    target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});
  }
  menu.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
    const target=document.getElementById(link.hash.slice(1));closeMenu();
    if(!target)return;event.preventDefault();history.pushState(null,'',link.hash);
    target.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});focusSection(target);languageLinks();
  }));
  window.addEventListener('resize',()=>{if(window.innerWidth>980&&!menu.hidden)closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden)closeMenu(true);});
  document.addEventListener('portfolio:before-overlay',()=>closeMenu());
  function languageLinks(){
    document.querySelectorAll('.lang-en').forEach(link=>{link.href='/'+location.search+location.hash;});
    document.querySelectorAll('.lang-sl').forEach(link=>{link.href='/sl/'+location.search+location.hash;});
  }
  window.addEventListener('hashchange',languageLinks);document.addEventListener('portfolio:role-change',languageLinks);languageLinks();
  document.querySelectorAll('[data-language-pdf]').forEach(link=>{link.href=lang==='sl'?'/assets/tine-ugrin-credits-sl.pdf':'/assets/tine-ugrin-credits-en.pdf';link.download='Tine-Ugrin-'+(lang==='sl'?'Izbrane-vloge':'Screen-Credits')+'.pdf';});
  document.getElementById('year').textContent=new Date().getFullYear();
  const films={
    gepack:{title:'Gepack',year:'2024',image:'/assets/gepack.webp',role:'Jon',director:'Žiga Kukovič',format:'featureFilm',description:'gepackDescription',video:'https://www.youtube-nocookie.com/embed/iqsXFf8O_rw?rel=0',watch:'https://www.youtube.com/watch?v=iqsXFf8O_rw',source:'https://www.gepack.si.inicial.si/',credit:'Film still © Matic Gabriel / Trailer: Produkcija 3230',media:'officialTrailer',duration:'1:30',provider:'YouTube'},
    breathe:{title:t('breatheTitlePlain'),year:'2019',image:'/assets/breathe.webp',role:'Peter',director:'Martin Turk',format:'featureFilm',description:'breatheDescription',video:'https://player.vimeo.com/video/336166678?dnt=1',watch:'https://vimeo.com/336166678',source:'https://belafilm.si/seznam-filmi/ne-pozabi-dihati/',credit:'Film still © Željko Stevanić / Bela Film',media:'trailerEnglish',duration:'1:30',provider:'Vimeo'},
    legend:{title:'Legenda o bejbi',year:'2024',image:'/assets/legend.webp',role:t('tvActor'),director:'Leon Pučnik',format:'shortFilm',description:'legendDescription',source:'https://bsf.si/sl/film/legenda-o-bejbi/',credit:'Film still © Teo Toth',media:'filmDetails'}
  };
  let currentFilm='gepack',filmRender=0;
  const filmSelectors=[];
  function openDialog(dialog,opener){openers.set(dialog,opener instanceof HTMLElement?opener:document.activeElement);closeMenu();dialog.showModal();syncBodyLock();}
  function externalLink(href,label){const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label+' ↗';return a;}
  function playFilm(){
    const film=films[currentFilm];if(!film.video||frame.querySelector('iframe'))return;
    const version=filmRender;frame.replaceChildren();frame.setAttribute('aria-busy','true');
    const iframe=document.createElement('iframe');iframe.title=film.title+' — '+t(film.media)+' — '+film.duration;
    iframe.allow='autoplay; fullscreen; picture-in-picture; encrypted-media';iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allowFullscreen=true;iframe.src=film.video+'&autoplay=1';
    iframe.addEventListener('load',()=>{if(version===filmRender)frame.removeAttribute('aria-busy');},{once:true});frame.append(iframe);
  }
  function showFilm(id,options={}){
    const film=films[id];if(!film)return;currentFilm=id;filmRender++;frame.replaceChildren();frame.removeAttribute('aria-busy');
    document.getElementById('film-format').textContent=t(film.media)+(film.duration?' / '+film.duration:'');
    document.getElementById('film-year').textContent=t(film.format)+' / '+film.year;
    document.getElementById('film-title').textContent=film.title;document.getElementById('film-character').textContent=film.role;
    document.getElementById('film-description').textContent=t(film.description);document.getElementById('film-caption').textContent=film.credit;
    const facts=document.getElementById('film-facts');facts.replaceChildren();
    [[t('director'),film.director],[t('creditYear'),film.year]].forEach(([label,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);facts.append(row);});
    const poster=document.createElement('img');poster.src=film.image;poster.alt=film.title+' / Tine Ugrin';poster.width=1920;poster.height=1080;frame.append(poster);
    if(film.video){
      const play=document.createElement('button');play.type='button';play.className='cinema-play';play.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>';
      const label=document.createElement('span');label.textContent=t('playTrailer')+' / '+film.duration;play.append(label);play.addEventListener('click',playFilm);frame.append(play);
    }else{const link=externalLink(film.source,t('readFilm'));link.className='video-fallback';frame.append(link);}
    const links=document.getElementById('film-links');links.replaceChildren();if(film.watch)links.append(externalLink(film.watch,t('openOn')+' '+film.provider));links.append(externalLink(film.source,t('readFilm')));
    filmSelectors.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filmSelector===id)));
    announcer.textContent=t('tineAs')+' '+film.role+' / '+film.title;
    if(!filmDialog.open)openDialog(filmDialog,options.opener);if(options.play&&film.video)playFilm();
  }
  const filmTabs=document.getElementById('video-tabs');
  Object.keys(films).forEach(id=>{
    const button=document.createElement('button');button.type='button';button.className='video-tab';button.dataset.filmSelector=id;button.setAttribute('aria-pressed','false');
    const role=document.createElement('span'),title=document.createElement('span');role.textContent=films[id].role;title.textContent=films[id].title;button.append(role,title);
    button.addEventListener('click',()=>showFilm(id));filmTabs.append(button);filmSelectors.push(button);
  });
  document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',()=>showFilm(button.dataset.film,{play:button.dataset.filmPlay==='true'})));
  document.addEventListener('portfolio:open-film',event=>showFilm(event.detail?.id,{play:event.detail?.play===true,opener:event.detail?.opener}));
  const portraits=[
    {id:'warm',image:'/assets/portrait-warm.webp',download:'/assets/portrait-warm-download.jpg',credit:'© Arin Rapuš Jerman',alt:'Tine Ugrin / Arin Rapuš Jerman'},
    {id:'dark',image:'/assets/hero.webp',download:'/assets/hero-download.jpg',credit:'© Jakob Kastelec',alt:'Tine Ugrin / Jakob Kastelec'},
    {id:'black',image:'/assets/portrait-black.webp',download:'/assets/portrait-black-download.jpg',credit:'© Arin Rapuš Jerman',alt:'Tine Ugrin / Arin Rapuš Jerman'},
    {id:'smile',image:'/assets/about.webp',download:'/assets/about-download.jpg',credit:'© Jakob Kastelec',alt:'Tine Ugrin / Jakob Kastelec'}
  ];
  let portraitIndex=0;
  function showPortrait(index){
    portraitIndex=(index+portraits.length)%portraits.length;const p=portraits[portraitIndex];const img=document.getElementById('portrait-full');img.src=p.image;img.alt=p.alt;
    document.getElementById('portrait-credit').textContent=String(portraitIndex+1).padStart(2,'0')+' / 04 — '+p.credit;
    const a=document.getElementById('portrait-download');a.href=p.download;a.download='Tine-Ugrin-Portrait-'+String(portraitIndex+1).padStart(2,'0')+'.jpg';
    announcer.textContent=t('portraitViewer')+' '+(portraitIndex+1)+' / 4';if(!portraitDialog.open)openDialog(portraitDialog);
  }
  document.querySelectorAll('[data-portrait]').forEach(button=>button.addEventListener('click',()=>showPortrait(portraits.findIndex(p=>p.id===button.dataset.portrait))));
  document.addEventListener('portfolio:open-portrait',event=>{const index=portraits.findIndex(p=>p.id===event.detail?.id);if(index<0)return;event.preventDefault();showPortrait(index);});
  document.getElementById('portrait-prev').setAttribute('aria-label',lang==='sl'?'Prejšnji portret':'Previous portrait');
  document.getElementById('portrait-next').setAttribute('aria-label',lang==='sl'?'Naslednji portret':'Next portrait');
  document.getElementById('portrait-prev').addEventListener('click',()=>showPortrait(portraitIndex-1));
  document.getElementById('portrait-next').addEventListener('click',()=>showPortrait(portraitIndex+1));
  portraitDialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showPortrait(portraitIndex-1);}if(event.key==='ArrowRight'){event.preventDefault();showPortrait(portraitIndex+1);}});
  document.querySelectorAll('[data-close]').forEach(button=>{button.setAttribute('aria-label',t('closeViewer'));button.addEventListener('click',()=>document.getElementById(button.dataset.close).close());});
  [filmDialog,portraitDialog,creditsDialog].forEach(dialog=>{
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
    dialog.addEventListener('close',()=>{if(dialog===filmDialog){filmRender++;frame.replaceChildren();frame.removeAttribute('aria-busy');}syncBodyLock();const opener=openers.get(dialog);if(opener instanceof HTMLElement&&opener.isConnected)opener.focus({preventScroll:true});});
  });
  document.getElementById('credits-open').addEventListener('click',()=>openDialog(creditsDialog));
  document.getElementById('print-credits')?.addEventListener('click',()=>window.print());
})();
