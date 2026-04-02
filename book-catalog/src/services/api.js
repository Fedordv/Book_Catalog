/**
 * api.js
 * All communication with the Open Library public API.
 * No business logic here — only fetch calls and URL builders.
 */

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

async function fetchWithRetry(url, retries = 2, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);

      // 500+ = the server is broken, retry cant help — exit
      if (response.status >= 500) {
        throw new Error(`Server error ${response.status}`);
      }

      if (!response.ok) throw new Error(`API error ${response.status}`);
      return response;

    } catch (err) {
      const isServerError = err.message.includes('500')
        || err.message.includes('503');

      // we throw on server errors and the last attempt
      if (isServerError || i === retries - 1) throw err;

      await new Promise(res => setTimeout(res, delay));
    }
  }
}

/**
 * Searches books via Open Library search API.
 * @param {string} query - free text (title, author, keyword)
 * @param {number} limit - max results to fetch
 * @returns {Promise<Array>} array of book objects
 */

export async function searchBooks(query, limit = 24) {
  const trimmed = query.trim();

  if (trimmed.length < 2) throw new alert('Query too short');

  const url = `${BASE_URL}/search.json?q=${encodeURIComponent(trimmed)}&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i`;

  const response = await fetchWithRetry(url);
  const data = await response.json();
  return data.docs || [];
}