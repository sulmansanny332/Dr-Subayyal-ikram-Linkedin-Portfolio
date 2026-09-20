"use strict";
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
document
  .querySelectorAll(
    "main h2, main h3, main .prose p, main .section-summary, main .identity-cards article, main .office-card",
  )
  .forEach((el) => el.classList.add("reveal"));
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  document.body.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06 },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
window.matchMedia("(min-width: 951px)").addEventListener("change", closeMenu);
const progress = document.querySelector(".reading-progress");
let scrollPending = false;
function updateProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${distance > 0 ? Math.min(100, Math.max(0, (window.scrollY / distance) * 100)) : 0}%`;
  scrollPending = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateProgress);
    }
  },
  { passive: true },
);
window.addEventListener("resize", updateProgress);
updateProgress();
// Active page navigation is set in each HTML document.
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project-card");
filters.forEach((button) =>
  button.addEventListener("click", () => {
    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    let count = 0;
    projects.forEach((project) => {
      project.hidden =
        button.dataset.filter !== "all" &&
        project.dataset.city !== button.dataset.filter;
      if (!project.hidden) {
        count++;
        project.classList.add("visible");
      }
    });
    document.querySelector("#project-status").textContent =
      window.portfolioMessage
        ? window.portfolioMessage("projects", count)
        : `${count} projects shown.`;
    updateProgress();
  }),
);
const profileDetails = document.querySelector(".full-profile");
profileDetails?.addEventListener("toggle", updateProgress);
const aboutHeading = [...document.querySelectorAll(".archive h2")].find(
  (heading) => heading.textContent.startsWith("About —"),
);
const aboutParagraphs = [];
for (
  let element = aboutHeading?.nextElementSibling;
  element && element.tagName !== "H2";
  element = element.nextElementSibling
) {
  aboutParagraphs.push(element.textContent);
}
const originalAboutText = aboutParagraphs.join("\n\n");
const copyStatus = document.querySelector("#copy-status");
document.querySelector("#copy-about")?.addEventListener("click", async () => {
  const aboutText = window.portfolioAboutText
    ? window.portfolioAboutText()
    : originalAboutText;
  let success = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(aboutText);
      success = true;
    }
  } catch (_) {
    /* Use the local-file-compatible fallback below. */
  }
  if (!success) {
    const field = document.createElement("textarea");
    field.value = aboutText;
    field.setAttribute("aria-label", "LinkedIn About text");
    field.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(field);
    field.select();
    try {
      success = document.execCommand("copy");
    } catch (_) {
      success = false;
    }
    field.remove();
    document.querySelector("#copy-about").focus();
  }
  copyStatus.textContent = window.portfolioMessage
    ? window.portfolioMessage(success ? "copied" : "copyFailed")
    : success
      ? "LinkedIn About copied."
      : "Open the full profile below to select and copy the About text.";
  if (!success) profileDetails.open = true;
});
let wasOpenBeforePrint = false;
window.addEventListener("beforeprint", () => {
  if (!profileDetails) return;
  wasOpenBeforePrint = profileDetails.open;
  profileDetails.open = true;
});
window.addEventListener("afterprint", () => {
  if (profileDetails) profileDetails.open = wasOpenBeforePrint;
});
document
  .querySelector("#print-profile")
  ?.addEventListener("click", () => window.print());

// Optional photographs: artwork remains visible until an image has loaded.
const configuredImages = window.PORTFOLIO_IMAGES || {};
document.querySelectorAll("[data-image-slot]").forEach((slot) => {
  const path = configuredImages[slot.dataset.imageSlot];
  if (typeof path !== "string" || !path.trim()) return;
  const picture = new Image();
  picture.alt = ""; // The containing profile or project heading provides the identity.
  picture.className = "project-image";
  picture.loading = slot.dataset.imageSlot === "portrait" ? "eager" : "lazy";
  picture.addEventListener("load", () => {
    slot.querySelectorAll("img").forEach((existing) => {
      if (existing !== picture) existing.remove();
    });
    slot.classList.add("has-image");
    if (slot.dataset.imageSlot === "portrait")
      slot.parentElement.classList.add("has-portrait");
  });
  picture.addEventListener("error", () => picture.remove());
  slot.appendChild(picture);
  picture.src = path;
});

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
function setMotionState() {
  document.documentElement.classList.toggle(
    "motion-paused",
    motionPreference.matches,
  );
}
motionPreference.addEventListener("change", setMotionState);
setMotionState();
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const art = document.querySelector(".hero-art");
art?.addEventListener("pointermove", (event) => {
  if (
    !finePointer.matches ||
    document.documentElement.classList.contains("motion-paused")
  )
    return;
  const bounds = art.getBoundingClientRect();
  art.style.setProperty(
    "--art-y",
    `${((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 9}deg`,
  );
  art.style.setProperty(
    "--art-x",
    `${(-(event.clientY - bounds.top - bounds.height / 2) / bounds.height) * 7}deg`,
  );
});
art?.addEventListener("pointerleave", () => {
  art.style.setProperty("--art-y", "0deg");
  art.style.setProperty("--art-x", "0deg");
});
document
  .querySelectorAll(".project-card,.recitation-card,.identity-cards article")
  .forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (
        !finePointer.matches ||
        document.documentElement.classList.contains("motion-paused")
      )
        return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
    });
  });

// Vary animation timing once per animation, with modestly faster playback.
const variedMotionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
const variedAnimations = new WeakSet();
function varyAnimationSpeeds() {
  if (variedMotionPreference.matches) return;
  document.getAnimations().forEach((animation) => {
    if (variedAnimations.has(animation)) return;
    animation.updatePlaybackRate(1.15 + Math.random() * 0.35);
    variedAnimations.add(animation);
  });
}
const ambient = document.createElement("div");
ambient.className = "page-ambient";
ambient.setAttribute("aria-hidden", "true");
document.body.appendChild(ambient);
window.addEventListener("load", varyAnimationSpeeds);
document.addEventListener("animationstart", varyAnimationSpeeds);
varyAnimationSpeeds();

// Keep language and navigation choices together in the mobile menu.
const mobileHeaderQuery = window.matchMedia("(max-width: 950px)");
const languageControl = document.querySelector(".language-control");
function positionHeaderOptions() {
  if (!languageControl || !navigation || !menuButton) return;
  if (mobileHeaderQuery.matches) navigation.appendChild(languageControl);
  else menuButton.before(languageControl);
}
mobileHeaderQuery.addEventListener("change", positionHeaderOptions);
positionHeaderOptions();
