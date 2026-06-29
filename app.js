// CineVerse JavaScript Application Engine

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE MANAGEMENT ---
  const state = {
    favorites: JSON.parse(localStorage.getItem("cineverse_favorites")) || [],
    theme: localStorage.getItem("cineverse_theme") || "dark",
    activeGenre: "All",
    activeSort: "Rating", // Rating, Latest, Popular
    activeView: "home"
  };

  // --- MOCK DATABASE HELPER ---
  const db = window.cineVerseData || { movies: [], anime: [] };
  const allItems = [...db.movies, ...db.anime];

  // --- DOM ELEMENTS ---
  const appContent = document.getElementById("app-content");
  const loadingOverlay = document.getElementById("loading-overlay");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const navMenu = document.getElementById("nav-menu");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  const favBadge = document.getElementById("fav-badge");
  
  // Trailer Video Elements
  const trailerModal = document.getElementById("trailer-modal");
  const trailerVideo = document.getElementById("trailer-video");
  const closeModalBtn = document.getElementById("close-modal-btn");

  // --- INITIALIZATION ---
  function init() {
    // Set initial theme
    document.documentElement.setAttribute("data-theme", state.theme);
    updateFavBadge();

    // Listeners
    window.addEventListener("hashchange", handleRouting);
    themeToggleBtn.addEventListener("click", toggleTheme);
    
    // Mobile Drawer toggle
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenuBtn.classList.toggle("open");
      mobileDrawer.classList.toggle("open");
    });

    // Close Mobile Drawer on link click
    document.querySelectorAll(".drawer-item").forEach(item => {
      item.addEventListener("click", () => {
        mobileMenuBtn.classList.remove("open");
        mobileDrawer.classList.remove("open");
      });
    });

    // Global Search Event
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
      }
    });

    searchInput.addEventListener("input", () => {
      if (searchInput.value.length > 0) {
        clearSearchBtn.classList.remove("hidden");
      } else {
        clearSearchBtn.classList.add("hidden");
      }
    });

    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearSearchBtn.classList.add("hidden");
      searchInput.focus();
    });

    // Trailer Modal Closes
    closeModalBtn.addEventListener("click", closeTrailer);
    trailerModal.addEventListener("click", (e) => {
      if (e.target === trailerModal) closeTrailer();
    });

    // Run routing for initial load
    handleRouting();
  }

  // --- ROUTING SYSTEM ---
  function showLoader() {
    loadingOverlay.classList.remove("hidden");
  }

  function hideLoader() {
    loadingOverlay.classList.add("hidden");
  }

  function handleRouting() {
    showLoader();

    // Minor delay to show loading spinner and create smooth cinematic transition
    setTimeout(() => {
      const hash = window.location.hash || "#/";
      
      let routePath = hash;
      let queryParams = {};

      if (hash.includes("?")) {
        const parts = hash.split("?");
        routePath = parts[0];
        const searchParams = new URLSearchParams(parts[1]);
        for (const [key, value] of searchParams) {
          queryParams[key] = value;
        }
      }

      // Sync navbar highlights
      updateActiveNavItem(routePath);

      // Route views
      if (routePath === "#/" || routePath === "") {
        state.activeView = "home";
        renderHome();
      } else if (routePath === "#/movies") {
        state.activeView = "movies";
        renderExplore("movie");
      } else if (routePath === "#/anime") {
        state.activeView = "anime";
        renderExplore("anime");
      } else if (routePath === "#/favorites") {
        state.activeView = "favorites";
        renderFavorites();
      } else if (routePath.startsWith("#/details/")) {
        state.activeView = "details";
        const itemId = routePath.replace("#/details/", "");
        renderDetails(itemId);
      } else if (routePath === "#/search") {
        state.activeView = "search";
        const query = queryParams.q || "";
        // Sync search input if redirected from another page
        searchInput.value = query;
        if (query) clearSearchBtn.classList.remove("hidden");
        renderSearch(query);
      } else {
        // Fallback
        window.location.hash = "#/";
      }

      window.scrollTo(0, 0);
      hideLoader();
    }, 400);
  }

  function updateActiveNavItem(hash) {
    let currentPage = "home";
    if (hash === "#/movies") currentPage = "movies";
    else if (hash === "#/anime") currentPage = "anime";
    else if (hash === "#/favorites") currentPage = "favorites";
    else if (hash === "#/search") currentPage = "search";
    else if (hash.startsWith("#/details/")) {
      // Find the item to see if it's movie or anime
      const id = hash.replace("#/details/", "");
      const item = allItems.find(i => i.id === id);
      if (item) currentPage = item.type === "movie" ? "movies" : "anime";
    }

    // Desktop
    document.querySelectorAll(".nav-item").forEach(item => {
      if (item.getAttribute("data-page") === currentPage) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Mobile Drawer
    document.querySelectorAll(".drawer-item").forEach(item => {
      if (item.getAttribute("data-page") === currentPage) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // --- THEME MANAGEMENT ---
  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", state.theme);
    localStorage.setItem("cineverse_theme", state.theme);
  }

  // --- FAVORITES LIFECYCLE ---
  function isFavorite(id) {
    return state.favorites.some(fav => fav.id === id);
  }

  function toggleFavorite(id) {
    const isFav = isFavorite(id);
    if (isFav) {
      state.favorites = state.favorites.filter(fav => fav.id !== id);
    } else {
      const item = allItems.find(i => i.id === id);
      if (item) {
        state.favorites.push(item);
      }
    }
    localStorage.setItem("cineverse_favorites", JSON.stringify(state.favorites));
    updateFavBadge();

    // Rerender active view components if needed
    const favBtn = document.querySelector(`.btn-fav[data-id="${id}"]`);
    if (favBtn) {
      if (isFav) {
        favBtn.classList.remove("active");
        favBtn.innerHTML = `<i class="fa-regular fa-heart"></i> Add to Favorites`;
      } else {
        favBtn.classList.add("active");
        favBtn.innerHTML = `<i class="fa-solid fa-heart"></i> Saved to Favorites`;
      }
    }

    // If we're on the favorites page, update it instantly
    if (state.activeView === "favorites") {
      renderFavorites();
    }
  }

  function updateFavBadge() {
    const count = state.favorites.length;
    if (count > 0) {
      favBadge.textContent = count;
      favBadge.classList.remove("fav-badge.hidden");
      favBadge.classList.add("fav-badge"); // make visible
    } else {
      favBadge.classList.remove("fav-badge");
      favBadge.classList.add("fav-badge.hidden");
      favBadge.style.display = "none";
      return;
    }
    favBadge.style.display = "inline-block";
  }

  // --- TRAILER MODAL SYSTEM & SIMULATION ---
  let loadTimeout = null;
  let simInterval = null;
  let simTime = 0;
  let simDuration = 135; // 2m 15s representation
  let isSimPlaying = false;
  
  const captions = [
    "CINEVERSE SECURE CONNECTION ESTABLISHED...",
    "DECRYPTING VIDEO CONTAINER PACKETS...",
    "[Kai] We are in. Accessing secure node...",
    "CREATING CYBERNETIC DECRYPT LINK...",
    "Evelyn: 'Hurry, Kai! Brave shield defenses are scaling up.'",
    "Kai: 'Almost there... bypass logic injected...'",
    "Evelyn: 'Downloading consciousness protocols...'",
    "STREAM SECURED. ENJOY PREMIUM PLAYBACK."
  ];

  // Listen for video errors to fallback instantly
  trailerVideo.addEventListener("error", (e) => {
    console.log("Video source load failed. Falling back to CineVerse Cinematic Simulation.");
    activateVideoSimulation();
  });

  // Listen for video stalling / network empty states
  trailerVideo.addEventListener("stalled", () => {
    console.log("Video playback stalled.");
  });

  function playTrailer(url) {
    if (url) {
      clearTimeout(loadTimeout);
      if (simInterval) clearInterval(simInterval);
      
      // Reset displays
      document.getElementById("video-simulation").classList.add("hidden");
      trailerVideo.classList.remove("hidden");
      
      // Load source
      trailerVideo.src = url;
      trailerVideo.load();
      trailerModal.classList.remove("hidden");
      document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
      
      trailerVideo.play().catch(err => {
        console.log("Autoplay blocked, waiting for user play gesture.", err);
      });
      
      // If video does not start playing within 2.5 seconds, trigger simulation mode
      loadTimeout = setTimeout(() => {
        if (trailerVideo.currentTime === 0 && trailerVideo.paused) {
          console.log("Video failed to play within 2.5s. Activating local simulator fallback.");
          activateVideoSimulation();
        }
      }, 2500);
    }
  }

  function closeTrailer() {
    clearTimeout(loadTimeout);
    if (simInterval) {
      clearInterval(simInterval);
      simInterval = null;
    }
    
    trailerVideo.pause();
    trailerVideo.src = "";
    document.getElementById("video-simulation").classList.add("hidden");
    trailerModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function activateVideoSimulation() {
    clearTimeout(loadTimeout);
    trailerVideo.pause();
    trailerVideo.classList.add("hidden");
    
    const simContainer = document.getElementById("video-simulation");
    simContainer.classList.remove("hidden");
    
    // Find active title
    let activeTitle = "Cinematic Title";
    let durationStr = "2h 15m";
    
    const activeItem = allItems.find(i => i.videoUrl === trailerVideo.src || (i.epList && i.epList.some(e => e.videoUrl === trailerVideo.src)));
    if (activeItem) {
      activeTitle = activeItem.title;
      durationStr = activeItem.duration || activeItem.episodes;
      
      // Check if it's an episode that was clicked
      if (activeItem.epList) {
        const matchingEp = activeItem.epList.find(e => e.videoUrl === trailerVideo.src);
        if (matchingEp) {
          activeTitle = `${activeItem.title} - Episode ${matchingEp.epNum}`;
          durationStr = matchingEp.duration;
        }
      }
    }
    
    document.getElementById("sim-movie-title").textContent = activeTitle;
    document.getElementById("sim-total-time").textContent = durationStr;
    
    // Reset simulation timer
    simTime = 0;
    // Parse durationStr to duration seconds representation
    if (durationStr.includes("m") && !durationStr.includes("h")) {
      const parsedMins = parseInt(durationStr);
      simDuration = isNaN(parsedMins) ? 135 : parsedMins * 60;
    } else {
      simDuration = 180; // default 3 minutes representation for loop
    }
    
    isSimPlaying = true;
    updateSimUI();
    
    if (simInterval) clearInterval(simInterval);
    simInterval = setInterval(() => {
      if (isSimPlaying) {
        simTime += 1;
        if (simTime >= simDuration) {
          simTime = 0;
        }
        updateSimUI();
      }
    }, 1000);
  }

  function updateSimUI() {
    const fillPercent = (simTime / simDuration) * 100;
    document.getElementById("sim-progress-fill").style.width = `${fillPercent}%`;
    
    const mins = Math.floor(simTime / 60);
    const secs = simTime % 60;
    document.getElementById("sim-current-time").textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    
    // Set captions
    const captionIdx = Math.floor((simTime / simDuration) * captions.length);
    document.getElementById("sim-caption-text").textContent = captions[captionIdx] || "";
    
    const btn = document.getElementById("sim-play-pause-btn");
    const wave = document.querySelector(".sim-audio-wave");
    const playBig = document.querySelector(".sim-play-big-btn");
    
    if (isSimPlaying) {
      if (btn) btn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
      if (wave) wave.classList.remove("paused");
      if (playBig) playBig.classList.add("hidden");
    } else {
      if (btn) btn.innerHTML = `<i class="fa-solid fa-play"></i>`;
      if (wave) wave.classList.add("paused");
      if (playBig) playBig.classList.remove("hidden");
    }
  }

  function toggleSimPlay() {
    isSimPlaying = !isSimPlaying;
    updateSimUI();
  }

  // Bind simulation UI elements
  document.getElementById("sim-play-pause-btn").addEventListener("click", toggleSimPlay);
  document.querySelector(".sim-play-overlay").addEventListener("click", toggleSimPlay);

  // --- CARD GENERATOR ---
  function createCardHtml(item) {
    const yearTypeStr = item.type === "movie" ? `${item.year} &bull; Movie` : `${item.year} &bull; Anime`;
    const ratingStr = item.rating.toFixed(1);
    
    return `
      <div class="card-item" data-id="${item.id}">
        <div class="card-poster-wrapper">
          <span class="card-overlay-badge">${item.genres[0]}</span>
          <img class="card-poster" src="${item.poster}" alt="${item.title} Poster" 
               onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500';">
        </div>
        <div class="card-content">
          <h3 class="card-title" title="${item.title}">${item.title}</h3>
          <div class="card-meta">
            <span class="card-rating"><i class="fa-solid fa-star"></i> ${ratingStr}</span>
            <span class="card-year-type">${yearTypeStr}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Attach card click handlers inside views
  function setupCardClickHandlers() {
    document.querySelectorAll(".card-item").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        window.location.hash = `#/details/${id}`;
      });
    });
  }

  // --- RENDERING PAGE 1: HOME PAGE ---
  function renderHome() {
    // Choose hero item dynamically (e.g. Frieren or Cyberpunk)
    const heroItem = db.anime.find(a => a.id === "a-frieren") || allItems[0];
    const heroGenreStr = heroItem.genres.join(" | ");
    
    // Filter trending and popular lists
    const trendingItems = allItems.filter(item => item.trending);
    const popularMovies = db.movies.filter(item => item.popular);
    const popularAnime = db.anime.filter(item => item.popular);

    appContent.innerHTML = `
      <!-- Hero Banner -->
      <section class="hero-container" style="background-image: url('${heroItem.banner}')">
        <div class="hero-overlay"></div>
        <div class="hero-content page-fade-in">
          <span class="hero-type">${heroItem.type}</span>
          <h1 class="hero-title">${heroItem.title}</h1>
          <div class="hero-meta">
            <span class="hero-rating"><i class="fa-solid fa-star"></i> ${heroItem.rating.toFixed(1)}/10</span>
            <span class="hero-duration-ep">${heroItem.type === "movie" ? heroItem.duration : heroItem.episodes}</span>
            <span class="hero-genre">${heroGenreStr}</span>
          </div>
          <p class="hero-description">${heroItem.description}</p>
          <div class="hero-buttons">
            <button class="btn btn-primary" id="hero-watch-btn"><i class="fa-solid fa-play"></i> Watch Trailer</button>
            <button class="btn btn-secondary" id="hero-details-btn"><i class="fa-solid fa-circle-info"></i> View Details</button>
          </div>
        </div>
      </section>

      <!-- Trending Section (Horizontal Slider) -->
      <section class="section-container page-fade-in">
        <div class="section-header">
          <h2 class="section-title">Trending Now</h2>
        </div>
        <div class="slider-wrapper">
          <div class="cards-slider">
            ${trendingItems.map(item => createCardHtml(item)).join("")}
          </div>
        </div>
      </section>

      <!-- Popular Movies Section (Grid) -->
      <section class="section-container page-fade-in">
        <div class="section-header">
          <h2 class="section-title">Popular Movies</h2>
          <a href="#/movies" class="btn btn-secondary" style="padding: 0.45rem 1rem; font-size: 0.85rem;">See All</a>
        </div>
        <div class="cards-grid">
          ${popularMovies.map(item => createCardHtml(item)).join("")}
        </div>
      </section>

      <!-- Popular Anime Section (Grid) -->
      <section class="section-container page-fade-in">
        <div class="section-header">
          <h2 class="section-title">Popular Anime</h2>
          <a href="#/anime" class="btn btn-secondary" style="padding: 0.45rem 1rem; font-size: 0.85rem;">See All</a>
        </div>
        <div class="cards-grid">
          ${popularAnime.map(item => createCardHtml(item)).join("")}
        </div>
      </section>
    `;

    // Bind Hero Clicks
    document.getElementById("hero-watch-btn").addEventListener("click", () => {
      const playUrl = heroItem.epList ? heroItem.epList[0].videoUrl : heroItem.videoUrl;
      playTrailer(playUrl);
    });
    document.getElementById("hero-details-btn").addEventListener("click", () => {
      window.location.hash = `#/details/${heroItem.id}`;
    });

    // Bind cards clicks
    setupCardClickHandlers();
  }

  // --- RENDERING PAGE 2 & 3: BROWSE PAGES (MOVIES & ANIME) ---
  function renderExplore(type) {
    const isMovie = type === "movie";
    const title = isMovie ? "Explore Movies" : "Explore Anime";
    const databaseList = isMovie ? db.movies : db.anime;
    
    // Collect all genres specific to this database type
    const availableGenres = ["All"];
    databaseList.forEach(item => {
      item.genres.forEach(g => {
        if (!availableGenres.includes(g)) availableGenres.push(g);
      });
    });

    // Rerender layout template
    appContent.innerHTML = `
      <div class="page-header-container page-fade-in">
        <h1 class="page-title">${title}</h1>
        <p class="page-subtitle">Browse through the highest quality cinematic items in our collection.</p>
        
        <!-- Filters & Sorting Bar -->
        <div class="filter-bar">
          <div class="filter-group">
            <span class="filter-label">Genre:</span>
            <div class="genre-pills" id="genre-pills-container">
              ${availableGenres.map(genre => `
                <button class="genre-pill ${state.activeGenre === genre ? "active" : ""}" data-genre="${genre}">${genre}</button>
              `).join("")}
            </div>
          </div>
          <div class="filter-group">
            <span class="filter-label">Sort By:</span>
            <div class="select-wrapper">
              <select class="custom-select" id="sort-selector">
                <option value="Rating" ${state.activeSort === "Rating" ? "selected" : ""}>Highest Rating</option>
                <option value="Latest" ${state.activeSort === "Latest" ? "selected" : ""}>Latest Release</option>
                <option value="Popular" ${state.activeSort === "Popular" ? "selected" : ""}>Popularity</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Cards Grid Container -->
        <div class="cards-grid" id="explore-grid">
          <!-- Dynamic cards injected here -->
        </div>
      </div>
    `;

    // Filter and Sort implementation
    function updateGrid() {
      let filtered = [...databaseList];

      // 1. Genre filter
      if (state.activeGenre !== "All") {
        filtered = filtered.filter(item => item.genres.includes(state.activeGenre));
      }

      // 2. Sorting
      if (state.activeSort === "Rating") {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (state.activeSort === "Latest") {
        filtered.sort((a, b) => b.year - a.year);
      } else if (state.activeSort === "Popular") {
        // Mock sorting: items with true trending first, then rating
        filtered.sort((a, b) => {
          if (a.trending !== b.trending) {
            return a.trending ? -1 : 1;
          }
          return b.rating - a.rating;
        });
      }

      const gridElement = document.getElementById("explore-grid");
      if (filtered.length === 0) {
        gridElement.innerHTML = `
          <div class="no-results-container">
            <i class="fa-solid fa-film no-results-icon"></i>
            <h3 class="no-results-title">No items found</h3>
            <p class="no-results-text">No matches for genre "${state.activeGenre}". Try exploring other categories.</p>
          </div>
        `;
      } else {
        gridElement.innerHTML = filtered.map(item => createCardHtml(item)).join("");
        setupCardClickHandlers();
      }
    }

    // Attach Event Listeners to Genre Pills
    document.querySelectorAll(".genre-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".genre-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        state.activeGenre = pill.getAttribute("data-genre");
        updateGrid();
      });
    });

    // Attach Event Listener to Sorting Selector
    document.getElementById("sort-selector").addEventListener("change", (e) => {
      state.activeSort = e.target.value;
      updateGrid();
    });

    // Initial grid population
    updateGrid();
  }

  // --- RENDERING PAGE 4: SEARCH PAGE ---
  function renderSearch(query) {
    const trimmedQuery = query.toLowerCase().trim();
    
    // Filter database
    const results = allItems.filter(item => {
      return (
        item.title.toLowerCase().includes(trimmedQuery) ||
        item.genres.some(g => g.toLowerCase().includes(trimmedQuery)) ||
        item.description.toLowerCase().includes(trimmedQuery)
      );
    });

    appContent.innerHTML = `
      <div class="page-header-container page-fade-in">
        <h1 class="page-title">Search Results</h1>
        <p class="page-subtitle" id="search-results-summary">
          Found ${results.length} results matching "<strong>${escapeHtml(query)}</strong>"
        </p>

        <div class="cards-grid" style="margin-top: 2rem;">
          ${results.length === 0 ? `
            <div class="no-results-container">
              <i class="fa-solid fa-magnifying-glass-minus no-results-icon"></i>
              <h3 class="no-results-title">No results found</h3>
              <p class="no-results-text">We couldn't find any movies or anime matching "${escapeHtml(query)}". Try using different keywords or checking for spelling errors.</p>
              <button class="btn btn-primary" onclick="window.location.hash='#/'"><i class="fa-solid fa-house"></i> Return Home</button>
            </div>
          ` : results.map(item => createCardHtml(item)).join("")}
        </div>
      </div>
    `;

    setupCardClickHandlers();
  }

  // Helper to escape search inputs
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- RENDERING PAGE 5: DETAILS PAGE ---
  function renderDetails(id) {
    const item = allItems.find(i => i.id === id);
    if (!item) {
      appContent.innerHTML = `
        <div class="page-header-container page-fade-in" style="text-align: center; padding: 6rem 2rem;">
          <h1 class="page-title">Item Not Found</h1>
          <p class="page-subtitle">The movie or anime details you are trying to view does not exist.</p>
          <a href="#/" class="btn btn-primary" style="margin-top: 1.5rem;"><i class="fa-solid fa-house"></i> Go Back Home</a>
        </div>
      `;
      return;
    }

    const isFav = isFavorite(item.id);
    const typeLabel = item.type === "movie" ? "Movies" : "Anime";
    const typeHash = item.type === "movie" ? "#/movies" : "#/anime";
    const lengthLabel = item.type === "movie" ? "Duration" : "Episodes";
    const lengthVal = item.type === "movie" ? item.duration : item.episodes;

    // Filter Recommended Section (Exclude current, match at least one genre, match type)
    const recommendations = allItems
      .filter(rec => rec.id !== item.id && rec.type === item.type && rec.genres.some(g => item.genres.includes(g)))
      .slice(0, 4);

    appContent.innerHTML = `
      <div class="details-container page-fade-in">
        <!-- Left Side: Large Poster -->
        <div class="details-left">
          <div class="details-poster-card">
            <img src="${item.poster}" alt="${item.title} Poster" 
                 onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500';">
          </div>
        </div>

        <!-- Right Side: Details Info -->
        <div class="details-right">
          <!-- Breadcrumbs -->
          <div class="details-breadcrumbs">
            <a href="#/">Home</a>
            <i class="fa-solid fa-chevron-right breadcrumbs-separator"></i>
            <a href="${typeHash}">${typeLabel}</a>
            <i class="fa-solid fa-chevron-right breadcrumbs-separator"></i>
            <span>${item.title}</span>
          </div>

          <h1 class="details-title">${item.title}</h1>
          
          <div class="details-genre-pills">
            ${item.genres.map(g => `<span class="details-genre-pill">${g}</span>`).join("")}
          </div>

          <!-- Metadata table -->
          <div class="details-meta-grid">
            <div class="details-meta-item rating">
              <i class="fa-solid fa-star"></i>
              <span><strong>${item.rating.toFixed(1)}</strong>/10</span>
            </div>
            <div class="details-meta-item">
              <i class="fa-solid fa-calendar"></i>
              <span>Released: <strong>${item.year}</strong></span>
            </div>
            <div class="details-meta-item">
              <i class="fa-solid fa-clock"></i>
              <span>${lengthLabel}: <strong>${lengthVal}</strong></span>
            </div>
          </div>

          <div>
            <h2 class="details-section-title">Synopsis</h2>
            <p class="details-description">${item.description}</p>
          </div>

          <!-- Cast Section -->
          <div>
            <h2 class="details-section-title">Principal Cast</h2>
            <div class="cast-grid">
              ${item.cast.map(cName => {
                const initials = cName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
                return `
                  <div class="cast-card">
                    <div class="cast-avatar">${initials}</div>
                    <span class="cast-name">${cName}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="details-actions">
            <button class="btn btn-primary" id="details-play-btn">
              <i class="fa-solid fa-play"></i> ${item.type === "movie" ? "Play Movie" : "Play Episode 1"}
            </button>
            <button class="btn btn-secondary btn-fav ${isFav ? "active" : ""}" id="details-fav-btn" data-id="${item.id}">
              ${isFav ? `<i class="fa-solid fa-heart"></i> Saved to Favorites` : `<i class="fa-regular fa-heart"></i> Add to Favorites`}
            </button>
          </div>

          <!-- Episode List Section (Anime Only) -->
          ${item.epList ? `
            <div class="episodes-section">
              <h2 class="details-section-title">Episodes</h2>
              <div class="episodes-list">
                ${item.epList.map(ep => `
                  <div class="episode-row" data-video-url="${ep.videoUrl}">
                    <div class="episode-info">
                      <div class="episode-play-icon">
                        <i class="fa-solid fa-play"></i>
                      </div>
                      <div class="episode-details">
                        <span class="episode-title-text">Episode ${ep.epNum}: ${ep.title}</span>
                        <span class="episode-duration">${ep.duration}</span>
                      </div>
                    </div>
                    <button class="episode-play-btn">Play</button>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ""}

        </div>
      </div>

      <!-- Recommended/Similar Section -->
      ${recommendations.length > 0 ? `
        <section class="section-container page-fade-in" style="border-top: 1px solid var(--border-color); padding-top: 3rem;">
          <h2 class="section-title">You May Also Like</h2>
          <div class="cards-grid" style="margin-top: 1.5rem;">
            ${recommendations.map(rec => createCardHtml(rec)).join("")}
          </div>
        </section>
      ` : ""}
    `;

    // Listeners
    document.getElementById("details-play-btn").addEventListener("click", () => {
      const playUrl = item.epList ? item.epList[0].videoUrl : item.videoUrl;
      playTrailer(playUrl);
    });

    document.getElementById("details-fav-btn").addEventListener("click", () => {
      toggleFavorite(item.id);
    });

    // Bind episode row clicks
    if (item.epList) {
      document.querySelectorAll(".episode-row").forEach(row => {
        row.addEventListener("click", () => {
          const url = row.getAttribute("data-video-url");
          playTrailer(url);
        });
      });
    }

    setupCardClickHandlers();
  }

  // --- RENDERING PAGE 6: FAVORITES PAGE ---
  function renderFavorites() {
    appContent.innerHTML = `
      <div class="page-header-container page-fade-in">
        <h1 class="page-title">My Favorites <i class="fa-solid fa-heart" style="color: var(--accent-neon); font-size: 1.8rem; margin-left: 0.5rem; vertical-align: middle;"></i></h1>
        <p class="page-subtitle">Your personalized list of saved movies and anime series.</p>

        <div class="cards-grid" id="favorites-grid" style="margin-top: 2rem;">
          <!-- Favorite cards -->
        </div>
      </div>
    `;

    const gridElement = document.getElementById("favorites-grid");
    
    if (state.favorites.length === 0) {
      gridElement.innerHTML = `
        <div class="no-results-container">
          <i class="fa-regular fa-heart no-results-icon"></i>
          <h3 class="no-results-title">No Favorites Saved</h3>
          <p class="no-results-text">You haven't added any movies or anime to your favorites list yet. When exploring, click the "Add to Favorites" button to save them here.</p>
          <button class="btn btn-primary" onclick="window.location.hash='#/'"><i class="fa-solid fa-compass"></i> Discover Content</button>
        </div>
      `;
    } else {
      // Favorites list cards
      gridElement.innerHTML = state.favorites.map(item => {
        const yearTypeStr = item.type === "movie" ? `${item.year} &bull; Movie` : `${item.year} &bull; Anime`;
        const ratingStr = item.rating.toFixed(1);
        
        return `
          <div class="card-item" data-id="${item.id}" style="position: relative;">
            <button class="btn-remove-fav" data-id="${item.id}" title="Remove from Favorites" aria-label="Remove Favorite">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="card-poster-wrapper">
              <span class="card-overlay-badge">${item.genres[0]}</span>
              <img class="card-poster" src="${item.poster}" alt="${item.title} Poster" 
                   onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500';">
            </div>
            <div class="card-content">
              <h3 class="card-title" title="${item.title}">${item.title}</h3>
              <div class="card-meta">
                <span class="card-rating"><i class="fa-solid fa-star"></i> ${ratingStr}</span>
                <span class="card-year-type">${yearTypeStr}</span>
              </div>
            </div>
          </div>
        `;
      }).join("");

      // CSS specific to removing from favorites page
      const styleSheet = document.createElement("style");
      styleSheet.innerText = `
        .btn-remove-fav {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(8, 9, 13, 0.85);
          backdrop-filter: var(--glass-filter);
          -webkit-backdrop-filter: var(--glass-filter);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }
        .btn-remove-fav:hover {
          background-color: var(--accent-neon);
          color: white;
          border-color: transparent;
          box-shadow: var(--glow-shadow);
          transform: scale(1.1);
        }
      `;
      document.head.appendChild(styleSheet);

      // Card clicks
      setupCardClickHandlers();

      // Bind Remove Clicks
      document.querySelectorAll(".btn-remove-fav").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation(); // Avoid triggering card click detail redirect
          const id = btn.getAttribute("data-id");
          toggleFavorite(id);
        });
      });
    }
  }

  // Run the app!
  init();
});
