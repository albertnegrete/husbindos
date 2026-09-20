/* husbindos. — shared behaviour */
(function () {
  var C = window.HUSBINDOS || {};
  var page = document.body.dataset.page || "";

  /* ---------- ornaments ---------- */

  var FLOURISH =
    '<svg viewBox="0 0 120 22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="flourish">' +
    '<path d="M2 11c14-9 26-9 40 0 8 5 14 5 18 0-4 5-10 5-18 0M118 11c-14-9-26-9-40 0-8 5-14 5-18 0 4 5 10 5 18 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
    '<circle cx="60" cy="11" r="2" fill="currentColor"/></svg>';

  var ICONS = {
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="9" width="18" height="12"/><path d="M3 13h18M12 9v12M12 9c-3 0-5-2-5-4a2 2 0 0 1 4 0c0 2 1 4 1 4zm0 0c3 0 5-2 5-4a2 2 0 0 0-4 0c0 2-1 4-1 4z"/></svg>',
    photo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="6" width="18" height="14"/><path d="M8 6l2-3h4l2 3"/><circle cx="12" cy="13" r="3.5"/></svg>',
    film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="5" width="18" height="14"/><path d="M3 9h18M3 15h18M8 5v14M16 5v14"/></svg>',
    invite: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 8l9 6 9-6M3 8v10h18V8M3 8l9-5 9 5"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 17V5M6 11l6-6 6 6M5 20h14"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
  };

  /* ---------- header & footer ---------- */
  var NAV = [
    ["index.html", "Home", ""],
    ["notes.html", "Thank-you notes", "notes"],
    ["registry.html", "Registry", "registry"],
    ["photos.html", "Photos", "photos"],
    ["video.html", "The film", "video"]
  ];

  function renderHeader() {
    var links = NAV.map(function (n) {
      var cur = n[2] === page || (page === "home" && n[2] === "");
      return '<a href="' + n[0] + '"' + (cur ? ' aria-current="page"' : "") + ">" + n[1] + "</a>";
    }).join("");
    if (C.INVITE_URL) links += '<a href="' + C.INVITE_URL + '" target="_blank" rel="noopener">The invite</a>';
    var h = document.getElementById("site-header");
    if (!h) return;
    h.className = "velvet";
    h.innerHTML =
      '<div class="topbar"><a class="brand" href="index.html">husbindos.</a>' +
      '<button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>' +
      '<nav class="nav" id="nav">' + links + "</nav></div>";
    var btn = h.querySelector(".menu-btn"), nav = h.querySelector(".nav");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function renderFooter() {
    var f = document.getElementById("site-footer");
    if (!f) return;
    f.className = "velvet footer";
    f.innerHTML =
      '<div class="wm">husbindos.</div>' +
      "<p>" + (C.NAMES || []).join(" &amp; ") + " · " + (C.DATE_LONG || "") + " · " + (C.VENUE || "") + "</p>" +
      (C.INVITE_URL ? '<p><a href="' + C.INVITE_URL + '" target="_blank" rel="noopener">See the original invite</a></p>' : "");
  }

  function renderCard() {
    document.querySelectorAll(".card").forEach(function (card) {
      var art = document.createElement("img");
      art.className = "card-art"; art.alt = ""; art.decoding = "async";
      art.src = C.CARD_ART_LOCAL || "assets/card.jpg";
      art.onerror = function () { if (C.CARD_ART_URL && art.src !== C.CARD_ART_URL) art.src = C.CARD_ART_URL; };
      card.insertAdjacentHTML("afterbegin", '<span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>');
      card.insertBefore(art, card.firstChild);
      art.addEventListener("load", function () { card.classList.add("has-art"); });
      card.querySelectorAll("[data-flourish]").forEach(function (el) { el.outerHTML = FLOURISH; });
    });
    document.querySelectorAll("[data-divider]").forEach(function (el) {
      el.outerHTML = FLOURISH.replace('class="flourish"', 'class="divider"');
    });
    document.querySelectorAll("[data-icon]").forEach(function (el) {
      el.innerHTML = ICONS[el.dataset.icon] || "";
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
        status.textContent = kind === "note" ? "Thank you — your note is on its way to the wall." : "Thank you — we've got it and we'll be in touch.";
        form.reset();
        if (kind === "note") setTimeout(function () { loadNotes(true); }, 2500);
      }).catch(function () {
        status.className = "status err";
        status.textContent = "Hmm, that didn't send. Please try again.";
      }).finally(function () { btn.disabled = false; });
    });
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmtDate(s) {
    var d = /^\d+(\.\d+)?$/.test(String(s || "").trim()) ? new Date((parseFloat(s) - 25569) * 86400000) : new Date(s); if (isNaN(d)) { var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s || ""); if (m) d = new Date(+m[3], m[1] - 1, +m[2]); }
    if (isNaN(d)) return "";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
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

  function loadNotes(quiet) {
    var wall = document.getElementById("wall");
    if (!wall) return;
    if (!C.NOTES_CSV) { wall.innerHTML = '<div class="empty">Notes will appear here soon.</div>'; return; }
    if (!quiet) wall.innerHTML = '<div class="empty">Gathering notes…</div>';
    fetch(C.NOTES_CSV + "&t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.text(); })
      .then(function (text) {
        var rows = parseCSV(text).slice(1).filter(function (r) { return r[1] && r[2]; });
        if (!rows.length) { wall.innerHTML = '<div class="empty">Be the first to leave a note.</div>'; return; }
        rows.reverse();
        wall.innerHTML = rows.map(function (r) {
          return '<article class="note"><span class="q">“</span><p>' + esc(r[2]) + '</p><div><span class="who">' + esc(r[1]) + '</span><span class="when">' + fmtDate(r[0]) + "</span></div></article>";
        }).join("");
      })
      .catch(function () { wall.innerHTML = '<div class="empty">Couldn’t load the notes right now.</div>'; });
  }

  /* ---------- photos ---------- */
  function renderPhotos() {
    var up = document.getElementById("upload-link");
    if (up) up.href = "https://drive.google.com/drive/folders/" + C.GUEST_UPLOAD_FOLDER_ID;
    var dl = document.getElementById("gallery-link");
    if (dl) dl.href = "https://drive.google.com/drive/folders/" + C.PHOTOGRAPHER_FOLDER_ID;
    var host = document.getElementById("gallery-host");
    if (!host) return;
    if (!C.PHOTOGRAPHER_READY) {
      host.innerHTML = '<div class="soon"><h3>The photographer is still at work.</h3><p>Official pictures will land here the moment they are delivered. In the meantime, add yours next door.</p></div>';
      return;
    }
    if (C.PHOTOGRAPHER_IMAGES && C.PHOTOGRAPHER_IMAGES.length) {
      host.innerHTML = '<div class="gallery">' + C.PHOTOGRAPHER_IMAGES.map(function (u) {
        return '<a href="' + esc(u) + '" target="_blank" rel="noopener"><img loading="lazy" src="' + esc(u) + '" alt="Wedding photograph"></a>';
      }).join("") + "</div>";
    } else {
      host.innerHTML = '<iframe class="drive-frame" title="Photographer gallery" loading="lazy" src="https://drive.google.com/embeddedfolderview?id=' + C.PHOTOGRAPHER_FOLDER_ID + '#grid"></iframe>';
    }
  }

  /* ---------- home photos ---------- */
  function renderHomePhotos() {
    var sec = document.getElementById("home-photos"), strip = document.getElementById("home-photo-strip");
    if (!sec || !strip) return;
    var list = (C.HOME_PHOTOS || []).filter(function (p) { return p && p.src; });
    if (!list.length) return;
    sec.hidden = false;
    strip.className = "photo-strip rv" + (list.length === 1 ? " single" : "");
    strip.innerHTML = list.map(function (p) {
      return '<figure><img src="' + esc(p.src) + '" alt="' + esc(p.caption || "Wedding photograph") + '" loading="lazy">' + (p.caption ? "<figcaption>" + esc(p.caption) + "</figcaption>" : "") + "</figure>";
    }).join("");
  }

  /* ---------- video ---------- */
  function renderVideo() {
    var frame = document.getElementById("video-frame");
    if (!frame) return;
    if (C.VIDEO_YOUTUBE_ID) {
      frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(C.VIDEO_YOUTUBE_ID) + '?rel=0&modestbranding=1&color=white" title="Wedding film" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    } else {
      frame.innerHTML = '<div class="holding"><div class="play">' + ICONS.play + '</div><h3>Still in the edit.</h3><p>The official film premieres here as soon as it is ready. We will let everyone know.</p></div>';
    }
  }

  /* ---------- registry ---------- */
  function renderRegistry() {
    var s = document.getElementById("registry-spain"), w = document.getElementById("registry-world");
    if (s) { if (C.REGISTRY_SPAIN_URL) s.href = C.REGISTRY_SPAIN_URL; else s.style.display = "none"; }
    if (w) { if (C.REGISTRY_WORLD_URL) w.href = C.REGISTRY_WORLD_URL; else w.style.display = "none"; }
  }

  /* ---------- reveal on scroll ---------- */
  function reveal() {
    var els = document.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderHeader(); renderFooter(); renderCard();
    var nf = document.getElementById("note-form"); if (nf) wireForm(nf, "note");
    var rf = document.getElementById("registry-form"); if (rf) wireForm(rf, "registry");
    loadNotes(); renderPhotos(); renderHomePhotos(); renderVideo(); renderRegistry(); reveal();
  });
})();
