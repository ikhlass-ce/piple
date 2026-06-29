import React, { useState } from 'react';
import { dbService } from '../dbService';

export default function DashboardView({ catalog, onUpdateCatalog }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form State fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');
  const [rating, setRating] = useState('8.0');
  const [year, setYear] = useState('2024');
  const [genres, setGenres] = useState('');
  const [duration, setDuration] = useState('');
  const [episodes, setEpisodes] = useState('');
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState('');
  const [banner, setBanner] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [cast, setCast] = useState('');
  const [trending, setTrending] = useState(false);
  const [popular, setPopular] = useState(false);

  // Statistics calculation
  const totalMovies = catalog.filter(i => i.type === 'movie').length;
  const totalAnime = catalog.filter(i => i.type === 'anime').length;
  const avgRating = catalog.length > 0 
    ? (catalog.reduce((acc, curr) => acc + curr.rating, 0) / catalog.length).toFixed(1) 
    : '0.0';

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setType('movie');
    setRating('8.0');
    setYear('2024');
    setGenres('Action, Sci-Fi');
    setDuration('2h 00m');
    setEpisodes('12 Episodes');
    setDescription('');
    setPoster('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500');
    setBanner('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    setCast('Actor One, Actor Two');
    setTrending(false);
    setPopular(true);
    setIsFormOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setType(item.type || 'movie');
    setRating(item.rating?.toString() || '8.0');
    setYear(item.year?.toString() || '2024');
    setGenres(item.genres ? item.genres.join(', ') : '');
    setDuration(item.duration || '');
    setEpisodes(item.episodes || '');
    setDescription(item.description || '');
    setPoster(item.poster || '');
    setBanner(item.banner || '');
    setVideoUrl(item.videoUrl || '');
    setCast(item.cast ? item.cast.join(', ') : '');
    setTrending(!!item.trending);
    setPopular(!!item.popular);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Map input to catalog model fields
    const parsedGenres = genres.split(',').map(s => s.trim()).filter(Boolean);
    const parsedCast = cast.split(',').map(s => s.trim()).filter(Boolean);
    
    const payload = {
      title,
      type,
      rating: parseFloat(rating) || 8.0,
      year: parseInt(year) || 2024,
      genres: parsedGenres,
      description,
      poster,
      banner,
      videoUrl,
      cast: parsedCast,
      trending,
      popular
    };

    // Conditional duration/episodes field mapping
    if (type === 'movie') {
      payload.duration = duration || '2h 00m';
      payload.episodes = '';
      payload.epList = null;
    } else {
      payload.episodes = episodes || '12 Episodes';
      payload.duration = '';
      
      // Inject standard template epList if none exists
      if (!editingItem || !editingItem.epList) {
        payload.epList = [
          { epNum: 1, title: "Pilot Episode", duration: "24m", videoUrl: videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
          { epNum: 2, title: "Rising Tension", duration: "23m", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
        ];
      } else {
        payload.epList = editingItem.epList;
      }
    }

    if (editingItem) {
      // Update
      await dbService.updateItem(editingItem.id, payload);
    } else {
      // Create
      payload.id = `${type[0]}-${Date.now()}`;
      await dbService.addItem(payload);
    }

    // Close and reload catalog data
    setIsFormOpen(false);
    onUpdateCatalog();
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this catalog record?")) {
      await dbService.deleteItem(id);
      onUpdateCatalog();
    }
  };

  return (
    <div className="dashboard-container page-fade-in">
      <div className="section-header" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>Database Dashboard</h1>
          <p className="page-subtitle">Add, edit, or delete items from the global catalog.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {dbService.isSupabaseActive() ? (
            <span className="badge badge-anime" style={{ textTransform: 'none', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <i className="fa-solid fa-circle fa-fade" style={{ color: 'var(--accent-teal)', fontSize: '0.65rem' }}></i> Supabase Connected
            </span>
          ) : (
            <span className="badge badge-movie" style={{ textTransform: 'none', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <i className="fa-solid fa-circle" style={{ color: 'var(--accent-neon)', fontSize: '0.65rem' }}></i> LocalStorage Sandbox
            </span>
          )}
          <button className="btn btn-primary" onClick={openAddModal}>
            <i className="fa-solid fa-plus"></i> Add Title
          </button>
        </div>
      </div>

      {/* Metrics widgets */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><i className="fa-solid fa-database"></i></div>
          <div className="stat-info">
            <span className="stat-label">Total Titles</span>
            <span className="stat-value">{catalog.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fa-solid fa-film"></i></div>
          <div className="stat-info">
            <span className="stat-label">Movies</span>
            <span className="stat-value">{totalMovies}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fa-solid fa-tv"></i></div>
          <div className="stat-info">
            <span className="stat-label">Anime</span>
            <span className="stat-value">{totalAnime}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-gold)' }}><i className="fa-solid fa-star"></i></div>
          <div className="stat-info">
            <span className="stat-label">Average Rating</span>
            <span className="stat-value">{avgRating}</span>
          </div>
        </div>
      </div>

      {/* Database Listing Table */}
      <h2 className="details-section-title">Catalog Inventory</h2>
      <div className="table-wrapper">
        <table className="dash-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Poster</th>
              <th>Title</th>
              <th>Type</th>
              <th>Year</th>
              <th>Rating</th>
              <th>Genres</th>
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {catalog.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                  No titles in inventory. Click "Add Title" to create one.
                </td>
              </tr>
            ) : (
              catalog.map(item => (
                <tr key={item.id}>
                  <td>
                    <img 
                      className="table-poster" 
                      src={item.poster} 
                      alt="" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=100';
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{item.title}</td>
                  <td>
                    <span className={`badge ${item.type === 'movie' ? 'badge-movie' : 'badge-anime'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td>{item.year}</td>
                  <td style={{ fontWeight: '700' }}><i className="fa-solid fa-star" style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', marginRight: '0.2rem' }}></i> {item.rating.toFixed(1)}</td>
                  <td>{item.genres ? item.genres.join(', ') : ''}</td>
                  <td>
                    <div className="dash-actions">
                      <button 
                        className="btn-icon btn-edit" 
                        onClick={() => openEditModal(item)}
                        title="Edit Title"
                        aria-label="Edit Title"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button 
                        className="btn-icon btn-delete" 
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete Title"
                        aria-label="Delete Title"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal overlay */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-container" style={{ maxWidth: '650px', backgroundColor: 'var(--bg-secondary)' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsFormOpen(false)} aria-label="Close Form">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="modal-header" style={{ padding: '1.5rem 2rem 0.5rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 className="details-section-title" style={{ margin: 0 }}>
                {editingItem ? 'Edit Catalog Record' : 'Add New Catalog Record'}
              </h2>
            </div>
            
            <form className="dash-form" onSubmit={handleFormSubmit}>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label className="form-label">Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Catalog Type</label>
                  <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="movie">Movie</option>
                    <option value="anime">Anime Series</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Rating (out of 10)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="1" 
                    max="10" 
                    className="form-input" 
                    required 
                    value={rating} 
                    onChange={(e) => setRating(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Release Year</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)} 
                  />
                </div>

                {type === 'movie' ? (
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 2h 15m"
                      value={duration} 
                      onChange={(e) => setDuration(e.target.value)} 
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Episodes</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 24 Episodes"
                      value={episodes} 
                      onChange={(e) => setEpisodes(e.target.value)} 
                    />
                  </div>
                )}

                <div className="form-group form-group-full">
                  <label className="form-label">Genres (Comma separated)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Action, Sci-Fi, Fantasy" 
                    value={genres} 
                    onChange={(e) => setGenres(e.target.value)} 
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Poster Image URL</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    value={poster} 
                    onChange={(e) => setPoster(e.target.value)} 
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Banner Image URL</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    value={banner} 
                    onChange={(e) => setBanner(e.target.value)} 
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Streaming MP4 Video URL</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    value={videoUrl} 
                    onChange={(e) => setVideoUrl(e.target.value)} 
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Cast Members (Comma separated)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Eren Yeager, Mikasa Ackerman" 
                    value={cast} 
                    onChange={(e) => setCast(e.target.value)} 
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Synopsis Description</label>
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    style={{ resize: 'vertical' }}
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                  ></textarea>
                </div>

                <div className="form-group form-group-full form-checkbox-group">
                  <label className="form-checkbox">
                    <input 
                      type="checkbox" 
                      checked={trending} 
                      onChange={(e) => setTrending(e.target.checked)} 
                    />
                    Add to Trending Slider
                  </label>
                  <label className="form-checkbox">
                    <input 
                      type="checkbox" 
                      checked={popular} 
                      onChange={(e) => setPopular(e.target.checked)} 
                    />
                    Add to Popular Sections
                  </label>
                </div>
              </div>

              <div className="form-actions" style={{ margin: '0 -2rem -1.5rem -2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Save Updates' : 'Add Title'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
