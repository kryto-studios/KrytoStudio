"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, PlayCircle, Laptop, FileText, ChevronLeft, ChevronRight, X, Eye, Images } from "lucide-react";
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
  };

  const nextImage = () => {
    if (!activeGallery || !activeGallery.image_urls) return;
    setActiveImageIndex((prev) => (prev + 1) % activeGallery.image_urls.length);
  };

  const prevImage = () => {
    if (!activeGallery || !activeGallery.image_urls) return;
    setActiveImageIndex((prev) => (prev - 1 + activeGallery.image_urls.length) % activeGallery.image_urls.length);
  };

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((item) => {
          const isYoutube = item.link && (item.link.includes("youtube.com") || item.link.includes("youtu.be"));
          const videoId = isYoutube ? getYoutubeVideoId(item.link) : null;
          const isDrive = item.link && item.link.includes("drive.google.com");
          const hasGallery = item.image_urls && item.image_urls.length > 0;

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
                ) : (
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
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 max-w-5xl w-full max-h-[90vh] overflow-hidden backdrop-blur-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={() => setActiveGallery(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all z-30 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-xs font-bold text-accent uppercase tracking-widest">{activeGallery.category}</span>
                <h3 className="text-2xl font-bold text-white mt-1">{activeGallery.title}</h3>
              </div>

              {/* Main image viewer with slider arrows */}
              <div className="relative flex-1 min-h-[300px] md:min-h-[450px] bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center group/view">
                <div className="relative w-full h-full aspect-[16/9] max-h-[55vh]">
                  <Image 
                    src={activeGallery.image_urls[activeImageIndex]} 
                    alt={`${activeGallery.title} screenshot ${activeImageIndex + 1}`} 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Arrow navigation */}
                {activeGallery.image_urls.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-all transform -translate-y-1/2 top-1/2 opacity-80 hover:opacity-100 cursor-pointer"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-all transform -translate-y-1/2 top-1/2 opacity-80 hover:opacity-100 cursor-pointer"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Counter index pill */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 border border-white/10 rounded-full text-xs font-medium text-gray-400">
                  Image {activeImageIndex + 1} of {activeGallery.image_urls.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {activeGallery.image_urls.length > 1 && (
                <div className="flex gap-3 mt-6 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-zinc-800 justify-start md:justify-center">
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
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
