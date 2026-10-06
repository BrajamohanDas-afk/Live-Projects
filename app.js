var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal on scroll
var revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });
} else {
  revealEls.forEach(function (el) {
    el.classList.add("visible");
  });
}

// Deferred live previews.
// ponytail: static block list — talbeenaa sends X-Frame-Options: SAMEORIGIN
// (verified via response headers), so its card shows a captured screenshot
// asset instead of an iframe. Upgrade to runtime detection if more sites
// start blocking embedding.
var previews = document.querySelectorAll(".preview");

function loadPreview(preview) {
  if (preview.dataset.loaded === "true") return;
  preview.dataset.loaded = "true";

  if (preview.dataset.blocked === "true") return;

  var iframe = document.createElement("iframe");
  iframe.src = preview.dataset.src;
  iframe.title = "Live preview of " + preview.dataset.name;
  iframe.loading = "lazy";
  iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");
  iframe.setAttribute("aria-hidden", "true");
  iframe.tabIndex = -1;

  iframe.addEventListener("load", function () {
    preview.classList.add("is-loaded");
  });

  preview.appendChild(iframe);
}

if ("IntersectionObserver" in window) {
  var previewObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          previewObserver.unobserve(entry.target);
          loadPreview(entry.target);
        }
      });
    },
    { rootMargin: "600px 0px" }
  );

  previews.forEach(function (preview) {
    previewObserver.observe(preview);
  });
} else {
  previews.forEach(loadPreview);
}
