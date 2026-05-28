"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { useStudio } from '@/context/StudioContext';
import { DottedSurface } from "@/components/ui/dotted-surface";

export default function Hero() {
  const { settings } = useStudio();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2 + 0.5,
        duration: 0.8,
        ease: "easeInOut",
      },
    }),
  };

  const wordSplit = settings?.name ? settings.name.split(' ') : ['Kryto', 'Studio'];
  const firstWord = wordSplit[0] || 'Kryto';
  const restWords = wordSplit.slice(1).join(' ') || 'Studio';
  const bio = settings?.bio || 'An intelligent, adaptive framework for creating fluid digital experiences that feel alive and respond to user interaction in real-time.';

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black select-none">
      {/* The 3D WebGL ripples wave dotted surface is now the primary background */}
      <DottedSurface className="absolute inset-0 w-full h-full -z-10" />
      
      {/* Overlay HTML Content */}
      <div className="relative z-10 text-center p-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm"
        >
          <Zap className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-200">
            Dynamic Rendering Engine
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mb-6 leading-none"
        >
          <span className="text-white">{firstWord}</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">{restWords}</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 mb-10 font-light leading-relaxed"
        >
          {bio}
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <a href="/appointment" className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 mx-auto cursor-pointer">
            Explore the Engine
            <ArrowRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>

      {/* Elegant Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[8px] sm:text-[10px] text-purple-400/40 uppercase tracking-widest font-mono">SCROLL SYSTEM</span>
        <div className="w-[1px] h-12 bg-purple-500/20 overflow-hidden relative">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-full h-full bg-purple-400 absolute top-0 left-0"
          />
        </div>
      </div>
    </div>
  );
}
