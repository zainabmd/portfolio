// Theme: follow the OS by default, remember an explicit choice.
(() => {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (_) { /* storage blocked */ }
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  else root.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  document.querySelector(".theme-toggle")?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (_) { /* storage blocked */ }
  });
})();

// Repo links: fill data-repo="https://github.com/..." in index.html; empty ones show "Code coming soon".
document.querySelectorAll("a.repo").forEach((a) => {
  const url = (a.dataset.repo || "").trim();
  if (url) {
    a.href = url;
    a.rel = "noopener";
    a.textContent = "View code on GitHub ↗";
  } else {
    a.classList.add("pending");
    a.textContent = "Code coming soon";
    a.setAttribute("aria-disabled", "true");
  }
});

// Hide screenshots that fail to load (keeps the layout clean if an image is missing).
document.querySelectorAll(".shot img").forEach((img) => {
  const hide = () => {
    img.closest(".shot")?.remove();
    document.querySelectorAll(".gallery").forEach((g) => { if (!g.querySelector(".shot")) g.classList.add("missing"); });
  };
  if (img.complete && img.naturalWidth === 0) hide();
  else img.addEventListener("error", hide);
});

// Lightbox for screenshots.
(() => {
  const box = document.querySelector(".lightbox");
  if (!box || typeof box.showModal !== "function") return;
  const img = box.querySelector("img");
  document.querySelectorAll(".shot").forEach((btn) => {
    btn.addEventListener("click", () => {
      const thumb = btn.querySelector("img");
      img.src = btn.dataset.full || thumb.src;
      img.alt = thumb.alt;
      box.showModal();
    });
  });
  box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("close")) box.close(); });
})();

document.getElementById("yr").textContent = new Date().getFullYear();
