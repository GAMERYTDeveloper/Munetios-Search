/**
 * schoolModeCheck.js
 * Provided by Munetios - sites creator.
 * Reusable utility to detect and handle Munetios School Mode activation.
 */
(function () {
  'use strict';

  // 1. Check URL parameters and persist state if requested
  try {
    const params = new URLSearchParams(window.location.search || "");
    if (params.get("schoolMode") === "true") {
      localStorage.setItem("schoolMode", "true");
    }
  } catch (e) {
    console.warn("Storage access restricted:", e);
  }

  // 2. Global API Object matching the site environment
  window.MunetiosSchoolMode = {
    /**
     * Checks if School Mode is currently enabled.
     * @returns {boolean} True if school mode is active.
     */
    isEnabled: function () {
      try {
        return localStorage.getItem("schoolMode") === "true";
      } catch (_) {
        return false;
      }
    },

    /**
     * Forcefully enables school mode.
     */
    enable: function () {
      try {
        localStorage.setItem("schoolMode", "true");
        window.dispatchEvent(new Event("schoolModeChanged"));
      } catch (_) {}
    },

    /**
     * Disables school mode.
     */
    disable: function () {
      try {
        localStorage.removeItem("schoolMode");
        window.dispatchEvent(new Event("schoolModeChanged"));
      } catch (_) {}
    }
  };

  // 3. Optional automated defensive actions for external integration
  document.addEventListener("DOMContentLoaded", function () {
    if (window.MunetiosSchoolMode.isEnabled()) {
      // Custom enforcement logic for pages can go here
      // e.g., document.body.classList.add("school-mode-active");
      console.log("Munetios School Mode is actively monitoring this environment.");
    }
  });
})();
