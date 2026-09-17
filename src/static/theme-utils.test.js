const test = require("node:test");
const assert = require("node:assert/strict");
const { createThemeManager } = require("./theme-utils.js");

function createClassList() {
  const classNames = new Set();

  return {
    toggle(className, force) {
      if (typeof force === "boolean") {
        if (force) {
          classNames.add(className);
        } else {
          classNames.delete(className);
        }

        return force;
      }

      if (classNames.has(className)) {
        classNames.delete(className);
        return false;
      }

      classNames.add(className);
      return true;
    },
    contains(className) {
      return classNames.has(className);
    },
  };
}

function createElement() {
  return {
    attributes: {},
    textContent: "",
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    getAttribute(name) {
      return this.attributes[name];
    },
  };
}

function createManager({ storedTheme = null, prefersDark = false } = {}) {
  const body = { classList: createClassList() };
  const toggleButton = createElement();
  const toggleIcon = createElement();
  const toggleText = createElement();
  const storage = {
    getItem(key) {
      return key === "preferredTheme" ? storedTheme : null;
    },
    setItem() {},
    removeItem() {},
  };

  return {
    body,
    toggleButton,
    toggleText,
    manager: createThemeManager({
      storage,
      matchMedia: () => ({ matches: prefersDark }),
      body,
      toggleButton,
      toggleIcon,
      toggleText,
      logger: { warn() {} },
    }),
  };
}

test("loadThemePreference uses a stored dark theme", () => {
  const { body, toggleButton, toggleText, manager } = createManager({
    storedTheme: "dark",
  });

  manager.loadThemePreference();

  assert.equal(body.classList.contains("dark-mode"), true);
  assert.equal(toggleButton.getAttribute("aria-pressed"), "true");
  assert.equal(toggleText.textContent, "Use light mode");
});

test("loadThemePreference uses a stored light theme", () => {
  const { body, toggleButton, toggleText, manager } = createManager({
    storedTheme: "light",
  });

  manager.loadThemePreference();

  assert.equal(body.classList.contains("dark-mode"), false);
  assert.equal(toggleButton.getAttribute("aria-pressed"), "false");
  assert.equal(toggleText.textContent, "Use dark mode");
});

test("loadThemePreference falls back to light mode for invalid stored values", () => {
  const { body, manager } = createManager({
    storedTheme: "sepia",
    prefersDark: false,
  });

  manager.loadThemePreference();

  assert.equal(body.classList.contains("dark-mode"), false);
});

test("loadThemePreference follows system dark mode when storage is invalid", () => {
  const { body, toggleText, manager } = createManager({
    storedTheme: "sepia",
    prefersDark: true,
  });

  manager.loadThemePreference();

  assert.equal(body.classList.contains("dark-mode"), true);
  assert.equal(toggleText.textContent, "Use light mode");
});
