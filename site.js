/* husbindos. — shared behaviour (2026 redesign) */
(function () {
  var C = window.HUSBINDOS || {};
  var page = document.body.dataset.page || "";

  /* ---------- ornaments ---------- */
  var FLOURISH =
    '<svg class="flourish" viewBox="0 0 120 22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M2 11c14-9 26-9 40 0 8 5 14 5 18 0-4 5-10 5-18 0M118 11c-14-9-26-9-40 0-8 5-14 5-18 0 4 5 10 5 18 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
    '<circle cx="60" cy="11" r="2" fill="currentColor"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var BIRD_L = "assets/peacock-left.png", BIRD_R = "assets/peacock-right.png";
  var BIRD_L_PLUM = "assets/peacock-left-plum.png", BIRD_R_PLUM = "assets/peacock-right-plum.png";

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- header & footer ---------- */
  var NAV = [
    ["index.html", "Home", "home"],
    ["notes.html", "Notes", "notes"],
    ["photos.html", "Photos", "photos"],
    ["registry.html", "Registry", "registry"],
    ["video.html", "The films", "video"]
  ];

  function renderHeader() {
    var h = document.getElementById("site-header");
    if (!h) return;
    var links = NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : "") + ">" + n[1] + "</a>";
    }).join("");
    if (C.INVITE_URL) links += '<a class="ext" href="' + esc(C.INVITE_URL) + '" target="_blank" rel="noopener">The invite ↗</a>';
    h.className = "nav band";
    h.innerHTML =
      '<div class="inner"><a class="brand" href="index.html">husbindos.</a>' +
      '<button class="menu" id="menu" aria-expanded="false" aria-controls="links">Menu</button>' +
      '<div class="links" id="links">' + links + "</div></div>";
    var btn = h.querySelector(".menu"), nav = h.querySelector(".links");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function renderFooter() {
    var f = document.getElementById("site-footer");
    if (!f) return;
    f.className = "footer band";
    f.innerHTML =
      '<div class="inner grid">' +
      '<div class="crest"><img src="' + BIRD_L_PLUM + '" alt="" aria-hidden="true"><div class="wm">husbindos.</div><img src="' + BIRD_R_PLUM + '" alt="" aria-hidden="true"></div>' +
      '<div class="cols">' +
      '<div><div class="eyebrow">Around the site</div><a href="notes.html">Thank-you notes</a><a href="photos.html">Photos</a><a href="registry.html">Registry</a><a href="video.html">The films</a></div>' +
      '<div><div class="eyebrow">The day</div>' + esc((C.NAMES || []).join(" & ")) + "<br>" + esc(C.DATE_LONG || "") + "<br>" + esc(C.VENUE || "") +
      (C.INVITE_URL ? '<br><a href="' + esc(C.INVITE_URL) + '" target="_blank" rel="noopener" style="margin-top:8px">The original invite ↗</a>' : "") + "</div>" +
      "</div>" +
      '<div class="fine"><span>Made with love in ' + esc(C.CITY || "Barcelona") + ".</span><span>husbindos.com</span></div>" +
      "</div>";
  }

  /* Inner-page banner: plum velvet, title, flourish, one line, the two peacocks. */
  function renderBanners() {
    document.querySelectorAll(".pagehead").forEach(function (b) {
      b.querySelectorAll("[data-flourish]").forEach(function (el) { el.outerHTML = FLOURISH; });
      b.insertAdjacentHTML("beforeend",
        '<img class="bird l" src="' + BIRD_L + '" alt="" aria-hidden="true"><img class="bird r" src="' + BIRD_R + '" alt="" aria-hidden="true">');
    });
    document.querySelectorAll("[data-flourish]").forEach(function (el) { el.outerHTML = FLOURISH; });
    document.querySelectorAll("[data-bird]").forEach(function (el) {
      el.src = el.dataset.bird === "left" ? BIRD_L : BIRD_R;
    });
  }

  /* ---------- API: Google Forms (write) + published Sheet CSV (read) ---------- */
  function formCfg(kind) { return kind === "note" ? C.NOTES_FORM : C.REGISTRY_FORM; }
  function apiReady(kind) { var f = formCfg(kind); return !!(f && f.action && f.fields); }

  function post(kind, data) {
    var f = formCfg(kind), body = new URLSearchParams();
    Object.keys(f.fields).forEach(function (k) { if (data[k] != null) body.append(f.fields[k], data[k]); });
    // Google Forms accepts cross-origin posts but returns an opaque response.
    return fetch(f.action, { method: "POST", mode: "no-cors", body: body, headers: { "Content-Type": "application/x-www-form-urlencoded" } });
  }

  function wireForm(form, kind) {
    var status = form.querySelector(".status");
    var btn = form.querySelector("button[type=submit]");
    if (!apiReady(kind)) {
      status.className = "status err";
      status.textContent = "The guestbook isn't open yet — check back in a day or two.";
      btn.disabled = true;
      return;
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
      if (data.website) { form.reset(); return; } // honeypot
      var required = kind === "note" ? ["name", "message"] : ["name", "gift"];
      for (var i = 0; i < required.length; i++) {
        if (!data[required[i]]) { status.className = "status err"; status.textContent = "Please fill in the " + (required[i] === "message" ? "note" : required[i]) + "."; return; }
      }
      btn.disabled = true;
      status.className = "status";
      status.textContent = "Sending…";
      post(kind, data).then(function () {
        status.className = "status ok";
        status.textContent = kind === "note" ? "Thank you. Your note is on its way to the wall." : "Thank you. We've got it, and we'll be in touch.";
        form.reset();
        if (kind === "note") setTimeout(function () { loadNotes(true); }, 2500);
      }).catch(function () {
        status.className = "status err";
        status.textContent = "Hmm, that didn't send. Please try again.";
      }).finally(function () { btn.disabled = false; });
    });
  }

  function fmtDate(s, long) {
    var d = /^\d+(\.\d+)?$/.test(String(s || "").trim()) ? new Date((parseFloat(s) - 25569) * 86400000) : new Date(s);
    if (isNaN(d)) { var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s || ""); if (m) d = new Date(+m[3], m[1] - 1, +m[2]); }
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-GB", long ? { day: "numeric", month: "long" } : { day: "numeric", month: "short" });
  }
  // Minimal RFC-4180 CSV parser (handles quoted fields with commas/newlines).
  function parseCSV(text) {
    var rows = [], row = [], cur = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
        else cur += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cur); cur = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; }
      else cur += ch;
    }
    if (cur.length || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }

  function fetchNotes() {
    if (!C.NOTES_CSV) return Promise.resolve([]);
    return fetch(C.NOTES_CSV + "&t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.text(); })
      .then(function (text) {
        var rows = parseCSV(text).slice(1).filter(function (r) { return r[1] && r[2]; });
        rows.reverse(); // newest first
        return rows;
      });
  }

  function quote(r, long) {
    return '<blockquote><p>' + esc(r[2]) + '</p><cite>' + esc(r[1]) + ' <span>' + fmtDate(r[0], long) + "</span></cite></blockquote>";
  }

  /* The wall on notes.html */
  function loadNotes(quiet) {
    var wall = document.getElementById("wall"), count = document.getElementById("note-count");
    if (!wall) return;
    if (!C.NOTES_CSV) { wall.innerHTML = '<div class="empty">Notes will appear here soon.</div>'; return; }
    if (!quiet) wall.innerHTML = '<div class="empty">Gathering notes…</div>';
    fetchNotes().then(function (rows) {
      if (count) count.textContent = rows.length;
      if (!rows.length) { wall.innerHTML = '<div class="empty">Be the first to leave a note.</div>'; return; }
      wall.innerHTML = rows.map(function (r) { return quote(r, true); }).join("") + '<div class="write">Yours goes here.</div>';
    }).catch(function () { wall.innerHTML = '<div class="empty">Couldn’t load the notes right now.</div>'; });
  }

  /* The two newest notes on the home page */
  function loadHomeQuotes() {
    var host = document.getElementById("home-quotes");
    if (!host) return;
    fetchNotes().then(function (rows) {
      var sec = document.getElementById("home-wall");
      if (!rows.length) { if (sec) sec.hidden = true; return; }
      host.innerHTML = rows.slice(0, 2).map(function (r) { return quote(r, false); }).join("");
    }).catch(function () { var sec = document.getElementById("home-wall"); if (sec) sec.hidden = true; });
  }

  /* ---------- photos ---------- */
  function renderPhotos() {
    var up = document.getElementById("upload-link");
    if (up) up.href = "https://drive.google.com/drive/folders/" + C.GUEST_UPLOAD_FOLDER_ID;
    var dl = document.getElementById("gallery-link");
    if (dl) {
      if (C.PHOTOGRAPHER_READY) dl.href = "https://drive.google.com/drive/folders/" + C.PHOTOGRAPHER_FOLDER_ID;
      else dl.parentNode.style.display = "none";
    }
    var host = document.getElementById("gallery-host");
    if (host) {
      if (!C.PHOTOGRAPHER_READY) host.hidden = true;
      else if (C.PHOTOGRAPHER_IMAGES && C.PHOTOGRAPHER_IMAGES.length) {
        host.innerHTML = '<div class="pgallery">' + C.PHOTOGRAPHER_IMAGES.map(function (u) {
          return '<a href="' + esc(u) + '" target="_blank" rel="noopener"><img loading="lazy" src="' + esc(u) + '" alt="Wedding photograph"></a>';
        }).join("") + "</div>";
      } else {
        host.innerHTML = '<iframe class="drive-frame" title="Photographer gallery" loading="lazy" src="https://drive.google.com/embeddedfolderview?id=' + C.PHOTOGRAPHER_FOLDER_ID + '#grid"></iframe>';
      }
    }
    // "So far": hand-picked guest photos from config
    var g = document.getElementById("so-far");
    if (g) {
      var list = (C.GALLERY_PHOTOS || []).filter(function (p) { return p && p.src; });
      var slots = ["g1", "g2", "g3", "g4", "g5"];
      g.innerHTML = list.slice(0, 5).map(function (p, i) {
        return '<figure class="' + slots[i] + '"><div class="ph"><img src="' + esc(p.src) + '" alt="' + esc(p.alt || "") + '" loading="lazy"></div></figure>';
      }).join("") + '<div class="g6"><div class="soon">The rest of your photos appear here as the folder fills up.<small>We’ll curate lightly. Blurry ones stay; unflattering ones of us also stay, apparently.</small></div></div>';
    }
  }

  /* ---------- home snapshots ---------- */
  function renderHomePhotos() {
    var sec = document.getElementById("home-photos"), strip = document.getElementById("home-photo-strip");
    if (!sec || !strip) return;
    var list = (C.HOME_PHOTOS || []).filter(function (p) { return p && p.src; });
    if (!list.length) { sec.hidden = true; return; }
    var cls = ["a", "b"];
    strip.innerHTML = list.slice(0, 2).map(function (p, i) {
      return '<figure class="' + cls[i] + '"><div class="ph"><img src="' + esc(p.src) + '" alt="' + esc(p.alt || "") + '" loading="lazy"></div>' +
        (p.caption ? "<figcaption>" + esc(p.caption) + "</figcaption>" : "") + "</figure>";
    }).join("");
  }

  /* ---------- films ---------- */
  function renderFilms() {
    var screen = document.getElementById("screen"), prog = document.getElementById("programme");
    if (!screen || !prog) return;
    var films = (C.FILMS || []).filter(function (f) { return f && f.title; });
    if (!films.length) { prog.hidden = true; return; }
    var NUM = ["I", "II", "III", "IV", "V"];
    var current = 0;

    function poster(i) {
      var f = films[i];
      var thumb = f.poster || (f.youtube ? "https://img.youtube.com/vi/" + encodeURIComponent(f.youtube) + "/maxresdefault.jpg" : "");
      screen.innerHTML =
        '<div class="holding" data-tone="' + esc(f.tone || "sapphire") + '" role="button" tabindex="0" aria-label="Play ' + esc(f.title) + '">' +
        (thumb ? '<img class="poster" src="' + esc(thumb) + '" alt="" loading="lazy">' : "") +
        '<div class="num">' + NUM[i] + '</div>' +
        '<span class="play">' + PLAY + '</span>' +
        '<h3>' + esc(f.title) + '</h3>' +
        '<div class="rt">' + esc(f.runtime || "") + '</div>' +
        (f.youtube ? "" : '<div class="micro">Still in the edit. It premieres here the moment it is ready.</div>') +
        "</div>";
      var h = screen.firstChild;
      h.addEventListener("click", function () { play(i); });
      h.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(i); } });
    }
    function play(i) { // loads the player; it waits for the viewer to press play
      var f = films[i];
      if (!f.youtube) return;
      screen.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(f.youtube) + '?rel=0&modestbranding=1&color=white" title="' + esc(f.title) + '" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    }
    function select(i, scroll) {
      current = i;
      if (films[i].youtube) play(i); else poster(i);
      prog.querySelectorAll("button").forEach(function (b, k) {
        var on = k === i;
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.querySelector(".rt .w").textContent = on ? "Now showing" : "Watch";
      });
      if (scroll) document.querySelector(".screen").scrollIntoView({ behavior: "smooth", block: "center" });
    }

    prog.innerHTML = films.map(function (f, i) {
      var t = f.title, m = /^(.*\s)(\S+)$/.exec(t); // italicise the last word
      var titleHtml = m ? esc(m[1]) + "<em>" + esc(m[2]) + "</em>" : esc(t);
      return '<button type="button" data-i="' + i + '" aria-pressed="false">' +
        '<span class="pb">' + PLAY + '<span class="n">' + NUM[i] + '</span></span>' +
        '<h3>' + titleHtml + '</h3><p>' + esc(f.blurb || "") + '</p>' +
        '<span class="rt"><span class="w">Watch</span><span class="sep">·</span>' + esc(f.runtime || "") + "</span></button>";
    }).join("");
    prog.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = +b.dataset.i;
        if (i === current && films[i].youtube) document.querySelector(".screen").scrollIntoView({ behavior: "smooth", block: "center" });
        else select(i, true);
      });
    });
    select(0, false);
  }

  /* ---------- registry ---------- */
  function renderRegistry() {
    var s = document.getElementById("registry-spain"), w = document.getElementById("registry-world");
    if (s) { if (C.REGISTRY_SPAIN_URL) s.href = C.REGISTRY_SPAIN_URL; else s.style.display = "none"; }
    if (w) { if (C.REGISTRY_WORLD_URL) w.href = C.REGISTRY_WORLD_URL; else w.style.display = "none"; }
    document.querySelectorAll("[data-invite]").forEach(function (a) { if (C.INVITE_URL) a.href = C.INVITE_URL; });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderHeader(); renderFooter(); renderBanners();
    var nf = document.getElementById("note-form"); if (nf) wireForm(nf, "note");
    var rf = document.getElementById("registry-form"); if (rf) wireForm(rf, "registry");
    loadNotes(); loadHomeQuotes(); renderPhotos(); renderHomePhotos(); renderFilms(); renderRegistry();
  });
})();
