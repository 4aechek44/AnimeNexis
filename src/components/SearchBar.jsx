function SearchBar({ query, setQuery }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search characters..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
    </div>
  )
}

export default SearchBar