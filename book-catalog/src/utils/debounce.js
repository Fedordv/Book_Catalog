/**
 * debounce.js
 * Delays function execution until `delay` ms have passed
 * without a new call. Used for live search without a button.
 *
 * @param {Function} fn
 * @param {number}   delay - milliseconds
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}