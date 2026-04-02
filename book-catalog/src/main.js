/**
 * main.js
 * Application entry point.
 *
 * Responsibilities:
 *  - Holds the app state (favorites, search results, author filter)
 *  - Initializes all components
 *  - Wires components together via callbacks
 *
 * Components are pure renderers — they call back into main.js
 * when something happens. main.js updates state and re-renders.
 */

import './styles/main.css';

import { searchBooks }                        from './services/api.js';
import { loadFavorites, saveFavorites,
         isFavorite }                         from './utils/storage.js';
import { initSearch }                         from './components/Search.js';
import { initFilter }                         from './components/Filter.js';
import { initTheme }                          from './components/Theme.js';
import { createBookCard, updateCardFavState } from './components/BookCard.js';
import { renderFavorites }                    from './components/Favorites.js';

// DOM containers (declared in index.html)
const searchContainer   = document.getElementById('search-container');
const filterContainer   = document.getElementById('filter-container');
const themeContainer    = document.getElementById('theme-toggle-container');
const favContainer      = document.getElementById('favorites-container');
const booksGrid         = document.getElementById('books-grid');
const resultsTitle      = document.getElementById('results-title');

// Application state
let favorites   = loadFavorites(); // Array<book> — persisted in localStorage
let allResults  = [];              // Array<book> — last API response
let authorQuery = '';              // string — current author filter value

// Theme
initTheme(themeContainer);

// Search
initSearch(searchContainer, handleSearch);

// Author filter (bonus feature)
initFilter(filterContainer, (query) => {
  authorQuery = query;
  renderGrid(allResults); // re-filter already loaded results, no new fetch
});

// Favorites — initial render
renderFavorites(favContainer, favorites, handleRemoveFavorite);

// Initial grid state

const DEFAULT_QUERIES = [
  'harry potter',
  'lord of the rings',
  'sherlock holmes',
  'dracula',
  'pride and prejudice',
  'the hobbit'
];

async function loadDefaultCatalog() {
  showStatus('loading');
  try {
    const picked = DEFAULT_QUERIES
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Promise.allSettled istead of Promise.all
    const results = await Promise.allSettled(
      picked.map(q => searchBooks(q, 20))
    );

    // take only successful results
    allResults = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value)
      .sort(() => Math.random() - 0.5);

    if (allResults.length === 0) {
      showStatus('error');
    } else {
      renderGrid(allResults);
    }
  } catch {
    showStatus('error');
  }
}

loadDefaultCatalog(); 

// Handlers

/** Called by Search.js when user submits a query */
async function handleSearch(query) {
  if (!query.trim() || query.trim().length < 2) {
    allResults.length > 0 ? renderGrid(allResults) : loadDefaultCatalog();
    return;
  }

  showStatus('loading');
  resultsTitle.textContent = '';
  allResults = [];

  try {
    allResults = await searchBooks(query, 24);
    renderGrid(allResults);
  } catch (err) {
    if (err.message.includes('503')) {
      showStatus('error', 'Open Library is temporarily unavailable. Try again in a moment.');
    } else {
      showStatus('error', err.message);
    }
  }
}

initFilter(filterContainer, async (query) => {
  authorQuery = query;

  if (allResults.length === 0 && query.trim().length >= 2) {
    showStatus('loading');
    try {
      allResults = await searchBooks(query, 24);
    } catch {
      showStatus('error');
      return;
    }
  }

  renderGrid(allResults);
});

/** Toggle a book in/out of favorites */
function handleFavToggle(book) {
  if (isFavorite(favorites, book.key)) {
    favorites = favorites.filter((b) => b.key !== book.key);
  } else {
    favorites = [...favorites, book];
  }

  saveFavorites(favorites);

  // Update sidebar
  renderFavorites(favContainer, favorites, handleRemoveFavorite);

  // Update hearts on existing cards — no full grid re-render needed
  booksGrid.querySelectorAll('.book-card').forEach((card) => {
    updateCardFavState(card, isFavorite(favorites, card.dataset.key));
  });
}

/** Remove a book from favorites (called from the sidebar) */
function handleRemoveFavorite(key) {
  favorites = favorites.filter((b) => b.key !== key);
  saveFavorites(favorites);

  renderFavorites(favContainer, favorites, handleRemoveFavorite);

  // Sync hearts on grid
  booksGrid.querySelectorAll('.book-card').forEach((card) => {
    updateCardFavState(card, isFavorite(favorites, card.dataset.key));
  });
}

// Rendering helpers

/**
 * Renders the books grid.
 * Applies the current authorQuery filter before rendering.
 * @param {Array} books - full results from API
 */
function renderGrid(books) {
  // Apply author filter if set
  const filtered = authorQuery
    ? books.filter((b) =>
        b.author_name &&
        b.author_name.some((a) =>
          a.toLowerCase().includes(authorQuery.toLowerCase())
        )
      )
    : books;

  if (filtered.length === 0) {
    showStatus('no-results');
    resultsTitle.textContent = '';
    return;
  }

  resultsTitle.textContent =
    `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`;

  booksGrid.innerHTML = '';

  filtered.forEach((book, i) => {
    const card = createBookCard(book, favorites, handleFavToggle);
    // Staggered fade-in: each card appears slightly after the previous
    card.style.animationDelay = `${i * 25}ms`;
    booksGrid.appendChild(card);
  });
}

/**
 * Replaces the grid contents with a status message.
 * @param {'loading'|'error'|'no-query'|'no-results'} type
 * @param {string} [detail] - optional error detail
 */
function showStatus(type, detail = '') {
  const html = {
    loading: `
      <div class="status-msg status-msg--loading">
        <div class="spinner"></div>
        <p>Searching books...</p>
      </div>`,

    error: `
      <div class="status-msg">
        <div class="status-msg__icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>${detail || 'Could not connect to Open Library.'}</p>
      </div>`,

    'no-query': `
      <div class="status-msg">
        <div class="status-msg__icon">🔍</div>
        <h3>Start searching</h3>
        <p>Enter a title, author, or keyword above.</p>
      </div>`,

    'no-results': `
      <div class="status-msg">
        <div class="status-msg__icon">📭</div>
        <h3>Nothing found</h3>
        <p>Try a different term or remove the author filter.</p>
      </div>`,
  };

  booksGrid.innerHTML = html[type] || '';
}