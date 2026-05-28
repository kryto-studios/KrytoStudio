"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, PlayCircle, Laptop, FileText, ChevronLeft, ChevronRight, X, Eye, Images, Grid, Globe } from "lucide-react";
import Image from "next/image";

const getYoutubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) return match[2];
  return null;
};

const LazyYoutubePlayer = ({ videoId, title }: { videoId: string; title: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (isPlaying) {
    return (
      <iframe 
        src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`} 
        title={title} 
        className="w-full h-full border-0 relative z-10" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      ></iframe>
    );
  }

  return (
    <div 
      className="w-full h-full relative cursor-pointer group flex items-center justify-center bg-black"
      onClick={() => setIsPlaying(true)}
    >
      <Image 
        src={thumbnailUrl} 
        alt={title} 
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
      <PlayCircle size={64} className="text-white z-20 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300" />
    </div>
  );
};

export default function PortfolioGrid({ items }: { items: any[] }) {
  const [activeGallery, setActiveGallery] = useState<any | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGridView, setIsGridView] = useState(false);
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);

  useEffect(() => {
    if (activeGallery || isFullScreenMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeGallery, isFullScreenMode]);

  const nextImage = () => {
    if (!activeGallery || !activeGallery.image_urls) return;
    setActiveImageIndex((prev) => (prev + 1) % activeGallery.image_urls.length);
  };

  const prevImage = () => {
    if (!activeGallery || !activeGallery.image_urls) return;
    setActiveImageIndex((prev) => (prev - 1 + activeGallery.image_urls.length) % activeGallery.image_urls.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeGallery) return;
      if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "Escape") {
        if (isFullScreenMode) {
          setIsFullScreenMode(false);
        } else {
          setActiveGallery(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGallery, activeImageIndex, isFullScreenMode]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const openGallery = (item: any) => {
    setActiveGallery(item);
    setActiveImageIndex(0);
    setIsGridView(false);
    setIsFullScreenMode(false);
  };

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((item) => {
          const isYoutube = item.link && (item.link.includes("youtube.com") || item.link.includes("youtu.be"));
          const videoId = isYoutube ? getYoutubeVideoId(item.link) : null;
          const isDrive = item.link && item.link.includes("drive.google.com");
          const hasGallery = item.image_urls && item.image_urls.length > 0;

          // Try parsing domain for mockup URL display
          let displayDomain = "kryto.studio/project";
          if (item.link && item.link.startsWith("http")) {
            try {
              const parsed = new URL(item.link);
              displayDomain = parsed.hostname;
            } catch (e) {}
          }

          return (
            <motion.div 
              key={item.id} 
              variants={itemVariants} 
              whileHover={{ y: -8, boxShadow: "0 10px 30px -10px rgba(14,165,233,0.15)" }} 
              className="bg-white/[0.02] border border-white/5 hover:border-accent/30 rounded-3xl overflow-hidden group transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => {
                if (hasGallery) {
                  openGallery(item);
                } else if (!videoId && item.link && item.link !== "#") {
                  window.open(item.link, "_blank");
                }
              }}
            >
              <div className="relative aspect-video bg-black/50 overflow-hidden shrink-0 border-b border-white/5">
                {videoId ? (
                  <LazyYoutubePlayer videoId={videoId} title={item.title} />
                ) : item.thumbnail_url ? (
                  <Image 
                    src={item.thumbnail_url} 
                    alt={item.title} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 relative z-0" 
                  />
                ) : item.category === "Web Development" ? (
                  /* Premium Website Front Page simulated mock browser frame */
                  <div className="w-full h-full bg-[#0a0a0a] flex flex-col relative z-0 group-hover:bg-[#0c0c0c] transition-colors duration-300 overflow-hidden">
                    {/* Simulated Browser Header */}
                    <div className="h-6 bg-white/[0.03] border-b border-white/5 flex items-center px-3 justify-between shrink-0">
                      {/* Window Controls */}
                      <div className="flex gap-1.5 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-red-500/60" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                        <span className="w-2 h-2 rounded-full bg-green-500/60" />
                      </div>
                      {/* Address Bar */}
                      <div className="bg-white/[0.02] border border-white/5 text-[9px] text-gray-500 px-4 py-0.5 rounded-md truncate max-w-[160px] text-center flex items-center gap-1 font-mono">
                        <Globe size={8} className="text-gray-600" />
                        {displayDomain}
                      </div>
                      <div className="w-8" />
                    </div>

                    {/* Simulated Website Hero Section content */}
                    <div className="flex-1 p-4 flex flex-col justify-center relative overflow-hidden">
                      {/* Glowing color blobs in background */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/20 rounded-full blur-[40px] z-0 pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                      <div className="absolute top-10 right-4 w-16 h-16 bg-purple-500/10 rounded-full blur-[20px] z-0 pointer-events-none" />

                      <div className="relative z-10 text-center space-y-1.5">
                        <span className="text-[9px] font-bold text-accent tracking-widest uppercase bg-accent/10 px-2 py-0.5 rounded-full inline-block">LIVE PORTFOLIO</span>
                        <h4 className="text-sm md:text-base font-extrabold text-white line-clamp-1 max-w-[85%] mx-auto tracking-tight">{item.title}</h4>
                        <div className="w-10 h-0.5 bg-accent/50 mx-auto rounded-full" />
                        
                        {/* Mock columns layout to represent dashboard/site */}
                        <div className="grid grid-cols-3 gap-2 mt-4 pt-1 max-w-[200px] mx-auto opacity-45 group-hover:opacity-60 transition-opacity">
                          <div className="h-6 bg-white/5 border border-white/5 rounded-md flex items-center justify-center text-[7px] text-gray-400 font-mono">Hero</div>
                          <div className="h-6 bg-white/5 border border-white/5 rounded-md flex items-center justify-center text-[7px] text-gray-400 font-mono">Grid</div>
                          <div className="h-6 bg-white/5 border border-white/5 rounded-md flex items-center justify-center text-[7px] text-gray-400 font-mono">Action</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard fallback */
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-[#050505] relative z-0">
                    {item.category.includes("Video") ? <PlayCircle size={48} className="text-gray-700 mb-2" /> : <Laptop size={48} className="text-gray-700 mb-2" />}
                    <span className="text-gray-600 font-medium text-sm">{item.category}</span>
                  </div>
                )}

                {!videoId && (
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-20 backdrop-blur-sm">
                    {hasGallery ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openGallery(item);
                        }}
                        className="bg-accent hover:bg-accent/90 shadow-[0_0_20px_rgba(14,165,233,0.4)] text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto"
                      >
                        <Eye size={18} /> View screenshots
                      </button>
                    ) : (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-accent hover:bg-accent/90 shadow-[0_0_20px_rgba(14,165,233,0.4)] text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto"
                      >
                        {isDrive ? <><FileText size={18} /> View File</> : <><ExternalLink size={18} /> Visit Site</>}
                      </a>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300 shrink-0">
                    {hasGallery ? <Images size={12} className="text-indigo-400" /> : (item.category.includes("Video") || isYoutube ? <PlayCircle size={12} className="text-purple-400" /> : <Laptop size={12} className="text-accent" />)}
                    {item.category}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                {item.description && <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mt-auto">{item.description}</p>}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Glassmorphic Lightbox Modal overlay */}
      <AnimatePresence>
        {activeGallery && activeGallery.image_urls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setActiveGallery(null)}
            data-lenis-prevent
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 max-w-5xl w-full max-h-[90vh] overflow-hidden backdrop-blur-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top actions toolbar */}
              <div className="absolute top-6 right-6 flex items-center gap-2 z-30">
                {/* Grid / Slideshow toggle */}
                <button 
                  onClick={() => setIsGridView(!isGridView)}
                  className="p-2.5 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {isGridView ? (
                    <><Images size={14} className="text-accent animate-pulse" /> Slideshow</>
                  ) : (
                    <><Grid size={14} className="text-accent" /> Grid View ({activeGallery.image_urls.length})</>
                  )}
                </button>
                
                {/* Close button */}
                <button 
                  onClick={() => setActiveGallery(null)}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <span className="text-xs font-bold text-accent uppercase tracking-widest">{activeGallery.category}</span>
                <h3 className="text-2xl font-bold text-white mt-1 pr-32">{activeGallery.title}</h3>
              </div>

              {isGridView ? (
                /* Dynamic Grid View display showing all screenshots at once */
                <div className="flex-1 overflow-y-auto max-h-[65vh] p-2 grid grid-cols-2 sm:grid-cols-3 gap-4 scrollbar-thin scrollbar-thumb-zinc-800 pr-1 select-none" data-lenis-prevent>
                  {activeGallery.image_urls.map((url: string, index: number) => (
                    <div 
                      key={url}
                      onClick={() => {
                        setActiveImageIndex(index);
                        setIsGridView(false); // Switch back to slideshow to expand this image
                      }}
                      className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 hover:border-accent/40 hover:scale-[1.03] transition-all duration-300 cursor-pointer group/griditem bg-black/40"
                    >
                      <Image src={url} alt="screenshot" fill className="object-cover group-hover/griditem:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/griditem:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span className="text-white text-xs font-semibold bg-accent/80 shadow-[0_0_15px_rgba(14,165,233,0.3)] px-3 py-1.5 rounded-full flex items-center gap-1">
                          <Eye size={12} /> Expand
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Main image viewer with slider arrows */
                <>
                  <div className="relative flex-1 min-h-[300px] md:min-h-[450px] bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center group/view select-none">
                    <motion.div 
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(e, info) => {
                        const swipeThreshold = 50;
                        if (info.offset.x < -swipeThreshold) {
                          nextImage();
                        } else if (info.offset.x > swipeThreshold) {
                          prevImage();
                        }
                      }}
                      onClick={() => setIsFullScreenMode(true)}
                      className="relative w-full h-full aspect-[16/9] max-h-[55vh] cursor-zoom-in active:cursor-grabbing flex items-center justify-center"
                    >
                      <Image 
                        src={activeGallery.image_urls[activeImageIndex]} 
                        alt={`${activeGallery.title} screenshot ${activeImageIndex + 1}`} 
                        fill
                        className="object-contain pointer-events-none"
                        priority
                      />
                      
                      {/* Hint for dragging/clicking */}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full text-[10px] text-accent font-semibold opacity-0 group-hover/view:opacity-100 transition-opacity flex items-center gap-1.5 pointer-events-none">
                        <Eye size={10} /> Click to Full Screen / Drag to Slide
                      </div>
                    </motion.div>

                    {/* Arrow navigation */}
                    {activeGallery.image_urls.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage}
                          className="absolute left-4 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-all transform -translate-y-1/2 top-1/2 opacity-80 hover:opacity-100 cursor-pointer z-30"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button 
                          onClick={nextImage}
                          className="absolute right-4 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-all transform -translate-y-1/2 top-1/2 opacity-80 hover:opacity-100 cursor-pointer z-30"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}

                    {/* Counter index pill */}
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 border border-white/10 rounded-full text-xs font-medium text-gray-400 z-30">
                      Image {activeImageIndex + 1} of {activeGallery.image_urls.length}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {activeGallery.image_urls.length > 1 && (
                    <div className="flex gap-3 mt-6 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-zinc-800 justify-start md:justify-center" data-lenis-prevent>
                      {activeGallery.image_urls.map((url: string, index: number) => (
                        <button
                          key={url}
                          onClick={() => setActiveImageIndex(index)}
                          className={`relative w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${activeImageIndex === index ? "border-accent shadow-[0_0_10px_rgba(14,165,233,0.5)] scale-105" : "border-white/10 opacity-50 hover:opacity-100"}`}
                        >
                          <Image 
                            src={url} 
                            alt="thumbnail" 
                            fill
                            className="object-cover pointer-events-none"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Zoom Lightbox */}
      <AnimatePresence>
        {isFullScreenMode && activeGallery && activeGallery.image_urls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
            data-lenis-prevent
          >
            {/* Top Toolbar */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-[110]">
              <div className="text-white">
                <span className="text-[10px] sm:text-xs font-bold text-accent uppercase tracking-wider">{activeGallery.category}</span>
                <h4 className="text-sm sm:text-base font-extrabold tracking-tight mt-0.5">{activeGallery.title}</h4>
              </div>
              <button 
                onClick={() => setIsFullScreenMode(false)}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer shadow-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Slider container with drag */}
            <motion.div 
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold) {
                  nextImage();
                } else if (info.offset.x > swipeThreshold) {
                  prevImage();
                }
              }}
              className="relative w-full h-[80vh] flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <div className="relative w-full h-full max-w-[95vw] max-h-[80vh]">
                <Image 
                  src={activeGallery.image_urls[activeImageIndex]} 
                  alt={`${activeGallery.title} screenshot ${activeImageIndex + 1}`} 
                  fill
                  className="object-contain pointer-events-none"
                  priority
                />
              </div>

              {/* Slider Arrows */}
              {activeGallery.image_urls.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 sm:left-6 p-4 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-all cursor-pointer pointer-events-auto"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 sm:right-6 p-4 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-all cursor-pointer pointer-events-auto"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Index Counter */}
            <div className="absolute bottom-6 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-gray-400">
              Image {activeImageIndex + 1} of {activeGallery.image_urls.length} — Swipe / Drag / Left-Right Arrows
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
