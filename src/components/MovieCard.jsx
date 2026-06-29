import React from 'react';

export default function MovieCard({ item, onClick }) {
  const yearTypeStr = item.type === "movie" ? `${item.year} • Movie` : `${item.year} • Anime`;
  const ratingStr = item.rating.toFixed(1);
  const firstGenre = item.genres && item.genres.length > 0 ? item.genres[0] : '';

  return (
    <div className="card-item" onClick={() => onClick(item.id)}>
      <div className="card-poster-wrapper">
        {firstGenre && <span className="card-overlay-badge">{firstGenre}</span>}
        <img 
          className="card-poster" 
          src={item.poster} 
          alt={`${item.title} Poster`} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500';
          }}
        />
      </div>
      <div className="card-content">
        <h3 className="card-title" title={item.title}>{item.title}</h3>
        <div className="card-meta">
          <span className="card-rating"><i className="fa-solid fa-star"></i> {ratingStr}</span>
          <span className="card-year-type">{yearTypeStr}</span>
        </div>
      </div>
    </div>
  );
}
