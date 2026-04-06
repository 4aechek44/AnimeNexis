import { useState, useEffect, useRef, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Card from './components/Card'
import SearchBar from './components/SearchBar'
import CharacterPage from './pages/CharacterPage'
import Header from './components/Header'
import './App.css'

function App() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [query, setQuery] = useState('')
  const pageRef = useRef(1)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef(null)

  const fetchCharacters = (pageNum, append = false) => {
    fetch(`https://api.jikan.moe/v4/top/characters?page=${pageNum}`)
      .then(res => res.json())
      .then(data => {
        if (append) {
          setCharacters(prev => [...prev, ...data.data])
        } else {
          setCharacters(data.data)
        }
        setHasMore(data.pagination?.has_next_page)
        setLoading(false)
        setLoadingMore(false)
      })
  }

  const searchCharacters = (q) => {
    setLoading(true)
    fetch(`https://api.jikan.moe/v4/characters?q=${q}&order_by=favorites&sort=desc&limit=25`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.data?.sort((a, b) => b.favorites - a.favorites) || []
        setCharacters(sorted)
        setHasMore(false)
        setLoading(false)
      })
  }

  useEffect(() => { fetchCharacters(1) }, [])

  useEffect(() => {
    if (!query) {
      fetchCharacters(1)
      pageRef.current = 1
      return
    }
    const timeout = setTimeout(() => searchCharacters(query), 500)
    return () => clearTimeout(timeout)
  }, [query])

  const lastElementRef = useCallback(node => {
    if (loadingMore) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !query) {
        const next = pageRef.current + 1
        pageRef.current = next
        setLoadingMore(true)
        fetchCharacters(next, true)
      }
    })
    if (node) observerRef.current.observe(node)
  }, [loadingMore, hasMore, query])

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <div className="main-content">
              <SearchBar query={query} setQuery={setQuery} />
              {loading ? (
                <p className="loading">loading...</p>
              ) : (
                <>
                  <div className="card-grid">
                    {characters.map((character, index) => (
                      <Card
                        key={character.mal_id}
                        character={character}
                        ref={index === characters.length - 1 ? lastElementRef : null}
                      />
                    ))}
                  </div>
                  {loadingMore && <p className="loading-more">loading more...</p>}
                </>
              )}
            </div>
          </>
        } />
        <Route path="/character/:id" element={<CharacterPage />} />
      </Routes>
    </div>
  )
}

export default App