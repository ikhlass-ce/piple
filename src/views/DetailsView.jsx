import React from 'react';
import MovieCard from '../components/MovieCard';

export default function DetailsView({ catalog, id, favorites, onToggleFavorite, onPlayTrailer, onViewDetails }) {
  const item = catalog.find(i => i.id === id);

  if (!item) {
    return (
      <div className="page-header-container page-fade-in" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <h1 className="page-title">Title Not Found</h1>
        <p className="page-subtitle">The movie or anime details you are trying to view does not exist in our catalog.</p>
        <a href="#/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          <i className="fa-solid fa-house"></i> Go Back Home
        </a>
      </div>
    );
  }

  const isFav = favorites.some(fav => fav.id === item.id);
  const typeLabel = item.type === 'movie' ? 'Movies' : 'Anime';
  const typeHash = item.type === 'movie' ? '#/movies' : '#/anime';
  const lengthLabel = item.type === 'movie' ? 'Duration' : 'Episodes';
  const lengthVal = item.type === 'movie' ? item.duration : item.episodes;

  // Filter recommendations (Exclude current, match base type, match at least one genre)
  const recommendations = catalog
    .filter(rec => rec.id !== item.id && rec.type === item.type && rec.genres && item.genres && rec.genres.some(g => item.genres.includes(g)))
    .slice(0, 4);

  const handlePlayClick = () => {
    const playUrl = item.epList ? item.epList[0].videoUrl : item.videoUrl;
    onPlayTrailer(playUrl, item.title);
  };

  return (
    <div className="page-fade-in">
      <div className="details-container">
        {/* Left Side: Large Poster */}
        <div className="details-left">
          <div className="details-poster-card">
            <img 
              src={item.poster} 
              alt={`${item.title} Poster`} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500';
              }}
            />
          </div>
        </div>

        {/* Right Side: Details Info */}
        <div className="details-right">
          {/* Breadcrumbs */}
          <div className="details-breadcrumbs">
            <a href="#/">Home</a>
            <i className="fa-solid fa-chevron-right breadcrumbs-separator"></i>
            <a href={typeHash}>{typeLabel}</a>
            <i className="fa-solid fa-chevron-right breadcrumbs-separator"></i>
            <span>{item.title}</span>
          </div>

          <h1 className="details-title">{item.title}</h1>
          
          <div className="details-genre-pills">
            {item.genres && item.genres.map(g => (
              <span key={g} className="details-genre-pill">{g}</span>
            ))}
          </div>

          {/* Metadata Grid */}
          <div className="details-meta-grid">
            <div className="details-meta-item rating">
              <i className="fa-solid fa-star"></i>
              <span><strong>{item.rating.toFixed(1)}</strong>/10</span>
            </div>
            <div className="details-meta-item">
              <i className="fa-solid fa-calendar"></i>
              <span>Released: <strong>{item.year}</strong></span>
            </div>
            <div className="details-meta-item">
              <i className="fa-solid fa-clock"></i>
              <span>{lengthLabel}: <strong>{lengthVal}</strong></span>
            </div>
          </div>

          <div>
            <h2 className="details-section-title">Synopsis</h2>
            <p className="details-description">{item.description}</p>
          </div>

          {/* Cast Members */}
          {item.cast && item.cast.length > 0 && (
            <div>
              <h2 class="details-section-title">Principal Cast</h2>
              <div className="cast-grid">
                {item.cast.map(cName => {
                  const initials = cName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                  return (
                    <div key={cName} className="cast-card">
                      <div className="cast-avatar">{initials}</div>
                      <span className="cast-name">{cName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="details-actions">
            <button className="btn btn-primary" onClick={handlePlayClick}>
              <i className="fa-solid fa-play"></i> {item.type === 'movie' ? 'Play Movie' : 'Play Episode 1'}
            </button>
            <button 
              className={`btn btn-secondary btn-fav ${isFav ? 'active' : ''}`}
              onClick={() => onToggleFavorite(item)}
            >
              {isFav ? (
                <><i className="fa-solid fa-heart"></i> Saved to Favorites</>
              ) : (
                <><i className="fa-regular fa-heart"></i> Add to Favorites</>
              )}
            </button>
          </div>

          {/* Episode List Section (Anime Only) */}
          {item.epList && item.epList.length > 0 && (
            <div className="episodes-section">
              <h2 className="details-section-title">Episodes</h2>
              <div className="episodes-list">
                {item.epList.map(ep => (
                  <div 
                    key={ep.epNum} 
                    className="episode-row" 
                    onClick={() => onPlayTrailer(ep.videoUrl, `${item.title} - Ep ${ep.epNum}`)}
                  >
                    <div className="episode-info">
                      <div className="episode-play-icon">
                        <i className="fa-solid fa-play"></i>
                      </div>
                      <div className="episode-details">
                        <span className="episode-title-text">Episode {ep.epNum}: {ep.title}</span>
                        <span className="episode-duration">{ep.duration}</span>
                      </div>
                    </div>
                    <button className="episode-play-btn">Play</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Section */}
      {recommendations.length > 0 && (
        <section className="section-container" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
          <h2 className="section-title">You May Also Like</h2>
          <div className="cards-grid" style={{ marginTop: '1.5rem' }}>
            {recommendations.map(rec => (
              <MovieCard key={rec.id} item={rec} onClick={onViewDetails} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
