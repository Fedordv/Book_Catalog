/**
 * Filter.js
 * Renders the "filter by author" input below the search bar.
 * Calls onFilter(authorQuery) with debounce.
 */

import { debounce } from '../utils/debounce.js';

/**
 * @param {HTMLElement} container  - where to render the filter
 * @param {Function}    onFilter   - callback(authorQuery: string)
 */
export function initFilter(container, onFilter) {
  container.innerHTML = `
    <div class="filter-bar">
      <span class="filter-bar__label">Filter by author:</span>
      <input
        class="filter-bar__input"
        id="author-filter"
        type="text"
        placeholder="e.g. Tolkien"
        aria-label="Filter results by author"
        autocomplete="off"
      />
    </div>
  `;

  const input = container.querySelector('#author-filter');

  // Re-filter 300ms after the user stops typing
  input.addEventListener('input', debounce((e) => {
    onFilter(e.target.value);
  }, 300));
}