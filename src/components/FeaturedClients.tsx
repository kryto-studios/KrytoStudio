"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

type FeaturedClient = {
  id: string;
  name: string;
  role: string | null;
  description: string;
  photo_url: string;
  created_at: string;
};

export default function FeaturedClients() {
  const [clients, setClients] = useState<FeaturedClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedClients();
  }, []);

  const fetchFeaturedClients = async () => {
    try {
      const { data, error } = await supabase
        .from("featured_clients")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3); // Max 3 clients displayed at a time

      if (!error && data) {
        setClients(data);
      }
    } catch (err) {
      console.error("Error loading featured clients:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hide the section completely if no featured clients exist
  if (!loading && clients.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section id="featured-clients" className="relative z-20 bg-[#050505] pb-24 pt-16 px-4 sm:px-6 border-t border-white/5 overflow-hidden">
      {/* Background glowing glass effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-accent/20">
            <Sparkles size={12} className="text-accent" /> Valued Partners
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-4 mb-4">
            Meet Our Clients
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base font-light">
            We work close with visionary founders and established brands to build extraordinary digital futures.
          </p>
        </div>

        {/* Premium Glass-Blue Client Cards Grid */}
        {loading ? (
          <div className="flex justify-center py-10 text-accent">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {clients.map((client) => (
              <motion.div
                key={client.id}
                variants={itemVariants}
                whileHover={{ y: -8, borderColor: "rgba(14, 165, 233, 0.3)", boxShadow: "0 0 30px rgba(14, 165, 233, 0.1)" }}
                className="group bg-sky-500/[0.02] border border-sky-500/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl transition-all duration-500 relative flex flex-col items-center text-center shadow-[0_0_20px_rgba(14,165,233,0.05)] overflow-hidden"
              >
                {/* Visual Glass blue back-glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-500/0 to-sky-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Client Avatar Frame */}
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-sky-500/30 to-purple-500/10 border border-sky-500/20 mb-6 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                  <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 relative">
                    <img 
                      src={client.photo_url} 
                      alt={client.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                </div>

                {/* Name & Role (Founder, CEO, etc.) */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors tracking-tight">
                    {client.name}
                  </h3>
                  {client.role && (
                    <span className="text-[10px] text-sky-400/60 font-mono tracking-widest uppercase block mt-1">
                      {client.role}
                    </span>
                  )}
                </div>

                {/* Client Unique Font Styled Description */}
                <p className="font-serif italic text-sky-200/90 text-sm tracking-wide leading-relaxed font-light">
                  "{client.description}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}

function Loader2({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      width={size} 
      height={size}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
