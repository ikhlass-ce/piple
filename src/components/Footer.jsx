import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wrapper">
        <div className="footer-brand">
          <div className="logo">
            <i className="fa-solid fa-clapperboard logo-icon"></i>
            <span>pi<span class="highlight">ple</span></span>
          </div>
          <p className="footer-tagline">
            Your ultimate portal for cinematic and anime discovery. Browse, search, save favorites, and manage listings in real-time.
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h4>Explore</h4>
            <a href="#/">Home</a>
            <a href="#/movies">Movies</a>
            <a href="#/anime">Anime</a>
            <a href="#/favorites">Favorites</a>
            <a href="#/dashboard">Dashboard</a>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <a href="#"><i className="fa-brands fa-github"></i> GitHub</a>
            <a href="#"><i className="fa-brands fa-twitter"></i> Twitter</a>
            <a href="#"><i className="fa-brands fa-instagram"></i> Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 piple. Powered by React, Supabase, and custom CSS.</p>
      </div>
    </footer>
  );
}
