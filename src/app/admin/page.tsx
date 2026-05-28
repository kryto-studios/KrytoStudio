"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { useStudio } from "@/context/StudioContext";
import { Settings, Users, MessageSquare, Loader2, UploadCloud, Save, X, Globe, Trash2, Plus, TrendingUp, Star, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const { settings, refreshSettings, isAdmin, loading: authLoading } = useStudio();
  const [activeTab, setActiveTab] = useState("settings");
  
  // Data States
  const [appointments, setAppointments] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  // Settings Form States
  const [studioName, setStudioName] = useState(settings.name);
  const [studioBio, setStudioBio] = useState(settings.bio);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Portfolio Form States
  const [newPortfolio, setNewPortfolio] = useState({ title: "", category: "Web Development", link: "" });
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [portfolioFiles, setPortfolioFiles] = useState<FileList | null>(null);
  const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<string[]>([]);

  // Reviews & Permissions States
  const [reviewPermissions, setReviewPermissions] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [newPermissionEmail, setNewPermissionEmail] = useState("");
  const [savingPermission, setSavingPermission] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  // Sync state if settings context loads later
  useEffect(() => {
    setStudioName(settings.name);
    setStudioBio(settings.bio);
  }, [settings]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [apptsRes, inqsRes, portRes, permissionsRes, reviewsRes] = await Promise.all([
        supabase.from("appointments").select("*").order("date", { ascending: false }),
        supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("portfolio").select("*").order("created_at", { ascending: false }),
        supabase.from("reviews_permissions").select("*").order("created_at", { ascending: false }),
        supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      ]);

      if (apptsRes.data) setAppointments(apptsRes.data);
      if (inqsRes.data) setInquiries(inqsRes.data);
      if (portRes.data) setPortfolios(portRes.data);
      if (permissionsRes.data) setReviewPermissions(permissionsRes.data);
      if (reviewsRes.data) setAllReviews(reviewsRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddPermissionEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPermissionEmail) return;
    setSavingPermission(true);
    try {
      const { error } = await supabase
        .from("reviews_permissions")
        .insert([{ email: newPermissionEmail.trim().toLowerCase() }]);

      if (error) throw error;

      setNewPermissionEmail("");
      const { data } = await supabase.from("reviews_permissions").select("*").order("created_at", { ascending: false });
      if (data) setReviewPermissions(data);
      alert("Review permission granted successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Failed to grant permission: " + (err.message || err));
    } finally {
      setSavingPermission(false);
    }
  };

  const handleDeletePermissionEmail = async (id: string) => {
    if (!confirm("Are you sure you want to revoke review permission for this email?")) return;
    try {
      const { error } = await supabase.from("reviews_permissions").delete().eq("id", id);
      if (error) throw error;
      setReviewPermissions(prev => prev.filter(p => p.id !== id));
      alert("Review permission revoked!");
    } catch (err) {
      console.error(err);
      alert("Error revoking permission.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client review permanently?")) return;
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
      setAllReviews(prev => prev.filter(r => r.id !== id));
      alert("Review deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting review.");
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "done" : "pending";
    const { error } = await supabase.from("appointments").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    }
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `profile-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('studio-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('studio-assets').getPublicUrl(filePath);
      
      // Update DB
      await supabase.from("studio_settings").update({ profile_pic_url: data.publicUrl }).eq("id", 1);
      await refreshSettings();
      alert("Profile picture updated!");
    } catch (err: any) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("studio_settings").update({
        name: studioName,
        bio: studioBio,
      }).eq("id", 1);
      
      if (error) throw error;
      await refreshSettings();
      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPortfolio(true);
    
    try {
      let image_urls: string[] = [];
      let thumbnailUrl = null;

      // Handle multiple image uploads if provided
      if (portfolioFiles && portfolioFiles.length > 0) {
        for (let i = 0; i < portfolioFiles.length; i++) {
          const file = portfolioFiles[i];
          const fileExt = file.name.split('.').pop();
          const filePath = `portfolio-${Math.random()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('studio-assets')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage.from('studio-assets').getPublicUrl(filePath);
          if (urlData?.publicUrl) {
            image_urls.push(urlData.publicUrl);
          }
        }

        // Auto-use first uploaded image as thumbnail
        if (image_urls.length > 0) {
          thumbnailUrl = image_urls[0];
        }
      }

      // Auto-generate youtube thumbnail if youtube link
      if (!thumbnailUrl && newPortfolio.link) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = newPortfolio.link.match(regExp);
        if (match && match[2].length === 11) {
          thumbnailUrl = `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
        }
      }

      const { data, error } = await supabase.from("portfolio").insert([
        {
          title: newPortfolio.title,
          category: newPortfolio.category,
          link: newPortfolio.link || "#",
          thumbnail_url: thumbnailUrl,
          image_urls: image_urls
        }
      ]).select();

      if (error) throw error;

      if (data && data[0]) {
        setPortfolios([data[0], ...portfolios]);
        setNewPortfolio({ title: "", category: "Web Development", link: "" });
        setPortfolioFiles(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        alert("Portfolio project saved successfully!");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error saving portfolio: " + (err.message || err));
    } finally {
      setSavingPortfolio(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (!error) {
      setPortfolios(portfolios.filter(p => p.id !== id));
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (!error) {
      setAppointments(prev => prev.filter(a => a.id !== id));
      setSelectedAppointmentIds(prev => prev.filter(item => item !== id));
    } else {
      console.error(error);
      alert("Error deleting appointment.");
    }
  };

  const handleBulkDeleteAppointments = async () => {
    if (!confirm(`Are you sure you want to permanently delete the ${selectedAppointmentIds.length} selected appointment(s)? This cannot be undone.`)) return;
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .in("id", selectedAppointmentIds);

      if (error) throw error;

      setAppointments(prev => prev.filter(a => !selectedAppointmentIds.includes(a.id)));
      setSelectedAppointmentIds([]);
      alert("Selected appointments deleted successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete appointments: " + (err.message || err));
    }
  };

  if (authLoading || loadingData) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-accent"><Loader2 className="animate-spin" size={32} /></div>;
  }

  if (!isAdmin) return null; // Middleware should catch this, fallback

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeTab === "settings" ? "bg-accent/20 text-accent" : "text-gray-400 hover:bg-white/5"}`}
          >
            <Settings size={18} /> Studio Settings
          </button>
          <button 
            onClick={() => setActiveTab("portfolio")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeTab === "portfolio" ? "bg-accent/20 text-accent" : "text-gray-400 hover:bg-white/5"}`}
          >
            <Globe size={18} /> Manage Portfolio
          </button>
          <button 
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeTab === "appointments" ? "bg-accent/20 text-accent" : "text-gray-400 hover:bg-white/5"}`}
          >
            <Users size={18} /> Appointments ({appointments.length})
          </button>
          <button 
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeTab === "inquiries" ? "bg-accent/20 text-accent" : "text-gray-400 hover:bg-white/5"}`}
          >
            <MessageSquare size={18} /> Contact Inquiries ({inquiries.length})
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeTab === "reviews" ? "bg-accent/20 text-accent" : "text-gray-400 hover:bg-white/5"}`}
          >
            <Star size={18} className="text-yellow-500" /> Manage Reviews
          </button>
          
          <Link 
            href="/admin/pipeline"
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap text-accent border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:text-accent font-semibold ml-auto shadow-[0_0_15px_rgba(14,165,233,0.1)]"
          >
            <TrendingUp size={18} /> Client Pipeline Matrix ⚡
          </Link>
        </div>

        {/* Tab Content */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl">
          
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-2xl">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Dynamic Branding</h2>
                <p className="text-gray-400 text-sm">Update your studio's public appearance.</p>
              </div>

              <div className="flex items-center gap-6">
                {settings.profile_pic_url ? (
                  <img src={settings.profile_pic_url} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Users size={32} className="text-gray-500" />
                  </div>
                )}
                <div>
                  <label className="cursor-pointer bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
                    Upload New Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} disabled={uploading} />
                  </label>
                  <p className="text-gray-500 text-xs mt-2">Recommended: 256x256px JPG/PNG</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 ml-1">Studio Name</label>
                  <input 
                    type="text" 
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 ml-1">Studio Bio (Hero Text)</label>
                  <textarea 
                    value={studioBio}
                    onChange={(e) => setStudioBio(e.target.value)}
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 mt-1 resize-none"
                  />
                </div>
                <button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Settings
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "portfolio" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Manage Portfolio</h2>
                <p className="text-gray-400 text-sm">Add or remove projects from your public portfolio.</p>
              </div>
              
              <form onSubmit={handleAddPortfolio} className="bg-black/30 p-6 rounded-2xl border border-white/5 space-y-4 max-w-2xl">
                <div>
                  <label className="text-sm font-medium text-gray-300 ml-1">Project Title</label>
                  <input required value={newPortfolio.title} onChange={e => setNewPortfolio({...newPortfolio, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 mt-1" placeholder="e.g. Zenova E-Commerce" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 ml-1">Category</label>
                  <select required value={newPortfolio.category} onChange={e => setNewPortfolio({...newPortfolio, category: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 mt-1 appearance-none">
                    <option value="Web Development">Web Development</option>
                    <option value="App Development">App Development</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Graphics Design">Graphics Design</option>
                  </select>
                </div>
                {newPortfolio.category !== "Video Editing" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1 block">Project Images / Screenshots (Multiple)</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => setPortfolioFiles(e.target.files)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 transition-all text-xs" 
                    />
                    {portfolioFiles && (
                      <p className="text-accent text-xs font-semibold">{portfolioFiles.length} file(s) selected</p>
                    )}
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-300 ml-1">URL (YouTube / Website / Drive)</label>
                  <input 
                    required={(!portfolioFiles || portfolioFiles.length === 0) && newPortfolio.category !== "Graphics Design"} 
                    type="url" 
                    value={newPortfolio.link} 
                    onChange={e => setNewPortfolio({...newPortfolio, link: e.target.value})} 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 mt-1" 
                    placeholder={newPortfolio.category !== "Video Editing" ? "https://... (Optional)" : "https://..."} 
                  />
                </div>
                <button type="submit" disabled={savingPortfolio} className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center gap-2 mt-4">
                  {savingPortfolio ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  Save to Portfolio
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-6">
                {portfolios.map(item => (
                  <div key={item.id} className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold truncate pr-2">{item.title}</h4>
                      <button onClick={() => handleDeletePortfolio(item.id)} className="text-red-400 hover:bg-red-400/20 p-1.5 rounded-lg transition-colors shrink-0" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-white/10 text-gray-300 rounded-md w-fit mb-4">{item.category}</span>
                    <a href={item.link} target="_blank" rel="noreferrer" className="text-accent text-xs hover:underline mt-auto truncate w-full block">
                      {item.link}
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "appointments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 w-full">
              
              {/* Bulk Action Controls */}
              {selectedAppointmentIds.length > 0 && (
                <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 p-4 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.1)] mb-4 animate-pulse">
                  <span className="text-red-400 text-xs md:text-sm font-semibold">
                    {selectedAppointmentIds.length} appointment(s) selected
                  </span>
                  <button
                    onClick={handleBulkDeleteAppointments}
                    className="bg-red-500 hover:bg-red-650 text-white font-bold py-2.5 px-4 rounded-xl text-xs md:text-sm flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
                  >
                    <Trash2 size={14} /> Bulk Delete Selected
                  </button>
                </div>
              )}

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 pl-4 text-gray-400 font-medium text-sm w-10">
                        <input
                          type="checkbox"
                          checked={
                            appointments.length > 0 && 
                            appointments.every(a => selectedAppointmentIds.includes(a.id))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAppointmentIds(appointments.map(a => a.id));
                            } else {
                              setSelectedAppointmentIds([]);
                            }
                          }}
                          className="w-4 h-4 accent-accent rounded border-white/10 bg-black/40 cursor-pointer focus:ring-0 focus:ring-offset-0"
                        />
                      </th>
                      <th className="py-4 text-gray-400 font-medium text-sm">Date</th>
                      <th className="py-4 text-gray-400 font-medium text-sm">Name</th>
                      <th className="py-4 text-gray-400 font-medium text-sm">Service</th>
                      <th className="py-4 text-gray-400 font-medium text-sm">Contact</th>
                      <th className="py-4 text-gray-400 font-medium text-sm">Status</th>
                      <th className="py-4 text-gray-400 font-medium text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-4 pl-4">
                          <input
                            type="checkbox"
                            checked={selectedAppointmentIds.includes(a.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAppointmentIds(prev => [...prev, a.id]);
                              } else {
                                setSelectedAppointmentIds(prev => prev.filter(id => id !== a.id));
                              }
                            }}
                            className="w-4 h-4 accent-accent rounded border-white/10 bg-black/40 cursor-pointer focus:ring-0 focus:ring-offset-0"
                          />
                        </td>
                        <td className="py-4 text-sm text-gray-300">{new Date(a.date).toLocaleDateString()}</td>
                        <td className="py-4 text-sm text-white font-medium">{a.name}</td>
                        <td className="py-4 text-sm text-accent">{a.service}</td>
                        <td className="py-4 text-sm text-gray-400">{a.email}<br/><span className="text-xs">{a.phone}</span></td>
                        <td className="py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.status === 'done' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="py-4 flex gap-2">
                          <button 
                            onClick={() => setSelectedAppointment(a)}
                            className="text-xs bg-accent/20 hover:bg-accent/30 text-accent px-3 py-1.5 rounded-lg transition-all"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(a.id, a.status)}
                            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-all"
                          >
                            Mark {a.status === 'pending' ? 'Done' : 'Pending'}
                          </button>
                          <button 
                            onClick={() => handleDeleteAppointment(a.id)}
                            className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                            title="Delete Appointment"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr><td colSpan={7} className="py-8 text-center text-gray-500">No appointments found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "inquiries" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 text-gray-400 font-medium text-sm">Date</th>
                    <th className="py-4 text-gray-400 font-medium text-sm">Name</th>
                    <th className="py-4 text-gray-400 font-medium text-sm">Subject</th>
                    <th className="py-4 text-gray-400 font-medium text-sm">Message</th>
                    <th className="py-4 text-gray-400 font-medium text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((i) => (
                    <tr key={i.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-4 text-sm text-gray-300">{new Date(i.created_at).toLocaleDateString()}</td>
                      <td className="py-4 text-sm text-white font-medium">{i.name}<br/><span className="text-xs text-gray-500">{i.email}</span></td>
                      <td className="py-4 text-sm text-accent">{i.subject}</td>
                      <td className="py-4 text-sm text-gray-400 max-w-xs truncate" title={i.message}>{i.message}</td>
                      <td className="py-4">
                        <button 
                          onClick={() => setSelectedInquiry(i)}
                          className="text-xs bg-accent/20 hover:bg-accent/30 text-accent px-3 py-1.5 rounded-lg transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-500">No inquiries found.</td></tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              {/* Left Column: Permissions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Review Permissions</h3>
                  <p className="text-gray-400 text-sm">Grant or revoke permission for clients to write a review.</p>
                </div>

                <form onSubmit={handleAddPermissionEmail} className="flex gap-3 bg-black/30 p-4 rounded-xl border border-white/5">
                  <input
                    required
                    type="email"
                    value={newPermissionEmail}
                    onChange={(e) => setNewPermissionEmail(e.target.value)}
                    placeholder="client@email.com"
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={savingPermission}
                    className="bg-accent hover:bg-accent/90 text-white font-medium px-4 py-2 rounded-xl transition-all text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {savingPermission ? <Loader2 className="animate-spin" size={12} /> : <Plus size={12} />}
                    Grant Permission
                  </button>
                </form>

                <div className="bg-black/20 border border-white/5 rounded-2xl p-4 overflow-hidden max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-850">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3 block">Authorized Client Emails ({reviewPermissions.length})</h4>
                  <div className="space-y-2">
                    {reviewPermissions.map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between bg-white/[0.01] border border-white/5 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-accent" />
                          <span className="text-white text-xs md:text-sm truncate max-w-[200px] md:max-w-xs">{perm.email}</span>
                        </div>
                        <button
                          onClick={() => handleDeletePermissionEmail(perm.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                          title="Revoke Permission"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {reviewPermissions.length === 0 && (
                      <p className="text-gray-500 text-xs py-4 text-center">No client email permissions granted yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Reviews */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Published Reviews</h3>
                  <p className="text-gray-400 text-sm">View and moderate customer reviews displayed on your website.</p>
                </div>

                <div className="bg-black/20 border border-white/5 rounded-2xl p-4 overflow-hidden max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-850 space-y-3">
                  {allReviews.map((rev) => (
                    <div key={rev.id} className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-3 hover:bg-white/[0.02] transition-colors relative group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden relative bg-zinc-800 border border-white/10 shrink-0">
                            {rev.avatar_url ? (
                              <img src={rev.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-mono uppercase">{rev.name[0]}</div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-xs md:text-sm flex items-center gap-1">
                              {rev.name}
                              <ShieldCheck size={12} className="text-accent" />
                            </h4>
                            <span className="text-[10px] text-gray-500 font-mono block truncate max-w-[150px]">{rev.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-500 shrink-0">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={10} className="fill-current" />
                            ))}
                          </div>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed italic">"{rev.content}"</p>
                    </div>
                  ))}
                  {allReviews.length === 0 && (
                    <p className="text-gray-500 text-xs py-8 text-center">No customer reviews published yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Appointment Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden relative"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Appointment Details</h3>
              <button onClick={() => setSelectedAppointment(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name</p>
                  <p className="text-white text-sm font-medium">{selectedAppointment.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white text-sm">{selectedAppointment.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-white text-sm">{selectedAppointment.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-white text-sm">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Service</p>
                  <p className="text-accent text-sm font-medium">{selectedAppointment.service}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-white text-sm">{selectedAppointment.address}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Message</p>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-gray-300 text-sm max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {selectedAppointment.message || "No message provided."}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end">
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl transition-all text-sm font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Inquiry Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden relative"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Inquiry Details</h3>
              <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name</p>
                  <p className="text-white text-sm font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white text-sm">{selectedInquiry.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-white text-sm">{new Date(selectedInquiry.created_at).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-white text-sm">{selectedInquiry.address || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Subject</p>
                  <p className="text-accent text-sm font-medium">{selectedInquiry.subject}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Message</p>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-gray-300 text-sm max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {selectedInquiry.message || "No message provided."}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end">
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl transition-all text-sm font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
