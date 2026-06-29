/** @jsxRuntime classic */
/** @jsx React.createElement */
// piple React Application Script (Compiled In-Browser)
const { useState, useEffect, useRef } = React;

// --- SUPABASE CLIENT INITIALIZATION ---
const supabaseUrl = ''; 
const supabaseAnonKey = ''; 
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const LOCAL_STORAGE_KEY = 'piple_netflix_catalog';

// Initial Mock Database Seed matching user screenshot
const initialSeedData = [
  {
    id: "s-suits",
    title: "Suits",
    type: "show",
    rating: 8.5,
    year: 2011,
    genres: ["Drama", "Comedy"],
    duration: "9 Seasons",
    description: "On the run from a drug deal gone bad, brilliant college dropout Mike Ross finds himself working with Harvey Specter, one of New York City's best attorneys. Mike's sharp mind and photographic memory make him a valuable asset, even if he doesn't have a law degree.",
    poster: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    cast: ["Gabriel Macht", "Patrick J. Adams", "Sarah Rafferty", "Meghan Markle"],
    trending: true,
    popular: true,
    continueWatching: true,
    newRelease: false
  },
  {
    id: "s-vikings",
    title: "Vikings",
    type: "show",
    rating: 8.5,
    year: 2013,
    genres: ["Action", "Drama", "History"],
    duration: "6 Seasons",
    description: "Vikings transports us to the brutal and mysterious world of Ragnar Lothbrok, a Viking warrior and farmer who yearns to explore—and raid—the distant shores across the ocean. Ragnar's ambitions lead him to clash with powerful leaders and forge a legacy that changes history.",
    poster: "https://images.unsplash.com/photo-1558223190-1c0b3952f4c3?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1519074069444-1ba4e6663104?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    cast: ["Travis Fimmel", "Katheryn Winnick", "Clive Standen", "Gustaf Skarsgård"],
    trending: true,
    popular: true,
    continueWatching: true,
    newRelease: false
  },
  {
    id: "s-bridgerton",
    title: "Bridgerton",
    type: "show",
    rating: 7.4,
    year: 2020,
    genres: ["Drama", "Romance"],
    duration: "3 Seasons",
    description: "Wealth, lust, and betrayal set against the backdrop of Regency-era England, seen through the eyes of the powerful Bridgerton family. As the siblings navigate the high-society marriage market, mysterious gossip columnist Lady Whistledown documents every scandal.",
    poster: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    cast: ["Adjoa Andoh", "Julie Andrews", "Jonathan Bailey", "Nicola Coughlan"],
    trending: false,
    popular: true,
    continueWatching: false,
    newRelease: true
  },
  {
    id: "a-kuroko",
    title: "Kuroko's Basketball",
    type: "anime",
    rating: 8.3,
    year: 2012,
    genres: ["Anime", "Sports", "Comedy"],
    duration: "3 Seasons",
    description: "The Seirin High School basketball team attempts to reach the national tournament by defeating the 'Generation of Miracles'—five prodigies who previously dominated middle school basketball. Tetsuya Kuroko, the mysterious 'sixth man', joins forces with Taiga Kagami to lead their team to victory.",
    poster: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    cast: ["Kensho Ono", "Yuki Ono", "Yoshimasa Hosoya", "Hiroshi Kamiya"],
    trending: true,
    popular: false,
    continueWatching: true,
    newRelease: false
  },
  {
    id: "s-peaky-blinders",
    title: "Peaky Blinders",
    type: "show",
    rating: 8.8,
    year: 2013,
    genres: ["Crime", "Drama"],
    duration: "6 Seasons",
    description: "A notorious gang in 1919 Birmingham, England, is led by the fierce Tommy Shelby, a crime boss set on moving up in the world no matter the cost. As Winston Churchill sends a ruthless chief inspector to clean up the city, the gang navigates gang wars, political conspiracies, and internal betrayals.",
    poster: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    cast: ["Cillian Murphy", "Paul Anderson", "Helen McCrory", "Sophie Rundle"],
    trending: true,
    popular: true,
    continueWatching: false,
    newRelease: false
  },
  {
    id: "a-gto",
    title: "GTO (Great Teacher Onizuka)",
    type: "anime",
    rating: 8.6,
    year: 1999,
    genres: ["Anime", "Comedy", "Drama"],
    duration: "43 Episodes",
    description: "Former biker gang leader Eikichi Onizuka pursues a new dream of becoming the greatest high school teacher in Japan. Assigned to a class of rebellious students who hate teachers, Onizuka uses his unconventional street smarts, physical strength, and raw honesty to earn their respect.",
    poster: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    cast: ["Wataru Takagi", "Kotono Mitsuishi", "Hikaru Midorikawa", "Tomokazu Seki"],
    trending: false,
    popular: true,
    continueWatching: true,
    newRelease: true
  },
  {
    id: "s-squid-game",
    title: "Squid Game",
    type: "show",
    rating: 8.0,
    year: 2021,
    genres: ["Thriller", "Drama", "Mystery"],
    duration: "1 Season",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes. As they navigate alliances and betrayals, a dark secret behind the survival tournament is slowly unraveled.",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-jun", "Jung Ho-yeon"],
    trending: true,
    popular: true,
    continueWatching: false,
    newRelease: false
  },
  {
    id: "s-all-of-us-dead",
    title: "All of Us Are Dead",
    type: "show",
    rating: 7.5,
    year: 2022,
    genres: ["Horror", "Thriller", "Action"],
    duration: "1 Season",
    description: "A high school becomes ground zero for a zombie virus outbreak. Trapped students must fight their way out—or turn into one of the rabid infected. With no rescue team coming and resources dwindling, they must rely on their wits to survive.",
    poster: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    cast: ["Park Ji-hu", "Yoon Chan-young", "Cho Yi-hyun", "Lomon"],
    trending: false,
    popular: true,
    continueWatching: false,
    newRelease: true
  },
  {
    id: "s-berlin",
    title: "Berlin",
    type: "show",
    rating: 7.0,
    year: 2023,
    genres: ["Crime", "Action", "Drama"],
    duration: "1 Season",
    description: "During his golden age, before the events of Money Heist, Berlin gathers a gang in Paris for one of his most ambitious robberies ever: stealing 44 million euros worth of jewels in a single night from a prestigious auction house.",
    poster: "https://images.unsplash.com/photo-1499856138863-7a626d7ee7ad?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    cast: ["Pedro Alonso", "Michelle Jenner", "Tristán Ulloa", "Begoña Vargas"],
    trending: true,
    popular: false,
    continueWatching: false,
    newRelease: true
  },
  {
    id: "s-resident",
    title: "The Resident",
    type: "show",
    rating: 7.7,
    year: 2018,
    genres: ["Drama", "Medical"],
    duration: "6 Seasons",
    description: "A tough, brilliant senior resident guides an idealistic young doctor through his first day, pulling back the curtain on all of the good and bad in modern medicine. At Chastain Park Memorial Hospital, lives are saved and lost under corporate pressure.",
    poster: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    cast: ["Matt Czuchry", "Manish Dayal", "Bruce Greenwood", "Jane Leeves"],
    trending: false,
    popular: true,
    continueWatching: true,
    newRelease: false
  }
];

const getLocalCatalog = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSeedData));
    return initialSeedData;
  }
  return JSON.parse(data);
};

const saveLocalCatalog = (catalog) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(catalog));
};

const dbService = {
  isSupabaseActive() {
    return supabase !== null;
  },

  async getCatalog() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase.from('media_catalog').select('*');
        if (error) throw error;
        return data.map(item => ({
          ...item,
          genres: typeof item.genres === 'string' ? JSON.parse(item.genres) : (item.genres || []),
          cast: typeof item.cast === 'string' ? JSON.parse(item.cast) : (item.cast || []),
        }));
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to LocalStorage sandbox:", err);
        return getLocalCatalog();
      }
    } else {
      return getLocalCatalog();
    }
  },

  async addItem(item) {
    const newItem = { ...item, id: item.id || `s-${Date.now()}` };
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase.from('media_catalog').insert([newItem]).select();
        if (error) throw error;
        return data[0];
      } catch (err) {
        console.warn("Supabase insert failed, performing LocalStorage write:", err);
        return this.addLocalItem(newItem);
      }
    } else {
      return this.addLocalItem(newItem);
    }
  },

  addLocalItem(item) {
    const catalog = getLocalCatalog();
    catalog.push(item);
    saveLocalCatalog(catalog);
    return item;
  },

  async updateItem(id, updatedFields) {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase.from('media_catalog').update(updatedFields).eq('id', id).select();
        if (error) throw error;
        return data[0];
      } catch (err) {
        console.warn("Supabase update failed, performing LocalStorage write:", err);
        return this.updateLocalItem(id, updatedFields);
      }
    } else {
      return this.updateLocalItem(id, updatedFields);
    }
  },

  updateLocalItem(id, updatedFields) {
    let catalog = getLocalCatalog();
    catalog = catalog.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    saveLocalCatalog(catalog);
    return catalog.find(item => item.id === id);
  },

  async deleteItem(id) {
    if (this.isSupabaseActive()) {
      try {
        const { error } = await supabase.from('media_catalog').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn("Supabase delete failed, performing LocalStorage write:", err);
        return this.deleteLocalItem(id);
      }
    } else {
      return this.deleteLocalItem(id);
    }
  },

  deleteLocalItem(id) {
    let catalog = getLocalCatalog();
    catalog = catalog.filter(item => item.id !== id);
    saveLocalCatalog(catalog);
    return true;
  }
};


// --- REACT COMPONENTS ---

// Navbar Component
function Navbar({ activeRoute, favoritesCount, onSearch, currentView, setView }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 300);
    } else {
      setSearchValue('');
      onSearch('');
    }
  };

  const menuItems = [
    { label: "Home", view: "home" },
    { label: "Shows", view: "shows" },
    { label: "Movies", view: "movies" },
    { label: "Games", view: "games" },
    { label: "Latest", view: "latest" },
    { label: "My List", view: "mylist" },
    { label: "Browse by Languages", view: "languages" }
  ];

  return (
    <header className="netflix-navbar">
      <div className="navbar-left">
        <a href="#/" className="netflix-logo" onClick={() => setView('home')}>piple</a>
        <nav className="navbar-menu">
          {menuItems.map(item => (
            <button 
              key={item.label}
              className={`menu-link ${currentView === item.view ? 'active' : ''}`}
              onClick={() => setView(item.view)}
            >
              {item.label}
              {item.view === 'mylist' && favoritesCount > 0 && (
                <span className="nav-fav-badge">{favoritesCount}</span>
              )}
            </button>
          ))}
          {/* Dashboard Route */}
          <button 
            className={`menu-link ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setView('dashboard')}
            style={{ opacity: 0.6 }}
          >
            DB Dashboard
          </button>
        </nav>
      </div>

      <div className="navbar-right">
        {/* Animated Search Bar */}
        <div className={`search-container ${searchOpen ? 'open' : ''}`}>
          <button className="nav-icon-btn" onClick={handleSearchClick} aria-label="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Titles, people, genres..." 
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>

        {/* Notification Bell */}
        <div className="notification-bell-container">
          <button className="nav-icon-btn" aria-label="Notifications">
            <i className="fa-solid fa-bell"></i>
            <span className="bell-badge">9</span>
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="profile-dropdown-container">
          <div className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="profile-avatar"></div>
            <i className={`fa-solid fa-caret-down caret-icon ${profileOpen ? 'open' : ''}`}></i>
          </div>
          {profileOpen && (
            <div className="profile-menu">
              <div className="profile-menu-item"><i className="fa-solid fa-pen"></i> Manage Profiles</div>
              <div className="profile-menu-item"><i className="fa-solid fa-user"></i> Account Settings</div>
              <div className="profile-menu-item"><i className="fa-solid fa-circle-question"></i> Help Center</div>
              <div className="profile-menu-separator"></div>
              <div className="profile-menu-item logout" onClick={() => { setProfileOpen(false); alert("Signed out!"); }}>Sign out of piple</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="netflix-footer">
      <div className="footer-links-grid">
        <a href="#">Audio Description</a>
        <a href="#">Help Center</a>
        <a href="#">Gift Cards</a>
        <a href="#">Media Center</a>
        <a href="#">Investor Relations</a>
        <a href="#">Jobs</a>
        <a href="#">Terms of Use</a>
        <a href="#">Privacy</a>
        <a href="#">Legal Notices</a>
        <a href="#">Corporate Information</a>
        <a href="#">Contact Us</a>
      </div>
      <p className="footer-service-code">Service Code</p>
      <p className="footer-copyright">&copy; 2026 piple, Inc. Inspired by Netflix. Built in React & Supabase.</p>
    </footer>
  );
}

// TrailerModal Component (with Visualizer Fallback)
function TrailerModal({ isOpen, videoUrl, title, onClose }) {
  const videoRef = useRef(null);
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [isSimPlaying, setIsSimPlaying] = useState(true);
  const [simDuration] = useState(150);

  const captions = [
    "piple CDN LINK INITIALIZED...",
    "DECRYPTING VIDEO SEGMENTS...",
    "[Transmission Secure] Connection established.",
    "LOADING VIDEO HARDWARE ACCELERATORS...",
    "System Alert: Video stream blocked by browser tracker protection.",
    "Activating piple Stream Simulator Fallback engine...",
    "STREAM ENCRYPTED SECURELY. ENJOY STREAMING."
  ];

  useEffect(() => {
    let loadTimeout;
    if (isOpen && videoUrl) {
      setIsFallbackActive(false);
      setSimTime(0);
      setIsSimPlaying(true);
      
      const video = videoRef.current;
      if (video) {
        video.src = videoUrl;
        video.load();
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }

        const handleError = () => {
          setIsFallbackActive(true);
        };
        video.addEventListener('error', handleError);

        loadTimeout = setTimeout(() => {
          if (video.currentTime === 0 && video.paused) {
            setIsFallbackActive(true);
          }
        }, 2200);

        return () => {
          clearTimeout(loadTimeout);
          video.removeEventListener('error', handleError);
        };
      }
    } else {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.src = "";
      }
    }
  }, [isOpen, videoUrl]);

  useEffect(() => {
    let simInterval;
    if (isOpen && isFallbackActive && isSimPlaying) {
      simInterval = setInterval(() => {
        setSimTime((prev) => {
          if (prev >= simDuration) return 0;
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (simInterval) clearInterval(simInterval);
    };
  }, [isOpen, isFallbackActive, isSimPlaying, simDuration]);

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentCaption = captions[Math.min(
    Math.floor((simTime / simDuration) * captions.length),
    captions.length - 1
  )];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="modal-body">
          <div className="video-wrapper">
            <video 
              ref={videoRef} 
              className={isFallbackActive ? 'hidden' : ''} 
              controls 
              autoPlay 
              playsInline
            ></video>

            {isFallbackActive && (
              <div className="video-sim-container">
                <div className="sim-bg-glow"></div>
                <div className="sim-content">
                  <div className="sim-header">
                    <span className="sim-badge"><i className="fa-solid fa-circle-play fa-pulse"></i> SIMULATOR ACTIVE</span>
                    <h3>{title}</h3>
                  </div>

                  <div className="sim-visualizer-container" onClick={() => setIsSimPlaying(!isSimPlaying)}>
                    <div className={`sim-audio-wave ${!isSimPlaying ? 'paused' : ''}`}>
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                    </div>

                    <div className="sim-play-overlay">
                      <i className={`fa-solid fa-play sim-play-big-btn ${isSimPlaying ? 'hidden' : ''}`}></i>
                    </div>

                    <p className="sim-status-text">Playing video streams securely...</p>
                    <p className="sim-caption">{currentCaption}</p>
                  </div>

                  <div className="sim-controls">
                    <button className="sim-ctrl-btn" onClick={() => setIsSimPlaying(!isSimPlaying)}>
                      {isSimPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
                    </button>
                    
                    <div className="sim-progress-wrapper">
                      <span className="sim-time">{formatTime(simTime)}</span>
                      <div className="sim-progress-bar" onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        setSimTime(Math.floor((clickX / rect.width) * simDuration));
                      }}>
                        <div className="sim-progress-fill" style={{ width: `${(simTime / simDuration) * 100}%` }}></div>
                      </div>
                      <span className="sim-time">{formatTime(simDuration)}</span>
                    </div>

                    <div className="sim-volume-wrapper">
                      <i className="fa-solid fa-volume-high"></i>
                      <div className="sim-volume-bar">
                        <div className="sim-volume-fill" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// MovieCard Component (with Hover Scaling Overlay details)
function MovieCard({ item, onClick, onPlay, isFavorite, onToggleFavorite }) {
  const ratingStr = item.rating ? item.rating.toFixed(1) : '8.0';
  const genresStr = item.genres ? item.genres.slice(0, 3).join(' • ') : '';

  return (
    <div className="movie-card-item">
      <img 
        className="card-poster" 
        src={item.poster} 
        alt={item.title} 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500';
        }}
      />
      
      {/* Pop-up Info Hover Card */}
      <div className="card-hover-details">
        <img 
          className="hover-card-banner" 
          src={item.banner} 
          alt={item.title} 
        />
        <div className="hover-card-content">
          <div className="hover-card-buttons">
            <div className="left-buttons">
              <button className="hover-btn circle play" onClick={() => onPlay(item.videoUrl, item.title)} title="Play">
                <i className="fa-solid fa-play"></i>
              </button>
              <button 
                className={`hover-btn circle ${isFavorite ? 'active' : ''}`} 
                onClick={() => onToggleFavorite(item)}
                title={isFavorite ? "Remove from List" : "Add to List"}
              >
                {isFavorite ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-plus"></i>}
              </button>
            </div>
            <button className="hover-btn circle info" onClick={() => onClick(item.id)} title="View Details">
              <i className="fa-solid fa-chevron-down"></i>
            </button>
          </div>
          
          <h4 className="hover-card-title">{item.title}</h4>
          <div className="hover-card-meta">
            <span className="hover-match">{Math.floor(80 + item.rating * 2)}% Match</span>
            <span className="hover-rating-badge">{item.type === 'anime' ? 'Anime' : 'TV-MA'}</span>
            <span className="hover-year">{item.year}</span>
            <span className="hover-duration">{item.duration}</span>
          </div>
          <p className="hover-genres">{genresStr}</p>
          <div className="hover-rating-star"><i className="fa-solid fa-star"></i> {ratingStr}/10</div>
        </div>
      </div>
    </div>
  );
}

// Scrolling Movie Row Component
function MovieRow({ title, items, onViewDetails, onPlayTrailer, favorites, onToggleFavorite }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="movie-row-container">
      <h2 className="row-title">{title}</h2>
      <div className="row-wrapper">
        <button className="row-arrow left" onClick={() => scroll('left')} aria-label="Scroll Left">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        
        <div ref={rowRef} className="row-items-scroller">
          {items.map(item => (
            <MovieCard 
              key={item.id} 
              item={item} 
              onClick={onViewDetails} 
              onPlay={onPlayTrailer}
              isFavorite={favorites.some(fav => fav.id === item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>

        <button className="row-arrow right" onClick={() => scroll('right')} aria-label="Scroll Right">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}


// --- VIEWS ---

// HomeView
function HomeView({ catalog, onPlayTrailer, onViewDetails, favorites, onToggleFavorite }) {
  const heroItem = catalog.find(item => item.id === 's-vikings') || catalog[0];
  const trending = catalog.filter(i => i.trending);
  const popular = catalog.filter(i => i.popular);
  const continueWatching = catalog.filter(i => i.continueWatching);
  const newReleases = catalog.filter(i => i.newRelease);

  return (
    <div className="home-view-wrapper fade-in">
      {/* Netflix Hero Banner */}
      {heroItem && (
        <section className="hero-banner" style={{ backgroundImage: `linear-gradient(to top, #111 5%, rgba(17,17,17,0) 80%), url(${heroItem.banner})` }}>
          <div className="hero-banner-content">
            <h1 className="hero-banner-title">{heroItem.title}</h1>
            <div className="hero-banner-meta">
              <span className="hero-rating"><i className="fa-solid fa-star"></i> {heroItem.rating.toFixed(1)}/10</span>
              <span className="hero-duration">{heroItem.duration}</span>
              <span className="hero-year">{heroItem.year}</span>
            </div>
            <p className="hero-banner-description">{heroItem.description}</p>
            <div className="hero-banner-buttons">
              <button className="btn btn-netflix-play" onClick={() => onPlayTrailer(heroItem.videoUrl, heroItem.title)}>
                <i className="fa-solid fa-play"></i> Play
              </button>
              <button className="btn btn-netflix-info" onClick={() => onViewDetails(heroItem.id)}>
                <i className="fa-solid fa-circle-info"></i> More Info
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Rows */}
      <div className="movie-rows-area">
        <MovieRow 
          title="Trending Now" 
          items={trending} 
          onViewDetails={onViewDetails} 
          onPlayTrailer={onPlayTrailer}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
        <MovieRow 
          title="Continue Watching" 
          items={continueWatching} 
          onViewDetails={onViewDetails} 
          onPlayTrailer={onPlayTrailer}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
        <MovieRow 
          title="Popular on piple" 
          items={popular} 
          onViewDetails={onViewDetails} 
          onPlayTrailer={onPlayTrailer}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
        <MovieRow 
          title="New Releases" 
          items={newReleases} 
          onViewDetails={onViewDetails} 
          onPlayTrailer={onPlayTrailer}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
        <MovieRow 
          title="My List" 
          items={favorites} 
          onViewDetails={onViewDetails} 
          onPlayTrailer={onPlayTrailer}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </div>
  );
}

// ExploreView (Handles general filters & search query displays)
function ExploreView({ catalog, filterType, searchQuery, onViewDetails, onPlayTrailer, favorites, onToggleFavorite }) {
  let displayItems = [...catalog];

  if (filterType === 'shows') {
    displayItems = catalog.filter(i => i.type === 'show');
  } else if (filterType === 'movies') {
    displayItems = catalog.filter(i => i.type === 'movie');
  } else if (filterType === 'latest') {
    displayItems = [...catalog].sort((a, b) => b.year - a.year);
  } else if (filterType === 'search') {
    const q = searchQuery.toLowerCase().trim();
    displayItems = catalog.filter(i => 
      i.title.toLowerCase().includes(q) || 
      i.description.toLowerCase().includes(q) ||
      (i.genres && i.genres.some(g => g.toLowerCase().includes(q)))
    );
  }

  const pageTitle = filterType === 'search' 
    ? `Search results for "${searchQuery}"`
    : filterType === 'shows' ? 'TV Shows'
    : filterType === 'movies' ? 'Movies'
    : filterType === 'latest' ? 'Latest Releases'
    : 'Browse Catalog';

  return (
    <div className="explore-view-container fade-in">
      <h1 className="explore-view-title">{pageTitle}</h1>
      {displayItems.length === 0 ? (
        <div className="no-results-panel">
          <i className="fa-solid fa-magnifying-glass-minus"></i>
          <h3>No matches found</h3>
          <p>Try matching with another title, genre, or keyword.</p>
        </div>
      ) : (
        <div className="explore-cards-grid">
          {displayItems.map(item => (
            <MovieCard 
              key={item.id} 
              item={item} 
              onClick={onViewDetails}
              onPlay={onPlayTrailer}
              isFavorite={favorites.some(fav => fav.id === item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// MyListGrid (Visual Mirror of the Netflix My List layout)
function MyListView({ favorites, onRemoveFavorite, onViewDetails, onPlayTrailer }) {
  return (
    <div className="explore-view-container fade-in">
      <h1 className="explore-view-title">My List</h1>
      {favorites.length === 0 ? (
        <div className="no-results-panel">
          <i className="fa-regular fa-bookmark"></i>
          <h3>Your list is empty</h3>
          <p>Tap the + icon on posters to add shows and movies here.</p>
        </div>
      ) : (
        <div className="explore-cards-grid">
          {favorites.map(item => (
            <MovieCard 
              key={item.id} 
              item={item} 
              onClick={onViewDetails}
              onPlay={onPlayTrailer}
              isFavorite={true}
              onToggleFavorite={onRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// GamesView (Themed games tab)
function GamesView() {
  const mockGames = [
    { name: "Stranger Things: 1984", genre: "Adventure", rating: 4.8, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80" },
    { name: "Card Blast", genre: "Puzzle", rating: 4.2, img: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=500&auto=format&fit=crop&q=80" },
    { name: "Shooting Hoops", genre: "Sports", rating: 4.5, img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=80" },
    { name: "Teeter Up", genre: "Arcade", rating: 4.0, img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80" }
  ];

  return (
    <div className="explore-view-container fade-in">
      <h1 className="explore-view-title">piple Games</h1>
      <p className="games-subtitle">Play mobile games included with your piple membership, with no ads or in-app purchases.</p>
      <div className="explore-cards-grid" style={{ marginTop: '20px' }}>
        {mockGames.map(game => (
          <div key={game.name} className="game-card">
            <img src={game.img} alt={game.name} />
            <div className="game-card-info">
              <h4>{game.name}</h4>
              <p>{game.genre} • <i className="fa-solid fa-star" style={{ color: '#E50914' }}></i> {game.rating}</p>
              <button className="btn btn-netflix-play" style={{ width: '100%', marginTop: '10px', padding: '6px' }}>Play Game</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// DetailsView
function DetailsView({ catalog, id, favorites, onToggleFavorite, onPlayTrailer, onViewDetails }) {
  const item = catalog.find(i => i.id === id);

  if (!item) {
    return (
      <div className="explore-view-container fade-in" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Title Not Found</h2>
        <p>This item is not present in our database.</p>
        <button className="btn btn-netflix-play" style={{ marginTop: '20px' }} onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  const isFav = favorites.some(fav => fav.id === item.id);
  const recs = catalog.filter(r => r.id !== item.id && r.genres.some(g => item.genres.includes(g))).slice(0, 4);

  return (
    <div className="details-view-container fade-in">
      <div className="details-backdrop" style={{ backgroundImage: `linear-gradient(to top, #111, rgba(17,17,17,0.4)), url(${item.banner})` }}></div>
      
      <div className="details-main-content">
        <div className="details-left-pane">
          <h1 className="details-title">{item.title}</h1>
          
          <div className="details-meta-line">
            <span className="match-pct">{Math.floor(80 + item.rating * 2)}% Match</span>
            <span className="meta-year">{item.year}</span>
            <span className="meta-badge">{item.type === 'anime' ? 'Anime' : 'TV-14'}</span>
            <span className="meta-duration">{item.duration}</span>
          </div>

          <p className="details-synopsis">{item.description}</p>
          
          <div className="details-actions">
            <button className="btn btn-netflix-play" onClick={() => onPlayTrailer(item.videoUrl, item.title)}>
              <i className="fa-solid fa-play"></i> Play Title
            </button>
            <button className={`btn btn-netflix-info ${isFav ? 'active' : ''}`} onClick={() => onToggleFavorite(item)}>
              {isFav ? <><i className="fa-solid fa-check"></i> In My List</> : <><i className="fa-solid fa-plus"></i> Add to List</>}
            </button>
          </div>
        </div>

        <div className="details-right-pane">
          <div className="meta-listing">
            <span className="label">Cast:</span> {item.cast ? item.cast.join(', ') : 'Unknown'}
          </div>
          <div className="meta-listing">
            <span className="label">Genres:</span> {item.genres ? item.genres.join(', ') : 'None'}
          </div>
          <div className="meta-listing">
            <span className="label">This Show is:</span> Exciting, Suspenseful, Captivating
          </div>
        </div>
      </div>

      {recs.length > 0 && (
        <div className="details-recommendations">
          <h2>More Like This</h2>
          <div className="explore-cards-grid">
            {recs.map(rec => (
              <MovieCard 
                key={rec.id} 
                item={rec} 
                onClick={onViewDetails}
                onPlay={onPlayTrailer}
                isFavorite={favorites.some(fav => fav.id === rec.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// DashboardView (CRUD Panel)
function DashboardView({ catalog, onUpdateCatalog }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('show');
  const [rating, setRating] = useState('8.0');
  const [year, setYear] = useState('2024');
  const [genres, setGenres] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState('');
  const [banner, setBanner] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [cast, setCast] = useState('');

  const openAdd = () => {
    setEditingItem(null);
    setTitle('');
    setType('show');
    setRating('8.0');
    setYear('2024');
    setGenres('Drama, Thriller');
    setDuration('1 Season');
    setDescription('');
    setPoster('https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500');
    setBanner('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1600');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    setCast('Actor One, Actor Two');
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setType(item.type);
    setRating(item.rating.toString());
    setYear(item.year.toString());
    setGenres(item.genres ? item.genres.join(', ') : '');
    setDuration(item.duration || '');
    setDescription(item.description || '');
    setPoster(item.poster || '');
    setBanner(item.banner || '');
    setVideoUrl(item.videoUrl || '');
    setCast(item.cast ? item.cast.join(', ') : '');
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      type,
      rating: parseFloat(rating) || 8.0,
      year: parseInt(year) || 2024,
      genres: genres.split(',').map(s => s.trim()).filter(Boolean),
      duration,
      description,
      poster,
      banner,
      videoUrl,
      cast: cast.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingItem) {
      await dbService.updateItem(editingItem.id, payload);
    } else {
      payload.id = `s-${Date.now()}`;
      await dbService.addItem(payload);
    }
    setIsOpen(false);
    onUpdateCatalog();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this catalog item?")) {
      await dbService.deleteItem(id);
      onUpdateCatalog();
    }
  };

  return (
    <div className="explore-view-container fade-in" style={{ paddingBottom: '100px' }}>
      <div className="dashboard-header">
        <div>
          <h1 className="explore-view-title">Inventory Dashboard</h1>
          <p style={{ color: '#aaa', marginTop: '5px' }}>Database inventory management panel.</p>
        </div>
        <div>
          <button className="btn btn-netflix-play" onClick={openAdd}><i className="fa-solid fa-plus"></i> Add Item</button>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: '30px' }}>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>Type</th>
              <th>Year</th>
              <th>Rating</th>
              <th>Genres</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {catalog.map(item => (
              <tr key={item.id}>
                <td><img src={item.poster} style={{ width: '40px', borderRadius: '4px' }} alt="" /></td>
                <td><strong>{item.title}</strong></td>
                <td><span className={`type-badge ${item.type}`}>{item.type}</span></td>
                <td>{item.year}</td>
                <td>⭐ {item.rating}</td>
                <td>{item.genres ? item.genres.join(', ') : ''}</td>
                <td>
                  <button className="dash-action-btn edit" onClick={() => openEdit(item)}><i className="fa-solid fa-pen"></i></button>
                  <button className="dash-action-btn delete" onClick={() => handleDelete(item.id)}><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-container" style={{ maxWidth: '600px', background: '#181818', color: '#fff' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            <div style={{ padding: '20px' }}>
              <h2 style={{ marginBottom: '20px' }}>{editingItem ? 'Edit Item' : 'Add Item'}</h2>
              <form onSubmit={handleSubmit} className="dash-form">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                      <option value="show">TV Show</option>
                      <option value="movie">Movie</option>
                      <option value="anime">Anime</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Rating</label>
                    <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Duration / Seasons</label>
                    <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3 Seasons or 2h 15m" />
                  </div>
                  <div className="form-group">
                    <label>Genres (Comma separated)</label>
                    <input type="text" value={genres} onChange={(e) => setGenres(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Poster URL</label>
                  <input type="url" value={poster} onChange={(e) => setPoster(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Banner URL</label>
                  <input type="url" value={banner} onChange={(e) => setBanner(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Video Stream URL</label>
                  <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Cast (Comma separated)</label>
                  <input type="text" value={cast} onChange={(e) => setCast(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3"></textarea>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button type="button" className="btn btn-netflix-info" onClick={() => setIsOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-netflix-play">Save Item</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// --- MAIN APPLICATION MANAGER ---
function App() {
  const [currentView, setView] = useState('home');
  const [detailsId, setDetailsId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('piple_favorites')) || [];
  });

  const [trailerModal, setTrailerModal] = useState({
    isOpen: false,
    videoUrl: '',
    title: ''
  });

  // Sync details ID to view
  const handleViewDetails = (id) => {
    setDetailsId(id);
    setView('details');
  };

  const fetchCatalog = async () => {
    setIsLoading(true);
    const data = await dbService.getCatalog();
    setCatalog(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleToggleFavorite = (item) => {
    const isFav = favorites.some(fav => fav.id === item.id);
    let updated;
    if (isFav) {
      updated = favorites.filter(fav => fav.id !== item.id);
    } else {
      updated = [...favorites, item];
    }
    setFavorites(updated);
    localStorage.setItem('piple_favorites', JSON.stringify(updated));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setView('search');
    } else {
      setView('home');
    }
  };

  const handlePlayTrailer = (url, title) => {
    setTrailerModal({
      isOpen: true,
      videoUrl: url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: title
    });
  };

  const renderView = () => {
    if (isLoading) return null;

    switch (currentView) {
      case 'home':
        return (
          <HomeView 
            catalog={catalog} 
            onPlayTrailer={handlePlayTrailer} 
            onViewDetails={handleViewDetails}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'shows':
        return (
          <ExploreView 
            catalog={catalog} 
            filterType="shows" 
            onViewDetails={handleViewDetails}
            onPlayTrailer={handlePlayTrailer}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'movies':
        return (
          <ExploreView 
            catalog={catalog} 
            filterType="movies" 
            onViewDetails={handleViewDetails}
            onPlayTrailer={handlePlayTrailer}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'games':
        return <GamesView />;
      case 'latest':
        return (
          <ExploreView 
            catalog={catalog} 
            filterType="latest" 
            onViewDetails={handleViewDetails}
            onPlayTrailer={handlePlayTrailer}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'mylist':
        return (
          <MyListView 
            favorites={favorites} 
            onRemoveFavorite={handleToggleFavorite} 
            onViewDetails={handleViewDetails}
            onPlayTrailer={handlePlayTrailer}
          />
        );
      case 'languages':
        return (
          <ExploreView 
            catalog={catalog} 
            filterType="all" 
            onViewDetails={handleViewDetails}
            onPlayTrailer={handlePlayTrailer}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'search':
        return (
          <ExploreView 
            catalog={catalog} 
            filterType="search" 
            searchQuery={searchQuery}
            onViewDetails={handleViewDetails}
            onPlayTrailer={handlePlayTrailer}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'details':
        return (
          <DetailsView 
            catalog={catalog} 
            id={detailsId}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onPlayTrailer={handlePlayTrailer}
            onViewDetails={handleViewDetails}
          />
        );
      case 'dashboard':
        return (
          <DashboardView 
            catalog={catalog} 
            onUpdateCatalog={fetchCatalog} 
          />
        );
      default:
        return (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <h2>404</h2>
            <p>Page Not Found</p>
          </div>
        );
    }
  };

  return (
    <>
      {isLoading && (
        <div id="loading-overlay" className="loading-overlay">
          <div className="spinner-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">piple</span>
          </div>
        </div>
      )}

      <Navbar 
        favoritesCount={favorites.length} 
        onSearch={handleSearch}
        currentView={currentView}
        setView={(v) => { setView(v); setDetailsId(null); }}
      />

      <main className="main-content-viewport">
        {renderView()}
      </main>

      <Footer />

      <TrailerModal 
        isOpen={trailerModal.isOpen} 
        videoUrl={trailerModal.videoUrl} 
        title={trailerModal.title} 
        onClose={() => setTrailerModal({ isOpen: false, videoUrl: '', title: '' })}
      />
    </>
  );
}

// Mount React App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
