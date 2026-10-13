// FUEL v4 "NIGHT LAP": everything that moves. Words, prices and hours live in content.js.
// Rules: animate transform, opacity and clip-path only; prices and hours never count; every
// callback on a scrubbed timeline only fires on the way down; loops pause off-screen.
(() => {
  const html = document.documentElement;
  const lang = html.lang === 'ar' ? 'ar' : 'en';
  const rtl = html.dir === 'rtl';
  const dir = rtl ? -1 : 1;                 // multiplies every sideways value
  const T = TEXT[lang];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const isPhone = () => !window.matchMedia('(min-width: 768px)').matches;   // complements the CSS 767px block at every width
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const wideExists = false;                 // set to true once assets/video/hero-wide.mp4 is in the repo
  let seen = false; try { seen = sessionStorage.getItem('fuel-seen') === '1'; } catch (e) {}
  let lenis = null;

  // ---------- Words ----------
  const esc = (v) => v.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  $$('[data-t]').forEach((el) => {
    const v = T[el.dataset.t]; if (typeof v !== 'string') return;
    if (v.includes('\n')) el.innerHTML = v.split('\n').map(esc).join('<br>'); else el.textContent = v;
  });
  // "EAT. DRIVE. REPEAT!" is three stamps, one span per word
  $$('[data-words]').forEach((el) => {
    const v = T[el.dataset.words] || ''; el.innerHTML = v.replace(/\n/g, ' ').split(/\s+/).map((w) => `<span class="w">${esc(w)}</span>`).join('');
  });
  $('#year').textContent = new Date().getFullYear();
  const langBtn = $('#lang');
  langBtn.lang = lang === 'ar' ? 'en' : 'ar';
  langBtn.setAttribute('aria-label', T.lang_switch_label);
  $('#overlay').setAttribute('aria-label', T.menu_btn);
  langBtn.addEventListener('click', () => {
    try { localStorage.setItem('fuel-lang', lang === 'ar' ? 'en' : 'ar'); sessionStorage.setItem('fuel-seen', '1'); } catch (e) {}
    location.reload();
  });

  // ---------- The four top sellers (facts from content.js; images are FUEL's own, cut out) ----------
  const ITEMS = [ // visuals here; names and prices come from TOP in content.js
    { src: 'assets/img/cut/double-classic.webp', w: 827, h: 761, name: ['DOUBLE', 'CLASSIC'], s: 1 },
    { src: 'assets/img/cut/animal-fries.webp', w: 646, h: 723, name: ['ANIMAL', 'FRIES'], s: -1 },
    { src: 'assets/img/cut/mango-coco.webp', w: 568, h: 900, name: ['MANGO', 'COCO'], s: 0 },
    { src: 'assets/img/cut/double-truffle.webp', w: 586, h: 422, name: ['DOUBLE', 'TRUFFLE'], s: 1 },
  ].map((it, k) => ({ ...it, key: TOP[k].key, price: TOP[k].price }));
  $$('.fly-list em').forEach((em, k) => { em.firstChild.nodeValue = TOP[k].price + ' '; });

  // ---------- Menu: built from MENU in content.js ----------
  if (lang !== 'en' || !$('#menu-grid').children.length) $('#menu-grid').innerHTML = MENU.map((cat) => {
    const combo = cat.rows[0].length === 3;
    const head = combo ? `<div class="mrow mhead"><span></span><i style="border:0"></i><b>${esc(T.combo_soft)}</b><b>${esc(T.combo_shake)}</b></div>` : '';
    const rows = cat.rows.map((r) => `<div class="mrow"><span dir="ltr">${esc(r[0])}</span><i></i><b>${r[1]}</b>${combo ? `<b>${r[2]}</b>` : ''}</div>`).join('');
    const note = cat.note && T[cat.note] ? `<p class="mnote">${esc(T[cat.note])}</p>` : '';
    return `<article class="mcat"><h3>${esc(T[cat.key])}<span>${esc(T.jd)}</span></h3>${head}${rows}${note}</article>`;
  }).join('');

  // ---------- Open now (Amman time; late-night hours spill past midnight) ----------
  (function openBadge() {
    const el = $('#open');
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: BUSINESS.timezone }));
    const m = now.getHours() * 60 + now.getMinutes(), d = now.getDay(), y = (d + 6) % 7;
    const toMin = (s) => { const [h, mm] = s.split(':').map(Number); return h * 60 + mm; };
    const [o, c] = BUSINESS.hours[d].map(toMin), yc = toMin(BUSINESS.hours[y][1]);
    let close = null;
    if (m < yc - 1440) close = yc; else if (m >= o && m < c) close = c;
    el.classList.toggle('is-open', close !== null);
    const h = Math.floor(close / 60) % 24 || 12;
    $('span', el).textContent = close !== null ? `${T.open_now} · ${T.closes} ${h}${lang === 'en' ? ' AM' : ''}` : `${T.closed_now} · ${T.opens}`;
  })();

  // ---------- Menu overlay ----------
  const overlay = $('#overlay'), openBtn = $('#menu-open');
  const circleAt = rtl ? '60px 34px' : 'calc(100% - 60px) 34px';
  const behind = () => $$('#main, #header, #footer, #mbar');
  function setMenu(show, refocus = true) {
    openBtn.setAttribute('aria-expanded', String(show));
    behind().forEach((el) => { el.inert = show; });
    if (show) setTimeout(() => $('#menu-close').focus(), 50); else if (refocus) openBtn.focus();
    if (calm || !window.gsap) { overlay.hidden = !show; if (lenis) (show ? lenis.stop() : lenis.start()); return; }
    if (show) {
      overlay.hidden = false;
      gsap.fromTo(overlay, { clipPath: `circle(0% at ${circleAt})` }, { clipPath: `circle(150% at ${circleAt})`, duration: .8, ease: 'power3.inOut' });
      gsap.fromTo($$('.overlay-nav a'), { xPercent: -40 * dir, opacity: 0, skewX: lang === 'ar' ? 0 : -12 }, { xPercent: 0, opacity: 1, skewX: 0, duration: .7, stagger: .05, ease: 'power4.out', delay: .25 });
      if (lenis) lenis.stop();
    } else {
      gsap.to(overlay, { clipPath: `circle(0% at ${circleAt})`, duration: .6, ease: 'power3.inOut', onComplete: () => { overlay.hidden = true; } });
      if (lenis) lenis.start();
    }
  }
  openBtn.addEventListener('click', () => setMenu(true));
  $('#menu-close').addEventListener('click', () => setMenu(false));
  $$('.overlay-nav a').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault(); setMenu(false, false); const t = $(a.getAttribute('href'));
    setTimeout(() => { if (lenis) lenis.scrollTo(t, { offset: 0, duration: 1.2, easing: (x) => 1 - Math.pow(2, -10 * x) }); else t.scrollIntoView(); t.focus({ preventScroll: true }); }, 350);
  }));
  document.addEventListener('keydown', (e) => {
    if (overlay.hidden) return;
    if (e.key === 'Escape') setMenu(false);
    else if (['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End', ' '].includes(e.key)) e.preventDefault(); // the page behind stays put
  });

  // ---------- Papel picado flags for Fiesta (drawn here, so they also show without motion) ----------
  const FLAG_COLORS = ['#ff2e88', '#18b04c', '#ff6a1a', '#00b3c7', '#7b3fe4', '#ed1c24'];
  const picado = $('#picado');
  for (let i = 0; i < (picado.children.length > 1 ? 0 : 14); i++) {
    const f = document.createElement('div'); f.className = 'flag';
    f.innerHTML = `<svg viewBox="0 0 100 112"><path fill="${FLAG_COLORS[i % 6]}" d="M0 0H100V100L90 110 80 100 70 110 60 100 50 110 40 100 30 110 20 100 10 110 0 100Z"/>`
      + '<g fill="#ffc21a"><circle cx="50" cy="52" r="13"/><path d="M50 22l7 9-7 9-7-9zM50 64l7 9-7 9-7-9zM20 45l8 7-8 7-8-7zM80 45l8 7-8 7-8-7z"/>'
      + '<path d="M10 8h10l-5 7zM30 8h10l-5 7zM50 8h10l-5 7zM70 8h10l-5 7zM20 86h8l-4 6zM45 90h10l-5 7zM72 86h8l-4 6z"/></g></svg>';
    picado.appendChild(f);
  }

  // ---------- Fuel gauge for the Passion Tank (E on the start side, F on the end side) ----------
  if (rtl || !$('#gauge').children.length) (function gauge() {
    const R = 80, cx = 100, cy = 100, pt = (deg, r) => { const a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    const [ax, ay] = pt(-110, R), [bx, by] = pt(110, R), [fx, fy] = pt(77, R);
    let ticks = '';
    for (let i = 0; i < 24; i++) {
      const deg = -110 + (220 / 23) * i, long = i % 5 === 0 || i === 23;
      const [x1, y1] = pt(deg, R - 8), [x2, y2] = pt(deg, long ? R - 22 : R - 16);
      ticks += `<line class="tick${long ? ' long' : ''}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }
    $('#gauge').innerHTML = `<svg viewBox="0 0 200 140"><g class="mirror">`
      + `<path class="arc" d="M${ax.toFixed(1)} ${ay.toFixed(1)}A${R} ${R} 0 1 1 ${bx.toFixed(1)} ${by.toFixed(1)}"/>`
      + `<path class="arc-f" d="M${fx.toFixed(1)} ${fy.toFixed(1)}A${R} ${R} 0 0 1 ${bx.toFixed(1)} ${by.toFixed(1)}"/>${ticks}`
      + `<line class="needle" id="needle" x1="100" y1="100" x2="100" y2="34"/><circle class="pivot" cx="100" cy="100" r="7"/></g>`
      + `<text x="${rtl ? 170 : 14}" y="134" text-anchor="middle">E</text><text x="${rtl ? 30 : 186}" y="134" text-anchor="middle">F</text></svg>`;
  })();

  // ---------- The flythrough stage: items, giant names, HUD labels, streaks ----------
  const stage = $('#fly-stage');
  ITEMS.forEach((it, k) => {
    const item = document.createElement('div'); item.className = 'fly-item';
    item.innerHTML = `<div class="fly-tilt"><i class="shadow"></i>`
      + `<img class="cut" src="${it.src}" width="${it.w}" height="${it.h}" alt="" decoding="async" fetchpriority="${k ? 'low' : 'high'}">`
      + `<img class="reflect" src="${it.src}" width="${it.w}" height="${it.h}" alt="" decoding="async" loading="lazy"></div>`;
    $('#fly-items').appendChild(item);
    const nm = document.createElement('h3'); nm.className = 'fly-name chrome'; nm.setAttribute('dir', 'ltr');
    nm.innerHTML = it.name.map((l) => `<span class="ln"><span class="in">${l}</span></span>`).join('');
    $('#fly-names').appendChild(nm);
    const lb = document.createElement('div'); lb.className = 'hud-label' + (it.s < 0 ? ' at-end' : '');
    lb.innerHTML = `<i class="rule"></i><span class="hud-num" dir="ltr">0${k + 1} <small>${esc(T.hud_of)}</small></span>`
      + `<span class="hud-nm" dir="ltr">${esc(T[it.key])}</span><span class="hud-pr" dir="ltr">${it.price}<small>${esc(T.jd)}</small></span>`;
    $('#hud-labels').appendChild(lb);
  });
  for (let i = 0; i < (isPhone() ? 2 : 6); i++) $('#streaks').appendChild(document.createElement('i'));
  [38, 64].forEach((top) => { const s = document.createElement('i'); s.className = 'streak sig'; s.style.top = top + 'vh'; s.style.zIndex = 8; stage.appendChild(s); });

  // ---------- Race track geometry: an S-curve through the five checkpoint dots (used live and in static mode) ----------
  function trackGeometry() {
    const track = $('#track'), fillP = $('#track-fill'), box = track.getBoundingClientRect();
    const pts = $$('.check .dot', track).map((d) => { const r = d.getBoundingClientRect(); return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 }; });
    const vertical = Math.abs(pts[4].y - pts[0].y) > Math.abs(pts[4].x - pts[0].x), amp = vertical ? 18 : 22;
    $('#track-svg').setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    let d = `M${pts[0].x} ${pts[0].y}`; const cum = [0];
    for (let i = 1; i < 5; i++) {
      const a = pts[i - 1], b = pts[i], sg = i % 2 ? 1 : -1;
      d += vertical ? ` C${a.x + amp * sg} ${a.y + (b.y - a.y) / 3},${b.x + amp * sg} ${a.y + 2 * (b.y - a.y) / 3},${b.x} ${b.y}`
        : ` C${a.x + (b.x - a.x) / 3} ${a.y + amp * sg},${a.x + 2 * (b.x - a.x) / 3} ${b.y + amp * sg},${b.x} ${b.y}`;
      fillP.setAttribute('d', d); cum.push(fillP.getTotalLength());
    }
    $('#track-base').setAttribute('d', d);
    return { pts, vertical, cum, len: cum[4] };
  }
  // Static mode (reduced motion, or the motion library missing): the track fully drawn, every checkpoint ticked
  function staticTrack() {
    trackGeometry();
    $$('.check').forEach((c) => c.classList.add('is-on'));
  }
  function goStatic() {
    html.classList.remove('fly-live');
    const l = $('#loader'); if (l) l.remove();
    staticTrack();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(staticTrack, 150); });
  }

  // ---------- Hero film: one file, picked here; the still underneath is the permanent backstop ----------
  const video = $('#hero-video');
  let heroVisible = true;
  function setupVideo() {
    if (!video) return;
    if (calm || saveData) { video.remove(); return; }
    const phone = isPhone();
    if (phone) video.preload = 'metadata';
    video.src = phone ? 'assets/video/hero-720.mp4' : (wideExists && innerWidth / innerHeight > 1 ? 'assets/video/hero-wide.mp4' : 'assets/video/hero.mp4');
    let on = false;
    video.addEventListener('playing', () => { if (on) return; on = true; if (window.gsap) gsap.to(video, { opacity: 1, duration: .6, ease: 'power1.out' }); else video.style.opacity = 1; });
    const tryPlay = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    const p = video.play();
    if (p && p.catch) p.catch(() => { window.addEventListener('touchstart', tryPlay, { once: true, passive: true }); window.addEventListener('click', tryPlay, { once: true }); });
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; if (heroVisible && !document.hidden) tryPlay(); else video.pause(); }, { threshold: 0 }).observe($('.hero'));
    document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else if (heroVisible) tryPlay(); });
  }
  setupVideo();

  if (calm || !(window.gsap && window.ScrollTrigger && window.SplitText && window.Lenis)) { goStatic(); return; }

  html.classList.add('fly-live');
  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? gsap.globalTimeline.pause() : gsap.globalTimeline.play()));
  // Wait for the fonts so headlines split on the right line breaks (but never more than 2.5 s).
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]).then(start)
    .catch((err) => { console.error(err); goStatic(); });

  function start() {

  // ---------- Smooth scroll ----------
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const t = a.getAttribute('href'); if (t.length < 2 || a.closest('.overlay-nav') || a.classList.contains('skip')) return;
    e.preventDefault(); lenis.scrollTo(t === '#top' ? 0 : t);
    const el = $(t); if (el) el.focus({ preventScroll: true });
  }));
  const header = $('#header');
  lenis.on('scroll', ({ direction, scroll }) => { if (header.contains(document.activeElement)) return; header.classList.toggle('is-hidden', direction === 1 && scroll > 200); });

  // ---------- Split headlines (chars in English, words in Arabic so letters stay joined) ----------
  const splits = $$('.split').map((el) => SplitText.create(el, { type: lang === 'ar' ? 'lines,words' : 'lines,words,chars', linesClass: 'line', wordsClass: 'word', charsClass: 'char' }));
  const pieces = (s) => (lang === 'ar' ? s.words : s.chars);
  const fiestaSplit = SplitText.create('#fiesta-title', { type: 'chars', charsClass: 'char' });
  const tankWord = $$('.tank-title .word').find((w) => /tank|تانك/i.test(w.textContent));
  if (tankWord) tankWord.classList.add('u');
  const fwdOnly = (st) => st && st.direction === 1;   // guard for callbacks on scrubbed timelines

  // ---------- Loader: five start lights, lights out, go; the film buffers behind the curtains ----------
  function runLoader(done) {
    const loader = $('#loader'), text = $('#loader-text'), bar = $('#loader-bar'), barWrap = $('#loader-bar-wrap');
    const pods = $$('.pod', loader);
    const lines = [T.load_1, T.load_2, T.load_3, T.load_4, T.load_5];
    const ON = { backgroundColor: '#ff1f27', boxShadow: '0 0 28px 4px rgba(255,31,39,.85), inset 0 -4px 8px rgba(0,0,0,.25)' };
    const OFF = { backgroundColor: '#2a0507', boxShadow: '0 0 0 0 rgba(255,31,39,0), inset 0 -4px 8px rgba(0,0,0,.6)' };
    lenis.stop();
    const tl = gsap.timeline();
    let out = 3.0;
    const curtains = (at) => ['.c1', '.c2', '.c3'].forEach((sel, i) => {
      const path = $(sel, loader), e = { l: 101, r: 101, c: 101 };
      const draw = () => path.setAttribute('d', `M -1 -1 L 101 -1 L 101 ${e.r} Q 50 ${e.c} -1 ${e.l} Z`);
      tl.to(e, { l: -1, r: -1, duration: .8, ease: 'power2.inOut', onUpdate: draw }, at + .12 * i);
      tl.to(e, { c: -1, duration: 1.1, ease: 'power4.inOut', onUpdate: draw }, at + .12 * i);
    });
    const finish = (at) => tl.call(() => { loader.remove(); lenis.start(); try { sessionStorage.setItem('fuel-seen', '1'); } catch (e) {} done(); }, null, at);
    if (seen) {
      loader.classList.add('is-short');
      curtains(.10);
      tl.call(() => { heroIn(); $('#mbar').classList.add('is-in'); }, null, .25);
      finish(1.5);
      return tl;
    }
    tl.fromTo('#loader-logo', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, 0);
    tl.from('#lights', { scale: .85, opacity: 0, duration: .5, ease: 'back.out(2)' }, .05);
    const step = .38, first = .35, lightsOut = 2.55;
    const p = { v: 0 };
    tl.to(p, { v: 100, duration: lightsOut, ease: 'power1.inOut', onUpdate: () => { bar.style.width = p.v + '%'; } }, 0);
    pods.forEach((pod, i) => {
      const at = first + step * i;
      tl.call(() => { text.textContent = lines[i]; }, null, at);
      tl.to($$('i', pod), { ...ON, duration: .06 }, at);
      tl.fromTo('#lights', { x: -3 }, { x: 0, duration: .25, ease: 'elastic.out(1, .3)' }, at);
    });
    // Lights out and away we go
    tl.to($$('.pod i', loader), { ...OFF, duration: .05 }, lightsOut);
    tl.call(() => { text.textContent = T.load_done; barWrap.classList.add('is-flash'); $('#loader-logo').classList.add('is-go'); setTimeout(() => barWrap.classList.remove('is-flash'), 120); }, null, lightsOut);
    tl.to('#loader-logo', { scale: 1.12, duration: .12, ease: 'power2.out', yoyo: true, repeat: 1 }, lightsOut);
    tl.to([text, barWrap], { y: 40, opacity: 0, duration: .3, ease: 'power2.in', onComplete: () => lenis.scrollTo(0, { immediate: true, force: true }) }, 2.70);
    // The curtains wait (at most 200 ms) for the film's first frames
    tl.addPause(out, () => {
      let went = false; const go = () => { if (went) return; went = true; gsap.delayedCall(.01, () => tl.play()); };
      if (!video || !video.isConnected || video.readyState >= 3) return go();
      video.addEventListener('canplay', go, { once: true }); video.addEventListener('playing', go, { once: true }); setTimeout(go, 200);
    });
    tl.to('#loader-stage', { x: 1400 * dir, skewX: -20, opacity: 0, duration: .6, ease: 'power3.in' }, out);
    curtains(out);
    tl.call(() => { heroIn(); $('#mbar').classList.add('is-in'); }, null, out + .15);
    finish(out + 1.39);
    return tl;
  }

  // ---------- Hero entrance ----------
  let cueLoop = null, heroOutBuilt = false;
  function heroIn() {
    const tl = gsap.timeline({ onComplete: buildHeroOut });
    const title = splits[0];
    tl.fromTo('#hero-media', { scale: 1.08 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, 0);
    tl.from(pieces(title), { yPercent: 115, skewX: lang === 'ar' ? 0 : -20, opacity: 0, duration: 1.1, stagger: .03, ease: 'expo.out' }, 0);
    // The one light sweep on the page: the chrome highlight runs up the title, line by line
    title.lines.forEach((ln, i) => tl.fromTo($$(lang === 'ar' ? '.word' : '.char', ln), { backgroundPosition: '0% 0%' }, { backgroundPosition: '0% 50%', duration: 1.4, ease: 'power2.inOut' }, i * .08));
    tl.from('.header .chip', { y: -16, opacity: 0, duration: .5, stagger: .06, ease: 'power3.out' }, .3);
    tl.fromTo('.hero-st1', { scale: 0 }, { scale: 1, duration: .7, ease: 'back.out(2.6)' }, .55);
    tl.fromTo('.hero-st2', { scale: 0 }, { scale: 1, duration: .7, ease: 'back.out(2.6)' }, .70);
    tl.from('#hero-word', { x: 220 * dir, skewX: -25, opacity: 0, duration: 1.1, ease: 'power4.out' }, .80);
    tl.from('.hero-copy p', { y: 24, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out' }, .95);
    tl.to('#hero-cue', { opacity: 1, duration: .5 }, 1.3);
    tl.call(() => { cueLoop = gsap.fromTo('#hero-cue svg', { y: 0, opacity: 1 }, { y: 10, opacity: 0, duration: 1.1, ease: 'power2.in', repeat: -1, repeatDelay: .9 }); }, null, 1.3);
    return tl;
  }
  // The cue goes on the first real scroll
  let cueGone = false;
  lenis.on('scroll', ({ scroll }) => { if (!cueGone && scroll > 40) { cueGone = true; gsap.to('#hero-cue', { opacity: 0, duration: .3, onComplete: () => { if (cueLoop) cueLoop.kill(); } }); } });

  // ---------- Hero scroll-out: the film sinks, the words lift, the wordmark drives under the sign ----------
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
    onLeave: () => { const c = $('#chip-order'); c.classList.add('is-pulse'); c.addEventListener('animationend', () => c.classList.remove('is-pulse'), { once: true }); } }, defaults: { ease: 'none' } })
    .fromTo('#hero-media', { yPercent: 0 }, { yPercent: () => (isPhone() ? 8 : 12), duration: 1 }, 0)
    .fromTo('#hero-exit', { opacity: 0 }, { opacity: .92, duration: 1, ease: 'power1.in' }, 0);
  function buildHeroOut() {
    if (heroOutBuilt) return; heroOutBuilt = true;
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }, defaults: { ease: 'none', immediateRender: false } })
      .fromTo('.hero-title', { yPercent: 0, opacity: 1 }, { yPercent: -28, opacity: 0, duration: .7, ease: 'power1.in' }, 0)
      .fromTo('.hero-st1, .hero-st2', { scale: 1, opacity: 1 }, { scale: .6, opacity: 0, duration: .5 }, 0)
      .fromTo('.hero-copy', { opacity: 1 }, { opacity: 0, duration: .4 }, 0)
      .fromTo('#hero-word', { scale: 1, y: 0, opacity: 1 }, { scale: 1.7, y: () => innerHeight * .14, opacity: 0, duration: .65, ease: 'power2.in' }, .15);
  }

  // ---------- Breakpoint-dependent motion (rebuilt if the window crosses 768 px) ----------
  const mm = gsap.matchMedia();
  mm.add({ desk: '(min-width: 768px)', phone: 'not all and (min-width: 768px)' }, (ctx) => {
    const phone = !!ctx.conditions.phone;
    const cleanupFly = buildFly(phone);
    // Slanted edges stretch on scroll (CRAV settings)
    $$('.edge').forEach((svg) => gsap.to(svg, { scaleY: phone ? 1.2 : 1.5, scrollTrigger: { trigger: svg.parentElement, start: phone ? 'top 90%' : 'top 80%', end: phone ? 'top 15%' : 'top 20%', scrub: phone ? .5 : 1 } }));
    // The coloured chapters sink a little as they leave
    $$('#tank .chapter-in, #fiesta .chapter-in, #race .chapter-in').forEach((el) => gsap.fromTo(el, { y: 0 }, { y: () => -innerHeight * .06, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'bottom 55%', end: 'bottom top', scrub: true } }));
    buildTank(phone);
    buildFull(phone);
    // Visit cards drift against the copy
    gsap.fromTo('#visit-photo', { yPercent: phone ? -3 : -6 }, { yPercent: phone ? 3 : 6, ease: 'none', scrollTrigger: { trigger: '.visit', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('#visit-map', { yPercent: phone ? 3 : 6 }, { yPercent: phone ? -3 : -6, ease: 'none', scrollTrigger: { trigger: '.visit', start: 'top bottom', end: 'bottom top', scrub: true } });
    // The wordmark rises over the crest as the page ends
    gsap.fromTo('#foot-word', { clipPath: 'inset(100% 0 0 0)', yPercent: 30 }, { clipPath: 'inset(0% 0 0 0)', yPercent: 0, ease: 'none', scrollTrigger: { trigger: '#foot-stage', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    // Lap progress line
    gsap.fromTo('#lap', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true } });
    return cleanupFly;
  });

  // ---------- THE FLYTHROUGH: one pinned stage, 100 units of scroll ----------
  function buildFly(phone) {
    const W = () => stage.offsetWidth, H = () => stage.offsetHeight;
    const items = $$('.fly-item'), tilts = $$('.fly-tilt'), shadows = $$('.fly-tilt .shadow'), names = $$('.fly-name'), labels = $$('.hud-label');
    const ticks = $$('#rail i'), streaks = $$('#streaks i'), dim = $('#dim'), glow = $('#glow'), road = $('.road-wrap');
    const neonDraw = $('#neon-draw'), neonGlow = $('#neon-glow'), neonPath = $('#neon-path'), tag = $('#hud-tag');
    const L = neonPath.getTotalLength();
    gsap.set(neonPath, { strokeDasharray: L, strokeDashoffset: L });
    gsap.set(items, { xPercent: -50, yPercent: -50, rotationX: 0, rotationY: 0, rotationZ: 0, z: phone ? -1300 : -1400, opacity: 0 });
    gsap.set(names, { x: (k) => -ITEMS[k].s * dir * .06 * W() });
    gsap.set(streaks, { x: () => gsap.utils.random(.2, .8) * W(), y: () => gsap.utils.random(.2, .8) * H(), z: -800, opacity: 0 });
    const clipIn = rtl ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', clipFull = 'inset(0% 0% 0% 0%)', clipOut = rtl ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
    const originS = rtl ? '100% 50%' : '0% 50%', originE = rtl ? '0% 50%' : '100% 50%';

    // The lineup slots are measured, so the parked items sit on them at every width and in both directions
    let slots = null;
    const measure = () => {
      const sr = stage.getBoundingClientRect(), iw = items[0].offsetWidth || 1;
      slots = $$('.slot').map((el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - (sr.left + sr.width / 2), y: r.top + r.height / 2 - (sr.top + sr.height / 2), s: r.width / iw }; });
    };
    const slot = (k, p) => { if (!slots) measure(); return slots[k][p]; };
    const onInit = () => { slots = null; };
    ScrollTrigger.addEventListener('refreshInit', onInit);
    const off = [() => ScrollTrigger.removeEventListener('refreshInit', onInit)];

    const SCHED = [ // approach start, hold start, hold end (exit start), exit end; name in/out; label in/out
      { a: 6, h: 18, e: 28, x: 36, nIn: 8, nOut: 27, lIn: 16, lOut: 27, tick: 18 },
      { a: 28, h: 40, e: 50, x: 58, nIn: 30, nOut: 49, lIn: 38, lOut: 49, tick: 40 },
      { a: 50, h: 62, e: 76, x: 84, nIn: 52, nOut: 75, lIn: 60, lOut: 75, tick: 62 },
      { a: 76, h: 88, e: 94, x: 100, nIn: 78, nOut: 93, lIn: 86, lOut: 93, tick: 88 },
    ];
    let holdK = -1, lastStreak = 0;
    const tl = gsap.timeline({ defaults: { ease: 'none', immediateRender: false }, scrollTrigger: {
      trigger: '#sellers', start: 'top top', end: () => '+=' + Math.round(innerHeight * (phone ? 4.3 : 5)), pin: stage, pinSpacing: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1,
      onToggle: (self) => stage.classList.toggle('is-pinned', self.isActive),
      onUpdate: (self) => {
        const u = self.progress * 100;
        ticks.forEach((t, i) => t.classList.toggle('is-on', u >= SCHED[i].tick));
        const k = SCHED.findIndex((s) => u >= s.h && u <= s.e);
        if (k !== holdK) { if (holdK >= 0) gsap.to(tilts[holdK], { rotationX: 0, rotationY: 0, duration: .6, ease: 'power3.out' }); holdK = k; }
        // Velocity streaks: a fast scroll fires one red line past the camera
        const now = performance.now();
        if (Math.abs(self.getVelocity()) > 1400 && now - lastStreak > 600 && gsap.getProperty(dim, 'opacity') === 0) {
          const idle = streaks.find((s) => !s._busy);
          if (idle) { lastStreak = now; idle._busy = true;
            gsap.fromTo(idle, { z: -800, opacity: 0 }, { z: 300, keyframes: { opacity: [0, 1, 0] }, duration: .5, ease: 'power2.in', onComplete: () => { idle._busy = false; } }); }
        }
      },
    } });
    tl.to({}, { duration: 100 }, 0); // the 100-unit ruler

    // Road, glow, HUD frame
    tl.fromTo(road, { opacity: 0 }, { opacity: 1, duration: 5 }, 0).fromTo(road, { opacity: 1 }, { opacity: .35, duration: 6 }, 94);
    tl.fromTo('#road-strip', { y: () => -1.6 * H() }, { y: 0, duration: 100 }, 0);
    tl.fromTo(glow, { opacity: .25 }, { opacity: .6, duration: 5 }, 0).fromTo(glow, { opacity: .6 }, { opacity: .25, duration: 6 }, 94);
    tl.fromTo('.br, .hud-marker', { opacity: 0 }, { opacity: 1, duration: 5 }, 0).fromTo('.br, .hud-marker', { opacity: 1 }, { opacity: 0, duration: 4 }, 94);
    tl.fromTo('#fly-heading', { yPercent: 0, opacity: 1 }, { yPercent: -40, opacity: 0, duration: 5, ease: 'power2.in' }, 5);

    ITEMS.forEach((it, k) => {
      const s = it.s * dir, S = SCHED[k], item = items[k], sh = shadows[k], mid = it.s === 0;
      const sw = (a, b) => (phone ? a : b); // phone value, desktop value
      // Approach (12 units): fast in, brakes into the box
      const z0 = mid ? sw(-1500, -1600) : sw(-1300, -1400);
      const xRest = mid ? 0 : s * sw(0, .09), yRest = mid ? sw(-.07, -.02) : sw(-.07, 0), rzRest = mid ? -3 : -s * sw(4, 5);
      tl.fromTo(item, { z: z0 }, { z: 0, duration: 12, ease: 'power3.out' }, S.a);
      tl.fromTo(item, { x: () => (mid ? 0 : s * sw(.26, .48) * W()), y: () => (mid ? sw(.30, .26) : sw(.34, .22)) * H() }, { x: () => xRest * W(), y: () => yRest * H(), duration: 12, ease: 'power2.inOut' }, S.a);
      tl.fromTo(item, { rotationY: mid ? 0 : -s * sw(22, 38), rotationZ: mid ? -8 : -s * sw(12, 16), rotationX: 0 }, { rotationY: 0, rotationZ: rzRest, rotationX: 0, duration: 12, ease: 'power2.out' }, S.a);
      tl.fromTo(item, { opacity: 0 }, { opacity: 1, duration: 3, ease: 'power1.out' }, S.a);
      tl.fromTo(sh, { scale: .4, opacity: 0 }, { scale: 1, opacity: .55, duration: 12 }, S.a);
      // Hold: breathing idle
      const hd = S.e - S.h, zh = sw(30, 40), ryh = mid ? 5 : s * sw(4, 5), rzh = mid ? -2 : -s * sw(4, 3), yh = mid ? sw(-.07, -.03) : sw(-.07, -.01);
      tl.fromTo(item, { z: 0, rotationY: 0, rotationZ: rzRest, y: () => yRest * H() }, { z: zh, rotationY: ryh, rotationZ: rzh, y: () => yh * H(), duration: hd, ease: 'sine.inOut' }, S.h);
      if (k < 3) {
        // Exit (8 units): up and over the gantry; 03 straight up
        tl.fromTo(item, { z: zh, x: () => xRest * W(), y: () => yh * H(), rotationX: 0, rotationY: ryh, rotationZ: rzh },
          { z: sw(560, 720), x: () => (mid ? 0 : -s * sw(.22, .34) * W()), y: () => (mid ? sw(-.36, -.40) : sw(-.30, -.14)) * H(), rotationX: mid ? 0 : sw(22, 28), rotationY: mid ? 0 : -s * sw(18, 28), rotationZ: mid ? -3 : -s * sw(8, 10), duration: 8, ease: 'power2.in' }, S.e);
        tl.fromTo(item, { opacity: 1 }, { opacity: 0, duration: sw(3.2, 4.8), ease: 'power1.in' }, S.e + 3.2);
        tl.fromTo(sh, { scale: 1, opacity: .55 }, { scale: 1.6, opacity: 0, duration: 8 }, S.e);
        // Back from the fog into the lineup slot
        const at = 94 + k * 1.2;
        tl.fromTo(item, { z: sw(-1300, -1400), x: () => slot(k, 'x'), y: () => slot(k, 'y') - .16 * H(), opacity: 0, rotationX: 0, rotationY: 0, rotationZ: -s * 10, scale: () => slot(k, 's') },
          { z: 0, x: () => slot(k, 'x'), y: () => slot(k, 'y'), opacity: 1, rotationZ: [-3, 3, -3][k], scale: () => slot(k, 's'), duration: 5, ease: 'power3.out' }, at);
        tl.fromTo(sh, { scale: 1, opacity: 0 }, { opacity: .55, duration: 5 }, at);
      } else {
        // 04 glides straight from its hold into slot 4
        tl.fromTo(item, { z: zh, x: () => xRest * W(), y: () => yh * H(), rotationX: 0, rotationY: ryh, rotationZ: rzh, scale: 1 },
          { z: 0, x: () => slot(3, 'x'), y: () => slot(3, 'y'), rotationX: 0, rotationY: 0, rotationZ: 3, scale: () => slot(3, 's'), duration: 6, ease: 'power2.inOut' }, 94);
      }
      // Giant chrome name: in from below, out above
      const ins = $$('.in', names[k]);
      tl.fromTo(names[k], { opacity: 0 }, { opacity: 1, duration: 5 }, S.nIn).fromTo(ins, { yPercent: 25 }, { yPercent: 0, duration: 5 }, S.nIn);
      tl.fromTo(names[k], { opacity: 1 }, { opacity: 0, duration: 5 }, S.nOut).fromTo(ins, { yPercent: 0 }, { yPercent: -25, duration: 5 }, S.nOut);
      // HUD label: rule, then number, name, price wipe in like a timing display
      const lb = labels[k], rule = $('.rule', lb), parts = $$('.hud-num, .hud-nm, .hud-pr', lb);
      tl.set(rule, { transformOrigin: originS }, S.lIn).fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 2 }, S.lIn);
      parts.forEach((pt, i) => tl.fromTo(pt, { clipPath: clipIn }, { clipPath: clipFull, duration: 2 }, S.lIn + .5 + .5 * i));
      tl.fromTo(lb, { clipPath: clipFull }, { clipPath: clipOut, duration: 3 }, S.lOut);
      tl.set(rule, { transformOrigin: originE }, S.lOut).fromTo(rule, { scaleX: 1 }, { scaleX: 0, duration: 3 }, S.lOut);
    });

    // The Mango Coco stop: the stage dims, the neon bolt draws, flickers on, the tag stamps, two streaks whip past
    tl.fromTo(dim, { opacity: 0 }, { opacity: .78, duration: 4 }, 56).fromTo(dim, { opacity: .78 }, { opacity: 0, duration: 4 }, 76);
    tl.fromTo(neonDraw, { opacity: 0 }, { opacity: 1, duration: .5 }, 58);
    tl.fromTo(neonPath, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 5, ease: 'power2.inOut' }, 58);
    tl.fromTo(neonDraw, { scale: 1 }, { scale: 1.15, duration: 3 }, 76);
    tl.fromTo(neonDraw, { opacity: 1 }, { opacity: 0, duration: 3 }, 76).fromTo(neonGlow, { opacity: .6 }, { opacity: 0, duration: 3 }, 76);
    tl.fromTo(tag, { opacity: 1 }, { opacity: 0, duration: 3 }, 76);
    const sig = $$('.streak.sig', stage);
    let tagPop = null, glowFlick = null;
    tl.call(() => { if (tagPop) tagPop.kill(); if (glowFlick) glowFlick.kill(); }, null, 75.9);
    tl.call(() => {
      if (!fwdOnly(tl.scrollTrigger)) { gsap.set(tag, { opacity: 0 }); return; }
      tagPop = gsap.fromTo(tag, { scale: 1.6, rotation: -14, opacity: 0 }, { scale: 1, rotation: -6, opacity: 1, duration: .45, ease: 'back.out(3)' });
      sig.forEach((el, i) => gsap.timeline({ delay: i * .4 })
        .set(el, { transformOrigin: originS }).fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: .35, ease: 'power3.in' })
        .set(el, { transformOrigin: originE }).to(el, { scaleX: 0, duration: .4, ease: 'power3.out' }));
    }, null, 61);
    tl.call(() => {
      if (!fwdOnly(tl.scrollTrigger)) { gsap.set(neonGlow, { opacity: 0 }); return; }
      glowFlick = gsap.fromTo(neonGlow, { opacity: 0 }, { keyframes: { opacity: [0, .25, 1, .3, 1, .6], easeEach: 'none' }, duration: .8 });
    }, null, 63);

    // The lineup: copy rises, the list fades in under the parked items
    tl.fromTo('#fly-lineup', { autoAlpha: 0 }, { autoAlpha: 1, duration: 4 }, 96);
    tl.fromTo($$('.lineup-script, .fly-lineup-h, .fly-list b, .fly-list em, .fly-lineup .lead, .fly-lineup .btn'), { yPercent: 10 }, { yPercent: 0, duration: 4 }, 96);

    // The heading climbs out of the darkening hero before the pin
    gsap.fromTo('#fly-heading', { yPercent: 40 }, { yPercent: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '#sellers', start: 'top bottom', end: 'top top', scrub: true } });

    // Desktop: the held item leans toward the cursor; lineup hover lifts an item
    if (!phone && window.matchMedia('(hover: hover)').matches) {
      const qx = tilts.map((t) => gsap.quickTo(t, 'rotationX', { duration: .6, ease: 'power3.out' }));
      const qy = tilts.map((t) => gsap.quickTo(t, 'rotationY', { duration: .6, ease: 'power3.out' }));
      const onMove = (e) => {
        if (holdK < 0) return;
        const r = stage.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
        qy[holdK](nx * 12); qx[holdK](-ny * 8);
      };
      stage.addEventListener('mousemove', onMove);
      off.push(() => stage.removeEventListener('mousemove', onMove));
      $$('.fly-list li').forEach((li, k) => {
        const enter = () => { if (tl.progress() > .97) gsap.to(tilts[k], { y: -8, duration: .4, ease: 'power2.out' }); gsap.to($('.reflect', tilts[k]), { opacity: .4, duration: .4 }); };
        const leave = () => { gsap.to(tilts[k], { y: 0, duration: .4, ease: 'power2.out' }); gsap.to($('.reflect', tilts[k]), { opacity: .28, duration: .4 }); };
        li.addEventListener('mouseenter', enter); li.addEventListener('mouseleave', leave);
        off.push(() => { li.removeEventListener('mouseenter', enter); li.removeEventListener('mouseleave', leave); });
      });
    }
    // Re-measure once the cut-outs have decoded
    Promise.all($$('.fly-item img, .slot img').map((i) => (i.decode ? i.decode().catch(() => {}) : null))).then(() => ScrollTrigger.refresh());
    return () => off.forEach((f) => f());
  }

  // ---------- Passion Tank: the cup fills, the needle swings to F, the plates slide in ----------
  let tankOver = false;
  function buildTank(phone) {
    const needle = $('#needle');
    const nd = { r: -110 }, aim = () => needle.setAttribute('transform', `rotate(${nd.r.toFixed(2)} 100 100)`);
    aim();
    const fill = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#tank-stage', start: phone ? 'top 85%' : 'top 80%', end: phone ? 'center 45%' : 'center 40%', scrub: true,
      onUpdate: (self) => {
        if (self.progress > .995 && self.direction === 1 && !tankOver) {
          tankOver = true;
          gsap.timeline().to(nd, { r: 116, duration: .15, ease: 'power2.out', onUpdate: aim }).to(nd, { r: 110, duration: .4, ease: 'elastic.out(1, .4)', onUpdate: aim });
          if (tankWord) tankWord.classList.add('is-on');
        }
      } } });
    fill.fromTo('#tank-fill', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0);
    fill.fromTo(nd, { r: -110 }, { r: 110, duration: 1, onUpdate: aim }, 0);
    gsap.from('.plate', { x: (i) => (phone ? 0 : (i ? 60 : -60) * dir), y: phone ? 30 : 0, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '#tank-stage', start: 'top 60%', once: true } });
  }

  // ---------- Eat. Drive. Repeat!: the letterbox opens, the words stamp in like a rev counter ----------
  function buildFull(phone) {
    const box = phone ? 34 : 40;
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#full', start: 'top 70%', end: 'top top', scrub: .8 } })
      .fromTo('#full-media', { clipPath: `inset(${box}% 0% ${box}%)` }, { clipPath: 'inset(0% 0% 0%)', duration: 1 }, 0)
      .fromTo('#full-rule-t', { y: () => innerHeight * box / 100, opacity: 1 }, { y: 0, duration: 1 }, 0)
      .fromTo('#full-rule-b', { y: () => innerHeight * (100 - box) / 100, opacity: 1 }, { y: () => innerHeight, duration: 1 }, 0)
      .to('#full-rule-t, #full-rule-b', { opacity: 0, duration: .2 }, .8);
    gsap.fromTo('#full-img', { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#full', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
    const words = $$('#full-title .w'), at = phone ? [12, 42, 72] : [10, 40, 70];
    const st = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#full', start: 'top top', end: 'bottom bottom', scrub: true } });
    st.to({}, { duration: 100 }, 0);
    words.forEach((w, i) => st.fromTo(w, { scale: 1.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 8, ease: 'expo.out', immediateRender: false }, at[i]));
    st.fromTo('#full-rule', { scaleX: 0 }, { scaleX: 1, duration: 10, immediateRender: false }, 80);
  }

  // ---------- Scroll reveals (shared set) ----------
  splits.slice(1).forEach((s) => {
    const el = s.elements[0], inFly = !!el.closest('.fly-heading');
    gsap.from(pieces(s), { yPercent: 110, skewX: lang === 'ar' ? 0 : -14, duration: .9, stagger: .025, ease: 'power3.out',
      scrollTrigger: { trigger: inFly ? '#sellers' : el, start: inFly ? 'top 70%' : 'top 85%', once: true } });
  });
  $$('main .pop').forEach((el) => gsap.from(el, { scale: .2, rotate: -20, duration: .8, ease: 'back.out(2.2)', scrollTrigger: { trigger: el, start: 'top 95%', once: true } }));
  $$('main .reveal').forEach((el) => gsap.from(el, { y: 30, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
  $$('main section:not(.hero) .btn').forEach((el) => gsap.from(el, { x: -80 * dir, skewX: -20, opacity: 0, duration: .7, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } }));

  // ---------- Speed streaks: a red line zips across as each black chapter arrives ----------
  const zip = (el, delay = 0) => gsap.timeline({ delay })
    .set(el, { transformOrigin: rtl ? '100% 50%' : '0% 50%' }).fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power3.in' })
    .set(el, { transformOrigin: rtl ? '0% 50%' : '100% 50%' }).to(el, { scaleX: 0, duration: .5, ease: 'power3.out' });
  $$('main section:not(.hero) .streak:not(.sig)').forEach((el) => ScrollTrigger.create({ trigger: el.closest('section'), start: 'top 75%', once: true, onEnter: () => zip(el) }));

  // ---------- Fiesta: ring flash, the title assembles from the centre, flags unfurl, confetti ----------
  gsap.fromTo('#fiesta-bg', { clipPath: 'circle(0% at 50% 34%)' }, { clipPath: 'circle(165% at 50% 34%)', ease: 'power2.out', scrollTrigger: { trigger: '#fiesta', start: isPhone() ? 'top 90%' : 'top 85%', end: isPhone() ? 'top 15%' : 'top 10%', scrub: 1 } });
  const flags = $$('.flag');
  gsap.set(fiestaSplit.chars, { scale: 0, opacity: 0 });
  gsap.set('#picado-line', { scaleX: 0 });
  gsap.set(flags, { rotationX: -90, transformPerspective: 600 });
  const sway = gsap.timeline({ paused: true });
  ScrollTrigger.create({ trigger: '#fiesta-title', start: 'top 78%', once: true, onEnter: () => {
    gsap.fromTo('#fi-ring', { scale: .11, opacity: .9 }, { scale: 1, opacity: 0, duration: .9, ease: 'power3.out' });
    gsap.to(fiestaSplit.chars, { scale: 1, opacity: 1, rotation: 0, duration: .7, ease: 'back.out(2)', stagger: { each: .05, from: 'center' }, delay: .05,
      onStart: () => gsap.set(fiestaSplit.chars, { rotation: () => gsap.utils.random(-14, 14) }) });
    gsap.to('#picado-line', { scaleX: 1, duration: .5, ease: 'power3.out', delay: .2 });
    gsap.to(flags, { rotationX: 0, duration: .8, stagger: .04, ease: 'back.out(1.8)', delay: .3, onComplete: () => {
      flags.forEach((f, i) => sway.to(f, { rotate: i % 2 ? 4 : -4, duration: gsap.utils.random(1.4, 2.2), ease: 'sine.inOut', yoyo: true, repeat: -1 }, i * .08));
      sway.paused(!fiestaST.isActive);
    } });
    const host = $('#fiesta'), W = host.clientWidth, top = $('#fiesta-title').getBoundingClientRect().top - host.getBoundingClientRect().top + 60;
    const colors = ['#ff2e88', '#18b04c', '#ff6a1a', '#00b3c7', '#7b3fe4', '#ed1c24', '#0b0b0c'];
    for (let i = 0; i < (isPhone() ? 30 : 60); i++) {
      const c = document.createElement('i'); c.className = 'confetti'; c.style.background = colors[i % colors.length];
      host.appendChild(c);
      const a = gsap.utils.random(-Math.PI, 0), r = gsap.utils.random(150, W * .5);
      gsap.timeline({ onComplete: () => c.remove() })
        .set(c, { x: W / 2, y: top, rotation: 0, scale: gsap.utils.random(.5, 1.2) })
        .to(c, { x: W / 2 + Math.cos(a) * r, y: top + Math.sin(a) * r * .8, rotation: gsap.utils.random(-360, 360), duration: .8, ease: 'power3.out' })
        .to(c, { y: `+=${gsap.utils.random(300, 600)}`, rotation: '+=360', opacity: 0, duration: gsap.utils.random(1.4, 2.4), ease: 'power1.in' });
    }
  } });
  const fiestaST = ScrollTrigger.create({ trigger: '#fiesta', start: 'top bottom', end: 'bottom top', onToggle: (self) => sway.paused(!self.isActive) });
  gsap.set('.fi-card h3', { scale: 1.4, opacity: 0 });
  gsap.from('.fi-card', { y: 140, rotate: (i) => [-14, 12, -10, 16][i], opacity: 0, duration: .9, stagger: .1, ease: 'back.out(1.5)', scrollTrigger: { trigger: '#fi-cards', start: 'top 88%', once: true },
    onComplete: () => gsap.to('.fi-card h3', { scale: 1, opacity: 1, duration: .4, stagger: .1, ease: 'back.out(3)' }) });

  // ---------- Menu: each panel lands, its rule draws, the rows flip in like a split-flap board ----------
  $$('.mcat').forEach((panel) => {
    const rows = $$('.mrow', panel), leaders = $$('.mrow i', panel), prices = $$('.mrow b', panel);
    gsap.set(panel, { y: 60, opacity: 0 }); gsap.set($('h3', panel), { '--rule': 0 });
    gsap.set(rows, { rotationX: -90, opacity: 0, transformPerspective: 500 }); gsap.set(leaders, { scaleX: 0 }); gsap.set(prices, { opacity: 0 });
    ScrollTrigger.create({ trigger: panel, start: 'top 90%', once: true, onEnter: () => {
      const tl = gsap.timeline();
      tl.to(panel, { y: 0, opacity: 1, duration: .8, ease: 'power3.out' }, 0);
      tl.fromTo($('h3', panel), { '--rule': 0 }, { '--rule': 1, duration: .6, ease: 'power3.out' }, .1);
      tl.to(rows, { rotationX: 0, opacity: 1, duration: isPhone() ? .35 : .45, stagger: isPhone() ? .03 : .035, ease: 'power3.out', clearProps: 'transform' }, .2);
      tl.to(leaders, { scaleX: 1, duration: .4, stagger: .035, ease: 'power2.out', clearProps: 'transform' }, .3);
      tl.to(prices, { opacity: 1, duration: .25, stagger: .035 }, .45);
    } });
  });

  // ---------- Race Mode: an S-curve through the checkpoints; the bolt rides it, pods flip as it passes ----------
  const track = $('#track'), fillP = $('#track-fill'), bolt = $('#track-bolt'), gantry = $('#gantry');
  const checks = $$('.check', track), trail = $$('.trail', track);
  const tx = trail.map((t, i) => gsap.quickTo(t, 'x', { duration: .15 + .1 * i, ease: 'power2.out' }));
  const ty = trail.map((t, i) => gsap.quickTo(t, 'y', { duration: .15 + .1 * i, ease: 'power2.out' }));
  let geo = null, finished = false, pinged = [];
  const prog = { v: 0 };
  function layoutTrack() {
    const { pts, vertical, cum, len } = trackGeometry();
    fillP.style.strokeDasharray = len;
    geo = { len, vertical, at: cum.map((l) => l / len) };
    const gw = gantry.offsetWidth || 74;
    gsap.set(gantry, vertical ? { x: pts[0].x + (rtl ? -34 - gw : 34), y: pts[0].y - 5 } : { x: pts[0].x + (rtl ? 32 : -32), y: pts[0].y - 40 });
    draw(prog.v);
  }
  function draw(v) {
    if (!geo) return;
    const { len, vertical } = geo;
    fillP.style.strokeDashoffset = len * (1 - v);
    const p = fillP.getPointAtLength(len * v), q = fillP.getPointAtLength(Math.min(len, len * v + 2));
    let ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
    const rot = vertical ? ang + 90 : (rtl ? ang - 180 : ang) + 14 * dir;
    gsap.set(bolt, { x: p.x, y: p.y, xPercent: -50, yPercent: -50, rotation: rot });
    trail.forEach((t, i) => { tx[i](p.x); ty[i](p.y); });
    checks.forEach((c, i) => {
      const on = v >= geo.at[i] - .01, was = c.classList.contains('is-on');
      c.classList.toggle('is-on', on);
      if (on && !was) {
        if (!pinged[i]) { pinged[i] = true; gsap.fromTo($('.ping', c), { scale: 1, opacity: .6 }, { scale: i === 4 ? 2.6 : 2.2, opacity: 0, duration: .6, ease: 'power2.out' }); }
        if (c.classList.contains('check-big')) gsap.fromTo($('small', c), { scale: 1.4, rotate: -12, opacity: 0 }, { scale: 1, rotate: -6, opacity: 1, duration: .3, ease: 'back.out(3)' });
      } else if (!on && was && c.classList.contains('check-big')) gsap.set($('small', c), { clearProps: 'opacity,transform' });
    });
    if (v >= .99 && !finished) {
      finished = true;
      gsap.timeline().to(bolt, { scale: 1.35, duration: .2, ease: 'power2.out' }).to(bolt, { scale: 1, duration: .2, ease: 'power2.in' });
      gsap.fromTo('#finish', { scaleX: 0 }, { scaleX: 1, duration: .7, ease: 'power3.out' });
    }
  }
  layoutTrack();
  gsap.set(trail, { opacity: .7 });
  gsap.to(prog, { v: 1, ease: 'none', onUpdate: () => draw(prog.v), scrollTrigger: { trigger: track, start: isPhone() ? 'top 80%' : 'top 75%', end: isPhone() ? 'bottom 45%' : 'bottom 40%', scrub: 1 } });
  ScrollTrigger.addEventListener('refreshInit', () => { gsap.set(bolt, { clearProps: 'transform' }); });
  ScrollTrigger.addEventListener('refresh', layoutTrack);
  gsap.from(checks, { y: 40, opacity: 0, duration: .7, stagger: .08, ease: 'back.out(1.8)', scrollTrigger: { trigger: track, start: 'top 85%', once: true } });
  // Mini start gantry: five lights, then the bolt pops onto the grid
  ScrollTrigger.create({ trigger: track, start: 'top 70%', once: true, onEnter: () => {
    const pods = $$('i', gantry), g = gsap.timeline();
    g.to(gantry, { opacity: 1, duration: .2 });
    pods.forEach((p, i) => g.call(() => p.classList.add('on'), null, .2 + .12 * i));
    g.call(() => pods.forEach((p) => p.classList.remove('on')), null, .2 + .12 * 5 + .3);
    g.fromTo(bolt, { scale: 0, opacity: 1 }, { scale: 1, duration: .35, ease: 'back.out(2)' }, .2 + .12 * 5 + .3);
    g.to(gantry, { opacity: 0, duration: .4 }, '+=.6');
  } });

  // ---------- Visit cards ----------
  gsap.from('#visit-photo', { y: 120, rotate: -16, opacity: 0, duration: 1.1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '#visit-photo', start: 'top 90%', once: true } });
  gsap.from('#visit-map', { y: 120, rotate: 14, opacity: 0, duration: 1.1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '#visit-map', start: 'top 90%', once: true } });
  gsap.from('#visit-list > div', { x: -14 * dir, opacity: 0, duration: .6, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '#visit-list', start: 'top 92%', once: true } });
  ScrollTrigger.create({ trigger: '#open', start: 'top bottom', end: 'bottom top', onToggle: (self) => $('#open').classList.toggle('is-paused', !self.isActive) });

  // ---------- Footer: links fade up, the chequered strip and rule draw, the bolts juggle ----------
  gsap.from('.foot-nav a, .foot-small', { y: 16, opacity: 0, duration: .6, stagger: .05, ease: 'power3.out', scrollTrigger: { trigger: '.foot-top', start: 'top 95%', once: true } });
  gsap.set('#foot-chequer', { scaleX: 0 }); gsap.set('#foot-rule', { scaleX: 0 });
  ScrollTrigger.create({ trigger: '.foot-rule', start: 'top 92%', once: true, onEnter: () => {
    gsap.to('#foot-chequer', { scaleX: 1, duration: .9, ease: 'power3.out' });
    gsap.to('#foot-rule', { scaleX: 1, duration: .9, ease: 'power3.out', delay: .15 });
  } });

  const fstage = $('#foot-stage');
  const n = isPhone() ? 5 : 8, R = gsap.utils.random;
  const toss = [], jug = gsap.timeline({ autoRemoveChildren: true });
  for (let i = 0; i < n; i++) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 60 100'); s.setAttribute('class', 'toss' + (i % 3 === 0 ? ' front' : ''));
    s.innerHTML = '<use href="#bolt"/>';
    fstage.appendChild(s); toss.push(s);
  }
  function juggle(el, i) {
    const W = fstage.clientWidth, H = window.innerHeight, phone = isPhone();
    const x0 = (W / n) * (i + .5) + R(-20, 20), drift = R(phone ? 10 : 30, phone ? 40 : 120) * (Math.random() > .5 ? 1 : -1);
    const up = R(phone ? .7 : .9, phone ? .95 : 1.3), down = up * R(1.1, 1.45);
    const apex = -H * R(phone ? .14 : .32, phone ? .22 : .55);
    const spin = R(phone ? 80 : 220, phone ? 180 : 560) * (Math.random() > .5 ? 1 : -1);
    const t = gsap.timeline({ onComplete: () => juggle(el, i) })
      .set(el, { x: x0, y: 60, rotation: 0, opacity: 1 })
      .to(el, { y: apex, x: x0 + drift / 2, duration: up, ease: 'power2.out' })
      .to(el, { y: 80, x: x0 + drift, duration: down, ease: 'power2.in' })
      .to(el, { rotation: spin, duration: up + down, ease: 'none' }, 0.001);
    jug.add(t, jug.time() + R(.1, .8));
  }
  gsap.set(toss, { opacity: 0 });
  ScrollTrigger.create({ trigger: fstage, start: 'top bottom', once: true, onEnter: () => toss.forEach((el, i) => gsap.delayedCall(i * .3, () => juggle(el, i))) });
  ScrollTrigger.create({ trigger: '#footer', start: 'top bottom', end: 'bottom top', onToggle: (self) => jug.paused(!self.isActive) });

  // ---------- Go ----------
  ScrollTrigger.sort();
  runLoader(() => {});
  window.addEventListener('load', () => ScrollTrigger.refresh());
  }
})();
