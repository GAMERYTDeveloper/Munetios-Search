/**
 * munetios-pronounce.js (Exclude Google & Microsoft voices)
 */
(function () {
  "use strict";

  var PHONETIC = "moo neh tee ohs";
  var REGEX = /munetios/gi;

  function applyPhonetics(text) {
    return typeof text === "string"
      ? text.replace(REGEX, PHONETIC)
      : text;
  }

  if (!window.SpeechSynthesisUtterance) return;

  var OriginalUtterance = window.SpeechSynthesisUtterance;

  function isExcludedVoice(voice) {
    if (!voice) return false;
    var name = (voice.name || "").toLowerCase();
    var vendor = (voice.voiceURI || "").toLowerCase();

    return (
      name.includes("google") ||
      name.includes("microsoft") ||
      vendor.includes("google") ||
      vendor.includes("microsoft")
    );
  }

  function PatchedSpeechSynthesisUtterance(text) {
    var utt = new OriginalUtterance(text);

    function patchIfNeeded() {
      if (!isExcludedVoice(utt.voice)) {
        utt.text = applyPhonetics(utt.text);
      }
    }

    // Patch initial text
    patchIfNeeded();

    // Intercept future .text changes
    var _text = utt.text;
    Object.defineProperty(utt, "text", {
      get: function () {
        return _text;
      },
      set: function (val) {
        _text = isExcludedVoice(utt.voice)
          ? val
          : applyPhonetics(val);
      },
      configurable: true,
      enumerable: true,
    });

    // Also patch when voice changes later
    var _voice = utt.voice;
    Object.defineProperty(utt, "voice", {
      get: function () {
        return _voice;
      },
      set: function (v) {
        _voice = v;
        patchIfNeeded();
      },
      configurable: true,
      enumerable: true,
    });

    return utt;
  }

  PatchedSpeechSynthesisUtterance.prototype =
    OriginalUtterance.prototype;

  Object.defineProperty(PatchedSpeechSynthesisUtterance, "prototype", {
    writable: false,
  });

  window.SpeechSynthesisUtterance =
    PatchedSpeechSynthesisUtterance;
})();
