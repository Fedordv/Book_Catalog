/**
 * Favorites.js
 * Renders the favorites sidebar panel.
 * Re-renders fully on every change — panel is small so this is fine.
 */

import { getCoverUrl } from '../services/api.js';

/**
 * Renders (or re-renders) the favorites panel inside container.
 * @param {HTMLElement} container  - sidebar wrapper element
 * @param {Array}       favorites  - current favorites array
 * @param {Function}    onRemove   - callback(key: string) to remove a book
 */
export function renderFavorites(container, favorites, onRemove) {
  const count = favorites.length;

  container.innerHTML = `
    <aside class="sidebar" aria-label="Favorites">
      <div class="sidebar__header">
        <svg class="sidebar__heart" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67
                   l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78
                   l1.06 1.06L12 21.23l7.78-7.78
                   1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <h2 class="sidebar__title">Favorites</h2>
      </div>

      <p class="sidebar__count">
        ${count === 1 ? '1 book saved' : `${count} books saved`}
      </p>

      ${count === 0
        ? `<p class="sidebar__empty">
             Click ♡ on any card to save a book here.
           </p>`
        : `<ul class="fav-list" aria-label="Favorite books">
             ${favorites.map((book) => _favItemHTML(book)).join('')}
           </ul>`
      }
    </aside>
  `;

  // Wire up remove buttons after innerHTML is set
  container.querySelectorAll('.fav-item__remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      onRemove(btn.dataset.key);
    });
  });
}

/**
 * Returns HTML string for a single favorite item.
 * @param {Object} book
 * @returns {string}
 */
function _favItemHTML(book) {
  const coverUrl = getCoverUrl(book.cover_i, 'S');
  const author   = book.author_name ? book.author_name[0] : 'Unknown';

  return `
    <li class="fav-item">
      ${coverUrl
        ? `<img class="fav-item__thumb"
                src="${escapeAttr(coverUrl)}"
                alt="${escapeAttr(book.title)}"
                loading="lazy" />`
        : `<div class="fav-item__thumb-placeholder"></div>`
      }
      <div class="fav-item__info">
        <div class="fav-item__title">${escapeHtml(book.title)}</div>
        <div class="fav-item__author">${escapeHtml(author)}</div>
        ${book.first_publish_year
          ? `<div class="fav-item__year">${book.first_publish_year}</div>`
          : ''}
      </div>
      <button
        class="fav-item__remove"
        data-key="${escapeAttr(book.key)}"
        aria-label="Remove ${escapeAttr(book.title)} from favorites"
      >
        <svg viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </li>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;');
}