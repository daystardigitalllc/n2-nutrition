(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.classList.remove('no-js');
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

  /* header: solid after scrolling, mobile menu */
  const nav = $('#nav'), toggle = $('#navToggle');
  const onScroll = () => nav.classList.toggle('is-solid', scrollY > 40);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  const setMenu = open => {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('nav-open')));
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* hero video: triptych on landscape screens, single portrait splice on phones */
  const video = $('#heroVideo');
  if (video && !reduce) {
    const mq = matchMedia('(max-width: 860px), (max-aspect-ratio: 1/1)');
    let current = '';
    const load = () => {
      const src = mq.matches ? video.dataset.srcMobile : video.dataset.srcDesktop;
      if (src === current) return;
      current = src; video.classList.remove('is-playing'); video.src = src; video.load();
      video.play().catch(() => {});
    };
    video.addEventListener('playing', () => video.classList.add('is-playing'));
    load();
    mq.addEventListener('change', load);
    document.addEventListener('visibilitychange', () => { document.hidden ? video.pause() : video.play().catch(() => {}); });
  }

  /* open / closed status (Central time) */
  const status = $('#openStatus');
  if (status) {
    const hours = { 0: null, 1: [6, 17], 2: [6, 17], 3: [6, 17], 4: [6, 17], 5: [6, 17], 6: [8, 14] };
    const fmt = h => (h % 12 || 12) + (h < 12 ? 'am' : 'pm');
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t).value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    const now = (+get('hour') % 24) + +get('minute') / 60;
    const today = hours[day];
    let msg = 'M–F 6am–5pm · Sat 8am–2pm', open = false;
    if (today && now >= today[0] && now < today[1]) { open = true; msg = `Open now · until ${fmt(today[1])}`; }
    else if (today && now < today[0]) msg = `Closed · opens today at ${fmt(today[0])}`;
    else {
      let n = (day + 1) % 7, add = 1; while (!hours[n]) { n = (n + 1) % 7; add++; }
      msg = `Closed · opens ${add === 1 ? 'tomorrow' : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][n]} at ${fmt(hours[n][0])}`;
    }
    status.classList.toggle('is-open', open);
    $('span', status).textContent = msg;
  }

  /* menu tabs */
  const tabs = $$('.tab');
  const select = tab => {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      const panel = $('#' + t.getAttribute('aria-controls'));
      panel.hidden = !on; panel.classList.toggle('is-active', on);
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus(); select(next);
    });
  });

  /* reviews carousel */
  const track = $('#carousel');
  if (track) {
    const step = () => track.querySelector('.review').getBoundingClientRect().width + 20;
    $('#prev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    $('#next').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  /* lightbox */
  const box = $('#lightbox');
  if (box && box.showModal) {
    const img = $('img', box);
    $$('.bento__item').forEach(b => b.addEventListener('click', () => {
      img.src = b.dataset.full; img.alt = $('img', b).alt; box.showModal();
    }));
    box.addEventListener('click', e => { if (e.target === box || e.target.closest('.lightbox__close')) box.close(); });
  }

  /* scroll reveal */
  const items = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('.bento .reveal').forEach((el, i) => el.style.setProperty('--d', (i % 4) * 0.07 + 's'));
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('is-visible'));
})();
