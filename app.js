const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Header solidify on scroll
    const header = document.getElementById('site-header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile nav toggle
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.innerHTML = open ? '<svg class="ic"><use href="#ic-close"/></svg>' : '<svg class="ic"><use href="#ic-menu"/></svg>';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      toggle.innerHTML = '<svg class="ic"><use href="#ic-menu"/></svg>';
    }));

    // Scroll reveal (staggered)
    const revObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = Math.min(idx, 6) * 80 + 'ms';
          entry.target.classList.add('visible');
          revObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => revObserver.observe(el));

    // Count-up stats
    function animateCount(el) {
      const target = parseInt(el.dataset.target, 10);
      if (reduceMotion) { el.textContent = target; return; }
      const duration = 1500, start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    }
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { animateCount(entry.target); statObserver.unobserve(entry.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('.count').forEach(el => statObserver.observe(el));

    // Hero lion parallax (mouse + scroll)
    const lion = document.getElementById('hero-lion');
    if (lion && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 22;
        const dy = (e.clientY / window.innerHeight - 0.5) * 22;
        lion.querySelector('img').style.transform = `translate(${dx}px, ${dy}px)`;
      }, { passive: true });
    }

    // Card spotlight follows cursor
    if (!reduceMotion) {
      document.querySelectorAll('.glow-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
      });
    }

    // Ember particles
    const embers = document.getElementById('embers');
    if (embers && !reduceMotion) {
      for (let i = 0; i < 14; i++) {
        const s = document.createElement('span');
        s.className = 'ember';
        s.style.left = (Math.random() * 100) + '%';
        s.style.animationDuration = (7 + Math.random() * 8) + 's';
        s.style.animationDelay = (Math.random() * 8) + 's';
        const sc = 0.5 + Math.random() * 1.2;
        s.style.width = s.style.height = (sc * 5) + 'px';
        embers.appendChild(s);
      }
    }

    // Scroll progress bar
    const bar = document.getElementById('scroll-progress');
    const updateBar = () => { const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; bar.style.width = (max > 0 ? (h.scrollTop / max * 100) : 0) + '%'; };
    updateBar(); window.addEventListener('scroll', updateBar, { passive: true });

    const finePointer = window.matchMedia('(pointer:fine)').matches;

    // Device 3D tilt
    const device = document.getElementById('device');
    if (device && !reduceMotion && finePointer) {
      const stage = device.closest('.device-stage');
      stage.addEventListener('mousemove', (e) => {
        const r = stage.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -9;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 12;
        device.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      stage.addEventListener('mouseleave', () => { device.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
    }

    // Magnetic buttons
    if (!reduceMotion && finePointer) {
      document.querySelectorAll('.btn-gold, .form-submit, .nav-cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
      });
    }

    // Starfield parallax + hero lion scroll drift
    const stars = document.querySelectorAll('.starfield');
    const heroLion = document.getElementById('hero-lion');
    if ((stars.length || heroLion) && !reduceMotion) {
      const parallax = () => {
        stars.forEach(s => { const r = s.parentElement.getBoundingClientRect(); s.style.transform = `translateY(${r.top * -0.12}px)`; });
        if (heroLion && window.innerWidth > 1024) { const y = window.scrollY; heroLion.style.transform = `translateY(${y * 0.09}px) scale(${Math.max(0.9, 1 - y * 0.00006)})`; }
      };
      parallax(); window.addEventListener('scroll', parallax, { passive: true });
    }

    // Global cursor spotlight
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && !reduceMotion && finePointer) {
      let cx = 0, cy = 0, shown = false, ticking = false;
      window.addEventListener('mousemove', (e) => {
        cx = e.clientX; cy = e.clientY;
        if (!shown) { cursorGlow.style.opacity = '1'; shown = true; }
        if (!ticking) { ticking = true; requestAnimationFrame(() => { cursorGlow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`; ticking = false; }); }
      }, { passive: true });
      document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; shown = false; });
    }

    // Process connector line draw-in
    const steps = document.querySelector('.steps');
    if (steps) {
      const stepObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { steps.classList.add('drawn'); stepObs.unobserve(steps); } });
      }, { threshold: 0.35 });
      stepObs.observe(steps);
    }

    // Back to top
    const toTop = document.getElementById('to-top');
    if (toTop) {
      window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 700), { passive: true });
      toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
    }

    // FAQ accordion
    document.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q'), a = item.querySelector('.faq-a');
      q.addEventListener('click', () => {
        const open = item.classList.toggle('open');
        q.setAttribute('aria-expanded', open);
        a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
      });
    });

    // Nav scroll-spy
    const navLinks = [...document.querySelectorAll('.nav a')].filter(a => { const h = a.getAttribute('href'); return h && h.startsWith('#') && !a.classList.contains('nav-cta'); });
    const spySections = ['services', 'work', 'problems', 'about', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
    if (spySections.length) {
      const spyObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { const id = entry.target.id; navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id)); }
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      spySections.forEach(s => spyObs.observe(s));
      window.addEventListener('scroll', () => { if (window.scrollY < 400) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#top')); }, { passive: true });
    }

    // AJAX contact form
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        const nameF = form.querySelector('[name="name"]'), emailF = form.querySelector('[name="email"]');
        let ok = true;
        [nameF, emailF].forEach(f => { f.classList.remove('field-error'); if (!f.value.trim()) { f.classList.add('field-error'); ok = false; } });
        if (emailF.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailF.value)) { emailF.classList.add('field-error'); ok = false; }
        e.preventDefault();
        if (!ok) { nameF.value.trim() ? emailF.focus() : nameF.focus(); return; }
        const btn = form.querySelector('.form-submit'), orig = btn.innerHTML;
        btn.disabled = true; btn.textContent = 'Sending…';
        try {
          const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
          if (!res.ok) throw new Error('bad');
          form.style.display = 'none';
          document.getElementById('form-success').classList.add('show');
        } catch (err) {
          btn.disabled = false; btn.innerHTML = orig; form.submit();
        }
      });
    }

    // Portfolio lightbox
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      const lbImg = document.getElementById('lb-img'), lbCat = document.getElementById('lb-cat'),
            lbTitle = document.getElementById('lb-title'), lbDesc = document.getElementById('lb-desc'),
            lbClose = document.getElementById('lb-close'), lbLive = document.getElementById('lb-live');
      let lastFocus = null;
      const decode = (s) => { const t = document.createElement('textarea'); t.innerHTML = s; return t.value; };
      const openLb = (card) => {
        lbImg.src = card.dataset.img; lbImg.alt = decode(card.dataset.title);
        lbCat.textContent = decode(card.dataset.cat); lbTitle.textContent = decode(card.dataset.title);
        lbDesc.textContent = decode(card.dataset.desc);
        if (card.dataset.live) { lbLive.href = card.dataset.live; lbLive.classList.add('show'); }
        else { lbLive.classList.remove('show'); lbLive.removeAttribute('href'); }
        lightbox.classList.add('open'); document.body.style.overflow = 'hidden';
        lastFocus = card; lbClose.focus();
      };
      const closeLb = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); };
      document.querySelectorAll('.work-card').forEach(c => c.addEventListener('click', () => openLb(c)));
      lbClose.addEventListener('click', closeLb);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLb(); });
    }

    // Portfolio filter
    const filterBar = document.getElementById('work-filters');
    if (filterBar) {
      const cards = [...document.querySelectorAll('.work-card')];
      filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.wf'); if (!btn) return;
        filterBar.querySelectorAll('.wf').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        cards.forEach(c => c.classList.toggle('hide', f !== 'all' && c.dataset.filter !== f));
      });
    }

    // Free-audit CTA pre-selects the audit option in the contact form
    const auditCta = document.getElementById('audit-cta');
    if (auditCta) {
      auditCta.addEventListener('click', () => {
        const sel = document.getElementById('service');
        if (sel) sel.value = "I'd like a free website audit";
      });
    }

    // Sticky mobile quote bar
    const mcta = document.getElementById('mobile-cta');
    if (mcta) {
      window.addEventListener('scroll', () => {
        const nearBottom = window.innerHeight + window.scrollY > document.body.offsetHeight - 240;
        mcta.classList.toggle('show', window.scrollY > 600 && !nearBottom);
      }, { passive: true });
    }
