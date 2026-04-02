# 📚 Book Finder
A lightweight web application for searching books using the Open Library API.
Built with **pure JavaScript (no frameworks)** following clean architecture principles.

---

## 🚀 Live Demo

👉 Add your deployed link here (e.g. Vercel / Netlify)


## 🧠 Task

The goal was to build a small SPA-like application **without any frameworks or libraries**, implementing:

* Book search via public API
* Card-based UI
* Favorites system with persistence
* Clean project structure
* Production build setup

API: https://openlibrary.org/search.json

---

## ✨ Features

### 🔎 Search (Debounced)

* Search books by title / author / keyword
* Uses native `fetch`

### 📚 Book Cards

* Cover image (or placeholder)
* Title
* Author(s)
* First publish year
* Favorite toggle button ❤️

###  Favorites System

* Add/remove books
* Stored in `localStorage`
* Restored on reload
* Sidebar UI

###  Author Filter

* Client-side filtering by author name

###  Theme Toggle

* Light / Dark mode switch

###  State Handling

* Loading state
* Empty input state
* No results state
* Network error handling

---

##  Tech Stack

* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**
* **Vite**
* **Open Library API**
* **localStorage**

---

## 📁 Project Structure

```id="n9y6bo"
src/
  assets/        # icons, images
  components/    # UI components (BookCard, Favorites)
  services/      # API layer (fetch logic)
  utils/         # helpers (debounce, storage)
  styles/        # global styles
  main.js        # entry point

index.html
vite.config.js
```

---

##  How to Run the App

### 1. Install dependencies

```bash id="rjdlrm"
npm install
```

### 2. Run development server

```bash id="g0yqmr"
npm run dev
```

### 3. Build for production

```bash id="5m9p9p"
npm run build
```

### 4. Preview build

```bash id="6o5l3m"
npm run preview
```

---

##  Production Build

After running build:

```id="2a0s0y"
dist/
  index.html
  main.js
  assets/
```

✔ Optimized
✔ Single JS bundle
✔ Ready for deployment

---

##  Key Implementation Details

* **Separation of concerns**
  UI components do not contain business logic

* **Single source of truth**
  All state managed in `main.js`

* **Debounce pattern**
  Prevents excessive API calls

* **LocalStorage sync**
  Favorites persist between sessions


## 📌 Future Improvements

* Pagination
* Book details page
* Skeleton loading UI
* Accessibility improvements

---

## 🧑‍💻 Author

Fedor