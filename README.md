# AnimeNexis

AnimeNexis is a React anime discovery app built with Vite. The app uses the
Jikan API to show top anime, seasonal releases, catalog filters, search results,
anime details, and personal lists stored in the browser.

## Features

- Home page with top anime and current seasonal releases
- Anime search by title
- Catalog page with type, status, and rating filters
- Anime details pages
- Favorites, watched list, and planned list
- Local browser storage for personal lists
- Client-side routing with `react-router-dom`
- GitHub Pages deployment support

## Tech Stack

- React 18
- Vite
- React Router
- Jikan API
- CSS modules by component files

## Getting Started

Install Node.js first. The recommended option is the current LTS version from
[nodejs.org](https://nodejs.org/).

Check that Node.js and npm are available:

```bash
node --version
npm --version
```

On Windows, if these commands are not found, install Node.js LTS and reopen the
terminal. You can install it from the website above or with:

```bash
winget install OpenJS.NodeJS.LTS
```

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will print a local URL in the terminal, usually:

```text
http://localhost:5173/AnimeNexis/
```

Open that URL in your browser to test the interface. If Vite shows a different
port, use the URL from the terminal.

## Testing the Interface Locally

While the dev server is running, edit files inside `src/`. Vite reloads the page
automatically after most changes.

Useful places to start:

- `src/App.jsx` - routes and page layout
- `src/components/Navigation.jsx` - top navigation and search bar
- `src/components/Home.jsx` - main page content
- `src/components/Catalog.jsx` - catalog filters and pagination
- `src/components/AnimeCard.jsx` - anime card UI
- `src/components/*.css` - component styles

If the page is open but data does not load, check:

- The browser has internet access
- The Jikan API is available
- The browser console does not show request errors or rate-limit errors

## Troubleshooting

### `npm` is not recognized

Node.js is not installed or the terminal does not see it yet. Install Node.js LTS,
then close and reopen the terminal.

### Port `5173` is already busy

Vite will automatically choose another port. Open the URL printed in the
terminal.

### GitHub Pages route opens a blank page

This project uses `HashRouter`, so deployed routes include `#/` in the URL. This
helps GitHub Pages serve client-side routes correctly.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deploy

The project is configured for GitHub Pages:

```bash
npm run deploy
```

The configured homepage is:

```text
https://4aechek44.github.io/AnimeNexis/
```

## Project Structure

```text
public/              Static assets
src/api/             Jikan API client
src/components/      React pages and UI components
src/context/         Shared anime list state
src/hooks/           Reusable data and context hooks
src/App.jsx          App routes
src/main.jsx         React entry point
```
