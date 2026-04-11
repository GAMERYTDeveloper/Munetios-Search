/**
 * munetios-pronounce.js
 * Forces all Web Speech API voices to pronounce "Munetios" correctly
 * as "moo NEH tee ohs" by patching SpeechSynthesisUtterance.
 */
(function () {
  "use strict";

  // Phonetic replacement that TTS engines read as "moo-NEH-tee-ohs"
  var PHONETIC = "moo neh tee ohs";
  var REGEX = /munetios/gi;

  function applyPhonetics(text) {
    if (typeof text === "string") {
      return text.replace(REGEX, PHONETIC);
    }
    return text;
  }

  if (!window.SpeechSynthesisUtterance) return; // API not supported

  var OriginalUtterance = window.SpeechSynthesisUtterance;
  var textDescriptor = Object.getOwnPropertyDescriptor(
    OriginalUtterance.prototype,
    "text",
  );

  // Wrap the constructor
  function PatchedSpeechSynthesisUtterance(text) {
    var utt = new OriginalUtterance(applyPhonetics(text));

    // Also intercept any later assignments to .text
    if (textDescriptor && textDescriptor.set) {
      Object.defineProperty(utt, "text", {
        get: function () {
          return textDescriptor.get.call(utt);
        },
        set: function (val) {
          textDescriptor.set.call(utt, applyPhonetics(val));
        },
        configurable: true,
        enumerable: true,
      });
    }

    return utt;
  }

  // Preserve prototype chain so `instanceof` checks still work
  PatchedSpeechSynthesisUtterance.prototype = OriginalUtterance.prototype;
  Object.defineProperty(PatchedSpeechSynthesisUtterance, "prototype", {
    writable: false,
  });

  window.SpeechSynthesisUtterance = PatchedSpeechSynthesisUtterance;
})();
