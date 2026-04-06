import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'

function CharacterPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [character, setCharacter] = useState(null)
  const [anime, setAnime] = useState([])

  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/characters/${id}`)
      .then(res => res.json())
      .then(data => setCharacter(data.data))

    fetch(`https://api.jikan.moe/v4/characters/${id}/anime`)
      .then(res => res.json())
      .then(data => setAnime(data.data?.slice(0, 12) || []))
  }, [id])

  if (!character) return (
    <>
      <Header />
      <p className="loading">загрузка...</p>
    </>
  )

  return (
    <>
      <Header />
      <div className="character-page">
        <div className="character-hero">
          <div className="character-img-wrap">
            <img src={character.images?.jpg?.image_url} alt={character.name} />
          </div>
          <div className="character-details">
            <p className="character-label">character profile</p>
            <h1 className="character-name">{character.name}</h1>
            {character.name_kanji && (
              <p className="character-name-jp">{character.name_kanji}</p>
            )}
            <div className="character-stats">
              <div className="stat">
                <span className="stat-value">
                  {character.favorites?.toLocaleString()}
                </span>
                <span className="stat-label">favorites</span>
              </div>
              <div className="stat">
                <span className="stat-value">{anime.length}</span>
                <span className="stat-label">appearances</span>
              </div>
            </div>
            {character.about && (
              <p className="character-about">{character.about}</p>
            )}
            <button className="back-btn" onClick={() => navigate('/')}>
              ← back to index
            </button>
          </div>
        </div>

        {anime.length > 0 && (
          <div className="character-anime">
            <h2 className="section-title">appearances</h2>
            <div className="anime-list">
              {anime.map(item => (
                <span key={item.anime.mal_id} className="anime-tag">
                  {item.anime.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CharacterPage