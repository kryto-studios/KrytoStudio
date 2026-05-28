"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Search, CheckCircle, ShieldAlert, BookOpen } from "lucide-react";

export default function CaseStudies() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Stack image animation variants for "Fan Out" effect on hover
  const fanLeft = {
    rest: { rotate: -4, x: -10, y: 5, zIndex: 10 },
    hover: { rotate: -15, x: -130, y: -10, scale: 1.05, zIndex: 30, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const fanRight = {
    rest: { rotate: 4, x: 10, y: 5, zIndex: 10 },
    hover: { rotate: 15, x: 130, y: -10, scale: 1.05, zIndex: 30, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const fanCenter = {
    rest: { rotate: 0, x: 0, y: 0, zIndex: 20 },
    hover: { rotate: 0, x: 0, y: -20, scale: 1.08, zIndex: 40, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section id="case-studies" className="relative z-20 bg-[#030303] pb-32 pt-12 px-4 sm:px-6 border-t border-white/5 overflow-hidden">
      {/* Ambient background vector colors */}
      <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-28">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-purple-500/20 mb-4">
            <Sparkles size={12} className="text-purple-400 animate-pulse" /> Proven Success
          </span>
          <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-6">
            Featured Case Studies
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto font-light text-base sm:text-lg">
            A deep-dive review into how we engineered customized software architectures to automate operations and redefine growth.
          </p>
        </div>

        {/* Case Studies grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col gap-24"
        >
          
          {/* Case Study 1: Srijan Institute */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Context Left */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex gap-2 flex-wrap">
                {["DATABASE ENGINE", "AUTO-SYNC", "99% TIME SAVED"].map(tag => (
                  <span key={tag} className="text-[9px] font-mono font-bold tracking-wider px-3 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/10 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Srijan Management Suite
              </h3>
              <p className="text-gray-400 leading-relaxed font-light text-sm sm:text-base">
                We replaced fragmented, slow spreadsheet calculations at a premier academic institute with a high-performance offline-to-online synchronization platform. 
                Our secure fee management dashboard automates receipt allocation and delivers flawless backend tracking with zero latency.
              </p>
              
              <div className="flex flex-col gap-3 border-t border-white/5 pt-6 mt-2">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle size={16} className="text-sky-400 shrink-0" />
                  <span>Real-time fee transaction ledger & auto-receipts.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle size={16} className="text-sky-400 shrink-0" />
                  <span>Instant data sync using custom API pipeline patterns.</span>
                </div>
              </div>

              <motion.a 
                href="/appointment"
                whileHover={{ gap: "10px" }}
                className="inline-flex items-center gap-1.5 text-sky-400 text-sm font-semibold mt-4 hover:text-sky-300 transition-colors w-fit cursor-pointer"
              >
                Discuss Similar Architecture <ArrowUpRight size={16} />
              </motion.a>
            </div>

            {/* spring fanning cards Right */}
            <div className="lg:col-span-7 flex items-center justify-center h-[350px] sm:h-[450px] relative select-none">
              <motion.div 
                className="w-[260px] sm:w-[350px] aspect-[16/10] relative cursor-pointer"
                initial="rest"
                whileHover="hover"
                whileTap="hover"
              >
                
                {/* Photo Stack 1 (Left Fan Card) */}
                <motion.div 
                  variants={fanLeft}
                  className="absolute inset-0 bg-[#070709] border border-sky-500/15 rounded-3xl p-4 shadow-2xl flex flex-col justify-between overflow-hidden"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[7px] font-mono text-gray-500">SRIJAN_LEDGER</span>
                    <span className="text-[6px] text-emerald-400 font-mono">● LIVE</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <div className="h-2 w-16 bg-white/10 rounded" />
                    <div className="h-5 bg-sky-500/10 border border-sky-500/20 rounded flex items-center px-2">
                      <span className="text-[8px] font-mono text-sky-400">Total Fees: ₹12,45,000</span>
                    </div>
                    <div className="h-2 w-24 bg-white/5 rounded" />
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 w-3/4" />
                  </div>
                </motion.div>

                {/* Photo Stack 2 (Right Fan Card) */}
                <motion.div 
                  variants={fanRight}
                  className="absolute inset-0 bg-[#070709] border border-purple-500/15 rounded-3xl p-4 shadow-2xl flex flex-col justify-between overflow-hidden"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[7px] font-mono text-gray-500">SECURITY_RLS</span>
                    <span className="text-[6px] text-purple-400 font-mono">● ENCRYPTED</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center gap-2">
                    <ShieldAlert size={20} className="text-purple-400 animate-pulse" />
                    <span className="text-[8px] font-mono text-white">DATABASE SECURE</span>
                  </div>
                  <div className="h-2 w-16 bg-white/10 rounded self-end" />
                </motion.div>

                {/* Photo Stack 3 (Center Primary Card) */}
                <motion.div 
                  variants={fanCenter}
                  className="absolute inset-0 bg-[#0c0c10] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-[0_30px_70px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute -inset-1 bg-gradient-to-tr from-sky-500/5 to-purple-500/5 opacity-40 blur-xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                      <span className="text-[8px] font-mono text-sky-400">SRIJAN_CONSOLE</span>
                    </div>
                    <span className="text-[8px] font-mono text-gray-500">v1.2</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[7px] text-gray-500">ACTIVE STUDENTS</span>
                        <span className="text-base sm:text-lg font-bold text-white tracking-tight">1,240</span>
                      </div>
                      <div className="h-6 w-12 bg-sky-500/10 border border-sky-500/20 rounded flex items-center justify-center">
                        <span className="text-[8px] font-mono text-sky-400">+14%</span>
                      </div>
                    </div>
                    <div className="h-10 bg-black/60 border border-white/5 rounded-lg flex items-center justify-between px-3">
                      <div className="flex items-center gap-1.5">
                        <Search size={10} className="text-gray-500" />
                        <span className="text-[8px] text-gray-500">Search student name...</span>
                      </div>
                      <div className="h-1.5 w-6 bg-white/10 rounded" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[7px] font-mono text-gray-500">
                    <span>SYSTEM RUNNING</span>
                    <span>99.9% UPTIME</span>
                  </div>
                </motion.div>

              </motion.div>
            </div>
          </motion.div>

          {/* Case Study 2: Krishna Library */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12"
          >
            {/* spring fanning cards Left (Ordered right on large screens) */}
            <div className="lg:col-span-7 flex items-center justify-center h-[350px] sm:h-[450px] relative select-none order-last lg:order-first">
              <motion.div 
                className="w-[260px] sm:w-[350px] aspect-[16/10] relative cursor-pointer"
                initial="rest"
                whileHover="hover"
                whileTap="hover"
              >
                
                {/* Photo Stack 1 (Left Fan Card) */}
                <motion.div 
                  variants={fanLeft}
                  className="absolute inset-0 bg-[#070709] border border-purple-500/15 rounded-3xl p-4 shadow-2xl flex flex-col justify-between overflow-hidden"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[7px] font-mono text-gray-500">CIRCULATION_DB</span>
                    <span className="text-[6px] text-purple-400 font-mono">● ONLINE</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <div className="h-2 w-16 bg-white/10 rounded" />
                    <div className="h-5 bg-purple-500/10 border border-purple-500/20 rounded flex items-center px-2">
                      <span className="text-[8px] font-mono text-purple-400">Desks Booked: 148 / 150</span>
                    </div>
                    <div className="h-2 w-24 bg-white/5 rounded" />
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 w-[95%]" />
                  </div>
                </motion.div>

                {/* Photo Stack 2 (Right Fan Card) */}
                <motion.div 
                  variants={fanRight}
                  className="absolute inset-0 bg-[#070709] border border-sky-500/15 rounded-3xl p-4 shadow-2xl flex flex-col justify-between overflow-hidden"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[7px] font-mono text-gray-500">MEMBER_RENEWALS</span>
                    <span className="text-[6px] text-emerald-400 font-mono">● AUTO_RENEW</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center gap-2">
                    <BookOpen size={20} className="text-sky-400 animate-bounce" />
                    <span className="text-[8px] font-mono text-white">RENEWAL TRIGGER SENT</span>
                  </div>
                  <div className="h-2 w-16 bg-white/10 rounded self-end" />
                </motion.div>

                {/* Photo Stack 3 (Center Primary Card) */}
                <motion.div 
                  variants={fanCenter}
                  className="absolute inset-0 bg-[#0c0c10] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-[0_30px_70px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute -inset-1 bg-gradient-to-tr from-purple-500/5 to-sky-500/5 opacity-40 blur-xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                      <span className="text-[8px] font-mono text-purple-400">KRISHNA_PORTAL</span>
                    </div>
                    <span className="text-[8px] font-mono text-gray-500">v2.1</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[7px] text-gray-500">ACTIVE SEATS</span>
                        <span className="text-base sm:text-lg font-bold text-white tracking-tight">150 Desks</span>
                      </div>
                      <div className="h-6 w-12 bg-purple-500/10 border border-purple-500/20 rounded flex items-center justify-center">
                        <span className="text-[8px] font-mono text-purple-400">98% FULL</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3, 4, 5, 6].map(idx => (
                        <div key={idx} className={`h-4 rounded border ${idx === 6 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'} flex items-center justify-center`}>
                          <span className="text-[6px] text-white font-mono">{idx === 6 ? 'X' : 'A' + idx}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[7px] font-mono text-gray-500">
                    <span>GRID MONITOR ACTIVE</span>
                    <span>10k+ RENEWALS SECURED</span>
                  </div>
                </motion.div>

              </motion.div>
            </div>

            {/* Context Right */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex gap-2 flex-wrap">
                {["UI/UX ARCHITECTURE", "SEAT MONITORING", "10k+ RENEWALS"].map(tag => (
                  <span key={tag} className="text-[9px] font-mono font-bold tracking-wider px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/10 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Krishna Reservation Portal
              </h3>
              <p className="text-gray-400 leading-relaxed font-light text-sm sm:text-base">
                We designed and engineered a custom, high-concurrency reservation engine for a leading Ambikapur study space. 
                The system features live grid seat allocation, automates renewal alerts to members, and provides a sleek administrative tracking dashboard that maximizes desk usage.
              </p>
              
              <div className="flex flex-col gap-3 border-t border-white/5 pt-6 mt-2">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle size={16} className="text-purple-400 shrink-0" />
                  <span>Dynamic seat reservation grids with real-time sync.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle size={16} className="text-purple-400 shrink-0" />
                  <span>Automatic member notifications for circulation deadlines.</span>
                </div>
              </div>

              <motion.a 
                href="/appointment"
                whileHover={{ gap: "10px" }}
                className="inline-flex items-center gap-1.5 text-purple-400 text-sm font-semibold mt-4 hover:text-purple-300 transition-colors w-fit cursor-pointer"
              >
                Discuss Similar Architecture <ArrowUpRight size={16} />
              </motion.a>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
