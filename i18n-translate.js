(function () {
  const SOURCE_LANG = "en";
  const STORAGE_KEY = "munetios_ui_lang";

  const languageMap = {
    af: "Afrikaans", sq: "Albanian", am: "Amharic", ar: "Arabic", hy: "Armenian", az: "Azerbaijani",
    eu: "Basque", be: "Belarusian", bn: "Bengali", bs: "Bosnian", bg: "Bulgarian", ca: "Catalan",
    ceb: "Cebuano", ny: "Chichewa", zh: "Chinese (Simplified)", "zh-TW": "Chinese (Traditional)", co: "Corsican",
    hr: "Croatian", cs: "Czech", da: "Danish", nl: "Dutch", en: "English", eo: "Esperanto",
    et: "Estonian", tl: "Filipino", fi: "Finnish", fr: "French", fy: "Frisian", gl: "Galician",
    ka: "Georgian", de: "German", el: "Greek", gu: "Gujarati", ht: "Haitian Creole", ha: "Hausa",
    haw: "Hawaiian", iw: "Hebrew", hi: "Hindi", hmn: "Hmong", hu: "Hungarian", is: "Icelandic",
    ig: "Igbo", id: "Indonesian", ga: "Irish", it: "Italian", ja: "Japanese", jw: "Javanese",
    kn: "Kannada", kk: "Kazakh", km: "Khmer", ko: "Korean", ku: "Kurdish (Kurmanji)", ky: "Kyrgyz",
    lo: "Lao", la: "Latin", lv: "Latvian", lt: "Lithuanian", lb: "Luxembourgish", mk: "Macedonian",
    mg: "Malagasy", ms: "Malay", ml: "Malayalam", mt: "Maltese", mi: "Maori", mr: "Marathi",
    mn: "Mongolian", my: "Myanmar (Burmese)", ne: "Nepali", no: "Norwegian", or: "Odia", ps: "Pashto",
    fa: "Persian", pl: "Polish", pt: "Portuguese", pa: "Punjabi", ro: "Romanian", ru: "Russian",
    sm: "Samoan", gd: "Scots Gaelic", sr: "Serbian", st: "Sesotho", sn: "Shona", sd: "Sindhi",
    si: "Sinhala", sk: "Slovak", sl: "Slovenian", so: "Somali", es: "Spanish", su: "Sundanese",
    sw: "Swahili", sv: "Swedish", tg: "Tajik", ta: "Tamil", te: "Telugu", th: "Thai",
    tr: "Turkish", uk: "Ukrainian", ur: "Urdu", ug: "Uyghur", uz: "Uzbek", vi: "Vietnamese",
    cy: "Welsh", xh: "Xhosa", yi: "Yiddish", yo: "Yoruba", zu: "Zulu"
  };

  const includedLanguages = Object.keys(languageMap).join(",");

  function normalizeLang(code) {
    if (!code) return "en";
    const clean = String(code).trim().replace("_", "-");
    if (languageMap[clean]) return clean;
    const base = clean.toLowerCase().split("-")[0];
    if (languageMap[base]) return base;
    return "en";
  }

  function detectPreferredLanguage() {
    const explicit = localStorage.getItem(STORAGE_KEY);
    if (explicit) return normalizeLang(explicit);

    const preferred = Array.isArray(navigator.languages) ? navigator.languages : [navigator.language || "en"];
    for (const item of preferred) {
      const normalized = normalizeLang(item);
      if (normalized !== "en") return normalized;
    }
    return "en";
  }

  function setGoogTransCookie(langCode) {
    const target = langCode === "en" ? SOURCE_LANG : langCode;
    const value = `/en/${target}`;
    document.cookie = `googtrans=${value};path=/;max-age=31536000`;
    document.cookie = `googtrans=${value};path=/;domain=${location.hostname};max-age=31536000`;
  }

  function triggerTranslate(langCode) {
    const combo = document.querySelector(".goog-te-combo");
    if (!combo) return;

    combo.value = langCode;
    combo.dispatchEvent(new Event("change"));
  }

  function applyLanguage(langCode) {
    const normalized = normalizeLang(langCode);
    localStorage.setItem(STORAGE_KEY, normalized);
    setGoogTransCookie(normalized);
    document.documentElement.setAttribute("lang", normalized === "en" ? "en" : normalized);

    const label = document.getElementById("munetios-translate-current");
    if (label) {
      label.textContent = languageMap[normalized] || "English";
    }

    if (window.google && window.google.translate) {
      triggerTranslate(normalized);
    }
  }

  function buildTranslatorUI() {
    if (document.getElementById("munetios-translate-launcher")) return;

    const wrapper = document.createElement("div");
    wrapper.id = "munetios-translate-launcher";
    wrapper.innerHTML = `
      <button id="munetios-translate-toggle" aria-label="Open language selector" type="button">
        🌐 <span id="munetios-translate-current">English</span>
      </button>
      <div id="munetios-translate-panel" hidden>
        <label for="munetios-translate-select">Translate UI</label>
        <select id="munetios-translate-select"></select>
      </div>
    `;

    document.body.appendChild(wrapper);

    const panel = document.getElementById("munetios-translate-panel");
    const toggle = document.getElementById("munetios-translate-toggle");
    const select = document.getElementById("munetios-translate-select");

    Object.entries(languageMap)
      .sort((a, b) => a[1].localeCompare(b[1]))
      .forEach(([code, name]) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = `${name} (${code})`;
        select.appendChild(option);
      });

    toggle.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
    });

    select.addEventListener("change", function () {
      applyLanguage(select.value);
    });

    const initial = detectPreferredLanguage();
    select.value = initial;
    applyLanguage(initial);
  }

  function injectStyles() {
    if (document.getElementById("munetios-translate-style")) return;

    const style = document.createElement("style");
    style.id = "munetios-translate-style";
    style.textContent = `
      .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon, #goog-gt-tt { display: none !important; }
      body { top: 0 !important; }
      #munetios-translate-launcher { position: fixed; right: 16px; bottom: 16px; z-index: 2147483647; font-family: inherit; }
      #munetios-translate-toggle { border: 1px solid rgba(255,255,255,.25); background: rgba(40, 16, 96, .92); color: #fff; border-radius: 999px; padding: 10px 14px; cursor: pointer; }
      #munetios-translate-panel { margin-top: 8px; background: rgba(24, 9, 58, .96); color: #fff; border-radius: 12px; padding: 10px; border: 1px solid rgba(255,255,255,.2); min-width: 240px; }
      #munetios-translate-panel label { display: block; margin-bottom: 6px; font-size: 12px; opacity: .9; }
      #munetios-translate-select { width: 100%; padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,.25); background: #fff; color: #111; }
      #google_translate_element { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
    `;
    document.head.appendChild(style);
  }

  window.munetiosGoogleTranslateInit = function () {
    new google.translate.TranslateElement(
      {
        pageLanguage: SOURCE_LANG,
        includedLanguages,
        autoDisplay: false,
      },
      "google_translate_element",
    );

    const selected = normalizeLang(localStorage.getItem(STORAGE_KEY) || detectPreferredLanguage());
    setTimeout(function () {
      triggerTranslate(selected);
    }, 600);
  };

  function loadGoogleTranslate() {
    if (document.getElementById("google_translate_element")) return;

    const host = document.createElement("div");
    host.id = "google_translate_element";
    document.body.appendChild(host);

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=munetiosGoogleTranslateInit";
    script.async = true;
    document.head.appendChild(script);
  }

  function init() {
    injectStyles();
    buildTranslatorUI();
    loadGoogleTranslate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
