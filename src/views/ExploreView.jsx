import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

export default function ExploreView({ catalog, type, searchQuery, onViewDetails }) {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOrder, setSortOrder] = useState('Rating');

  // Reset filters when route type changes
  useEffect(() => {
    setSelectedGenre('All');
    setSortOrder('Rating');
  }, [type]);

  const isSearch = type === 'search';
  const pageTitle = isSearch ? 'Search Results' : type === 'movie' ? 'Explore Movies' : 'Explore Anime';
  const pageSubtitle = isSearch 
    ? `Showing results matching "${searchQuery}"`
    : `Browse through the highest quality ${type === 'movie' ? 'cinematic items' : 'anime series'} in our catalog.`;

  // 1. Filter items by base type or search query
  let baseItems = [];
  if (isSearch) {
    const q = searchQuery.toLowerCase().trim();
    baseItems = catalog.filter(item => {
      return (
        item.title.toLowerCase().includes(q) ||
        (item.genres && item.genres.some(g => g.toLowerCase().includes(q))) ||
        item.description.toLowerCase().includes(q)
      );
    });
  } else {
    baseItems = catalog.filter(item => item.type === type);
  }

  // 2. Extract unique genres for genre pills
  const availableGenres = ['All'];
  if (!isSearch) {
    baseItems.forEach(item => {
      if (item.genres) {
        item.genres.forEach(g => {
          if (!availableGenres.includes(g)) {
            availableGenres.push(g);
          }
        });
      }
    });
  }

  // 3. Filter by selected genre pill (only if not search page, or if search allows genres)
  let filteredItems = [...baseItems];
  if (!isSearch && selectedGenre !== 'All') {
    filteredItems = filteredItems.filter(item => item.genres && item.genres.includes(selectedGenre));
  }

  // 4. Sort items
  if (sortOrder === 'Rating') {
    filteredItems.sort((a, b) => b.rating - a.rating);
  } else if (sortOrder === 'Latest') {
    filteredItems.sort((a, b) => b.year - a.year);
  } else if (sortOrder === 'Popular') {
    // Sort by trending flag first, then rating
    filteredItems.sort((a, b) => {
      if (a.trending !== b.trending) {
        return a.trending ? -1 : 1;
      }
      return b.rating - a.rating;
    });
  }

  return (
    <div className="page-header-container page-fade-in">
      <h1 className="page-title">{pageTitle}</h1>
      <p className="page-subtitle" dangerouslySetInnerHTML={{ __html: pageSubtitle }}></p>

      {/* Render filters only on Movies/Anime explorer pages, not search */}
      {!isSearch && (
        <div className="filter-bar">
          <div className="filter-group">
            <span className="filter-label">Genre:</span>
            <div className="genre-pills">
              {availableGenres.map(genre => (
                <button 
                  key={genre}
                  className={`genre-pill ${selectedGenre === genre ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <span className="filter-label">Sort By:</span>
            <div className="select-wrapper">
              <select 
                className="custom-select" 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="Rating">Highest Rating</option>
                <option value="Latest">Latest Release</option>
                <option value="Popular">Popularity</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Grid container */}
      <div className="cards-grid" style={{ marginTop: isSearch ? '2rem' : '0' }}>
        {filteredItems.length === 0 ? (
          <div className="no-results-container">
            <i className={`fa-solid ${isSearch ? 'fa-magnifying-glass-minus' : 'fa-film'} no-results-icon`}></i>
            <h3 className="no-results-title">No results found</h3>
            <p className="no-results-text">
              {isSearch 
                ? "We couldn't find any matches for your query. Check your spelling or try searching for another title." 
                : `No items matching the selected genre "${selectedGenre}" exist in our database.`}
            </p>
            {isSearch && (
              <a href="#/" className="btn btn-primary"><i className="fa-solid fa-house"></i> Go Home</a>
            )}
          </div>
        ) : (
          filteredItems.map(item => (
            <MovieCard key={item.id} item={item} onClick={onViewDetails} />
          ))
        )}
      </div>
    </div>
  );
}
