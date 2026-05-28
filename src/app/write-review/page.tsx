"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Upload, X, MessageSquare, ShieldCheck, Trash2, Edit3, Loader2, LogOut, Lock } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useStudio } from "@/context/StudioContext";
import Link from "next/link";
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

export default function WriteReviewPage() {
  const { user, logout } = useStudio();
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

  // Login Form States (for custom email login if needed)
  const [emailInput, setEmailInput] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    if (user && user.email) {
      checkPermissionAndExistingReview();
    } else {
      setAuthorized(false);
      setUserReview(null);
      setLoading(false);
    }
  }, [user]);

  const checkPermissionAndExistingReview = async () => {
    if (!user || !user.email) return;

    try {
      // 1. Check if email is in the allowed list
      const { data: permissionData } = await supabase
        .from("reviews_permissions")
        .select("id")
        .eq("email", user.email.toLowerCase().trim())
        .maybeSingle();

      setAuthorized(!!permissionData);

      if (permissionData) {
        // 2. Check if user already submitted a review
        const { data: existingReview, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("email", user.email.toLowerCase().trim())
          .maybeSingle();

        if (!error && existingReview) {
          setUserReview(existingReview);
          setName(existingReview.name);
          setRating(existingReview.rating);
          setContent(existingReview.content);
          setAvatarPreview(existingReview.avatar_url);
        } else {
          setUserReview(null);
          // Pre-fill name and avatar from Google Metadata if available
          setName(user.user_metadata?.full_name || user.user_metadata?.name || "");
          setAvatarPreview(user.user_metadata?.avatar_url || null);
        }
      }
    } catch (err) {
      console.error("Error checking permissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/write-review`,
      },
    });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setLoginLoading(true);
    setLoginMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailInput.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/write-review`,
        },
      });

      if (error) throw error;
      setLoginMessage("A magic sign-in link has been sent to your email!");
    } catch (err: any) {
      console.error(err);
      setLoginMessage(err.message || "Failed to send magic link.");
    } finally {
      setLoginLoading(false);
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
        email: user.email.toLowerCase().trim(),
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
      await checkPermissionAndExistingReview();
      alert(userReview ? "Review updated successfully!" : "Review submitted successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Error saving review: " + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview || !confirm("Are you sure you want to delete your review permanently?")) return;

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
      alert("Review deleted successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-accent">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 flex flex-col items-center relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] z-0 pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        
        {/* Logo and Headings */}
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white inline-block mb-4">
            Kryto<span className="text-accent">.</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Verified Client Gateway</h1>
          <p className="text-gray-400 text-sm mt-2">Publish your experience with Kryto Studio.</p>
        </div>

        {/* Phase 1: NOT LOGGED IN */}
        {!user && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl flex flex-col space-y-6"
          >
            <div className="flex items-center gap-3 text-amber-400 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
              <Lock size={20} className="shrink-0 animate-pulse" />
              <p className="text-xs font-medium leading-relaxed">
                Review writing access is restricted to verified clients only. Log in with your authorized email address to continue.
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-sm cursor-pointer shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.97 1 12 1 7.35 1 3.37 3.65 1.39 7.56l3.87 3a7.98 7.98 0 0 1 6.74-5.52z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46a5.53 5.53 0 0 1-2.4 3.63v3.01h3.87c2.26-2.08 3.56-5.14 3.56-8.79z"/>
                <path fill="#FBBC05" d="M5.26 14.56a7.96 7.96 0 0 1 0-5.12L1.39 6.44a11.96 11.96 0 0 0 0 11.12l3.87-3z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.87-3.01c-1.08.72-2.47 1.16-4.09 1.16-3.24 0-5.99-2.19-6.97-5.14l-3.87 3C3.37 20.35 7.35 23 12 23z"/>
              </svg>
              Sign In with Google
            </button>

            <div className="relative flex items-center justify-center py-2">
              <span className="absolute left-0 w-full h-[1px] bg-white/10" />
              <span className="relative bg-[#050505] px-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest z-10">or use email</span>
            </div>

            {/* Email OTP Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <input
                required
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="client@email.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm focus:ring-1 focus:ring-accent/50"
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {loginLoading ? <Loader2 className="animate-spin" size={16} /> : null}
                Send Magic Link
              </button>
            </form>

            {loginMessage && (
              <p className="text-xs text-center font-medium text-accent pt-1">{loginMessage}</p>
            )}
          </motion.div>
        )}

        {/* Phase 2: LOGGED IN BUT NOT AUTHORIZED */}
        {user && !authorized && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
              <Lock size={28} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Access Pending</h3>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-sm mx-auto">
                Logged in as <span className="text-white font-semibold">{user.email}</span>.
                <br />
                Your email is not currently authorized to publish reviews. Please request permission from the Kryto Studio team.
              </p>
            </div>

            <div className="flex gap-4 pt-4 justify-center">
              <button 
                onClick={logout}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold py-2.5 px-5 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut size={14} /> Log Out
              </button>
              <Link 
                href="/" 
                className="bg-accent hover:bg-accent/90 text-white font-semibold py-2.5 px-5 rounded-xl transition-all text-xs cursor-pointer shadow-md"
              >
                Go to Website
              </Link>
            </div>
          </motion.div>
        )}

        {/* Phase 3: AUTHORIZED & HAS EXISTING REVIEW OR WRITING */}
        {user && authorized && (
          <div className="space-y-6">
            
            {/* Logged in helper banner */}
            <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4">
              <span className="text-xs text-gray-400">
                Verified client: <span className="text-white font-medium">{user.email}</span>
              </span>
              <button 
                onClick={logout}
                className="text-[10px] uppercase font-bold tracking-wider text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                <LogOut size={10} /> Logout
              </button>
            </div>

            {/* Existing Review Active state */}
            {userReview && !isEditing ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-accent/[0.02] border border-accent/25 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-accent/5 flex flex-col space-y-6"
              >
                <div className="absolute top-0 right-0 bg-accent text-[9px] font-bold tracking-widest text-white px-3 py-1 rounded-bl-xl uppercase">
                  Published Review
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden relative bg-zinc-800 border border-white/10 shrink-0">
                    {userReview.avatar_url ? (
                      <Image src={userReview.avatar_url} alt="My avatar" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-mono uppercase">{userReview.name[0]}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base flex items-center gap-1.5">
                      {userReview.name}
                      <ShieldCheck size={16} className="text-accent" />
                    </h3>
                    <div className="flex text-yellow-500 mt-1">
                      {Array.from({ length: userReview.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 border border-white/5 p-4 rounded-xl italic font-light text-gray-300 text-sm leading-relaxed">
                  "{userReview.content}"
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Edit3 size={14} /> Update Review
                  </button>
                  <button 
                    onClick={handleDeleteReview}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 font-semibold py-3 px-5 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={14} /> Delete Review
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Writing/Editing form mode */
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare size={18} className="text-accent" />
                    {userReview ? "Update Review Details" : "Compose Client Review"}
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
                  {/* Rating Selector */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Overall Rating</label>
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

                  {/* Profile Pic and Name field */}
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Avatar Upload */}
                    <div className="relative group shrink-0">
                      <div className="w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden relative bg-zinc-800">
                        {avatarPreview ? (
                          <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-[10px] font-mono">PFP</div>
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

                    {/* Name */}
                    <div className="w-full">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Reviewer Display Name</label>
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

                  {/* Review Content */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Your Feedback Message</label>
                    <textarea 
                      required 
                      rows={5}
                      value={content} 
                      onChange={(e) => setContent(e.target.value)} 
                      placeholder="Tell other clients about your experience with our services, process, and outputs..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 text-sm leading-relaxed"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(14,165,233,0.3)] cursor-pointer"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={16} /> : null}
                      {userReview ? "Save Update" : "Publish Review"}
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

          </div>
        )}

      </div>
    </div>
  );
}
