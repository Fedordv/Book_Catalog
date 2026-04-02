/**
 * api.js
 * All communication with the Open Library public API.
 * No business logic here — only fetch calls and URL builders.
 */

// Прямой доступ к Open Library
const BASE_URL  = 'https://openlibrary.org';
const COVER_URL = 'https://covers.openlibrary.org/b/id';

/**
 * Returns a cover image URL for a given cover ID.
 * @param {number|undefined} coverId - the cover_i field from API
 * @param {'S'|'M'|'L'} size
 * @returns {string|null}
 */
export function getCoverUrl(coverId, size = 'M') {
  if (!coverId) return null;
  return `${COVER_URL}/${coverId}-${size}.jpg`;
}

/**
 * Helper function: fetch with retry on network/server errors
 */
async function fetchWithRetry(url, retries = 2, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error(`API error ${response.status}`);
      return response;

    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

/**
 * Searches books via Open Library search API.
 * If query is empty, returns a random popular book.
 * @param {string} query - free text (title, author, keyword)
 * @param {number} limit - max results to fetch
 * @returns {Promise<Array>} array of book objects
 */
export async function searchBooks(query = '', limit = 24) {
  let url;

  const trimmed = query.trim();

  if (trimmed.length < 2) {
    // Если пустой запрос — берем случайную популярную книгу
    const defaultBooks = [
      'the hobbit', 'harry potter', 'sherlock holmes',
      'pride and prejudice', 'lord of the rings', 'dracula'
    ];
    const randomQuery = defaultBooks[Math.floor(Math.random() * defaultBooks.length)];
    url = `${BASE_URL}/search.json?q=${encodeURIComponent(randomQuery)}&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i`;
  } else {
    url = `${BASE_URL}/search.json?q=${encodeURIComponent(trimmed)}&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i`;
  }

  const response = await fetchWithRetry(url);
  const data = await response.json();

  return data.docs || [];
}