(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }));
  }

  document.querySelectorAll('.gift-card').forEach(card => {
    let freq = 'One-time', amount = '50';
    const output = card.querySelector('.gift-selection');
    const show = () => output.textContent = `${freq} · ${amount === 'other' ? 'custom amount' : '$' + amount} selected`;
    card.querySelectorAll('[data-freq]').forEach(button => button.addEventListener('click', () => {
      card.querySelectorAll('[data-freq]').forEach(b => b.classList.remove('selected'));
      button.classList.add('selected'); freq = button.dataset.freq; show();
    }));
    card.querySelectorAll('[data-amount]').forEach(button => button.addEventListener('click', () => {
      card.querySelectorAll('[data-amount]').forEach(b => b.classList.remove('selected'));
      button.classList.add('selected'); amount = button.dataset.amount; show();
    }));
  });

  const tabData = {
    origins: ['01', 'It began with a promise to neighbours.', 'In early 2024, brothers Hani and Mahmoud Almadhoun founded Gaza Soup Kitchen in Beit Lahia, Gaza. A personal vow to feed neighbours grew into a community-led effort supported by people around the world.', 'kitchen-team.webp', 'Gaza Soup Kitchen team at a food preparation site'],
    legacy: ['02', '“Mostamreen” — we will continue.', 'Mahmoud Almadhoun was killed in November 2024. His word, Mostamreen, remains a guiding principle as family, friends and the Gaza team continue the work.', 'hero-kitchen.webp', 'Gaza Soup Kitchen team member preparing a meal'],
    team: ['03', 'The work belongs to the people on the ground.', 'Local staff and volunteers prepare and serve meals for their own community in Gaza, amid changing supplies and conditions.', 'woman-kitchen.webp', 'Gaza Soup Kitchen team member holding prepared food']
  };
  const panel = document.querySelector('#team-panel');
  if (panel) {
    document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b === button)));
      const [number, heading, text, image, alt] = tabData[button.dataset.tab];
      panel.querySelector('.panel-numeral').textContent = number;
      panel.querySelector('h3').textContent = heading;
      panel.querySelector('p').textContent = text;
      const img = panel.querySelector('img'); img.src = `assets/${image}`; img.alt = alt;
    }));
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.video-trigger').forEach(button => button.addEventListener('click', () => {
    const frame = button.parentElement.querySelector('iframe');
    frame.src = frame.dataset.src;
    const cover = button.parentElement.querySelector('.reel-cover');
    if (cover) cover.hidden = true;
    button.hidden = true;
  }));
  document.querySelectorAll('[data-carousel]').forEach(windowEl => {
    const track = windowEl.firstElementChild;
    const cards = [...track.children];
    const actions = windowEl.nextElementSibling;
    const prev = actions?.querySelector('[data-prev]');
    const next = actions?.querySelector('[data-next]');
    let index = 0, timer;
    const visibleCount = () => window.innerWidth < 760 ? 1 : track.classList.contains('media-track') ? 4 : 3;
    const maxIndex = () => Math.max(0, cards.length - visibleCount());
    const update = () => {
      const width = cards[0]?.getBoundingClientRect().width || 0;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      track.style.transform = `translateX(${-index * (width + gap)}px)`;
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= maxIndex();
    };
    prev?.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
    next?.addEventListener('click', () => { index = Math.min(maxIndex(), index + 1); update(); });
    window.addEventListener('resize', () => { index = Math.min(index, maxIndex()); update(); });
    update();
    if (!reduce && maxIndex()) {
      let paused = false;
      windowEl.addEventListener('mouseenter', () => paused = true);
      windowEl.addEventListener('mouseleave', () => paused = false);
      windowEl.addEventListener('focusin', () => paused = true);
      windowEl.addEventListener('focusout', () => paused = false);
      timer = setInterval(() => {
        if (paused || document.hidden) return;
        if (index >= maxIndex()) { clearInterval(timer); return; }
        index += 1; update();
      }, track.classList.contains('media-track') ? 3500 : 6000);
    }
  });
})();
