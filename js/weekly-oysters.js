/* ============================================================
   THE LAZY OYSTER  |  Weekly Oyster Banner
   ------------------------------------------------------------
   SINGLE SOURCE OF TRUTH for the "Fresh this week" banner.
   To update the list, edit ONLY the WEEKLY_OYSTERS object below
   (or let the automation rewrite it). Everything else is render
   logic and does not need to change week to week.

   IMPORTANT: bump "week" to a new value each week. Visitors who
   dismissed last week's banner will then see the new one.
   ============================================================ */

window.WEEKLY_OYSTERS = {
  // Unique id for the week — drives the "show again after dismiss" logic.
  week: "2026-W27",

  // Human label shown before the list.
  label: "Fresh this week",

  // The rotating list. Each entry: { name, region }
  oysters: [
    { name: "Schoodic Point", region: "ME" },
    { name: "Eel Lake Choice", region: "PEI" },
    { name: "Sippican",       region: "MA" }
  ],

  // No CTA — the page already has an Order button just below the banner.
  cta: null
};

/* ------------------------------------------------------------
   Render logic — no need to edit below for weekly updates.
   ------------------------------------------------------------ */
(function () {
  "use strict";

  var data = window.WEEKLY_OYSTERS;
  if (!data || !Array.isArray(data.oysters) || data.oysters.length === 0) return;

  var DISMISS_KEY = "lo_oysters_dismissed_week";

  function isDismissed() {
    try {
      return window.localStorage.getItem(DISMISS_KEY) === String(data.week);
    } catch (e) {
      return false; // storage blocked — just show it
    }
  }

  function remember() {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(data.week));
    } catch (e) { /* ignore */ }
  }

  function build() {
    var bar = document.createElement("aside");
    bar.className = "oyster-banner";
    bar.id = "oyster-banner";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "This week's oyster selection");

    var inner = document.createElement("div");
    inner.className = "oyster-banner__inner";

    // Label (with decorative oyster mark)
    var label = document.createElement("span");
    label.className = "oyster-banner__label";
    label.innerHTML = '<span class="oyster-banner__mark" aria-hidden="true">🦪</span>' +
                      escapeHtml(data.label) + ":";
    inner.appendChild(label);

    // List of oysters
    var list = document.createElement("span");
    list.className = "oyster-banner__list";
    data.oysters.forEach(function (o, i) {
      if (i > 0) {
        var dot = document.createElement("span");
        dot.className = "oyster-banner__dot";
        dot.setAttribute("aria-hidden", "true");
        dot.textContent = "•";
        list.appendChild(dot);
      }
      var item = document.createElement("span");
      item.className = "oyster-banner__item";
      item.innerHTML = '<strong>' + escapeHtml(o.name) + '</strong>' +
        (o.region ? ' <span class="oyster-banner__reg">' + escapeHtml(o.region) + '</span>' : '');
      list.appendChild(item);
    });
    inner.appendChild(list);

    // CTA
    if (data.cta && data.cta.url) {
      var cta = document.createElement("a");
      cta.className = "oyster-banner__cta";
      cta.href = data.cta.url;
      cta.target = "_blank";
      cta.rel = "noopener noreferrer";
      cta.innerHTML = escapeHtml(data.cta.text || "Order") + ' <span aria-hidden="true">&rarr;</span>';
      inner.appendChild(cta);
    }

    bar.appendChild(inner);

    // Close button
    var close = document.createElement("button");
    close.type = "button";
    close.className = "oyster-banner__close";
    close.setAttribute("aria-label", "Dismiss this week's oyster banner");
    close.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    close.addEventListener("click", function () {
      bar.parentNode && bar.parentNode.removeChild(bar);
      remember();
    });
    bar.appendChild(close);

    return bar;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function mount() {
    if (isDismissed()) return;
    if (document.getElementById("oyster-banner")) return;
    var bar = build();
    // Place above the header but after the skip link (keeps skip link first).
    var skip = document.querySelector(".skip-link");
    if (skip && skip.parentNode) {
      skip.parentNode.insertBefore(bar, skip.nextSibling);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
