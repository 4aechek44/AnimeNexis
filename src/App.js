import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimeProvider } from './context/AnimeContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import AnimeDetails from './components/AnimeDetails';
import Search from './components/Search';
import Catalog from './components/Catalog';
import Favorites from './components/Favorites';
import Watchlist from './components/Watchlist';
import './App.css';

function App() {
  return (
    <Router>
      <AnimeProvider>
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </main>
      </AnimeProvider>
    </Router>
  );
}

export default App;