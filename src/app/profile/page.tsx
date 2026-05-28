"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, LogOut, Settings, Video, Code, CheckCircle2, Clock, Globe, Camera, Trash2, Plus, X, Send } from "lucide-react";
import { useStudio } from "@/context/StudioContext";
import { supabase } from "@/utils/supabase/client";
import Cropper from "react-easy-crop";
import { useRouter } from "next/navigation";

// Utility to create image for cropping
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

// Utility to get cropped blob
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
}

export default function ProfilePage() {
  const { user, isAdmin, loading: authLoading, logout } = useStudio();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, authLoading, router]);

  const [activeTab, setActiveTab] = useState<"Pending" | "Completed">("Pending");

  // Crop Modal State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Portfolio Management State
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ title: "", category: "Web Development", link: "", description: "" });
  const [isSavingPortfolio, setIsSavingPortfolio] = useState(false);

  const dummyAppointments = [
    { id: "APT-1042", service: "Web Development", date: "Oct 24, 2026", status: "Upcoming", icon: Code, color: "text-accent", bg: "bg-accent/10" },
    { id: "APT-0921", service: "Video Editing", date: "Sep 12, 2026", status: "Completed", icon: Video, color: "text-purple-400", bg: "bg-purple-500/10" },
    { id: "APT-0885", service: "Consultation", date: "Aug 05, 2026", status: "Completed", icon: CalendarDays, color: "text-green-400", bg: "bg-green-500/10" }
  ];

  // Fetch portfolios on load (Admin Only)
  useEffect(() => {
    if (isAdmin) {
      const fetchPortfolios = async () => {
        const { data } = await supabase.from("portfolio").select("*").order("created_at", { ascending: false });
        if (data) setPortfolios(data);
      };
      fetchPortfolios();
    }
  }, [isAdmin]);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => setImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(file);
    }
    // Reset target so same file can be selected again
    e.target.value = '';
  };

  const handleUploadLogo = async () => {
    try {
      setIsUploadingLogo(true);
      const croppedImageBlob = await getCroppedImg(imageSrc!, croppedAreaPixels!);
      if (!croppedImageBlob) return;

      const fileName = `${user?.id}-${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, croppedImageBlob, { upsert: true, contentType: "image/jpeg" });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName);

      // Update auth user metadata
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrlData.publicUrl }
      });

      // Reload window to reflect changes
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error uploading logo.");
    } finally {
      setIsUploadingLogo(false);
      setImageSrc(null);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPortfolio(true);
    const { data, error } = await supabase.from("portfolio").insert([
      {
        title: newPortfolio.title,
        category: newPortfolio.category,
        link: newPortfolio.link,
        description: newPortfolio.description,
        user_id: user?.id
      }
    ]).select();

    if (!error && data) {
      setPortfolios([data[0], ...portfolios]);
      setShowPortfolioModal(false);
      setNewPortfolio({ title: "", category: "Web Development", link: "", description: "" });
      router.refresh(); 
    } else {
      console.error(error);
      alert("Error saving portfolio.");
    }
    setIsSavingPortfolio(false);
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (!error) {
      setPortfolios(portfolios.filter(p => p.id !== id));
      router.refresh();
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid lg:grid-cols-12 gap-8">
          
          {/* Sidebar / User Info */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl sticky top-32">
              <div className="flex flex-col items-center text-center">
                
                {/* Profile Picture / Logo Upload */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent to-purple-600 p-1 mb-6 relative group">
                  <div className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center relative">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                    
                    {/* Hover Upload Overlay */}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer">
                      <Camera className="text-white mb-1" size={20} />
                      <span className="text-[10px] text-white font-medium">Change Logo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-black rounded-full z-10" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-1">{user?.user_metadata?.full_name || "User"}</h2>
                <p className="text-gray-400 text-sm mb-6">{user?.email}</p>
                
                <div className="w-full h-px bg-white/10 mb-6" />
                
                <div className="w-full flex justify-between items-center mb-4 px-2">
                  <span className="text-sm text-gray-500">Joined Date</span>
                  <span className="text-sm font-medium text-white">March 2026</span>
                </div>
                
                <div className="flex flex-col gap-3 w-full mt-4">
                  <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-2 text-white text-sm font-medium transition-colors">
                    <Settings size={16} /> Account Settings
                  </button>
                  <button onClick={logout} className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-gradient-to-r from-accent/20 to-purple-600/20 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
              <p className="text-gray-400">Manage your bookings and project progress from your dashboard.</p>
            </div>

            {/* Admin Portfolio Management */}
            {isAdmin && (
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="text-blue-400" /> Manage Portfolio
                  </h3>
                  <button 
                    onClick={() => setShowPortfolioModal(true)}
                    className="bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Plus size={16} /> Add Project
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {portfolios.map(item => (
                    <div key={item.id} className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-medium">{item.title}</h4>
                          <button onClick={() => handleDeletePortfolio(item.id)} className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-white/10 text-gray-300 rounded-md">{item.category}</span>
                        {item.description && <p className="text-gray-500 text-sm mt-3 line-clamp-2">{item.description}</p>}
                      </div>
                      <a href={item.link} target="_blank" rel="noreferrer" className="text-accent text-sm mt-4 hover:underline break-all">
                        {item.link}
                      </a>
                    </div>
                  ))}
                  {portfolios.length === 0 && (
                    <div className="md:col-span-2 text-center py-8">
                      <p className="text-gray-500 text-sm">No portfolio items found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Appointments Section */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <CalendarDays className="text-accent" /> My Appointments
                </h3>
                <div className="flex bg-black/40 border border-white/10 rounded-full p-1">
                  <button onClick={() => setActiveTab("Pending")} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === "Pending" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                    Pending
                  </button>
                  <button onClick={() => setActiveTab("Completed")} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === "Completed" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                    Completed
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {dummyAppointments.filter(apt => activeTab === "Pending" ? apt.status === "Upcoming" : apt.status === "Completed").map((apt) => (
                  <div key={apt.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors gap-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 w-full">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${apt.bg}`}>
                          <apt.icon size={24} className={apt.color} />
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-1">{apt.service}</h4>
                          <div className="flex items-center gap-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{apt.id}</p>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <div className="flex items-center gap-1.5 text-gray-400 text-xs"><CalendarDays size={12} />{apt.date}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:ml-auto">
                        <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${apt.status === "Upcoming" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                          {apt.status === "Upcoming" ? <Clock size={12} /> : <CheckCircle2 size={12} />}{apt.status}
                        </div>
                        {apt.status === "Upcoming" && (
                          <motion.a href={`https://wa.me/919294625866?text=Hi%2C%20here%20is%20the%20Zoom%20link%20for%20my%20upcoming%20appointment%20(${apt.id})`} target="_blank" rel="noopener noreferrer" whileTap={{ scale: 0.95 }} className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer">
                            <Send size={12} /> WhatsApp Link
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Profile Picture Crop Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 w-full max-w-md flex flex-col items-center shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-4">Crop Profile Picture</h3>
            <div className="relative w-full h-64 bg-black rounded-2xl overflow-hidden mb-6 border border-white/5">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="w-full mb-8 px-4">
              <p className="text-xs text-gray-400 mb-2">Zoom</p>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
            <div className="flex gap-3 w-full">
              <button 
                onClick={handleUploadLogo} 
                disabled={isUploadingLogo}
                className="flex-1 bg-accent hover:bg-accent/90 text-white font-medium py-3 rounded-xl transition-all"
              >
                {isUploadingLogo ? "Saving..." : "Save Picture"}
              </button>
              <button 
                onClick={() => setImageSrc(null)}
                disabled={isUploadingLogo}
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Portfolio Item Modal (Admin) */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 w-full max-w-lg relative shadow-2xl">
            <button onClick={() => setShowPortfolioModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Add Portfolio Item</h3>
            <form onSubmit={handleAddPortfolio} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Project Title</label>
                <input required value={newPortfolio.title} onChange={e => setNewPortfolio({...newPortfolio, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" placeholder="e.g., E-Commerce Platform" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Category</label>
                <select value={newPortfolio.category} onChange={e => setNewPortfolio({...newPortfolio, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent appearance-none">
                  <option value="Web Development">Web Development</option>
                  <option value="App Development">App Development</option>
                  <option value="Website Redesign">Website Redesign</option>
                  <option value="Video Editing">Video Editing</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Link (URL)</label>
                <input required type="url" value={newPortfolio.link} onChange={e => setNewPortfolio({...newPortfolio, link: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Description (Optional)</label>
                <textarea rows={3} value={newPortfolio.description} onChange={e => setNewPortfolio({...newPortfolio, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent resize-none" placeholder="Brief details about the project..." />
              </div>
              <button type="submit" disabled={isSavingPortfolio} className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 rounded-xl transition-all mt-2">
                {isSavingPortfolio ? "Saving..." : "Save Project"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
