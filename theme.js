(function () {
  const STORAGE_KEY = "ospalpiti.theme";
  const THEMES = new Set(["dark", "light"]);

  function getStoredTheme() {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return THEMES.has(value) ? value : null;
    } catch (error) {
      return null;
    }
  }

  function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored) return stored;
    if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
    return "dark";
  }

  function applyTheme(theme) {
    const nextTheme = THEMES.has(theme) ? theme : "dark";
    document.documentElement.dataset.theme = nextTheme;

    let meta = document.querySelector('meta[name="color-scheme"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "color-scheme";
      document.head.appendChild(meta);
    }
    meta.content = nextTheme === "dark" ? "dark light" : "light dark";

    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: nextTheme } }));
    updateThemeToggles(nextTheme);
  }

  function persistTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // localStorage can be unavailable in restricted browser contexts.
    }
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme || getPreferredTheme();
    const nextTheme = current === "dark" ? "light" : "dark";
    persistTheme(nextTheme);
    applyTheme(nextTheme);
  }

  function updateThemeToggles(theme) {
    document.querySelectorAll("[data-theme-toggle], .theme-toggle").forEach((button) => {
      const nextLabel = theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
      button.setAttribute("aria-label", nextLabel);
      button.setAttribute("title", nextLabel);
      button.textContent = theme === "dark" ? "Claro" : "Escuro";
    });
  }

  function bindThemeToggle(selector) {
    document.querySelectorAll(selector).forEach((button) => {
      button.dataset.themeToggle = "true";
      button.addEventListener("click", toggleTheme);
    });
    updateThemeToggles(document.documentElement.dataset.theme || getPreferredTheme());
  }

  applyTheme(getPreferredTheme());

  document.addEventListener("DOMContentLoaded", () => {
    bindThemeToggle("[data-theme-toggle], .theme-toggle");
  });

  window.OSPalpitiTheme = {
    getStoredTheme,
    getPreferredTheme,
    applyTheme,
    toggleTheme,
    bindThemeToggle,
  };
})();
