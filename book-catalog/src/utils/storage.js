/**
 * storage.js
 * Thin wrapper around localStorage for persisting the favorites list.
 * Keeps the storage key and JSON serialization in one place.
 */

const STORAGE_KEY = 'book_catalog_favorites';

/**
 * Loads the favorites array from localStorage.
 * Returns an empty array if nothing is stored or JSON is corrupted.
 * @returns {Array}
 */
export function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Persists the favorites array to localStorage.
 * @param {Array} favorites
 */
export function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }
}

/**
 * Checks whether a book is already in the favorites list.
 * @param {Array}  favorites
 * @param {string} key - book.key from Open Library
 * @returns {boolean}
 */
export function isFavorite(favorites, key) {
  return favorites.some((b) => b.key === key);
}