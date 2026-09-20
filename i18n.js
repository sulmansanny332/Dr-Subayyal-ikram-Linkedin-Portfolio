"use strict";
(() => {
  const dictionary = window.PORTFOLIO_TRANSLATIONS || {};
  const selector = document.querySelector("#language-select");
  const languages = ["en", "ur", "ar"];
  let language = "en";
  const extra = {
    "Main navigation": { ur: "مرکزی نیویگیشن", ar: "التنقل الرئيسي" },
    "Dr. Subayyal Ikram home": {
      ur: "ڈاکٹر صبیّل اکرام — مرکزی صفحہ",
      ar: "الدكتور صبيّل إكرام — الصفحة الرئيسية",
    },
    "Filter projects by location": {
      ur: "مقام کے لحاظ سے منصوبے منتخب کریں",
      ar: "تصفية المشروعات حسب الموقع",
    },
    "Core values": { ur: "بنیادی اقدار", ar: "القيم الأساسية" },
    "Begin with Bismillah. Work with amanah. Grow with gratitude.": {
      ur: "بسم اللہ سے آغاز، امانت سے کام، شکر کے ساتھ ترقی۔",
      ar: "ابدأ ببسم الله، واعمل بأمانة، وتقدّم بالشكر.",
    },
    "Dr. Subayyal Ikram — real estate leadership, Quran recitation and a life guided by faith. Explore his professional journey and portfolio.":
      {
        ur: "ڈاکٹر صبیّل اکرام — رئیل اسٹیٹ قیادت، قرآن کی تلاوت اور ایمان کی رہنمائی میں زندگی۔ ان کا سفر اور منصوبے جانیں۔",
        ar: "الدكتور صبيّل إكرام — قيادة عقارية وتلاوة للقرآن وحياة تسترشد بالإيمان. اكتشف مسيرته ومشروعاته.",
      },
  };
  function translate(text, lang) {
    if (lang === "en") return text;
    const direct = dictionary[text]?.[lang] || extra[text]?.[lang];
    if (direct) return direct;
    const projectLabel = text.match(/^Explore (.+) on ABS Developers$/);
    if (projectLabel)
      return lang === "ur"
        ? `${translate(projectLabel[1], lang)} — اے بی ایس پر دیکھیں`
        : `استكشف ${translate(projectLabel[1], lang)} لدى إيه بي إس`;
    const picture = text.match(/^(.+) project image$/);
    if (picture)
      return lang === "ur"
        ? `${translate(picture[1], lang)} کی تصویر`
        : `صورة مشروع ${translate(picture[1], lang)}`;
    return text;
  }
  const nodes = [];
  const walker = document.createTreeWalker(
    document.documentElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (
          !node.nodeValue.trim() ||
          node.parentElement.closest("script,style,option")
        )
          return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );
  while (walker.nextNode())
    nodes.push({
      node: walker.currentNode,
      original: walker.currentNode.nodeValue,
    });
  const attributes = [];
  document
    .querySelectorAll('[aria-label],[alt],[title],meta[name="description"]')
    .forEach((element) => {
      for (const name of ["aria-label", "alt", "title", "content"]) {
        if (element.hasAttribute(name))
          attributes.push({
            element,
            name,
            original: element.getAttribute(name),
          });
      }
    });
  window.portfolioMessage = (type, count = 0) => {
    const messages = {
      en: {
        copied: "LinkedIn About copied.",
        copyFailed:
          "Open the full profile below to select and copy the About text.",
        projects: `${count} projects shown.`,
      },
      ur: {
        copied: "لنکڈ اِن کا تعارف کاپی ہو گیا۔",
        copyFailed:
          "تعارف منتخب کرکے کاپی کرنے کے لیے نیچے مکمل پروفائل کھولیں۔",
        projects: `${count} منصوبے دکھائے جا رہے ہیں۔`,
      },
      ar: {
        copied: "تم نسخ مقدمة لينكدإن.",
        copyFailed: "افتح الملف الكامل أدناه لتحديد نص المقدمة ونسخه.",
        projects: `عدد المشروعات المعروضة: ${count}.`,
      },
    };
    return messages[language][type] || "";
  };
  const aboutHeading = [...document.querySelectorAll(".archive h2")].find(
    (element) => element.textContent.startsWith("About —"),
  );
  window.portfolioAboutText = () => {
    const paragraphs = [];
    for (
      let element = aboutHeading?.nextElementSibling;
      element && element.tagName !== "H2";
      element = element.nextElementSibling
    )
      paragraphs.push(element.textContent);
    return paragraphs.join("\n\n");
  };
  const pageLinks = [...document.querySelectorAll("[data-page-link]")].map(
    (link) => ({ link, original: link.getAttribute("href") }),
  );
  function applyLanguage(next) {
    language = languages.includes(next) ? next : "en";
    document.documentElement.lang = language;
    document.documentElement.dir = language === "en" ? "ltr" : "rtl";
    selector.value = language;
    nodes.forEach(({ node, original }) => {
      const content = original.trim();
      const replacement = translate(content, language);
      node.nodeValue = original.replace(content, replacement);
      // The Arabic quote uses Quranic brackets rather than English quote marks.
      if (
        language === "ar" &&
        content === "”" &&
        node.parentElement.closest("blockquote")
      )
        node.nodeValue = "";
    });
    attributes.forEach(({ element, name, original }) =>
      element.setAttribute(name, translate(original, language)),
    );
    const copyStatus = document.querySelector("#copy-status");
    if (copyStatus) copyStatus.textContent = "";
    const count = document.querySelectorAll(
      ".project-card:not([hidden])",
    ).length;
    const projectStatus = document.querySelector("#project-status");
    if (projectStatus)
      projectStatus.textContent = window.portfolioMessage("projects", count);
    pageLinks.forEach(({ link, original }) => {
      const target = new URL(original, location.href);
      if (language === "en") target.searchParams.delete("lang");
      else target.searchParams.set("lang", language);
      link.setAttribute(
        "href",
        target.pathname.split("/").pop() + target.search + target.hash,
      );
    });
    // Do not move the user's scroll or collapse their expanded biography.
    window.dispatchEvent(new Event("resize"));
    document.dispatchEvent(
      new CustomEvent("portfolio:language", { detail: language }),
    );
  }
  selector.addEventListener("change", (event) =>
    applyLanguage(event.target.value),
  );
  const download = document.querySelector(".profile-tools a[download]");
  download?.addEventListener("click", (event) => {
    event.preventDefault();
    const archive = document.querySelector(".archive");
    const content = [...archive.children]
      .map((element) => {
        if (element.querySelector("table"))
          return [...element.querySelectorAll("tr")]
            .map((row) =>
              [...row.children].map((cell) => cell.textContent).join(" | "),
            )
            .join("\n");
        return element.textContent;
      })
      .join("\n\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + content], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `Dr_Subayyal_Ikram_Profile_${language}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  // New visits default to English; internal links carry the selected language.
  applyLanguage(new URLSearchParams(location.search).get("lang") || "en");
  window.portfolioLanguage = {
    set: applyLanguage,
    get: () => language,
    translate,
  };
})();
