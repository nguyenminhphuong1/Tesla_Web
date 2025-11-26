import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  video: string;
  label: string;
}

const VideoViewer: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState<string>('main');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const zoomVideoRef = useRef<HTMLVideoElement>(null);

  const hotspots: Hotspot[] = [
    {
      id: 'hotspot1',
      x: 58,
      y: 18,
      video: 'zoom1',
      label: '4 way shuttle'
    },
    {
      id: 'hotspot2',
      x: 75,
      y: 40,
      video: 'zoom2',
      label: 'Rack Stacking'
    },
    {
    id: 'hotspot3',
    x: 15,
    y: 50,
    video: 'zoom3',
    label: 'Loading & Unloading'
    },
    {
    id: 'hotspot4',
    x: 78,
    y: 23,
    video: 'zoom4',
    label: 'High-Level Storage'
    },
    {
    id: 'hotspot5',
    x: 42,
    y: 35,
    video: 'zoom5',
    label: 'Production Line Docking'
      },
      {
    id: 'hotspot6',
    x: 30,
    y: 16,
    video: 'zoom6',
    label: 'ASRS'
      }
  ];

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentVideo(hotspot.video);
    
    // Reset transitioning state after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    
    // Auto play zoom video
    setTimeout(() => {
      if (zoomVideoRef.current) {
        zoomVideoRef.current.play();
      }
    }, 150);
  };

  const handleBackToMain = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentVideo('main');
    
    // Pause zoom video
    if (zoomVideoRef.current) {
      zoomVideoRef.current.pause();
    }
    
    // Reset transitioning state after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    
    // Play main video
    setTimeout(() => {
      if (mainVideoRef.current) {
        mainVideoRef.current.play();
      }
    }, 10);
  };

  const videoVariants = {
    initial: { opacity: 0, scale: 1.02 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
  };

  const hotspotVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.2, opacity: 0.9 }
  };

  const backButtonVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // Ensure main video plays on mount
  useEffect(() => {
    console.log('🔄 currentVideo changed to:', currentVideo);
    if (mainVideoRef.current && currentVideo === 'main') {
      mainVideoRef.current.play().catch(console.error);
    }
  }, [currentVideo]);

  return (
    <div className="video-viewer">
      <div className="video-container"> 
        <AnimatePresence mode="popLayout">
          {currentVideo === 'main' ? (
            <motion.div
              key="main"
              className="video-wrapper"
              variants={videoVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <video
                ref={mainVideoRef}
                className="main-video"
                src="/assets/soluton_video/main.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
              
              {/* Hotspots */}
              {hotspots.map((hotspot) => (
                <motion.div
                  key={hotspot.id}
                  className="hotspot"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  variants={hotspotVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleHotspotClick(hotspot)}
                >
                  <div className="hotspot-pulse"></div>
                  <div className="hotspot-icon">+</div>
                  <div className="hotspot-label">{hotspot.label}</div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={currentVideo}
              className="video-wrapper"
              variants={videoVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <video
                poster="assets/1.png"
                ref={zoomVideoRef}
                className="zoom-video"
                src={`/assets/soluton_video/${currentVideo}.mp4`}
                preload="none"
                autoPlay
                muted
                loop
                playsInline
              />
              
              {/* Back Button */}
              <motion.button
                className="back-button-video"
                onClick={handleBackToMain}
                variants={backButtonVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="back-icon">←</span>
                <span className="back-text">Quay lại</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoViewer;
