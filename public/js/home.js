/* ============================================================
   UNIVERSA — HOME v2 · lógica
   TUM (Teoría del Universo de Marca™), secuenciador Big Bang™
   y formulario de contacto.
   ============================================================ */
(function () {
  'use strict';

  var reducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 02 · TUM: capas en órbita ---------- */
  var tum = document.getElementById('tum');
  if (tum) {
    var layers = tum.querySelectorAll('.tum-layer');
    var items = tum.querySelectorAll('.tum-item');
    var idx = 0;
    var timer = null;
    var HOLD = 3200;

    var setLayer = function (i) {
      idx = i;
      layers.forEach(function (layer) {
        layer.classList.toggle('is-hot', Number(layer.dataset.l) === i + 1);
      });
      items.forEach(function (btn, k) {
        btn.classList.toggle('is-on', k === i);
        btn.setAttribute('aria-pressed', k === i ? 'true' : 'false');
      });
    };

    var start = function () {
      if (reducedMotion || timer) return;
      timer = setInterval(function () {
        setLayer((idx + 1) % items.length);
      }, HOLD);
    };
    var stop = function () {
      clearInterval(timer);
      timer = null;
    };

    items.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        setLayer(i);
        stop();
        start();
      });
      btn.addEventListener('pointerenter', function () { setLayer(i); });
    });

    tum.addEventListener('pointerenter', stop);
    tum.addEventListener('pointerleave', start);

    setLayer(0);
    start();
  }

  /* ---------- 03 · Big Bang™: ignición secuencial ---------- */
  var bbm = document.getElementById('bbm');
  if (bbm) {
    var stages = bbm.querySelectorAll('.bbm-stage');
    var setStage = function (i) {
      stages.forEach(function (s, k) {
        s.classList.toggle('is-on', k === i);
      });
    };

    if (reducedMotion || !stages.length) {
      setStage(0);
    } else {
      var CYCLE = 12500;                     /* pulso: 10 s de viaje + 2.5 s de reposo */
      var IGNITE = [0, 2500, 5000, 7500, 10000]; /* el frente del pulso toca cada nodo */
      var pulse = bbm.querySelector('.bbm-wire-pulse');
      var pending = [];

      var runCycle = function () {
        if (pulse) {
          pulse.classList.remove('is-run');
          void pulse.getBoundingClientRect(); /* reinicio determinista */
          pulse.classList.add('is-run');
        }
        pending.forEach(clearTimeout);
        pending = IGNITE.map(function (t, k) {
          return setTimeout(function () { setStage(k); }, t);
        });
      };

      runCycle();
      setInterval(runCycle, CYCLE);
    }
  }

  /* ---------- 08 · Contacto: mailto ---------- */
  var form = document.getElementById('bbForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
      };
      var subject = 'Big Bang\u2122 \u2014 ' + (val('f-marca') || val('f-nombre') || 'Nueva marca');
      var body =
        'Nombre: ' + val('f-nombre') + '\n' +
        'Email: ' + val('f-email') + '\n' +
        'Marca: ' + val('f-marca') + '\n\n' +
        val('f-msg');
      window.location.href =
        'mailto:info@universaagency.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------- 01 · Tarjetas de servicio: tilt suave ---------- */
  var scards = document.querySelectorAll('.scard');
  if (scards.length && !reducedMotion &&
      window.matchMedia('(pointer: fine)').matches) {
    scards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        card.style.transform =
          'translateY(-7px) perspective(900px) rotateX(' + rx.toFixed(2) +
          'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Nav premium: progreso + spark + spy + megamenú ---------- */
  var header = document.getElementById('header');
  var navEl = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  if (header && navEl) {
    var navLinks = Array.prototype.slice.call(navEl.querySelectorAll(':scope > a'));
    navLinks.forEach(function (a, i) { a.style.setProperty('--i', i); });

    /* CTA + correo del pie del menú */
    var meta = document.createElement('div');
    meta.className = 'nav__meta';
    meta.innerHTML =
      '<a class="btn btn--light" href="bigbang.html">Iniciar Big Bang\u2122</a>' +
      '<a class="nav__mail" href="mailto:info@universaagency.com">info@universaagency.com</a>';

    /* — Megamenú premium (móvil) — */
    var mm = document.createElement('div');
    mm.className = 'mm';
    var mmLinks = document.createElement('div');
    mmLinks.className = 'mm__links';
    var SUBS = [
      ['Google SEO', 'La visibilidad se construye.', 'servicios/google-seo.html'],
      ['Web Develop', 'Organismos que convierten.', 'servicios/web-develop.html'],
      ['Meta Ads', 'Publicidad con hipótesis.', 'servicios/meta-ads.html'],
      ['Graphic Design', 'Comunica antes de leerse.', 'servicios/graphic-design.html']
    ];
    var mmCard = function (s) {
      return '<a class="mm-card" href="' + s[2] + '">' +
        '<span class="mm-card__tex" aria-hidden="true"></span>' +
        '<strong>' + s[0] + '</strong><em>' + s[1] + '</em>' +
        '<i aria-hidden="true">\u2192</i></a>';
    };

    /* Servicios primero, ya desplegado; el resto sin numerar */
    var mmGrp = document.createElement('div');
    mmGrp.className = 'mm-grp is-open';
    mmGrp.style.setProperty('--i', 0);
    mmGrp.innerHTML =
      '<button class="mm-grp__btn" type="button" aria-expanded="true">' +
      '<span>Servicios</span><i class="mm-grp__chev" aria-hidden="true"></i></button>' +
      '<div class="mm-grp__panel"><div class="mm-grp__clip">' +
      '<div class="mm-grp__grid">' + SUBS.map(mmCard).join('') + '</div>' +
      '<a class="mm-grp__all" href="#laboratorios">Ver los 8 laboratorios \u2192</a>' +
      '</div></div>';
    mmLinks.appendChild(mmGrp);
    var mmIdx = 1;
    navLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#laboratorios') return;
      var c = a.cloneNode(true);
      c.className = 'mm__link';
      c.style.setProperty('--i', mmIdx++);
      mmLinks.appendChild(c);
    });
    mm.appendChild(mmLinks);
    var mmFoot = document.createElement('div');
    mmFoot.className = 'mm__foot';
    mmFoot.appendChild(meta);
    mm.appendChild(mmFoot);
    navEl.appendChild(mm);

    var grpBtn = mm.querySelector('.mm-grp__btn');
    if (grpBtn) {
      grpBtn.addEventListener('click', function () {
        var on = grpBtn.parentNode.classList.toggle('is-open');
        grpBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
    }

    /* barra de progreso de scroll */
    var prog = document.createElement('span');
    prog.className = 'header__progress';
    header.appendChild(prog);

    /* spark bajo los enlaces (desktop) */
    var spark = document.createElement('span');
    spark.className = 'nav__spark';
    navEl.appendChild(spark);
    var activeLink = null;
    var sparkTo = function (link) {
      if (!link) { spark.classList.remove('is-live'); return; }
      spark.style.width = link.offsetWidth + 'px';
      spark.style.transform = 'translateX(' + link.offsetLeft + 'px)';
      spark.classList.add('is-live');
    };
    navLinks.forEach(function (a) {
      a.addEventListener('pointerenter', function () { sparkTo(a); });
    });
    navEl.addEventListener('pointerleave', function () { sparkTo(activeLink); });

    /* sección activa (nav + megamenú) */
    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var link = navEl.querySelector('a[href="#' + en.target.id + '"]');
          if (!link) return;
          navLinks.forEach(function (a) { a.classList.toggle('is-active', a === link); });
          document.querySelectorAll('.mm__link').forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === link.getAttribute('href'));
          });
          activeLink = link;
          if (window.matchMedia('(min-width: 769px)').matches) sparkTo(link);
        });
      }, { rootMargin: '-38% 0px -55% 0px' });
      navLinks.forEach(function (a) {
        var id = a.getAttribute('href');
        if (id && id.length > 1 && id.charAt(0) === '#') {
          var sec = document.getElementById(id.slice(1));
          if (sec) spy.observe(sec);
        }
      });
    }

    /* progreso de scroll */
    var progRaf = null;
    var progTick = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    };
    window.addEventListener('scroll', function () {
      if (progRaf) return;
      progRaf = requestAnimationFrame(function () { progRaf = null; progTick(); });
    }, { passive: true });
    progTick();

    /* bloqueo de scroll + cierre al navegar (megamenú) */
    if (navToggle) {
      navToggle.addEventListener('click', function () {
        document.body.classList.toggle('nav-locked', navEl.classList.contains('is-open'));
      });
    }
    navEl.addEventListener('click', function (e) {
      if (!e.target.closest('a')) return;
      navEl.classList.remove('is-open');
      document.body.classList.remove('nav-locked');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir men\u00fa');
      }
    });
  }

  /* ---------- Parallax de scroll ---------- */
  var plxEls = Array.prototype.slice.call(document.querySelectorAll('[data-plx]'));
  if (plxEls.length && !reducedMotion) {
    var plxMeasure = function () {
      plxEls.forEach(function (el) {
        el.style.transform = '';
        var r = el.getBoundingClientRect();
        el._plxC = r.top + window.scrollY + r.height / 2;
      });
    };
    var plxTick = function () {
      var vh = window.innerHeight;
      var mid = window.scrollY + vh / 2;
      plxEls.forEach(function (el) {
        var off = (el._plxC - mid) * parseFloat(el.dataset.plx || '0');
        var base = el.dataset.plxBase === 'center' ? 'translateX(-50%) ' : '';
        el.style.transform = base + 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });
    };
    var plxRaf = null;
    window.addEventListener('scroll', function () {
      if (plxRaf) return;
      plxRaf = requestAnimationFrame(function () { plxRaf = null; plxTick(); });
    }, { passive: true });
    window.addEventListener('resize', function () { plxMeasure(); plxTick(); });
    plxMeasure();
    plxTick();
  }

  /* ---------- Marquee infinito ---------- */
  var marqTrack = document.querySelector('.marq__track');
  if (marqTrack) { marqTrack.innerHTML += marqTrack.innerHTML; }

  /* ---------- GTEX: líneas de energía con curvas por las ranuras ---------- */
  var gtexes = document.querySelectorAll('.gtex');
  if (gtexes.length && !reducedMotion) {
    var GC = 100, RAD = 16, VEL = 118;
    gtexes.forEach(function (g) {
      g.querySelectorAll('.gtex__run').forEach(function (r, seed) {
        var dx = seed % 2 === 0 ? 1 : 0, dy = dx ? 0 : 1;
        var px = (2 + seed * 2) * GC + (dx ? GC / 2 : 0);
        var py = (2 + seed) * GC + (dy ? GC / 2 : 0);
        var mode = 'go', run = (2 + Math.random() * 3) * GC;
        var O = null, a0 = 0, sw = 1, at = 0, ndx = 0, ndy = 0;
        var vis = 1, visT = 2.5 + Math.random() * 3;
        var last = performance.now();
        var frame = function (now) {
          var dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          if (g.isConnected && !document.hidden) {
            var cols = Math.max(4, Math.floor(g.clientWidth / GC));
            var rows = Math.max(4, Math.floor(g.clientHeight / GC));
            var step = VEL * dt;
            var ang;
            if (mode === 'go') {
              px += dx * step; py += dy * step; run -= step;
              if (px < GC || px > (cols - 1) * GC) { dx *= -1; px = Math.max(GC, Math.min((cols - 1) * GC, px)); }
              if (py < GC || py > (rows - 1) * GC) { dy *= -1; py = Math.max(GC, Math.min((rows - 1) * GC, py)); }
              if (run <= 0) {
                var along = dx ? px : py;
                var next = (dx > 0 || dy > 0) ? Math.ceil(along / GC) * GC : Math.floor(along / GC) * GC;
                if (Math.abs(next - along) <= RAD) {
                  var turn = Math.random() < 0.5 ? 1 : -1;
                  ndx = dx ? 0 : turn; ndy = dx ? turn : 0;
                  var lane = dx ? py : px;                    /* carril perpendicular actual */
                  var espacio = lane + (dx ? ndy : ndx) * GC; /* ¿hay a dónde doblar? */
                  var maxLane = ((dx ? rows : cols) - 1) * GC;
                  if (espacio < GC || espacio > maxLane) { ndx *= -1; ndy *= -1; }
                  var cX = dx ? next : px, cY = dx ? py : next;
                  O = { x: cX - dx * RAD + ndx * RAD, y: cY - dy * RAD + ndy * RAD };
                  a0 = Math.atan2(cY - dy * RAD - O.y, cX - dx * RAD - O.x);
                  sw = (dx * ndy - dy * ndx) > 0 ? 1 : -1;
                  at = 0; mode = 'arc';
                }
              }
              ang = dx ? (dx > 0 ? 0 : 180) : (dy > 0 ? 90 : -90);
            } else {
              at += step / RAD;
              var lim = Math.PI / 2;
              var a = a0 + sw * Math.min(at, lim);
              px = O.x + RAD * Math.cos(a);
              py = O.y + RAD * Math.sin(a);
              ang = a * 180 / Math.PI + (sw > 0 ? 90 : -90);
              if (at >= lim) {
                dx = ndx; dy = ndy;
                mode = 'go';
                run = (2 + Math.random() * 4) * GC;
              }
            }
            visT -= dt;
            if (visT <= 0) { vis = vis ? 0 : 1; visT = vis ? 3 + Math.random() * 4 : 0.55; }
            r.style.opacity = vis;
            r.style.transform =
              'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px) rotate(' + ang.toFixed(1) + 'deg)';
          }
          requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
    });
  }

  /* ---------- Promesa: se escribe con el scroll ---------- */
  var promSec = document.getElementById('promesa');
  if (promSec) {
    var pws = [];
    promSec.querySelectorAll('.prom-line > span').forEach(function (sp) {
      var words = sp.textContent.trim().split(/\s+/);
      sp.textContent = '';
      words.forEach(function (w) {
        var el = document.createElement('span');
        el.className = 'pw';
        el.textContent = w;
        sp.appendChild(el);
        sp.appendChild(document.createTextNode(' '));
        pws.push(el);
      });
    });
    var promRaf = null;
    var promTick = function () {
      var r = promSec.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.88 - r.top) / (r.height * 0.95);
      p = Math.max(0, Math.min(1, p));
      var lit = p * (pws.length + 4);
      pws.forEach(function (w, i) {
        w.style.opacity = reducedMotion ? 1 : Math.max(0.08, Math.min(1, lit - i));
      });
    };
    window.addEventListener('scroll', function () {
      if (promRaf) return;
      promRaf = requestAnimationFrame(function () { promRaf = null; promTick(); });
    }, { passive: true });
    promTick();
  }

  /* ---------- Contacto: Iniciar ahora despliega el formulario ---------- */
  var sealCard = document.getElementById('bbForm');
  var openBtn = document.getElementById('bbOpen');
  if (sealCard && openBtn) {
    openBtn.addEventListener('click', function () {
      sealCard.classList.add('is-armed');
      openBtn.setAttribute('aria-expanded', 'true');
      setTimeout(function () {
        sealCard.classList.remove('is-sealed');
        var first = sealCard.querySelector('input');
        if (first) first.focus();
      }, reducedMotion ? 0 : 380);
    });
  }

  /* ---------- Videoplanetas: arranque garantizado + reduced-motion ---------- */
  var vplanets = document.querySelectorAll('.hero__vplanet video');
  if (vplanets.length) {
    if (reducedMotion) {
      vplanets.forEach(function (v) {
        v.removeAttribute('autoplay');
        v.addEventListener('loadeddata', function () { v.pause(); });
        v.pause();
      });
    } else {
      var kick = function () {
        vplanets.forEach(function (v) {
          v.muted = true;
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        });
      };
      kick();
      window.addEventListener('pointerdown', kick, { once: true });
      window.addEventListener('scroll', kick, { once: true, passive: true });
    }
  }
})();
