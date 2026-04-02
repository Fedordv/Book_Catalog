// search.js
import fetch from 'node-fetch';

export async function handler(event, context) {
  const query = event.queryStringParameters.q || '';
  const limit = event.queryStringParameters.limit || 20;

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i`;

  const res = await fetch(url);
  const data = await res.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
}