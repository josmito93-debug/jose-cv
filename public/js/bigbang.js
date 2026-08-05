/* ============================================================
   UNIVERSA — BIG BANG™ · motor
   Canvas del universo (partícula → explosión → estrellas),
   máquina de fases, progreso, chips, persistencia y envío.
   ============================================================ */
(function () {
  'use strict';

  var reducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Estado ---------- */
  var PHASES = 8; /* 0 intro · 1..7 fases · 8 final */
  var STARS_AT = [0, 60, 110, 150, 180, 205, 235, 265, 300];
  var state = { phase: 0, max: 0, answers: {}, canales: [] };

  var store = {
    get: function () {
      try { return JSON.parse(localStorage.getItem('universa-bigbang') || 'null'); }
      catch (e) { return null; }
    },
    set: function () {
      try { localStorage.setItem('universa-bigbang', JSON.stringify(state)); }
      catch (e) { /* memoria solamente */ }
    },
    clear: function () {
      try { localStorage.removeItem('universa-bigbang'); } catch (e) {}
    }
  };

  /* ---------- Canvas: el universo ---------- */
  var canvas = document.getElementById('bbCanvas');
  var ctx = canvas.getContext('2d');
  var stars = [];
  var burst = [];
  var W = 0, H = 0, DPR = 1;
  var exploded = false;

  var resize = function () {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (reducedMotion) draw(performance.now());
  };

  var rand = function (a, b) { return a + Math.random() * (b - a); };

  var spawnStars = function (n) {
    for (var i = 0; i < n; i++) {
      var violet = Math.random() < 0.12;
      stars.push({
        x: Math.random(), y: Math.random(),
        r: rand(0.5, 1.7),
        tw: rand(0, Math.PI * 2),
        sp: rand(0.4, 1.4),
        a: rand(0.25, 0.9),
        born: performance.now(),
        c: violet ? '167, 137, 255' : '207, 238, 224'
      });
    }
  };

  var ensureStars = function (target) {
    if (stars.length < target) spawnStars(target - stars.length);
  };

  var explode = function (x, y, count, spread) {
    if (reducedMotion) return;
    for (var i = 0; i < count; i++) {
      var ang = Math.random() * Math.PI * 2;
      var sp = rand(1, spread);
      var pick = Math.random();
      burst.push({
        x: x, y: y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        life: 1,
        decay: rand(0.008, 0.02),
        r: rand(0.8, 2.6),
        c: pick < 0.14 ? '167, 137, 255' : (pick < 0.5 ? '234, 255, 244' : '140, 245, 198')
      });
    }
  };

  var draw = function (t) {
    ctx.clearRect(0, 0, W, H);

    /* Fase 0: una sola partícula esperando */
    if (state.phase === 0 && !exploded) {
      var p = reducedMotion ? 1 : (0.72 + 0.28 * Math.sin(t / 520));
      var cx = W / 2, cy = H * 0.5;
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26 * p);
      g.addColorStop(0, 'rgba(234,255,244,0.95)');
      g.addColorStop(0.25, 'rgba(140,245,198,0.6)');
      g.addColorStop(1, 'rgba(140,245,198,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, 26 * p, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(234,255,244,1)';
      ctx.beginPath();
      ctx.arc(cx, cy, 2.4 * p + 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Estrellas */
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var fade = Math.min(1, (t - s.born) / 1400);
      var twinkle = reducedMotion ? 1 : (0.6 + 0.4 * Math.sin(s.tw + t / (900 / s.sp)));
      ctx.fillStyle = 'rgba(' + s.c + ',' + (s.a * fade * twinkle).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Partículas de explosión */
    for (var k = burst.length - 1; k >= 0; k--) {
      var b = burst[k];
      b.x += b.vx; b.y += b.vy;
      b.vx *= 0.985; b.vy *= 0.985;
      b.life -= b.decay;
      if (b.life <= 0) { burst.splice(k, 1); continue; }
      ctx.fillStyle = 'rgba(' + b.c + ',' + b.life.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * b.life, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  var loop = function (t) {
    draw(t);
    requestAnimationFrame(loop);
  };

  window.addEventListener('resize', resize);
  resize();
  if (!reducedMotion) {
    requestAnimationFrame(loop);
  } else {
    /* estático: redibuja solo en cambios de fase */
    draw(performance.now());
  }

  /* ---------- Vistas y progreso ---------- */
  var views = document.querySelectorAll('.bb-view');
  var progress = document.getElementById('bbProgress');
  var nodes = progress.querySelectorAll('.bb-node');
  var links = progress.querySelectorAll('.bb-linkline');

  var showView = function (p) {
    views.forEach(function (v) {
      var on = Number(v.dataset.view) === p;
      if (on) {
        v.classList.remove('is-in');
        void v.offsetWidth;
        v.classList.add('is-in');
      } else {
        v.classList.remove('is-in');
      }
    });
  };

  var paintProgress = function () {
    progress.hidden = state.phase === 0;
    nodes.forEach(function (n, i) {
      var ph = i + 1;
      n.classList.toggle('is-done', ph < state.phase || state.phase === PHASES);
      n.classList.toggle('is-now', ph === state.phase && state.phase !== PHASES);
      n.disabled = !(ph <= state.max && ph !== state.phase);
    });
    links.forEach(function (l, i) {
      l.classList.toggle('is-done', i + 1 < state.phase || state.phase === PHASES);
    });
  };

  var paintLayers = function () {
    document.querySelectorAll('[data-at]').forEach(function (el) {
      el.classList.toggle('is-live', state.phase >= Number(el.dataset.at));
    });
  };

  var setPhase = function (p, opts) {
    opts = opts || {};
    state.phase = p;
    state.max = Math.max(state.max, p);
    document.body.dataset.phase = String(p);
    ensureStars(STARS_AT[Math.min(p, STARS_AT.length - 1)]);
    showView(p);
    paintProgress();
    paintLayers();
    if (!opts.silent && p > 0 && !reducedMotion) {
      explode(W / 2, H * 0.32, p === PHASES ? 160 : 26, p === PHASES ? 7 : 3.5);
    }
    if (reducedMotion) draw(performance.now());
    store.set();
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  /* ---------- Respuestas ---------- */
  var collect = function () {
    document.querySelectorAll('[data-k]').forEach(function (el) {
      state.answers[el.dataset.k] = el.value ? el.value.trim() : '';
    });
    store.set();
  };
  var hydrate = function () {
    document.querySelectorAll('[data-k]').forEach(function (el) {
      if (state.answers[el.dataset.k]) el.value = state.answers[el.dataset.k];
    });
    chips.forEach(function (c) {
      c.classList.toggle('is-on', state.canales.indexOf(c.dataset.chip) !== -1);
      c.setAttribute('aria-pressed', c.classList.contains('is-on') ? 'true' : 'false');
    });
  };

  /* chips de canales */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  chips.forEach(function (c) {
    c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', function () {
      var name = c.dataset.chip;
      var i = state.canales.indexOf(name);
      if (i === -1) state.canales.push(name); else state.canales.splice(i, 1);
      c.classList.toggle('is-on', i === -1);
      c.setAttribute('aria-pressed', i === -1 ? 'true' : 'false');
      store.set();
    });
  });

  /* ---------- Navegación ---------- */
  document.getElementById('bbStart').addEventListener('click', function () {
    exploded = true;
    if (!reducedMotion) {
      explode(W / 2, H * 0.5, 220, 8);
      setTimeout(function () { setPhase(1, { silent: true }); }, 620);
    } else {
      setPhase(1, { silent: true });
    }
  });

  document.querySelectorAll('[data-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      collect();
      setPhase(Number(btn.dataset.next));
    });
  });
  document.querySelectorAll('[data-prev]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      collect();
      setPhase(Number(btn.dataset.prev), { silent: true });
    });
  });
  nodes.forEach(function (n) {
    n.addEventListener('click', function () {
      var go = Number(n.dataset.go);
      if (go <= state.max) { collect(); setPhase(go, { silent: true }); }
    });
  });

  /* ---------- Compilación y envío ---------- */
  var LABELS = {
    empresa: 'Empresa', origen: 'Por qué nació / problema', mision: 'Misión y valores',
    adn_edad: 'Edad y forma de hablar', adn_personalidad: 'Personalidad', adn_palabras: 'Palabras siempre / jamás',
    competidores: 'Competidores', comp_bienmal: 'Qué hacen bien / mal', admiras: 'Marcas que admira',
    porque_tu: 'Por qué comprarle', promesa: 'Promesa y experiencia', recompra: 'Por qué volverían',
    descubre: 'Cómo lo descubren', frenos: 'Dudas y frenos', postventa: 'Postventa y fidelización',
    canales_top: 'Canales que mejor funcionan', canales_nunca: 'Canales sin usar',
    meta_1_5: 'Meta a 1 y 5 años', exito: 'Éxito extraordinario',
    num_clientes: 'Clientes / mes', num_ticket: 'Ticket promedio', num_inversion: 'Inversión actual',
    invertir: 'Dispuesto a invertir',
    contacto_nombre: 'Nombre', contacto_email: 'Email'
  };
  var GROUPS = [
    ['Fase 01 · El Núcleo', ['empresa', 'origen', 'mision']],
    ['Fase 02 · ADN de Marca', ['adn_edad', 'adn_personalidad', 'adn_palabras']],
    ['Fase 03 · El Universo', ['competidores', 'comp_bienmal', 'admiras']],
    ['Fase 04 · La Gravedad', ['porque_tu', 'promesa', 'recompra']],
    ['Fase 05 · La Órbita', ['descubre', 'frenos', 'postventa']],
    ['Fase 06 · Las Constelaciones', ['canales_top', 'canales_nunca']],
    ['Fase 07 · La Expansión', ['meta_1_5', 'exito', 'num_clientes', 'num_ticket', 'num_inversion', 'invertir']],
    ['Contacto', ['contacto_nombre', 'contacto_email']]
  ];

  var compile = function () {
    collect();
    var out = ['BIG BANG\u2122 \u2014 ' + (state.answers.empresa || 'Nueva marca'), ''];
    GROUPS.forEach(function (g) {
      var lines = [];
      g[1].forEach(function (k) {
        if (state.answers[k]) lines.push('\u2022 ' + LABELS[k] + ': ' + state.answers[k]);
      });
      if (g[0] === 'Fase 06 · Las Constelaciones' && state.canales.length) {
        lines.unshift('\u2022 Canales: ' + state.canales.join(', '));
      }
      if (lines.length) out.push(g[0], lines.join('\n'), '');
    });
    return out.join('\n');
  };

  var feedback = document.getElementById('bbFeedback');
  var say = function (msg) {
    feedback.textContent = msg;
    setTimeout(function () { feedback.textContent = ''; }, 4200);
  };

  document.getElementById('bbSend').addEventListener('click', function () {
    var text = compile();
    var subject = 'Big Bang\u2122 \u2014 ' + (state.answers.empresa || state.answers.contacto_nombre || 'Nueva marca');
    window.location.href =
      'mailto:info@universaagency.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(text);
    say('Abriendo tu correo\u2026 si no se abre, usa \u201cCopiar respuestas\u201d.');
  });

  document.getElementById('bbCopy').addEventListener('click', function () {
    var text = compile();
    var done = function () { say('Mapa copiado. P\u00e9galo donde quieras \u2728'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
    } else {
      fallback(text); done();
    }
    function fallback(t) {
      var ta = document.createElement('textarea');
      ta.value = t;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      ta.remove();
    }
  });

  document.getElementById('bbRestart').addEventListener('click', function () {
    store.clear();
    state.phase = 0; state.max = 0; state.answers = {}; state.canales = [];
    document.querySelectorAll('[data-k]').forEach(function (el) { el.value = ''; });
    chips.forEach(function (c) { c.classList.remove('is-on'); c.setAttribute('aria-pressed', 'false'); });
    stars = []; burst = []; exploded = false;
    setPhase(0, { silent: true });
  });

  /* ---------- Arranque: restaurar sesión si existe ---------- */
  var saved = store.get();
  if (saved && saved.phase > 0) {
    state.phase = saved.phase;
    state.max = saved.max || saved.phase;
    state.answers = saved.answers || {};
    state.canales = saved.canales || [];
    exploded = true;
    hydrate();
    ensureStars(STARS_AT[Math.min(state.phase, STARS_AT.length - 1)]);
    setPhase(state.phase, { silent: true });
  } else {
    setPhase(0, { silent: true });
  }
})();
