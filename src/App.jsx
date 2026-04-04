import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Card from './components/Card'
import SearchBar from './components/SearchBar'
import CharacterPage from './pages/CharacterPage'
import './App.css'

function App() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('https://api.jikan.moe/v4/top/characters')
      .then(res => res.json())
      .then(data => {
        setCharacters(data.data)
        setLoading(false)
      })
  }, [])

  const filtered = characters.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          <>
            <SearchBar query={query} setQuery={setQuery} />
            {loading ? (
              <p className="loading">загрузка...</p>
            ) : (
              <div className="card-grid">
                {filtered.map(character => (
                  <Card key={character.mal_id} character={character} />
                ))}
              </div>
            )}
          </>
        } />
        <Route path="/character/:id" element={<CharacterPage />} />
      </Routes>
    </div>
  )
}

export default App