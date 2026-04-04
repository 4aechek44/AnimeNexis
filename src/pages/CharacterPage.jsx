import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CharacterPage() {
  const { id } = useParams()  // берём id из урла
  const [character, setCharacter] = useState(null)
  const navigate = useNavigate()


  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/characters/${id}`)
      .then(res => res.json())
      .then(data => setCharacter(data.data))
  }, [id])

  if (!character) return <p className="loading">загрузка...</p>

  return (
    <div className="character-page">
      <img src={character.images?.jpg?.image_url} alt={character.name} />
      <div className="character-info">
        <h1>{character.name}</h1>
        <p>{character.about}</p>
        <button onClick={() => navigate('/')}>← назад</button>
      </div>
    </div>
  )
}

export default CharacterPage