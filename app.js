/* Storyboard Styles · WPP Production
   Static, dependency-free. Hash routing (# for the index, #<slug> for a style) so it runs on GitHub Pages as is. */
(function () {
  "use strict";

  var STYLES = window.STYLES || [];
  var SCENES = window.SCENES || { car: "Street", kid: "Breakfast" };
  var EXT = window.IMAGE_EXT || "webp";
  var FRAMES = [
    { scene: "car", n: 1 }, { scene: "car", n: 2 },
    { scene: "kid", n: 1 }, { scene: "kid", n: 2 }
  ];
  var LETTER = ["A", "B"];
  var FRAMES_2 = [{ scene: "car", n: 1 }, { scene: "kid", n: 1 }];
  var FRAMES_5 = [{ scene: "car", n: 1 }, { scene: "kid", n: 1 }, { scene: "porsche", n: 1 }, { scene: "man", n: 1 }, { scene: "lake", n: 1 }];
  function framesOf(style) { return style.frames === 5 ? FRAMES_5 : style.frames === 2 ? FRAMES_2 : FRAMES; }
  function matchFrame(style, f) {
    var fs = framesOf(style), k;
    for (k = 0; k < fs.length; k++) if (fs[k].scene === f.scene && fs[k].n === f.n) return k;
    for (k = 0; k < fs.length; k++) if (fs[k].scene === f.scene) return k;
    return 0;
  }

  var state = { scene: "car", frame: 0, compare: null, lbList: [], lbIndex: 0 };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var header = $("#header"), view = $("#view");
  var TOTAL = STYLES.length;
  var WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-one", "Twenty-two", "Twenty-three", "Twenty-four", "Twenty-five", "Twenty-six", "Twenty-seven", "Twenty-eight", "Twenty-nine", "Thirty"];
  var FRAME_TOTAL = STYLES.reduce(function (t, st) { return t + framesOf(st).length; }, 0);

  /* ---------- helpers ---------- */
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function src(style, scene, n) {
    var p = "images/" + style.slug + "/" + scene + "-" + n + "." + EXT;
    return (window.IMAGE_MAP && window.IMAGE_MAP[p]) || p;
  }
  function other(scene) { return scene === "car" ? "kid" : "car"; }
  function frameLabel(f) { return SCENES[f.scene] + (window.ONE_TAKE ? "" : " " + LETTER[f.n - 1]); }
  function href(style) { return "#" + style.slug; }
  function indexOf(slug) { for (var i = 0; i < TOTAL; i++) if (STYLES[i].slug === slug) return i; return -1; }
  function img(style, scene, n, cls, alt) {
    return '<img ' + (cls ? 'class="' + cls + '" ' : "") + 'src="' + src(style, scene, n) + '" alt="' + esc(alt == null ? style.name + ", " + SCENES[scene] + " scene" : alt) + '" loading="lazy" decoding="async" width="1088" height="608">';
  }
  function preload(style) { framesOf(style).forEach(function (f) { var i = new Image(); i.src = src(style, f.scene, f.n); }); }
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, 1800);
  }

  /* ---------- header ---------- */
  var LOGO = '<a class="logo" href="#" aria-label="WPP Production, back to all styles"><img src="assets/wpp-production-logo.svg" alt="WPP Production"></a>';
  var TITLE = '<a href="#" class="title-link"><h1 class="title">Storyboard<br>Styles</h1></a>';

  function headerIndex() {
    header.innerHTML =
      '<div class="cell split span2 h-brand">' +
        '<a class="logo logo-home" href="#" aria-label="WPP Production"><img src="assets/wpp-production-logo.svg" alt="WPP Production"></a>' +
        '<h1 class="h-title">Storyboard Styles</h1>' +
      '</div>' +
      '<div class="cell tr hide-m"><span class="micro muted">' + TOTAL + " styles · " + FRAME_TOTAL + ' frames</span></div>' +
      '<div class="cell br h-desc">' +
        '<p class="micro intro intro-wide">' + (WORDS[TOTAL] || TOTAL) + ' visual languages for storyboards, animatics and key art. Choose the look of your boards.</p>' +
      '</div>';
  }

  function headerDetail(i) {
    var prev = STYLES[(i - 1 + TOTAL) % TOTAL], next = STYLES[(i + 1) % TOTAL];
    header.innerHTML =
      '<div class="cell split">' + TITLE + '<a class="micro link" href="#">← All styles</a></div>' +
      '<div class="cell split"><span class="micro muted hide-m">' + esc(STYLES[i].family) + '</span>' + LOGO + '</div>' +
      '<div class="cell tr"><span class="micro" style="font-variant-numeric:tabular-nums">' + pad(i + 1) + " / " + pad(TOTAL) + '</span></div>' +
      '<div class="cell br">' +
        '<span class="micro"><a class="link" href="' + href(prev) + '" aria-label="Previous style: ' + esc(prev.name) + '">Previous</a>&nbsp;&nbsp;&nbsp;<a class="link" href="' + href(next) + '" aria-label="Next style: ' + esc(next.name) + '">Next</a></span>' +
      '</div>';
  }

  /* ---------- index view ---------- */
  // Row templates on a 4 column grid. Each keeps a style's name next to its own frames.
  function label(s, i, align, withCta) {
    return '<a class="cell ' + align + ' item" data-item="' + i + '" href="' + href(s) + '">' +
      '<span class="micro num">' + pad(i + 1) + '</span>' +
      '<h2 class="name">' + esc(s.name) + '</h2>' +
      '<span class="micro fam">' + esc(s.family) + '</span>' +
      (withCta ? '<span class="micro cta">View style →</span>' : "") +
    '</a>';
  }
  function pic(s, i, kind, which, extra) {
    var scene = which === "primary" ? state.scene : other(state.scene);
    return '<div class="cell item ' + (kind === "wide" ? "span2" : "") + " " + (extra || "") + '" data-item="' + i + '" data-which="' + which + '" aria-hidden="true">' +
      '<div class="frame ' + (kind === "wide" ? "wide" : "natural") + '">' + img(s, scene, 1, "", "") + '</div></div>';
  }
  function meta(s, i) {
    return '<div class="cell br item" data-item="' + i + '" aria-hidden="true"><span class="micro muted">' + framesOf(s).length + ' frames</span><span class="micro link meta-cta" style="margin-top:4px">View style →</span></div>';
  }
  var T = {
    A: function (i) { var s = STYLES[i]; return label(s, i, "tl", false) + pic(s, i, "wide", "primary") + meta(s, i); },
    B: function (i) { var s = STYLES[i]; return pic(s, i, "wide", "primary") + label(s, i, "tl", true) + pic(s, i, "single", "secondary"); },
    C: function (i) { var a = STYLES[i], b = STYLES[i + 1];
      return label(a, i, "bl", true) + pic(a, i, "single", "primary") +
        (b ? label(b, i + 1, "tl", true) + pic(b, i + 1, "single", "primary", "bottom") : '<div class="cell"></div><div class="cell"></div>'); },
    D: function (i) { var s = STYLES[i]; return pic(s, i, "single", "primary") + label(s, i, "tl", true) + pic(s, i, "wide", "secondary"); }
  };
  var SEQ = ["A", "B", "C", "D", "A", "C", "B", "A"];
  var TAKES = { A: 1, B: 1, C: 2, D: 1 };

  function renderIndex() {
    document.title = "Storyboard Styles · WPP Production";
    headerIndex();
    var rows = STYLES.map(function (s, n) {
      return '<li><a class="hrow" href="' + href(s) + '" data-n="' + n + '">' +
        '<span class="hthumb frame" aria-hidden="true">' + img(s, "car", 1, "", "") + '</span>' +
        '<span class="micro muted hnum">' + pad(n + 1) + '</span>' +
        '<span class="hname">' + esc(s.name) + '</span>' +
        '<span class="micro muted hfam">' + esc(s.family) + '</span>' +
      '</a></li>';
    }).join("");
    var first = STYLES[0];
    view.innerHTML =
      '<section class="home grid" aria-label="Styles">' +
        '<div class="cell span2 hlist-cell"><ol class="hlist">' + rows + '</ol></div>' +
        '<div class="cell span2 hpeek-cell" aria-hidden="true">' +
          '<div class="hpeek">' +
            '<div class="frame natural hpeek-frame"><img id="hpeek-img" src="' + src(first, "car", 1) + '" alt=""></div>' +
            '<div class="hpeek-cap">' +
              '<div><span class="micro muted" id="hpeek-fam">' + pad(1) + " · " + esc(first.family) + '</span>' +
              '<p class="hpeek-name" id="hpeek-name">' + esc(first.name) + '</p>' +
              '<p class="micro hpeek-desc" id="hpeek-desc">' + esc(first.description) + '</p></div>' +
              '<a class="micro link" id="hpeek-go" href="' + href(first) + '">View style →</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
    wireHome();
  }

  function wireHome() {
    var im = $("#hpeek-img"), cur = 0;
    function show(n) {
      if (n === cur) return; cur = n;
      var s = STYLES[n];
      $$(".hrow").forEach(function (r) { r.classList.toggle("on", +r.dataset.n === n); });
      im.classList.add("swap");
      var next = new Image(); next.src = src(s, "car", 1);
      var done = function () { im.src = next.src; requestAnimationFrame(function () { im.classList.remove("swap"); }); };
      if (next.complete) setTimeout(done, 120); else next.onload = function () { setTimeout(done, 60); };
      $("#hpeek-fam").textContent = pad(n + 1) + " · " + s.family;
      $("#hpeek-name").textContent = s.name;
      $("#hpeek-desc").textContent = s.description;
      $("#hpeek-go").setAttribute("href", href(s));
      preload(s);
    }
    $$(".hrow").forEach(function (r) {
      r.addEventListener("mouseenter", function () { show(+r.dataset.n); });
      r.addEventListener("focus", function () { show(+r.dataset.n); });
    });
    var firstRow = $(".hrow"); if (firstRow) firstRow.classList.add("on");
  }

  /* ---------- detail view ---------- */
  function renderDetail(i) {
    var s = STYLES[i], prev = STYLES[(i - 1 + TOTAL) % TOTAL], next = STYLES[(i + 1) % TOTAL];
    document.title = s.name + " · Storyboard Styles";
    headerDetail(i);
    preload(s);
    if (state.compare && state.compare === s.slug) state.compare = null;

    var FS = framesOf(s);
    var thumbs = FS.map(function (f, n) {
      return '<button type="button" class="tl thumb' + (FS.length === 5 ? "" : " cell") + (FS.length === 2 ? " span2" : "") + '" data-frame="' + n + '" aria-current="' + (n === state.frame) + '" aria-label="Show ' + frameLabel(f) + '">' +
        '<div class="frame natural">' + img(s, f.scene, f.n, "", "") + '</div>' +
        '<div class="bar"></div>' +
        '<div class="tcap micro"><span>' + frameLabel(f) + '</span><span>' + pad(n + 1) + '</span></div>' +
      '</button>';
    }).join("");

    var options = STYLES.map(function (o) {
      return o.slug === s.slug ? "" : '<option value="' + o.slug + '"' + (o.slug === state.compare ? " selected" : "") + ">" + esc(o.name) + "</option>";
    }).join("");

    view.innerHTML =
      '<div class="detail">' +
      '<section class="grid">' +
        '<div class="cell split span2 d-head">' +
          '<span class="micro muted">' + pad(i + 1) + " · " + esc(s.family) + '</span>' +
          '<div><h2 class="d-name">' + esc(s.name) + '</h2><p class="d-desc">' + esc(s.description) + '</p></div>' +
        '</div>' +
        '<div class="cell bl hide-m"><span class="micro muted">' + (FS.length === 5 ? "Five scenes, one frame each." : FS.length === 2 ? "Two scenes, one take each." : "Two scenes, two takes each.") + '<br>Use ← → to step through frames.</span></div>' +
        '<div class="cell split br hide-m">' +
          '<button type="button" class="micro link" id="copy">Copy link</button>' +
          '<span class="micro muted">' + FS.length + ' frames</span>' +
        '</div>' +
        '<div class="cell stage-row">' +
          '<div class="stage" id="stage"></div>' +
          '<div class="stage-bar micro">' +
            '<span id="stage-label"></span>' +
            '<div class="group">' +
              '<button type="button" class="link" id="compare-btn" aria-pressed="' + !!state.compare + '">' + (state.compare ? "Close compare" : "Compare with another style") + '</button>' +
              '<label id="compare-pick" ' + (state.compare ? "" : "hidden") + '><span class="muted">With&nbsp;</span><select class="select" id="compare-select">' + options + '</select></label>' +
              '<button type="button" class="link" id="full-btn">Full screen</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        (FS.length === 5 ? '<div class="cell strip-row"><div class="strip5">' + thumbs + '</div></div>' : thumbs) +
        '<a class="cell split tl nav-cell" href="' + href(prev) + '">' +
          '<div><span class="micro muted">← Previous</span><h3 class="name" style="margin-top:8px">' + esc(prev.name) + '</h3></div>' +
          '<div class="frame natural">' + img(prev, "car", 1, "", "") + '</div>' +
        '</a>' +
        '<div class="cell hide-m"></div><div class="cell hide-m"></div>' +
        '<a class="cell split br nav-cell" href="' + href(next) + '">' +
          '<div><span class="micro muted">Next →</span><h3 class="name" style="margin-top:8px;margin-left:auto">' + esc(next.name) + '</h3></div>' +
          '<div class="frame natural">' + img(next, "car", 1, "", "") + '</div>' +
        '</a>' +
      '</section></div>';

    renderStage(i);

    $$(".thumb", view).forEach(function (b) {
      b.addEventListener("click", function () { setFrame(i, +b.dataset.frame); });
    });
    $("#copy").addEventListener("click", copyLink);
    $("#full-btn").addEventListener("click", function () { openLightbox(i, state.frame); });
    $("#compare-btn").addEventListener("click", function () {
      state.compare = state.compare ? null : STYLES[(i + 1) % TOTAL].slug;
      $("#compare-select").value = state.compare || "";
      $("#compare-pick").hidden = !state.compare;
      this.setAttribute("aria-pressed", String(!!state.compare));
      this.textContent = state.compare ? "Close compare" : "Compare with another style";
      renderStage(i);
    });
    $("#compare-select").addEventListener("change", function () { state.compare = this.value; renderStage(i); });
  }

  function pane(s, f, idx, isMain) {
    return '<figure class="pane">' +
      '<div class="frame natural" data-open="' + idx + '" data-fr="' + matchFrame(s, f) + '" data-slug="' + s.slug + '" role="button" tabindex="0" aria-label="Open ' + esc(s.name) + ' full screen">' +
        img(s, f.scene, f.n, "", s.name + ", " + frameLabel(f)) +
      '</div>' +
      '<figcaption class="micro"><b>' + esc(s.name) + '</b><span>' + (isMain ? "" : esc(s.family)) + '</span></figcaption>' +
    '</figure>';
  }

  function renderStage(i) {
    var s = STYLES[i], fs = framesOf(s), f = fs[state.frame] || fs[0], stage = $("#stage");
    var c = state.compare ? STYLES[indexOf(state.compare)] : null;
    stage.className = "stage" + (c ? " compare" : "");
    stage.innerHTML = pane(s, f, i, !c) + (c ? pane(c, framesOf(c)[matchFrame(c, f)], indexOf(c.slug), false) : "");
    if (!c) $("figcaption", stage).innerHTML = "<span></span>";
    $("#stage-label").innerHTML = '<span style="font-variant-numeric:tabular-nums">' + pad(state.frame + 1) + " / " + pad(fs.length) + "</span>&nbsp;&nbsp;&nbsp;" + frameLabel(f);
    $$("[data-open]", stage).forEach(function (el) {
      var open = function () { openLightbox(+el.dataset.open, +el.dataset.fr); };
      el.addEventListener("click", open);
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    if (c) preload(c);
  }

  function setFrame(i, n) {
    var len = framesOf(STYLES[i]).length;
    state.frame = (n + len) % len;
    $$(".thumb", view).forEach(function (b) { b.setAttribute("aria-current", String(+b.dataset.frame === state.frame)); });
    var imgs = $$("#stage img");
    imgs.forEach(function (im) { im.style.opacity = 0; });
    setTimeout(function () { renderStage(i); }, 160);
  }

  function copyLink() {
    var url = location.href;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(function () { toast("Link copied"); }, function () { toast(url); });
    } else { toast(url); }
  }

  /* ---------- lightbox ---------- */
  var lb = $("#lightbox");
  function openLightbox(styleIdx, frame) {
    state.lbStyle = styleIdx; state.lbIndex = frame;
    drawLightbox(); lb.hidden = false; document.body.style.overflow = "hidden"; $("#lb-close").focus();
  }
  function drawLightbox() {
    var s = STYLES[state.lbStyle], fs = framesOf(s), f = fs[state.lbIndex] || fs[0], im = $("#lb-img");
    im.src = src(s, f.scene, f.n); im.alt = s.name + ", " + frameLabel(f);
    $("#lb-cap").textContent = s.name + "  ·  " + frameLabel(f) + "  ·  " + pad(state.lbIndex + 1) + " / " + pad(fs.length);
  }
  function stepLightbox(d) { var len = framesOf(STYLES[state.lbStyle]).length; state.lbIndex = (state.lbIndex + d + len) % len; drawLightbox(); }
  function closeLightbox() { lb.hidden = true; document.body.style.overflow = ""; }
  $("#lb-close").addEventListener("click", closeLightbox);
  $("#lb-prev").addEventListener("click", function () { stepLightbox(-1); });
  $("#lb-next").addEventListener("click", function () { stepLightbox(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-figure")) closeLightbox(); });

  // swipe on touch screens
  var sx = null;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) stepLightbox(dx < 0 ? 1 : -1);
  });

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "SELECT") return;
    if (!lb.hidden) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") stepLightbox(1);
      else if (e.key === "ArrowLeft") stepLightbox(-1);
      return;
    }
    var m = location.hash.match(/^#(.+)$/);
    if (m) {
      var i = indexOf(decodeURIComponent(m[1]));
      if (e.key === "ArrowRight") { e.preventDefault(); setFrame(i, state.frame + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); setFrame(i, state.frame - 1); }
      else if (e.key === "Escape") location.hash = "";
    }
  });

  /* ---------- router ---------- */
  var lastRoute = null, indexScroll = 0;
  function route() {
    var m = location.hash.match(/^#(.+)$/);
    var i = m ? indexOf(decodeURIComponent(m[1])) : -1;
    if (lastRoute === "index") indexScroll = window.scrollY;
    document.body.classList.toggle("is-detail", i > -1);
    document.body.classList.toggle("home-page", i === -1);
    if (i > -1) {
      if (lastRoute !== STYLES[i].slug) state.frame = 0;
      renderDetail(i); lastRoute = STYLES[i].slug;
      window.scrollTo(0, 0);
    } else {
      renderIndex();
      window.scrollTo(0, lastRoute && lastRoute !== "index" ? indexScroll : 0);
      lastRoute = "index";
    }
    view.classList.remove("enter"); void view.offsetWidth; view.classList.add("enter");
  }

  $("#foot-count").textContent = TOTAL + " styles · " + FRAME_TOTAL + " frames";
  window.addEventListener("hashchange", route);
  route();
})();
