// FUEL: everything that moves. Words and facts live in content.js.
// Timings marked "CRAV" were read from cravburgers.shop on 2026-10-12 (see docs/REFERENCE_AUDIT.md).
(() => {
  const html = document.documentElement;
  const lang = html.lang === 'ar' ? 'ar' : 'en';
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

  // ---------- Open now ----------
  (function openBadge() {
    const el = $('#open');
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: BUSINESS.timezone }));
    let m = now.getHours() * 60 + now.getMinutes();
    const toMin = (s) => { const [h, mm] = s.split(':').map(Number); return h * 60 + mm; };
    const o = toMin(BUSINESS.open), c = toMin(BUSINESS.close);
    if (m < o && m + 1440 < c) m += 1440;
    const open = m >= o && m < c;
    el.classList.toggle('is-open', open);
    $('span', el).textContent = open ? `${T.open_now} · ${T.closes}` : `${T.closed_now} · ${T.opens}`;
  })();

  // ---------- Menu overlay ----------
  const overlay = $('#overlay'), openBtn = $('#menu-open');
  function setMenu(show) {
    openBtn.setAttribute('aria-expanded', String(show));
    if (show) {
      overlay.hidden = false;
      gsap.fromTo(overlay, { clipPath: 'circle(0% at calc(100% - 60px) 34px)' }, { clipPath: 'circle(150% at calc(100% - 60px) 34px)', duration: .8, ease: 'power3.inOut' });
      gsap.fromTo($$('.overlay-nav a'), { yPercent: 120, rotate: 6 }, { yPercent: 0, rotate: 0, duration: .7, stagger: .06, ease: 'back.out(1.6)', delay: .25 });
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
  const splits = $$('.split').map((el) => SplitText.create(el, { type: lang === 'ar' ? 'lines,words' : 'lines,words,chars', linesClass: 'line' }));
  const pieces = (s) => (lang === 'ar' ? s.words : s.chars);

  // ---------- Loader (CRAV timings) ----------
  function runLoader(done) {
    const loader = $('#loader'), stack = $('#loader-stack'), text = $('#loader-text'), bar = $('#loader-bar');
    const parts = $$('.ls', stack);
    const lines = [T.load_1, T.load_2, T.load_3, T.load_4, T.load_5];
    const tilt = [-2, 1, -4, 3, -3];
    lenis.stop();
    const tl = gsap.timeline();
    gsap.set(parts, { y: -800, opacity: 0, scale: .8 });
    const p = { v: 0 };
    tl.to(p, { v: 100, duration: 1.5, ease: 'power1.inOut', onUpdate: () => { bar.style.width = p.v + '%'; } }, 0);
    parts.forEach((el, i) => {
      const at = .22 * i, land = at + .32;
      tl.call(() => { text.textContent = lines[i] || lines[lines.length - 1]; }, null, at + .05);
      tl.fromTo(el, { y: -800, opacity: 0, scale: .8 }, { y: 0, opacity: 1, scale: 1, duration: .32, ease: 'power1.in' }, at);
      tl.fromTo(el, { rotate: tilt[i] + (Math.random() > .5 ? 12 : -12) }, { rotate: tilt[i], duration: .45, ease: 'back.out(2.5)' }, land);
      // the whole stack squashes a little each time something lands on it
      tl.to(stack, { scaleY: .88, scaleX: 1.06, duration: .06, ease: 'power2.out' }, land)
        .to(stack, { scaleY: 1.03, scaleX: .98, duration: .08, ease: 'power1.inOut' }, land + .06)
        .to(stack, { scaleY: 1, scaleX: 1, duration: .12, ease: 'power2.out' }, land + .14);
    });
    const burst = .22 * (parts.length - 1) + .32 + .3;
    const sparks = $('#sparks'), colors = ['#ffd54a', '#ffffff', '#ef6f2e', '#ffd54a'];
    for (let i = 0; i < 14; i++) { const s = document.createElement('i'); s.style.background = colors[i % 4]; sparks.appendChild(s); }
    tl.call(() => $$('i', sparks).forEach((s, i, all) => {
      const a = (i / all.length) * Math.PI * 2, r = 110 + Math.random() * 90;
      gsap.fromTo(s, { x: 0, y: 0, scale: 0, opacity: 1 }, { x: Math.cos(a) * r, y: Math.sin(a) * r - 30, scale: .6 + Math.random() * 1.5, opacity: 0, duration: .8, ease: 'power2.out' });
    }), null, burst);
    tl.to(stack, { y: -50, scale: 1.08, rotate: 2, duration: .4, ease: 'power2.out' }, burst + .3)
      .to(stack, { y: 0, scale: 1, rotate: 0, duration: .5, ease: 'bounce.out' });
    tl.call(() => { text.textContent = T.load_done; }, null, burst + .3);
    const out = burst + 1.2;
    tl.to([text, '.loader-bar'], { y: 50, opacity: 0, duration: .35, ease: 'power2.in', onComplete: () => lenis.scrollTo(0, { immediate: true }) }, out - .4);
    tl.to('#loader-stage', { y: -1000, opacity: 0, scale: .9, duration: .75, ease: 'power2.in' }, out);
    // three curtains lift with a curved bottom edge; the middle trails behind the corners
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
    const s = splits[0];
    tl.from(pieces(s), { yPercent: 115, rotate: 10, opacity: 0, duration: 1, stagger: .05, ease: 'power4.out' }, 0);
    tl.fromTo('.hero-st1, .hero-st2', { scale: 0 }, { scale: 1, duration: .7, stagger: .12, ease: 'back.out(2.6)' }, .15 + .35);
    // CRAV: the burger pops in, then floats
    tl.fromTo('#hero-burger', { scale: .5, opacity: 0, y: 100, rotate: -5 }, { scale: 1, opacity: 1, y: 0, rotate: 0, duration: 1.5, ease: 'back.out(1.5)' }, .5);
    tl.call(() => gsap.to('#hero-burger', { y: '-=15', duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }), null, 1.7);
    tl.from('#hero-word', { yPercent: 60, scale: .6, opacity: 0, duration: .9, ease: 'back.out(2.2)' }, .8);
    tl.from('.hero-copy p', { y: 30, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out' }, .25 + .6);
    return tl;
  }

  // ---------- Scroll reveals ----------
  splits.slice(1).forEach((s) => gsap.from(pieces(s), {
    yPercent: 110, rotate: 6, duration: .9, stagger: .025, ease: 'power3.out',
    scrollTrigger: { trigger: s.elements[0], start: 'top 85%', once: true },
  }));
  $$('.pop').forEach((el) => gsap.from(el, { scale: .2, rotate: -25, duration: .8, ease: 'back.out(2.2)', scrollTrigger: { trigger: el, start: 'top 95%', once: true } }));
  $$('main .reveal:not(.hero-copy p)').forEach((el) => gsap.from(el, { y: 30, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
  gsap.from('.statement .blob, .ctas .blob', { scale: 0, rotate: -12, duration: .7, ease: 'back.out(2.5)', stagger: .08, scrollTrigger: { trigger: '.statement .blob', start: 'top 95%', once: true } });

  // ---------- Cards: deal in, then lean with the mouse ----------
  const cards = $$('.card');
  gsap.from(cards, { y: 160, rotate: (i) => [-20, 10, 25][i], opacity: 0, duration: 1, stagger: .1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '#cards', start: 'top 90%', once: true } });
  if (window.matchMedia('(hover: hover)').matches) {
    let last = null;
    $('.statement').addEventListener('mousemove', (e) => {
      if (last) {
        const vx = e.clientX - last.x, vy = e.clientY - last.y;
        cards.forEach((c, i) => gsap.to(c, { x: `+=${vx * (.6 + i * .15)}`, y: `+=${vy * (.6 + i * .15)}`, rotation: `+=${vx * .08}`, duration: .5, ease: 'power2.out', overwrite: 'auto',
          onComplete: () => gsap.to(c, { x: 0, y: 0, rotation: 0, duration: 1.2, ease: 'elastic.out(1, .5)' }) }));
      }
      last = { x: e.clientX, y: e.clientY };
    });
  }

  // ---------- Wave edges (CRAV: wobble on sine.inOut, stretch on scroll) ----------
  $$('.wave').forEach((svg, k) => {
    const path = $('path', svg);
    const w = { a: 14, b: 4, c: 16, d: 8, e: 2, f: 12 };
    const draw = () => path.setAttribute('d', `M0 20.5 L0 ${w.a} C 18 ${w.b}, 30 ${w.c}, 50 ${w.d} S 82 ${w.e}, 100 ${w.f} L100 20.5 Z`);
    draw();
    const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: k * .3 });
    tl.to(w, { a: 8, b: 12, duration: 1, ease: 'sine.inOut', onUpdate: draw }, 0)
      .to(w, { c: 6, d: 14, duration: 2, ease: 'sine.inOut', onUpdate: draw }, .3)
      .to(w, { e: 12, f: 5, duration: 1.8, ease: 'sine.inOut', onUpdate: draw }, .6);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => gsap.to(svg, { scaleY: 1.5, scrollTrigger: { trigger: svg.parentElement, start: 'top 80%', end: 'top 20%', scrub: 1 } }));
    mm.add('(max-width: 767px)', () => gsap.to(svg, { scaleY: 1.2, scrollTrigger: { trigger: svg.parentElement, start: 'top 90%', end: 'top 15%', scrub: .5 } }));
  });

  // ---------- Experience: the burger grows as it comes up ----------
  gsap.fromTo('#exp-burger', { scale: .55, rotate: -8, y: 80 }, { scale: 1.05, rotate: 0, y: 0, ease: 'none', scrollTrigger: { trigger: '.exp-stage', start: 'top bottom', end: 'center center', scrub: 1 } });
  gsap.from('.exp-facts li', { x: (i, el) => (el.closest('.exp-l') ? -60 : 60), opacity: 0, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.exp-stage', start: 'top 60%', once: true } });

  // ---------- Full-bleed picture zooms out as you scroll ----------
  gsap.fromTo('#full-media .ph', { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#full', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });

  // ---------- Menu rows slide in ----------
  gsap.from('#menu-list li', { xPercent: (i) => (i % 2 ? 30 : -30), opacity: 0, duration: .9, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: '#menu-list', start: 'top 85%', once: true } });

  // ---------- Delivery: dashed route through the stops, the bolt rides it (CRAV: motion path, auto-rotate, scrubbed) ----------
  const route = $('#route'), rsvg = $('#route-svg'), rpath = $('#route-path'), rider = $('#rider');
  function buildRoute() {
    const box = route.getBoundingClientRect();
    rsvg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    const pts = $$('.stop', route).map((s) => {
      const r = s.getBoundingClientRect(), left = r.left - box.left, top = r.top - box.top;
      // pass beside each card, on its open side
      const side = (r.left + r.width / 2) < (box.left + box.width / 2);
      return { x: side ? Math.min(box.width - 30, left + r.width + box.width * .14) : Math.max(30, left - box.width * .14), y: top + r.height / 2 };
    });
    let d = `M ${box.width / 2} 0`;
    let prev = { x: box.width / 2, y: 0 };
    pts.concat([{ x: box.width / 2, y: box.height }]).forEach((p) => {
      const my = (prev.y + p.y) / 2;
      d += ` C ${prev.x} ${my}, ${p.x} ${my}, ${p.x} ${p.y}`;
      prev = p;
    });
    rpath.setAttribute('d', d);
  }
  buildRoute();
  gsap.set(rider, { xPercent: -50, yPercent: -50 });
  gsap.to(rider, {
    motionPath: { path: rpath, align: rpath, alignOrigin: [.5, .5], autoRotate: 90 },
    ease: 'none',
    scrollTrigger: { trigger: route, start: 'top 60%', end: 'bottom 60%', scrub: 1, invalidateOnRefresh: true, onRefresh: buildRoute },
  });
  ScrollTrigger.addEventListener('refreshInit', buildRoute);
  $$('.stop').forEach((s, i) => gsap.from(s, { scale: .6, rotate: i % 2 ? 16 : -16, opacity: 0, duration: .8, ease: 'back.out(1.7)', scrollTrigger: { trigger: s, start: 'top 85%', once: true } }));

  // ---------- Visit map card ----------
  gsap.from('.visit-map', { y: 120, rotate: 14, opacity: 0, duration: 1.1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.visit-map', start: 'top 90%', once: true } });

  // ---------- Footer: the rule draws (CRAV: scaleX, 0.9s power3.out at top 92%), the wordmark rises, bolts juggle ----------
  gsap.fromTo('#foot-rule', { scaleX: 0 }, { scaleX: 1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.foot-rule', start: 'top 92%', once: true } });
  gsap.from('.foot-word', { yPercent: 40, scaleY: .6, duration: 1.1, ease: 'back.out(1.8)', scrollTrigger: { trigger: '#foot-stage', start: 'top 85%', once: true } });

  const stage = $('#foot-stage');
  const BOLT = '<path d="M36 0 4 58h22L18 100l38-62H33L44 0z"/>';
  const n = isPhone() ? 5 : 8, R = gsap.utils.random;
  const toss = [];
  for (let i = 0; i < n; i++) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 60 100'); s.setAttribute('class', 'toss' + (i % 3 === 0 ? ' front' : '')); s.innerHTML = BOLT;
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
