// FUEL: everything that moves. Words, prices and hours live in content.js.
// Timings marked "CRAV" were read from cravburgers.shop on 2026-10-12 (see docs/REFERENCE_AUDIT.md).
(() => {
  const html = document.documentElement;
  const lang = html.lang === 'ar' ? 'ar' : 'en';
  const rtl = html.dir === 'rtl';
  const T = TEXT[lang];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const isPhone = () => window.matchMedia('(max-width: 767px)').matches;
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;

  // ---------- Words ----------
  const esc = (v) => v.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  $$('[data-t]').forEach((el) => {
    const v = T[el.dataset.t]; if (typeof v !== 'string') return;
    if (v.includes('\n')) el.innerHTML = v.split('\n').map(esc).join('<br>'); else el.textContent = v;
  });
  $('#year').textContent = new Date().getFullYear();
  $('#lang').addEventListener('click', () => {
    try { localStorage.setItem('fuel-lang', lang === 'ar' ? 'en' : 'ar'); } catch (e) {}
    location.reload();
  });

  // ---------- Menu: built from MENU in content.js ----------
  $('#menu-grid').innerHTML = MENU.map((cat) => {
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
  function setMenu(show) {
    openBtn.setAttribute('aria-expanded', String(show));
    if (!window.gsap) { overlay.hidden = !show; return; }
    if (show) {
      overlay.hidden = false;
      gsap.fromTo(overlay, { clipPath: 'circle(0% at calc(100% - 60px) 34px)' }, { clipPath: 'circle(150% at calc(100% - 60px) 34px)', duration: .8, ease: 'power3.inOut' });
      gsap.fromTo($$('.overlay-nav a'), { xPercent: rtl ? 40 : -40, opacity: 0, skewX: -12 }, { xPercent: 0, opacity: 1, skewX: 0, duration: .7, stagger: .05, ease: 'power4.out', delay: .25 });
      if (lenis) lenis.stop();
    } else {
      gsap.to(overlay, { clipPath: 'circle(0% at calc(100% - 60px) 34px)', duration: .6, ease: 'power3.inOut', onComplete: () => { overlay.hidden = true; } });
      if (lenis) lenis.start();
    }
  }
  openBtn.addEventListener('click', () => setMenu(true));
  $('#menu-close').addEventListener('click', () => setMenu(false));
  $$('.overlay-nav a').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault(); setMenu(false); const t = $(a.getAttribute('href'));
    setTimeout(() => (lenis ? lenis.scrollTo(t, { offset: 0 }) : t.scrollIntoView()), 350);
  }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) setMenu(false); });

  // ---------- Papel picado flags for Fiesta (drawn here, so they also show without motion) ----------
  const FLAG_COLORS = ['#ff2e88', '#18b04c', '#ff6a1a', '#00b3c7', '#7b3fe4', '#ed1c24'];
  const picado = $('#picado');
  for (let i = 0; i < 14; i++) {
    const f = document.createElement('div'); f.className = 'flag';
    f.innerHTML = `<svg viewBox="0 0 100 112"><path fill="${FLAG_COLORS[i % 6]}" d="M0 0H100V100L90 110 80 100 70 110 60 100 50 110 40 100 30 110 20 100 10 110 0 100Z"/>`
      + '<g fill="#ffc21a"><circle cx="50" cy="52" r="13"/><path d="M50 22l7 9-7 9-7-9zM50 64l7 9-7 9-7-9zM20 45l8 7-8 7-8-7zM80 45l8 7-8 7-8-7z"/>'
      + '<path d="M10 8h10l-5 7zM30 8h10l-5 7zM50 8h10l-5 7zM70 8h10l-5 7zM20 86h8l-4 6zM45 90h10l-5 7zM72 86h8l-4 6z"/></g></svg>';
    picado.appendChild(f);
  }

  if (calm || !window.gsap) { const l = $('#loader'); if (l) l.remove(); return; }

  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);
  // Wait for the fonts so headlines split on the right line breaks (but never more than 2.5 s).
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]).then(start);

  function start() {

  // ---------- Smooth scroll ----------
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const t = a.getAttribute('href'); if (t.length < 2 || a.closest('.overlay-nav')) return;
    e.preventDefault(); lenis.scrollTo(t === '#top' ? 0 : t);
  }));

  // Header slides away while scrolling down, comes back on the way up.
  const header = $('#header');
  lenis.on('scroll', ({ direction, scroll }) => header.classList.toggle('is-hidden', direction === 1 && scroll > 200));

  // ---------- Split headlines (chars in English, words in Arabic so letters stay joined) ----------
  const splits = $$('.split').map((el) => SplitText.create(el, { type: lang === 'ar' ? 'lines,words' : 'lines,words,chars', linesClass: 'line', wordsClass: 'word', charsClass: 'char' }));
  const pieces = (s) => (lang === 'ar' ? s.words : s.chars);

  // ---------- Loader: five start lights, lights out, go (curtain timings from CRAV) ----------
  function runLoader(done) {
    const loader = $('#loader'), text = $('#loader-text'), bar = $('#loader-bar');
    const pods = $$('.pod', loader);
    const lines = [T.load_1, T.load_2, T.load_3, T.load_4, T.load_5];
    const ON = { backgroundColor: '#ff1f27', boxShadow: '0 0 28px 4px rgba(255,31,39,.85), inset 0 -4px 8px rgba(0,0,0,.25)' };
    const OFF = { backgroundColor: '#2a0507', boxShadow: '0 0 0 0 rgba(255,31,39,0), inset 0 -4px 8px rgba(0,0,0,.6)' };
    lenis.stop();
    const tl = gsap.timeline();
    const step = .38, first = .35, lightsOut = first + step * 5 + .3;
    tl.fromTo('#loader-logo', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, 0);
    tl.from('#lights', { scale: .85, opacity: 0, duration: .5, ease: 'back.out(2)' }, .05);
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
    tl.call(() => { text.textContent = T.load_done; }, null, lightsOut);
    tl.to('#loader-logo', { scale: 1.12, duration: .12, ease: 'power2.out', yoyo: true, repeat: 1 }, lightsOut);
    const out = lightsOut + .45;
    tl.to([text, '.loader-bar'], { y: 40, opacity: 0, duration: .3, ease: 'power2.in', onComplete: () => lenis.scrollTo(0, { immediate: true }) }, out - .3);
    tl.to('#loader-stage', { x: rtl ? -1400 : 1400, skewX: -20, opacity: 0, duration: .6, ease: 'power3.in' }, out);
    // three curtains (black, chrome, red) lift with a curved bottom edge; the middle trails behind the corners
    ['.c1', '.c2', '.c3'].forEach((sel, i) => {
      const path = $(sel, loader), e = { l: 101, r: 101, c: 101 };
      const draw = () => path.setAttribute('d', `M -1 -1 L 101 -1 L 101 ${e.r} Q 50 ${e.c} -1 ${e.l} Z`);
      tl.to(e, { l: -1, r: -1, duration: .8, ease: 'power2.inOut', onUpdate: draw }, out + .12 * i);
      tl.to(e, { c: -1, duration: 1.1, ease: 'power4.inOut', onUpdate: draw }, out + .12 * i);
    });
    tl.call(() => { loader.remove(); lenis.start(); done(); }, null, out + .24 + 1.15);
    return tl;
  }

  // ---------- Hero entrance ----------
  function heroIn() {
    const tl = gsap.timeline();
    tl.fromTo('#hero-bg', { scale: 1.18 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0);
    tl.from(pieces(splits[0]), { yPercent: 115, skewX: -20, opacity: 0, duration: 1, stagger: .035, ease: 'power4.out' }, 0);
    tl.fromTo('.hero-st1, .hero-st2', { scale: 0 }, { scale: 1, duration: .7, stagger: .12, ease: 'back.out(2.6)' }, .5);
    // CRAV: the burger pops in, then floats
    tl.fromTo('#hero-burger', { scale: .5, opacity: 0, y: 100, rotate: -5 }, { scale: 1, opacity: 1, y: 0, rotate: 0, duration: 1.5, ease: 'back.out(1.5)' }, .5);
    tl.call(() => {
      gsap.to('#hero-burger', { y: '-=15', duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('.ring', { rotation: 360, duration: 40, ease: 'none', repeat: -1 });
    }, null, 1.7);
    // The red logo drives in from the side
    tl.from('#hero-word', { x: rtl ? 500 : -500, skewX: -25, opacity: 0, duration: 1, ease: 'power4.out' }, .8);
    tl.from('.hero-copy p', { y: 30, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out' }, .85);
    return tl;
  }
  gsap.to('#hero-bg', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // ---------- Scroll reveals ----------
  splits.slice(1).forEach((s) => gsap.from(pieces(s), {
    yPercent: 110, skewX: -14, duration: .9, stagger: .025, ease: 'power3.out',
    scrollTrigger: { trigger: s.elements[0], start: 'top 85%', once: true },
  }));
  $$('main .pop').forEach((el) => gsap.from(el, { scale: .2, rotate: -20, duration: .8, ease: 'back.out(2.2)', scrollTrigger: { trigger: el, start: 'top 95%', once: true } }));
  $$('main .reveal:not(.hero-copy p)').forEach((el) => gsap.from(el, { y: 30, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
  $$('main section:not(.hero) .btn').forEach((el) => gsap.from(el, { x: rtl ? 80 : -80, skewX: -20, opacity: 0, duration: .7, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } }));

  // ---------- Speed streaks: a red line zips across as each section arrives ----------
  $$('main section:not(.hero) .streak').forEach((el) => {
    gsap.timeline({ scrollTrigger: { trigger: el.parentElement, start: 'top 75%', once: true } })
      .set(el, { transformOrigin: rtl ? '100% 50%' : '0% 50%' })
      .fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power3.in' })
      .set(el, { transformOrigin: rtl ? '0% 50%' : '100% 50%' })
      .to(el, { scaleX: 0, duration: .5, ease: 'power3.out' });
  });

  // ---------- Top sellers: deal in, then lean with the mouse ----------
  const cards = $$('.card');
  gsap.from(cards, { y: 160, rotate: (i) => [-20, 10, 25, -15][i], opacity: 0, duration: 1, stagger: .1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '#cards', start: 'top 90%', once: true } });
  if (window.matchMedia('(hover: hover)').matches) {
    let last = null;
    $('.sellers').addEventListener('mousemove', (e) => {
      if (last) {
        const vx = e.clientX - last.x, vy = e.clientY - last.y;
        cards.forEach((c, i) => gsap.to(c, { x: `+=${vx * (.5 + i * .12)}`, y: `+=${vy * (.5 + i * .12)}`, rotation: `+=${vx * .07}`, duration: .5, ease: 'power2.out', overwrite: 'auto',
          onComplete: () => gsap.to(c, { x: 0, y: 0, rotation: 0, duration: 1.2, ease: 'elastic.out(1, .5)' }) }));
      }
      last = { x: e.clientX, y: e.clientY };
    });
  }

  // ---------- Slanted edges stretch on scroll (CRAV settings) ----------
  $$('.edge').forEach((svg) => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => gsap.to(svg, { scaleY: 1.5, scrollTrigger: { trigger: svg.parentElement, start: 'top 80%', end: 'top 20%', scrub: 1 } }));
    mm.add('(max-width: 767px)', () => gsap.to(svg, { scaleY: 1.2, scrollTrigger: { trigger: svg.parentElement, start: 'top 90%', end: 'top 15%', scrub: .5 } }));
  });

  // ---------- Passion tank: Mango Coco grows as it comes up ----------
  gsap.fromTo('#tank-cup', { scale: .55, rotate: -12, y: 80 }, { scale: 1.04, rotate: -3, y: 0, ease: 'none', scrollTrigger: { trigger: '.tank-stage', start: 'top bottom', end: 'center center', scrub: 1 } });
  gsap.from('.tank-facts li', { x: (i, el) => (el.closest('.tank-l') ? -60 : 60) * (rtl ? -1 : 1), opacity: 0, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.tank-stage', start: 'top 60%', once: true } });

  // ---------- Full-bleed picture zooms out as you scroll ----------
  gsap.fromTo('#full-media img', { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#full', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });

  // ---------- Fiesta: colour bursts out of the black, flags swing, confetti ----------
  gsap.fromTo('#fiesta-bg', { clipPath: 'circle(0% at 50% 0%)' }, { clipPath: 'circle(150% at 50% 0%)', ease: 'power2.out', scrollTrigger: { trigger: '#fiesta', start: 'top 85%', end: 'top 15%', scrub: 1 } });
  const flags = $$('.flag');
  gsap.from(flags, { yPercent: -120, rotate: () => gsap.utils.random(-30, 30), duration: .9, stagger: .04, ease: 'back.out(2)', scrollTrigger: { trigger: '#fiesta', start: 'top 40%', once: true } });
  flags.forEach((f, i) => gsap.to(f, { rotate: i % 2 ? 4 : -4, duration: gsap.utils.random(1.4, 2.2), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .08 }));
  ScrollTrigger.create({ trigger: '.fiesta-title', start: 'top 80%', once: true, onEnter: () => {
    const host = $('#fiesta'), W = host.clientWidth, top = $('.fiesta-title').offsetTop + 60;
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
  gsap.from('.fi-card', { y: 140, rotate: (i) => [-14, 12, -10, 16][i], opacity: 0, duration: .9, stagger: .1, ease: 'back.out(1.5)', scrollTrigger: { trigger: '#fi-cards', start: 'top 88%', once: true } });

  // ---------- Menu panels slide in ----------
  gsap.from('.mcat', { y: 60, opacity: 0, duration: .8, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '#menu-grid', start: 'top 85%', once: true } });

  // ---------- Race Mode: the bolt rides the loyalty track; checkpoints light up as it passes ----------
  const track = $('#track'), line = $('.track-line', track), fill = $('#track-fill'), bolt = $('#track-bolt');
  const checks = $$('.check', track);
  let geo = null;
  function layoutTrack() {
    const box = track.getBoundingClientRect();
    const pts = checks.map((c) => { const r = $('.dot', c).getBoundingClientRect(); return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 }; });
    const a = pts[0], b = pts[pts.length - 1], vertical = Math.abs(b.y - a.y) > Math.abs(b.x - a.x);
    Object.assign(line.style, vertical
      ? { left: `${a.x - 2}px`, right: 'auto', top: `${a.y}px`, bottom: 'auto', width: '4px', height: `${b.y - a.y}px` }
      : { left: `${Math.min(a.x, b.x)}px`, right: 'auto', top: `${a.y - 2}px`, bottom: 'auto', width: `${Math.abs(b.x - a.x)}px`, height: '4px' });
    Object.assign(bolt.style, { left: '0px', right: 'auto', top: '0px', margin: '0' });
    const len = vertical ? b.y - a.y : b.x - a.x;
    geo = { a, b, vertical, at: pts.map((p) => (vertical ? (p.y - a.y) : (p.x - a.x)) / len) };
    draw(prog.v);
  }
  const prog = { v: 0 };
  function draw(v) {
    if (!geo) return;
    const { a, b, vertical } = geo;
    fill.style.transform = vertical ? `scaleY(${v})` : `scaleX(${v})`;
    fill.style.transformOrigin = vertical ? '50% 0' : (rtl ? '100% 50%' : '0 50%');
    gsap.set(bolt, { x: a.x + (b.x - a.x) * v, y: a.y + (b.y - a.y) * v, xPercent: -50, yPercent: -50, rotation: vertical ? 0 : (rtl ? -14 : 14) });
    checks.forEach((c, i) => c.classList.toggle('is-on', v >= geo.at[i] - .01));
  }
  layoutTrack();
  gsap.to(prog, { v: 1, ease: 'none', onUpdate: () => draw(prog.v), scrollTrigger: { trigger: track, start: 'top 75%', end: 'bottom 40%', scrub: 1 } });
  ScrollTrigger.addEventListener('refreshInit', () => { gsap.set(bolt, { clearProps: 'transform' }); });
  ScrollTrigger.addEventListener('refresh', layoutTrack);
  gsap.from(checks, { y: 40, opacity: 0, duration: .7, stagger: .08, ease: 'back.out(1.8)', scrollTrigger: { trigger: track, start: 'top 85%', once: true } });

  // ---------- Visit cards ----------
  gsap.from('.visit-photo', { y: 120, rotate: -16, opacity: 0, duration: 1.1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.visit-photo', start: 'top 90%', once: true } });
  gsap.from('.visit-map', { y: 120, rotate: 14, opacity: 0, duration: 1.1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.visit-map', start: 'top 90%', once: true } });

  // ---------- Footer: the rule draws (CRAV: scaleX, 0.9s power3.out at top 92%), the logo drives in, bolts juggle ----------
  gsap.fromTo('#foot-rule', { scaleX: 0 }, { scaleX: 1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.foot-rule', start: 'top 92%', once: true } });
  gsap.from('.foot-word', { x: rtl ? 300 : -300, skewX: -25, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '#foot-stage', start: 'top 85%', once: true } });

  const stage = $('#foot-stage');
  const n = isPhone() ? 5 : 8, R = gsap.utils.random;
  const toss = [];
  for (let i = 0; i < n; i++) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 60 100'); s.setAttribute('class', 'toss' + (i % 3 === 0 ? ' front' : ''));
    s.innerHTML = '<use href="#bolt"/>';
    stage.appendChild(s); toss.push(s);
  }
  function juggle(el, i) {
    const W = stage.clientWidth, H = window.innerHeight, phone = isPhone();
    const x0 = (W / n) * (i + .5) + R(-20, 20), drift = R(phone ? 10 : 30, phone ? 40 : 120) * (Math.random() > .5 ? 1 : -1);
    const up = R(phone ? .7 : .9, phone ? .95 : 1.3), down = up * R(1.1, 1.45);
    const apex = -H * R(phone ? .14 : .32, phone ? .22 : .55);
    const spin = R(phone ? 80 : 220, phone ? 180 : 560) * (Math.random() > .5 ? 1 : -1);
    gsap.timeline({ delay: R(.1, .8), onComplete: () => juggle(el, i) })
      .set(el, { x: x0, y: 60, rotation: 0, opacity: 1 })
      .to(el, { y: apex, x: x0 + drift / 2, duration: up, ease: 'power2.out' })
      .to(el, { y: 80, x: x0 + drift, duration: down, ease: 'power2.in' })
      .to(el, { rotation: spin, duration: up + down, ease: 'none' }, 0.001);
  }
  gsap.set(toss, { opacity: 0 });
  ScrollTrigger.create({ trigger: stage, start: 'top bottom', once: true, onEnter: () => toss.forEach((el, i) => gsap.delayedCall(i * .3, () => juggle(el, i))) });

  // ---------- Go ----------
  if ($('#loader')) runLoader(() => {}).add(heroIn(), '-=0.9');
  else heroIn();
  window.addEventListener('load', () => ScrollTrigger.refresh());
  }
})();
