import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimeProvider } from './context/AnimeContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import './App.css';

// Lazy load компоненты для разбиения бандла
const AnimeDetails = lazy(() => import('./components/AnimeDetails'));
const Search = lazy(() => import('./components/Search'));
const Catalog = lazy(() => import('./components/Catalog'));
const Favorites = lazy(() => import('./components/Favorites'));
const Watchlist = lazy(() => import('./components/Watchlist'));

const LoadingFallback = () => (
  <div className="loading-fallback">
    <p>Загрузка...</p>
  </div>
);

function App() {
  return (
    <Router>
      <AnimeProvider>
        <Navigation />
        <main className="main-content">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          </Suspense>
        </main>
      </AnimeProvider>
    </Router>
  );
}

export default App;