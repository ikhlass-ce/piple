import React from 'react';
import MovieCard from '../components/MovieCard';

export default function HomeView({ catalog, onPlayTrailer, onViewDetails }) {
  // Find a hero item dynamically (prefer Frieren, otherwise take the first catalog item)
  const heroItem = catalog.find(item => item.id === 'a-frieren') || catalog[0];
  
  // Filter lists
  const trendingItems = catalog.filter(item => item.trending);
  const popularMovies = catalog.filter(item => item.type === 'movie' && item.popular);
  const popularAnime = catalog.filter(item => item.type === 'anime' && item.popular);

  const handleHeroPlay = () => {
    if (heroItem) {
      const playUrl = heroItem.epList ? heroItem.epList[0].videoUrl : heroItem.videoUrl;
      onPlayTrailer(playUrl, heroItem.title);
    }
  };

  if (!heroItem) {
    return (
      <div className="page-header-container page-fade-in" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <h1 className="page-title">No Catalog Data</h1>
        <p className="page-subtitle">Go to the Dashboard to add your first movie or anime series.</p>
      </div>
    );
  }

  const heroGenreStr = heroItem.genres ? heroItem.genres.join(' | ') : '';

  return (
    <div className="page-fade-in">
      {/* Hero Banner */}
      <section className="hero-container" style={{ backgroundImage: `url(${heroItem.banner})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-type">{heroItem.type}</span>
          <h1 className="hero-title">{heroItem.title}</h1>
          <div className="hero-meta">
            <span className="hero-rating">
              <i className="fa-solid fa-star"></i> {heroItem.rating.toFixed(1)}/10
            </span>
            <span className="hero-duration-ep">
              {heroItem.type === 'movie' ? heroItem.duration : heroItem.episodes}
            </span>
            {heroGenreStr && <span className="hero-genre">{heroGenreStr}</span>}
          </div>
          <p className="hero-description">{heroItem.description}</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleHeroPlay}>
              <i className="fa-solid fa-play"></i> Watch Trailer
            </button>
            <button className="btn btn-secondary" onClick={() => onViewDetails(heroItem.id)}>
              <i className="fa-solid fa-circle-info"></i> View Details
            </button>
          </div>
        </div>
      </section>

      {/* Trending Slider Section */}
      {trendingItems.length > 0 && (
        <section className="section-container">
          <div className="section-header">
            <h2 className="section-title">Trending Now</h2>
          </div>
          <div className="slider-wrapper">
            <div className="cards-slider">
              {trendingItems.map(item => (
                <MovieCard key={item.id} item={item} onClick={onViewDetails} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Movies Grid */}
      {popularMovies.length > 0 && (
        <section className="section-container">
          <div className="section-header">
            <h2 className="section-title">Popular Movies</h2>
            <a href="#/movies" className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>See All</a>
          </div>
          <div className="cards-grid">
            {popularMovies.map(item => (
              <MovieCard key={item.id} item={item} onClick={onViewDetails} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Anime Grid */}
      {popularAnime.length > 0 && (
        <section className="section-container">
          <div className="section-header">
            <h2 className="section-title">Popular Anime</h2>
            <a href="#/anime" className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>See All</a>
          </div>
          <div className="cards-grid">
            {popularAnime.map(item => (
              <MovieCard key={item.id} item={item} onClick={onViewDetails} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
