"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Upload, X, MessageSquare, ShieldCheck, Trash2, Edit3, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useStudio } from "@/context/StudioContext";
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
  const { user } = useStudio();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  // Form States
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (user && user.email) {
      checkPermissionAndExistingReview();
    } else {
      setAuthorized(false);
      setUserReview(null);
    }
  }, [user, reviews]);

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

  const checkPermissionAndExistingReview = async () => {
    if (!user || !user.email) return;

    try {
      // 1. Check if email is in the allowed list
      const { data: permissionData } = await supabase
        .from("reviews_permissions")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      setAuthorized(!!permissionData);

      // 2. Check if user already submitted a review
      const existing = reviews.find(r => r.email === user.email);
      if (existing) {
        setUserReview(existing);
        setName(existing.name);
        setRating(existing.rating);
        setContent(existing.content);
        setAvatarPreview(existing.avatar_url);
      } else {
        setUserReview(null);
        // Pre-fill name and avatar from Google Metadata if available
        setName(user.user_metadata?.full_name || user.user_metadata?.name || "");
        setAvatarPreview(user.user_metadata?.avatar_url || null);
      }
    } catch (err) {
      console.error("Error checking permissions:", err);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email || !authorized) return;

    setSubmitting(true);
    try {
      let finalAvatarUrl = avatarPreview;

      // Upload avatar if a custom file is chosen
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const filePath = `avatars/${Date.now()}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("studio-assets")
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("studio-assets")
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          finalAvatarUrl = urlData.publicUrl;
        }
      }

      const reviewData = {
        email: user.email,
        name: name,
        rating: rating,
        content: content,
        avatar_url: finalAvatarUrl,
      };

      if (userReview) {
        // Update review
        const { error } = await supabase
          .from("reviews")
          .update(reviewData)
          .eq("id", userReview.id);

        if (error) throw error;
      } else {
        // Insert review
        const { error } = await supabase
          .from("reviews")
          .insert([reviewData]);

        if (error) throw error;
      }

      setIsEditing(false);
      setAvatarFile(null);
      await fetchReviews();
      alert(userReview ? "Review updated successfully!" : "Review submitted successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Error saving review: " + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview || !confirm("Are you sure you want to delete your review?")) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", userReview.id);

      if (error) throw error;

      setUserReview(null);
      setContent("");
      setRating(5);
      setAvatarPreview(user.user_metadata?.avatar_url || null);
      await fetchReviews();
      alert("Review deleted successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete review");
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
      {/* Background abstract shapes */}
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

        {/* Form area: If authorized and user wants to write/edit */}
        <AnimatePresence>
          {authorized && (isEditing || !userReview) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-xl mx-auto mb-16 bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-accent" />
                  {userReview ? "Update Your Review" : "Write a Verified Review"}
                </h3>
                {userReview && (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Rating Select */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-2xl text-gray-600 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star 
                          size={28}
                          className={`${
                            star <= (hoverRating !== null ? hoverRating : rating)
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-gray-600"
                          } transition-colors duration-150`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar and Name */}
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* PFP preview & upload */}
                  <div className="relative group shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden relative bg-zinc-800">
                      {avatarPreview ? (
                        <Image src={avatarPreview} alt="Avatar Preview" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-mono">PFP</div>
                      )}
                    </div>
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full text-white cursor-pointer transition-opacity">
                      <Upload size={14} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {/* Name field */}
                  <div className="w-full">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Display Name</label>
                    <input 
                      required 
                      type="text"
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your Name (e.g. Rahul Sharma)"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 text-sm"
                    />
                  </div>
                </div>

                {/* Content field */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Review Message</label>
                  <textarea 
                    required 
                    rows={4}
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Share your detailed experience working with us..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 text-sm leading-relaxed"
                  />
                </div>

                {/* Submit buttons */}
                <div className="flex gap-3">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(14,165,233,0.3)] cursor-pointer"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : null}
                    {userReview ? "Save Changes" : "Publish Review"}
                  </button>
                  {userReview && (
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold py-3 px-5 rounded-xl transition-all text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logged in but not authorized helper note */}
        {user && !authorized && (
          <div className="max-w-xl mx-auto mb-16 bg-white/[0.01] border border-white/5 rounded-3xl p-6 text-center backdrop-blur-md">
            <p className="text-gray-400 text-sm">
              Logged in as <span className="text-white font-medium">{user.email}</span>. 
              <br />
              <span className="text-xs text-gray-500 mt-2 block">
                To write a verified review, please contact the studio team to authorize your email address!
              </span>
            </p>
          </div>
        )}

        {/* Not logged in CTA */}
        {!user && (
          <div className="text-center mb-16">
            <a 
              href="/login" 
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold px-6 py-3 rounded-full transition-all inline-flex items-center gap-2 shadow-md"
            >
              <ShieldCheck size={14} className="text-accent" /> Log in to write a verified review
            </a>
          </div>
        )}

        {/* Current User's active review card highlight */}
        {userReview && !isEditing && (
          <div className="max-w-2xl mx-auto mb-12 bg-accent/[0.03] border border-accent/20 rounded-3xl p-6 flex flex-col md:flex-row gap-5 relative overflow-hidden backdrop-blur-md shadow-lg shadow-accent/5">
            <div className="absolute top-0 right-0 bg-accent text-[9px] font-bold tracking-widest text-white px-3 py-1 rounded-bl-xl uppercase">
              Your Review
            </div>

            <div className="w-12 h-12 rounded-full overflow-hidden relative bg-zinc-800 shrink-0 border border-white/10">
              {userReview.avatar_url ? (
                <Image src={userReview.avatar_url} alt="My avatar" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-mono uppercase">{userReview.name[0]}</div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-white font-bold text-base flex items-center gap-1.5">
                  {userReview.name}
                  <ShieldCheck size={14} className="text-accent" title="Verified Reviewer" />
                </h4>
                <div className="flex text-yellow-500">
                  {Array.from({ length: userReview.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed italic font-light">"{userReview.content}"</p>
              
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-accent hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Edit3 size={12} /> Edit Review
                </button>
                <button 
                  onClick={handleDeleteReview}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Trash2 size={12} /> Delete Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Grid Masonry */}
        {loading ? (
          <div className="flex justify-center py-20 text-accent"><Loader2 className="animate-spin" size={32} /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-3xl max-w-xl mx-auto">
            <p className="text-gray-500 text-sm">No client reviews have been published yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {reviews.map((rev) => {
              // Skip showing own review in the grid again since it is highlighted above
              if (userReview && rev.id === userReview.id) return null;

              return (
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
                            className={`${i < rev.rating ? "fill-yellow-500" : "text-zinc-800"}`} 
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
              );
            })}
          </motion.div>
        )}

      </div>
    </section>
  );
}
