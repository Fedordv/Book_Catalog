/**
 * BookCard.js
 * Creates and returns a single book card DOM element.
 *
 * Pure function: data in → DOM element out.
 * No direct access to global state — everything is passed as arguments.
 */

import { getCoverUrl } from '../services/api.js';
import { isFavorite  } from '../utils/storage.js';

/**
 * Creates a book card element.
 * @param {Object}   book         - book data object from API
 * @param {Array}    favorites    - current favorites array (for heart state)
 * @param {Function} onFavToggle  - callback(book) when heart is clicked
 * @returns {HTMLElement}
 */
export function createBookCard(book, favorites, onFavToggle) {
  const card = document.createElement('article');
  card.className  = 'book-card';
  card.dataset.key = book.key; // needed to update heart state without re-render

  const coverUrl = getCoverUrl(book.cover_i, 'M');
  const fav      = isFavorite(favorites, book.key);
  const authors  = book.author_name
    ? book.author_name.join(', ')
    : 'Unknown author';

  card.innerHTML = `
    <div class="book-card__cover-wrap">

      ${coverUrl
        ? `<img
             class="book-card__cover"
             src="${escapeAttr(coverUrl)}"
             alt="${escapeAttr(book.title)}"
             loading="lazy"
           />`
        : `<div class="book-card__no-cover">
             <svg width="32" height="32" viewBox="0 0 24 24"
                  fill="none" stroke="#8a7f75" stroke-width="1.5">
               <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
               <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
             </svg>
             <span>No cover</span>
           </div>`
      }

      <button
        class="book-card__fav-btn ${fav ? 'is-fav' : ''}"
        aria-label="${fav ? 'Remove from favorites' : 'Add to favorites'}"
      >
        <svg class="heart-icon" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67
                   l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78
                   l1.06 1.06L12 21.23l7.78-7.78
                   1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

    </div>

    <div class="book-card__info">
      <div class="book-card__title">${escapeHtml(book.title)}</div>
      <div class="book-card__author">${escapeHtml(authors)}</div>
      ${book.first_publish_year
        ? `<div class="book-card__year">${book.first_publish_year}</div>`
        : ''}
    </div>
  `;

  // Heart button handler — stop propagation so the card click doesn't fire
  card.querySelector('.book-card__fav-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    onFavToggle(book);
  });

  return card;
}

/**
 * Updates only the heart button state on an existing card.
 * Avoids re-rendering the whole grid when favorites change.
 * @param {HTMLElement} card
 * @param {boolean}     isFav
 */
export function updateCardFavState(card, isFav) {
  const btn = card.querySelector('.book-card__fav-btn');
  if (!btn) return;
  btn.classList.toggle('is-fav', isFav);
  btn.setAttribute(
    'aria-label',
    isFav ? 'Remove from favorites' : 'Add to favorites'
  );
}

// --- Safety helpers to prevent XSS ---

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