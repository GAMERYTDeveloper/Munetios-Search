/**
 * munetios-pronounce.js
 * Only applies in Safari.
 * Forces Web Speech API voices to pronounce "Munetios" as "moo neh tee ohs"
 * by patching SpeechSynthesisUtterance.
 */
(function () {
  "use strict";

  function isSafari() {
    var ua = navigator.userAgent;
    var vendor = navigator.vendor || "";

    return (
      /Safari/i.test(ua) &&
      /Apple/i.test(vendor) &&
      !/CriOS|Chrome|Chromium|MunetiosWebView|Edg|OPR|Firefox|FxiOS|SamsungBrowser|DuckDuckGo/i.test(ua)
    );
  }

  if (!isSafari()) return;

  var PHONETIC = "moo neh tee ohs";
  var REGEX = /munetios/gi;

  function applyPhonetics(text) {
    if (typeof text === "string") {
      return text.replace(REGEX, PHONETIC);
    }
    return text;
  }

  if (!window.SpeechSynthesisUtterance) return;

  var OriginalUtterance = window.SpeechSynthesisUtterance;
  var textDescriptor = Object.getOwnPropertyDescriptor(
    OriginalUtterance.prototype,
    "text"
  );

  function PatchedSpeechSynthesisUtterance(text) {
    var utt = new OriginalUtterance(applyPhonetics(text));

    if (textDescriptor && textDescriptor.set) {
      Object.defineProperty(utt, "text", {
        get: function () {
          return textDescriptor.get.call(utt);
        },
        set: function (val) {
          textDescriptor.set.call(utt, applyPhonetics(val));
        },
        configurable: true,
        enumerable: true
      });
    }

    return utt;
  }

  PatchedSpeechSynthesisUtterance.prototype = OriginalUtterance.prototype;

  Object.defineProperty(PatchedSpeechSynthesisUtterance, "prototype", {
    writable: false
  });

  window.SpeechSynthesisUtterance = PatchedSpeechSynthesisUtterance;
})();
