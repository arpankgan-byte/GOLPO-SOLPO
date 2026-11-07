(() => {
  const KEY = "gs-stairs-route-pending";
  let routeBusy = false;
  let sequence = 0;
  let revealAudio = null;
  function startRevealMusic() {
    try {
      const siteAudio = document.getElementById("gsAudio");
      if (siteAudio && !siteAudio.paused) siteAudio.pause();
      revealAudio = document.getElementById("gsRevealAudio") || revealAudio;
      if (!revealAudio) {
        revealAudio = new Audio("/logo-reveal-music.wav");
        revealAudio.preload = "auto";
      }
      revealAudio.volume = 0.24;
      // Setting currentTime before metadata is ready can throw and prevent play().
      if (revealAudio.readyState >= 1) {
        try { revealAudio.currentTime = 0; } catch {}
      }
      const play = revealAudio.play();
      if (play?.catch) play.catch((error) => console.warn("Reveal music could not autoplay:", error));
    } catch (error) {
      console.warn("Reveal music could not autoplay:", error);
    }
  }
  const reduced = () => {
    try { return matchMedia("(prefers-reduced-motion: reduce)").matches; }
    catch { return false; }
  };

  function build(arrival) {
    const stage = document.createElement("div");
    stage.className = "gs-page-transition";
    stage.setAttribute("aria-hidden", "true");
    const cols = [];
    for (let i = 0; i < 5; i++) {
      const col = document.createElement("div");
      col.className = "gs-page-transition__column";
      col.style.transform = arrival ? "translateY(0%)" : (i % 2 === 0 ? "translateY(-100%)" : "translateY(100%)");
      stage.appendChild(col);
      cols.push(col);
    }
    stage.insertAdjacentHTML("beforeend", '<div class="gs-page-transition__loader" role="status" aria-label="Loading page"><div class="gs-morph-loading" aria-hidden="true"><span></span><span></span><span></span><span></span></div></div>');
    document.body.appendChild(stage);
    return { stage, cols };
  }

  function animate(cols, enter) {
    return Promise.all(cols.map((col, i) => {
      const from = enter ? (i % 2 === 0 ? "translateY(-100%)" : "translateY(100%)") : "translateY(0%)";
      const to = enter ? "translateY(0%)" : (i % 2 === 0 ? "translateY(-100%)" : "translateY(100%)");
      if (!col.animate) return Promise.resolve();
      return col.animate([{ transform: from }, { transform: to }], {
        duration: 700, delay: i * 50, easing: "cubic-bezier(.76,0,.24,1)", fill: "forwards"
      }).finished.catch(() => {});
    }));
  }

  function playGlass(stage, token, done) {
    const loader = stage.querySelector(".gs-page-transition__loader");
    if (loader) loader.remove();
    const frame = document.createElement("iframe");
    frame.className = "gs-page-transition__glass";
    frame.title = "Liquid glass page transition";
    let finished = false;
    let timer;
    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(timer);
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      cleanup();
      frame.remove();
      // Let the short sonic-logo tail resolve beneath the closed cover before navigation.
      setTimeout(done, 400);
    };
    const onMessage = (event) => {
      const data = event.data;
      if (event.source === frame.contentWindow && data?.gsGlassTransitionDone && String(data.token) === String(token)) finish();
    };
    window.addEventListener("message", onMessage);
    timer = setTimeout(finish, 5000);
    frame.src = "/glass-transition/transition.html?token=" + encodeURIComponent(String(token));
    stage.appendChild(frame);
  }

  function navigate(href) {
    if (routeBusy) return;
    routeBusy = true;
    const token = ++sequence;
    const { stage, cols } = build(false);
    let sent = false;
    const go = () => {
      if (sent) return;
      sent = true;
      try { sessionStorage.setItem(KEY, "1"); } catch {}
      location.assign(href);
    };
    animate(cols, true).then(() => {
      if (sent) return;
      playGlass(stage, token, go);
    });
    setTimeout(go, 7000);
  }

  function arrive() {
    let pending = false;
    try {
      pending = sessionStorage.getItem(KEY) === "1";
      sessionStorage.removeItem(KEY);
    } catch {}
    if (!pending || reduced()) return;
    const { stage, cols } = build(true);
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      const loader = stage.querySelector(".gs-page-transition__loader");
      if (loader) loader.remove();
      animate(cols, false).then(() => stage.remove());
    };
    window.addEventListener("load", reveal, { once: true });
    setTimeout(reveal, 1800);
  }

  // Keep the table QR context when returning from ordering or the kitchen panel.
  const table = new URLSearchParams(location.search).get("table");
  const returnTo = table && /^(?:[1-9]|1[0-2])$/.test(table) ? "/?table=" + table + "#home" : "/#home";
  document.querySelectorAll(".back-site,.brand-back").forEach((a) => a.setAttribute("href", returnTo));

  document.addEventListener("click", (event) => {
    const a = event.target.closest?.("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    let url;
    try { url = new URL(a.href, location.href); } catch { return; }
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    if (reduced() || !Element.prototype.animate) return;
    startRevealMusic();
    event.preventDefault();
    navigate(url.href);
  }, true);
  arrive();
})();
