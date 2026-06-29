import React, { useState, useEffect, useRef } from 'react';

export default function TrailerModal({ isOpen, videoUrl, title, onClose }) {
  const videoRef = useRef(null);
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [isSimPlaying, setIsSimPlaying] = useState(true);
  const [simDuration, setSimDuration] = useState(135); // Default 2m 15s

  const captions = [
    "piple SECURE CONNECTION ESTABLISHED...",
    "DECRYPTING VIDEO CONTAINER PACKETS...",
    "[Kai] We are in. Accessing secure node...",
    "CREATING CYBERNETIC DECRYPT LINK...",
    "Evelyn: 'Hurry, Kai! Brave shield defenses are scaling up.'",
    "Kai: 'Almost there... bypass logic injected...'",
    "Evelyn: 'Downloading consciousness protocols...'",
    "STREAM SECURED. ENJOY PREMIUM PLAYBACK."
  ];

  // Reset modal state on open/close
  useEffect(() => {
    let loadTimeout;
    
    if (isOpen && videoUrl) {
      setIsFallbackActive(false);
      setSimTime(0);
      setIsSimPlaying(true);
      
      // Setup duration based on default values
      setSimDuration(135);

      const video = videoRef.current;
      if (video) {
        video.src = videoUrl;
        video.load();
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log("Autoplay blocked, waiting for user interaction:", err);
          });
        }

        // Error listener
        const handleError = () => {
          console.log("Video source load failed. Activating piple simulator fallback.");
          setIsFallbackActive(true);
        };
        video.addEventListener('error', handleError);

        // Fallback timeout: if not playing in 2.5s, trigger simulation
        loadTimeout = setTimeout(() => {
          if (video.currentTime === 0 && video.paused) {
            console.log("Video load timeout. Activating simulator fallback.");
            setIsFallbackActive(true);
          }
        }, 2500);

        return () => {
          clearTimeout(loadTimeout);
          video.removeEventListener('error', handleError);
        };
      }
    } else {
      // Clean up player on close
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.src = "";
      }
    }
  }, [isOpen, videoUrl]);

  // Simulation ticking interval
  useEffect(() => {
    let simInterval;
    if (isOpen && isFallbackActive && isSimPlaying) {
      simInterval = setInterval(() => {
        setSimTime((prev) => {
          if (prev >= simDuration) {
            return 0; // Loop simulation
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (simInterval) clearInterval(simInterval);
    };
  }, [isOpen, isFallbackActive, isSimPlaying, simDuration]);

  if (!isOpen) return null;

  // Format time (e.g. 1:24)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentCaption = captions[Math.min(
    Math.floor((simTime / simDuration) * captions.length),
    captions.length - 1
  )];

  const toggleSimPlay = () => {
    setIsSimPlaying(!isSimPlaying);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close Player">
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

            {/* Custom Simulation Fallback */}
            {isFallbackActive && (
              <div className="video-sim-container">
                <div className="sim-bg-glow"></div>
                <div className="sim-content">
                  <div className="sim-header">
                    <span className="sim-badge">
                      <i className="fa-solid fa-compact-disc fa-spin"></i> piple Stream
                    </span>
                    <h3>{title}</h3>
                  </div>

                  <div className="sim-visualizer-container" onClick={toggleSimPlay}>
                    {/* Equalizer Visualizer */}
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
                      <i className={`fa-solid fa-circle-play sim-play-big-btn ${isSimPlaying ? 'hidden' : ''}`}></i>
                    </div>

                    <p className="sim-status-text">Streaming native piple content...</p>
                    <p className="sim-caption">{currentCaption}</p>
                  </div>

                  {/* Simulator Controls */}
                  <div className="sim-controls">
                    <button className="sim-ctrl-btn" onClick={toggleSimPlay} aria-label="Play/Pause">
                      {isSimPlaying ? (
                        <i className="fa-solid fa-pause"></i>
                      ) : (
                        <i className="fa-solid fa-play"></i>
                      )}
                    </button>
                    
                    <div className="sim-progress-wrapper">
                      <span className="sim-time">{formatTime(simTime)}</span>
                      <div className="sim-progress-bar" onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const width = rect.width;
                        const clickPercent = clickX / width;
                        setSimTime(Math.floor(clickPercent * simDuration));
                      }}>
                        <div 
                          className="sim-progress-fill" 
                          style={{ width: `${(simTime / simDuration) * 100}%` }}
                        ></div>
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
