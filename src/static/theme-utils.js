function createThemeManager({
  storage,
  matchMedia,
  body,
  toggleButton,
  toggleIcon,
  toggleText,
  themeStorageKey = "preferredTheme",
  logger = console,
}) {
  function accessStoredItem(action, key, value = null) {
    if (!storage) {
      return null;
    }

    try {
      if (action === "get") {
        return storage.getItem(key);
      }

      if (action === "set") {
        storage.setItem(key, value);
      }

      if (action === "remove") {
        storage.removeItem(key);
      }
    } catch (error) {
      const actionLabels = {
        get: "read",
        set: "save",
        remove: "remove",
      };

      logger.warn(
        `Unable to ${actionLabels[action] || "access"} ${key} in local storage.`,
        error
      );
    }

    return null;
  }

  function getStoredItem(key) {
    return accessStoredItem("get", key);
  }

  function setStoredItem(key, value) {
    accessStoredItem("set", key, value);
  }

  function removeStoredItem(key) {
    accessStoredItem("remove", key);
  }

  function applyTheme(theme) {
    const isDarkMode = theme === "dark";

    body.classList.toggle("dark-mode", isDarkMode);

    if (!toggleButton || !toggleIcon || !toggleText) {
      return;
    }

    toggleButton.setAttribute("aria-pressed", String(isDarkMode));
    toggleButton.setAttribute(
      "aria-label",
      isDarkMode ? "Switch to light mode" : "Switch to dark mode"
    );
    toggleIcon.textContent = isDarkMode ? "☀️" : "🌙";
    toggleText.textContent = isDarkMode ? "Use light mode" : "Use dark mode";
  }

  function getPreferredTheme() {
    const savedTheme = getStoredItem(themeStorageKey);
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    if (
      typeof matchMedia === "function" &&
      matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  }

  function loadThemePreference() {
    applyTheme(getPreferredTheme());
  }

  function toggleTheme() {
    const nextTheme = body.classList.contains("dark-mode") ? "light" : "dark";

    setStoredItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
  }

  return {
    getStoredItem,
    setStoredItem,
    removeStoredItem,
    applyTheme,
    getPreferredTheme,
    loadThemePreference,
    toggleTheme,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { createThemeManager };
}

if (typeof window !== "undefined") {
  window.createThemeManager = createThemeManager;
}
