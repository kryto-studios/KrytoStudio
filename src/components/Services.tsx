"use client";

import { motion } from "framer-motion";
import { Globe, Smartphone, Video, Layers, Terminal, Sparkles, Cpu, Play } from "lucide-react";
import { useState } from "react";

export default function Services() {
  const [activeTab, setActiveTab] = useState<"code" | "output">("code");
  const [sliderPosition, setSliderPosition] = useState(55); // 0 to 100 for before/after comparison split

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } },
  };

  const codeString = `// Kryto Studio Architecture
const WebExperience = ({ client }) => {
  const performance = usePerformance();
  
  return (
    <GlassmorphicPanel glow="sky">
      <CyberGrid speed="ultra" />
      <SpeedMetric value={performance.loadTime < 0.2s} />
      <HighConvertingCallToAction brand={client.name} />
    </GlassmorphicPanel>
  );
};`;

  return (
    <section id="services" className="relative z-20 bg-[#030303] pt-32 pb-40 px-4 sm:px-6 border-t border-white/5 overflow-hidden">
      {/* Background vector glow overlays */}
      <div className="absolute top-[30%] left-[10%] w-[350px] h-[350px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[10%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Modern Section Header */}
        <div className="text-center md:text-left mb-24 max-w-2xl">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-500/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-sky-500/20 mb-4">
            <Sparkles size={12} className="text-sky-400 animate-pulse" /> Capabilities
          </span>
          <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-6">
            Elite Digital Expertise
          </h2>
          <p className="text-gray-400 font-light text-base sm:text-lg leading-relaxed">
            We deliver uncompromising speed, stunning visual depth, and flawless interactive mechanics, turning ideas into world-class digital experiences.
          </p>
        </div>

        {/* High-Density Cyberpunk Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          
          {/* 1. Web Development Card (Double Width - 7 cols) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-7 bg-[#070709] border border-white/5 hover:border-sky-500/20 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-3xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(14,165,233,0.05)] relative group overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 transform group-hover:scale-110">
              <Globe size={180} className="text-sky-400" />
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-500/5 flex items-center justify-center mb-6 border border-sky-500/20">
                <Globe className="text-sky-400" size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                High-Performance Web Development
              </h3>
              <p className="text-gray-400 leading-relaxed font-light text-xs sm:text-sm max-w-xl">
                Blazing fast, secure, and infinitely scalable web platforms built with bleeding-edge frameworks. We design robust customized architectures optimized for search rankings, accessibility, and stellar conversions.
              </p>
            </div>

            {/* Glowing Interactive Code Editor Terminal Mockup */}
            <div className="w-full bg-[#050507] border border-white/5 rounded-2xl overflow-hidden mt-8 shadow-inner relative flex flex-col h-60">
              <div className="flex justify-between items-center bg-[#09090b]/80 px-4 py-2.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-sky-400" />
                  <span className="text-[10px] font-mono text-gray-500">KrytoDeveloperTerminal.tsx</span>
                </div>
                <div className="flex bg-black/50 border border-white/10 rounded-md p-0.5">
                  <button 
                    onClick={() => setActiveTab("code")}
                    className={`px-2 py-0.5 rounded text-[8px] font-mono transition-colors ${activeTab === "code" ? "bg-sky-500/10 text-sky-400" : "text-gray-500"}`}
                  >
                    CODE
                  </button>
                  <button 
                    onClick={() => setActiveTab("output")}
                    className={`px-2 py-0.5 rounded text-[8px] font-mono transition-colors ${activeTab === "output" ? "bg-sky-500/10 text-sky-400" : "text-gray-500"}`}
                  >
                    COMPILED
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 font-mono text-[9px] sm:text-[11px] overflow-y-auto leading-relaxed select-text">
                {activeTab === "code" ? (
                  <pre className="text-sky-200/70">
                    <code>
                      {codeString}
                    </code>
                  </pre>
                ) : (
                  <div className="flex flex-col gap-2.5 h-full justify-center items-center text-center p-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center animate-pulse">
                      <Cpu className="text-emerald-400" size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-white tracking-wider">COMPILATION SUCCESSFUL</span>
                    <span className="text-[8px] text-gray-500">Speed Score: 100/100 | Page Load Time: 0.11s</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* 2. App Development Card (Single Width - 5 cols) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-5 bg-[#070709] border border-white/5 hover:border-emerald-500/20 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-3xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.05)] relative group overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 transform group-hover:scale-110">
              <Smartphone size={180} className="text-emerald-400" />
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center mb-6 border border-emerald-500/20">
                <Smartphone className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                Native App Development
              </h3>
              <p className="text-gray-400 leading-relaxed font-light text-xs sm:text-sm">
                Smooth-as-silk native mobile and desktop applications. We assemble lightning-fast cross-platform architectures that feel deeply responsive, boosting daily user retention.
              </p>
            </div>

            {/* Glowing App Wireframe Visualizer */}
            <div className="w-[85%] mx-auto bg-black/60 border border-white/10 rounded-t-3xl border-b-0 h-48 mt-8 relative overflow-hidden flex justify-center p-3">
              <div className="w-full bg-[#050507] border border-white/10 border-b-0 rounded-t-2xl p-3 flex flex-col gap-3 relative">
                {/* Simulated Notch */}
                <div className="w-16 h-3 bg-black rounded-full mx-auto" />
                <div className="flex justify-between items-center">
                  <div className="h-2 w-10 bg-white/10 rounded" />
                  <div className="h-2 w-6 bg-emerald-500/10 border border-emerald-500/20 rounded" />
                </div>
                <div className="flex-1 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center p-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
                    <span className="text-[8px] font-mono text-emerald-400 animate-pulse">●</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded w-16 mb-1" />
                  <div className="h-1 bg-white/5 rounded w-12" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. Video Editing Card (Single Width - 5 cols) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-5 bg-[#070709] border border-white/5 hover:border-purple-500/20 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-3xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.05)] relative group overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 transform group-hover:scale-110">
              <Video size={180} className="text-purple-400" />
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-6 border border-purple-500/20">
                <Video className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                Cinematic Video Editing
              </h3>
              <p className="text-gray-400 leading-relaxed font-light text-xs sm:text-sm">
                Next-level audio-visual storytelling. From dynamic motion-graphics arrays to perfect cinematic color grades, we output highly immersive assets engineered to hold complete viewer attention.
              </p>
            </div>

            {/* Glowing Video Reel Visual logs */}
            <div className="w-full bg-[#050507] border border-white/5 rounded-2xl p-3 flex flex-col gap-3 mt-8 shadow-inner relative h-48 overflow-hidden">
              <div className="flex-1 bg-black/60 rounded-lg flex items-center justify-center relative overflow-hidden border border-white/5">
                <Play className="text-purple-400 animate-ping absolute" size={20} />
                <Play className="text-purple-400 relative z-10" size={20} />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 bg-purple-500/20 border border-purple-500/30 rounded flex-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-purple-500 rounded w-2/3 animate-pulse" />
                </div>
                <span className="text-[7px] font-mono text-purple-400">00:42:15</span>
              </div>
            </div>
          </motion.div>

          {/* 4. Website Redesign Card (Double Width - 7 cols) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-7 bg-[#070709] border border-white/5 hover:border-blue-500/20 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-3xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] relative group overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 transform group-hover:scale-110">
              <Layers size={180} className="text-blue-400" />
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-6 border border-blue-500/20">
                <Layers className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                High-Converting Site Redesigns
              </h3>
              <p className="text-gray-400 leading-relaxed font-light text-xs sm:text-sm max-w-xl">
                Tear down slow, outdated sites and convert them into gorgeous digital powerhouses featuring custom immersive elements, blazing-fast speed scores, and elite UX layouts.
              </p>
            </div>

            {/* Glowing Interactive Split Before-After Comparison Slider */}
            <div 
              className="w-full bg-[#050507] border border-white/5 rounded-2xl overflow-hidden mt-8 relative shadow-inner h-48 select-none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                setSliderPosition(Math.max(0, Math.min(100, x)));
              }}
            >
              {/* Before side (Old website style) */}
              <div className="absolute inset-0 bg-[#121215] flex flex-col justify-center items-center text-center p-4">
                <span className="text-[8px] font-mono text-gray-500 tracking-wider absolute top-3 left-4">LEGACY SITE</span>
                <span className="text-2xl font-bold text-zinc-700 select-none">Basic & Outdated</span>
                <span className="text-[9px] text-zinc-600 mt-2 select-none">Slow loading speed • High bounce rate</span>
              </div>

              {/* After side (Premium website style) */}
              <div 
                className="absolute inset-y-0 right-0 bg-[#080b11] border-l border-sky-500/30 flex flex-col justify-center items-center text-center p-4 overflow-hidden"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-[300px] sm:w-[500px] flex flex-col items-center shrink-0">
                  <span className="text-[8px] font-mono text-sky-400 tracking-wider absolute top-3 right-4">KRYTO DESIGN</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-500 select-none">Premium Experience</span>
                  <span className="text-[9px] text-sky-200/60 mt-2 select-none">Blazing Fast (0.1s) • High Conversions • Glassmorphism UI</span>
                </div>
              </div>

              {/* Drag line handle overlay indicator */}
              <div 
                className="absolute inset-y-0 w-0.5 bg-sky-400 pointer-events-none shadow-[0_0_15px_rgba(14,165,233,0.8)]"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-sky-400 border-4 border-[#030303] flex items-center justify-center shadow-lg">
                  <span className="text-[8px] text-black font-bold">⇄</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
