/* UNIVERSA — interacciones v1 */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Campo de estrellas ---------- */
  var starsHost = document.getElementById('stars');
  if (starsHost) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 70; i++) {
      var s = document.createElement('span');
      s.className = 'star';
      s.style.left = (Math.random() * 100).toFixed(2) + '%';
      s.style.top = (Math.random() * 70).toFixed(2) + '%';
      var size = Math.random() < 0.15 ? 3 : 2;
      s.style.width = s.style.height = size + 'px';
      s.style.setProperty('--tw', (Math.random() * 5).toFixed(2) + 's');
      frag.appendChild(s);
    }
    starsHost.appendChild(frag);
  }

  /* ---------- Header al hacer scroll ---------- */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menú móvil ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Carrusel de proyectos ---------- */
  var viewport = document.getElementById('projViewport');
  var prev = document.getElementById('projPrev');
  var next = document.getElementById('projNext');
  if (viewport && prev && next) {
    var step = function () {
      var card = viewport.querySelector('.proj');
      return card ? card.getBoundingClientRect().width + 22 : 350;
    };
    prev.addEventListener('click', function () {
      viewport.scrollBy({ left: -step(), behavior: reducedMotion ? 'auto' : 'smooth' });
    });
    next.addEventListener('click', function () {
      viewport.scrollBy({ left: step(), behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Parallax suave con el puntero ---------- */
  var fine = window.matchMedia('(pointer: fine)').matches;
  var layers = document.querySelectorAll('[data-depth]');
  if (fine && !reducedMotion && layers.length) {
    var targetX = 0, targetY = 0, curX = 0, curY = 0, raf = null;

    var render = function () {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      layers.forEach(function (el) {
        var d = parseFloat(el.dataset.depth) || 0;
        el.style.setProperty('--par-x', (curX * d).toFixed(2) + 'px');
        el.style.setProperty('--par-y', (curY * d).toFixed(2) + 'px');
      });
      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        raf = requestAnimationFrame(render);
      } else {
        raf = null;
      }
    };

    window.addEventListener('pointermove', function (e) {
      targetX = (e.clientX / window.innerWidth - 0.5);
      targetY = (e.clientY / window.innerHeight - 0.5);
      if (!raf) raf = requestAnimationFrame(render);
    }, { passive: true });
  }
  /* ---------- Tiles bento: glow, tilt 3D y chispas ---------- */
  var tiles = document.querySelectorAll('.btiles .tile');
  if (tiles.length) {
    tiles.forEach(function (tile, i) {
      tile.style.setProperty('--beam-delay', (i * -0.65).toFixed(2) + 's');
      var glow = document.createElement('span');
      glow.className = 't-glow';
      tile.appendChild(glow);
    });

    if (fine && !reducedMotion) {
      tiles.forEach(function (tile) {
        tile.addEventListener('pointermove', function (e) {
          var r = tile.getBoundingClientRect();
          var x = e.clientX - r.left, y = e.clientY - r.top;
          tile.style.setProperty('--mx', x + 'px');
          tile.style.setProperty('--my', y + 'px');
          tile.style.setProperty('--ry', (((x / r.width) - 0.5) * 7).toFixed(2) + 'deg');
          tile.style.setProperty('--rx', ((0.5 - (y / r.height)) * 7).toFixed(2) + 'deg');
        });
        tile.addEventListener('pointerleave', function () {
          tile.style.setProperty('--rx', '0deg');
          tile.style.setProperty('--ry', '0deg');
        });
      });
    }

    /* Fábrica de chispas */
    var makeSpark = function (tile, xPct, yPct, dx, dy, life, color) {
      var s = document.createElement('span');
      s.className = 'spark';
      s.style.left = xPct + '%';
      s.style.top = yPct + '%';
      s.style.setProperty('--dx', dx.toFixed(1) + 'px');
      s.style.setProperty('--dy', dy.toFixed(1) + 'px');
      s.style.setProperty('--life', life.toFixed(2) + 's');
      if (color) s.style.setProperty('--sc', color);
      s.addEventListener('animationend', function () { s.remove(); });
      tile.appendChild(s);
    };

    /* Chispas: nacen en el punto de iluminación de cada tile */
    var hosts = Array.prototype.filter.call(tiles, function (t) { return t.dataset.sparks; });
    var spawn = function (tile, burst) {
      if (tile.querySelectorAll('.spark').length > 7) return;
      var pos = tile.dataset.sparks.split(',');
      var a = Math.random() * Math.PI * 2;
      var d = 22 + Math.random() * 40;
      makeSpark(tile, +pos[0], +pos[1], Math.cos(a) * d, Math.sin(a) * d - 16,
                burst ? 0.9 : 1.3 + Math.random(), tile.dataset.sparkColor || '');
    };
    if (!reducedMotion && hosts.length) {
      setInterval(function () {
        if (document.hidden) return;
        spawn(hosts[Math.floor(Math.random() * hosts.length)]);
      }, 280);
      hosts.forEach(function (tile) {
        tile.addEventListener('pointerenter', function () {
          for (var k = 0; k < 5; k++) setTimeout(function () { spawn(tile, true); }, k * 70);
        });
      });
    }

    /* Energía en las esquinas: descargas sincronizadas con el haz del borde.
       El punto brillante del haz va a (--bang + 78°); las esquinas están a
       45°, 135°, 225° y 315°. Se calcula la fase exacta de cada golpe. */
    if (!reducedMotion) {
      var BEAM_T = 5.5;
      var cornerBurst = function (tile, x, y) {
        var col = 'rgb(' + getComputedStyle(tile).getPropertyValue('--beam').trim() + ')';
        var f = document.createElement('span');
        f.className = 'c-flash';
        f.style.left = x + '%';
        f.style.top = y + '%';
        f.addEventListener('animationend', function () { f.remove(); });
        tile.appendChild(f);
        var sx = x < 50 ? 1 : -1, sy = y < 50 ? 1 : -1;
        for (var k = 0; k < 3; k++) {
          makeSpark(tile, x, y,
            sx * (12 + Math.random() * 34) + (Math.random() - 0.5) * 14,
            sy * (12 + Math.random() * 34) + (Math.random() - 0.5) * 14,
            0.8 + Math.random() * 0.5, col);
        }
      };
      var corners = [
        { a: 45, x: 96, y: 4 }, { a: 135, x: 96, y: 96 },
        { a: 225, x: 4, y: 96 }, { a: 315, x: 4, y: 4 }
      ];
      var sched = [];
      tiles.forEach(function (tile, i) {
        corners.forEach(function (c) {
          var phase = (((c.a - 78) % 360 + 360) % 360) / 360 * BEAM_T + i * -0.65;
          phase = ((phase % BEAM_T) + BEAM_T) % BEAM_T;
          sched.push({ tile: tile, x: c.x, y: c.y, phase: phase, last: -1 });
        });
      });
      var t0 = performance.now() / 1000;
      setInterval(function () {
        if (document.hidden) return;
        var t = performance.now() / 1000 - t0;
        sched.forEach(function (e) {
          var cyc = Math.floor((t - e.phase) / BEAM_T);
          if (cyc >= 0 && cyc !== e.last) {
            var late = (t - e.phase) % BEAM_T;
            e.last = cyc;
            if (late < 0.35) cornerBurst(e.tile, e.x, e.y);
          }
        });
      }, 130);
    }
    /* Punto de dato que recorre la línea del gráfico (rápido al centro, lento en los extremos) */
    var trackPath = document.querySelector('path[data-track]');
    if (trackPath) {
      var tTile = trackPath.closest('.tile');
      var dot = tTile && tTile.querySelector('.t-dot');
      var chip = tTile && tTile.querySelector('.t-chip');
      if (dot) {
        var vb = trackPath.ownerSVGElement.viewBox.baseVal;
        var len = trackPath.getTotalLength();
        var place = function (u) {
          var p = trackPath.getPointAtLength(len * u);
          var x = p.x / vb.width * 100, y = p.y / vb.height * 100;
          dot.style.left = x + '%';
          dot.style.top = y + '%';
          if (chip) {
            chip.style.left = Math.min(Math.max(x - 7, 4), 64) + '%';
            chip.style.top = (y - 15) + '%';
          }
        };
        if (reducedMotion) {
          place(0.38);
        } else {
          var dotT0 = performance.now();
          var dotLoop = function (now) {
            var u = 0.5 + 0.36 * Math.sin((now - dotT0) / 1000 * 0.7);
            place(u);
            requestAnimationFrame(dotLoop);
          };
          requestAnimationFrame(dotLoop);
        }
      }
    }
  }

  /* ---------- Selectores energizados: la energía viaja de celda en celda ---------- */
  var selStages = document.querySelectorAll('.selgrid__stage, .ledgrid__track');
  selStages.forEach(function (stage, s) {
    var cells = stage.querySelectorAll('.sg-cell, .lg-cell');
    if (!cells.length) return;
    var idx = s % 2 ? 4 : 1;
    var dir = s % 2 ? -1 : 1;
    var apply = function () {
      stage.style.setProperty('--sel', idx);
      cells.forEach(function (c, i) { c.classList.toggle('is-on', i === idx); });
    };
    apply();
    if (!reducedMotion) {
      setInterval(function () {
        if (document.hidden) return;
        idx += dir;
        if (idx >= cells.length - 1 || idx <= 0) dir *= -1;
        apply();
      }, 1500);
    }
  });
})();