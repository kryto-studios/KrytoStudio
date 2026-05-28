"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";

type Review = {
  id: string;
  email: string;
  name: string;
  rating: number;
  content: string;
  avatar_url: string | null;
  created_at: string;
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="reviews" className="relative z-20 bg-background pb-32 pt-10 px-6 border-t border-white/5 overflow-hidden">
      {/* Background abstract glowing blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-accent/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-4 mb-4">
            Client Reviews
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg font-light">
            Read authentic feedback from our verified clients about their experience working with Kryto Studio.
          </p>
        </div>

        {/* Reviews Grid Masonry */}
        {loading ? (
          <div className="flex justify-center py-20 text-accent">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-3xl max-w-xl mx-auto">
            <p className="text-gray-500 text-sm">No client reviews have been published yet.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                variants={itemVariants}
                whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.1)" }}
                className="bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Stars and date */}
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={`${i < rev.rating ? "fill-yellow-500 animate-pulse" : "text-zinc-800"}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Review text */}
                  <p className="text-gray-300 text-sm font-light leading-relaxed group-hover:text-gray-200 transition-colors">
                    "{rev.content}"
                  </p>
                </div>

                {/* Reviewer details */}
                <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative bg-zinc-800 border border-white/5 shadow-inner">
                    {rev.avatar_url ? (
                      <Image src={rev.avatar_url} alt={rev.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-mono uppercase">{rev.name[0]}</div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm flex items-center gap-1 group-hover:text-accent transition-colors">
                      {rev.name}
                      <ShieldCheck size={13} className="text-accent" title="Verified Reviewer" />
                    </h4>
                    <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Verified Client</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}
