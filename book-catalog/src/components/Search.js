/**
 * Search.js
 * Renders the search bar and wires up its events.
 * Calls onSearch(query) when the user submits.
 */

import { debounce } from '../utils/debounce.js';

/**
 * @param {HTMLElement} container  - where to render the search bar
 * @param {Function}    onSearch   - callback(query: string)
 */
export function initSearch(container, onSearch) {
  // --- Render ---
  container.innerHTML = `
    <div class="search-bar" role="search">
      <span class="search-bar__icon">
        <img src="src/assets/search.svg" alt="" width="16" height="16" />
      </span>
      <input
        class="search-bar__input"
        id="search-input"
        type="search"
        placeholder="Search for books by title or author..."
        aria-label="Search books"
        autocomplete="off"
      />
      <button class="search-bar__btn" id="search-btn" type="button">
        Search
      </button>
    </div>
  `;

  const input = container.querySelector('#search-input');
  const btn   = container.querySelector('#search-btn');

  // Click on the Search button
  btn.addEventListener('click', () => onSearch(input.value));

  // Enter key inside the input
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSearch(input.value);
  });

  // Live search — fires 600ms after the user stops typing (bonus feature)
  input.addEventListener('input', debounce((e) => {
    onSearch(e.target.value);
  }, 600));
}