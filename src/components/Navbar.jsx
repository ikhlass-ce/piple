import React, { useState } from 'react';

export default function Navbar({ activeRoute, favoritesCount, theme, setTheme, onSearch }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
  };

  const getLinkClass = (path) => {
    return activeRoute === path ? 'nav-item active' : 'nav-item';
  };

  const getDrawerClass = (path) => {
    return activeRoute === path ? 'drawer-item active' : 'drawer-item';
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header className="navbar-container">
        <div class="navbar-wrapper">
          {/* Logo */}
          <a href="#/" class="logo-link" onClick={() => setMobileOpen(false)}>
            <div class="logo">
              <i class="fa-solid fa-clapperboard logo-icon"></i>
              <span>pi<span class="highlight">ple</span></span>
            </div>
          </a>

          {/* Desktop Links */}
          <nav className="nav-links">
            <a href="#/" className={getLinkClass('#/')}>Home</a>
            <a href="#/movies" className={getLinkClass('#/movies')}>Movies</a>
            <a href="#/anime" className={getLinkClass('#/anime')}>Anime</a>
            <a href="#/favorites" className={getLinkClass('#/favorites')}>
              Favorites {favoritesCount > 0 && <span id="fav-badge">{favoritesCount}</span>}
            </a>
            <a href="#/dashboard" className={getLinkClass('#/dashboard')}>Dashboard</a>
          </nav>

          {/* Controls */}
          <div className="nav-controls">
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <div className="search-input-wrapper">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input 
                  type="text" 
                  placeholder="Search titles..." 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {searchValue && (
                  <button type="button" className="clear-search-btn" onClick={clearSearch}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </form>

            {/* Dark Mode toggle */}
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? (
                <i className="fa-solid fa-sun sun-icon"></i>
              ) : (
                <i className="fa-solid fa-moon moon-icon"></i>
              )}
            </button>

            {/* Hamburger icon */}
            <button 
              className={`mobile-menu-btn ${mobileOpen ? 'open' : ''}`} 
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="drawer-content" onClick={() => setMobileOpen(false)}>
          <a href="#/" className={getDrawerClass('#/')}>Home</a>
          <a href="#/movies" className={getDrawerClass('#/movies')}>Movies</a>
          <a href="#/anime" className={getDrawerClass('#/anime')}>Anime</a>
          <a href="#/favorites" className={getDrawerClass('#/favorites')}>Favorites</a>
          <a href="#/dashboard" className={getDrawerClass('#/dashboard')}>Dashboard</a>
        </div>
      </div>
    </>
  );
}
