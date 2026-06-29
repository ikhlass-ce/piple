import React from 'react';

export default function FavoritesView({ favorites, onRemoveFavorite, onViewDetails }) {
  return (
    <div className="page-header-container page-fade-in">
      <h1 className="page-title">
        My Favorites 
        <i className="fa-solid fa-heart" style={{ color: 'var(--accent-neon)', fontSize: '1.8rem', marginLeft: '0.6rem', verticalAlign: 'middle' }}></i>
      </h1>
      <p className="page-subtitle">Your personalized list of saved movies and anime series.</p>

      <div className="cards-grid" style={{ marginTop: '2rem' }}>
        {favorites.length === 0 ? (
          <div className="no-results-container">
            <i className="fa-regular fa-heart no-results-icon"></i>
            <h3 className="no-results-title">No Favorites Saved</h3>
            <p className="no-results-text">
              You haven't added any movies or anime to your favorites list yet. When exploring, click the "Add to Favorites" button to save them here.
            </p>
            <a href="#/" className="btn btn-primary"><i className="fa-solid fa-compass"></i> Discover Content</a>
          </div>
        ) : (
          favorites.map(item => {
            const yearTypeStr = item.type === "movie" ? `${item.year} • Movie` : `${item.year} • Anime`;
            const ratingStr = item.rating.toFixed(1);
            const firstGenre = item.genres && item.genres.length > 0 ? item.genres[0] : '';

            return (
              <div key={item.id} className="card-item" style={{ position: 'relative' }}>
                {/* Remove button */}
                <button 
                  className="btn-remove-fav" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(item);
                  }}
                  title="Remove Favorite"
                  aria-label="Remove Favorite"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="card-poster-wrapper" onClick={() => onViewDetails(item.id)}>
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
                <div className="card-content" onClick={() => onViewDetails(item.id)}>
                  <h3 className="card-title" title={item.title}>{item.title}</h3>
                  <div className="card-meta">
                    <span className="card-rating"><i className="fa-solid fa-star"></i> {ratingStr}</span>
                    <span className="card-year-type">{yearTypeStr}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
