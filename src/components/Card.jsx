import { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'

const Card = forwardRef(({ character }, ref) => {
  const navigate = useNavigate()
  const name = character.name
  const image = character.images?.jpg?.image_url

  return (
    <div
      className="card"
      ref={ref}
      onClick={() => navigate(`/character/${character.mal_id}`)}
    >
      <img className="card-img" src={image} alt={name} />
      <div className="card-info">
        <h2 className="card-name">{name}</h2>
      </div>
    </div>
  )
})

export default Card