/**
 * Theme.js
 * Renders the dark/light toggle button and manages theme state.
 * Theme is stored in localStorage and respects prefers-color-scheme.
 *
 * Strategy: the entire theme switch is just toggling
 * data-theme="dark" on <html>. CSS variables do the rest.
 */

const THEME_KEY = 'book_catalog_theme';

/** Apply saved or system-preferred theme on page load */
export function initTheme(container) {
  const stored    = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark' : 'light';

  _applyTheme(stored || preferred);
  _renderButton(container);
}

/** Toggle between dark and light */
function _toggle(container) {
  const current = document.documentElement.dataset.theme || 'light';
  _applyTheme(current === 'dark' ? 'light' : 'dark');
  _renderButton(container); // re-render button label
}

/** Apply theme to <html> and persist */
function _applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

/** Render (or re-render) the toggle button */
function _renderButton(container) {
  const dark = document.documentElement.dataset.theme === 'dark';
  container.innerHTML = `
    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
      ${dark ? '☀️ Light mode' : '🌙 Dark mode'}
    </button>
  `;
  container.querySelector('#theme-toggle').addEventListener('click', () => {
    _toggle(container);
  });
}