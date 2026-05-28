import { createClient } from "@/utils/supabase/server";
import PortfolioGrid from "@/components/PortfolioGrid";
import { Suspense } from "react";
import Loading from "./loading";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PortfolioPage() {
  const supabase = await createClient();
  
  const { data: portfolios } = await supabase
    .from("portfolio")
    .select("*")
    .order("created_at", { ascending: false });

  const webPortfolios = portfolios?.filter(p => p.category === "Web Development") || [];
  const appPortfolios = portfolios?.filter(p => p.category === "App Development") || [];
  const softwarePortfolios = portfolios?.filter(p => p.category === "Software Development") || [];
  const videoPortfolios = portfolios?.filter(p => p.category === "Video Editing") || [];
  const graphicsPortfolios = portfolios?.filter(p => p.category === "Graphics Design") || [];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Work</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our curated showcase of design, development, and marketing campaigns built by Kryto Studio.
          </p>
        </div>
        
        {(!portfolios || portfolios.length === 0) ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
            <p className="text-gray-500">New projects are currently being curated. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-20">
            {/* 1. Web Development */}
            {webPortfolios.length > 0 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-8 h-1 bg-accent rounded-full"></span>
                  Web Development
                </h2>
                <PortfolioGrid items={webPortfolios} />
              </div>
            )}

            {/* 2. App Development */}
            {appPortfolios.length > 0 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                  App Development
                </h2>
                <PortfolioGrid items={appPortfolios} />
              </div>
            )}

            {/* 3. Software Development */}
            {softwarePortfolios.length > 0 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                  Software Development
                </h2>
                <PortfolioGrid items={softwarePortfolios} />
              </div>
            )}

            {/* 4. Video Editing */}
            {videoPortfolios.length > 0 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                  Video Editing
                </h2>
                <PortfolioGrid items={videoPortfolios} />
              </div>
            )}

            {/* 5. Graphics Design */}
            {graphicsPortfolios.length > 0 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-8 h-1 bg-pink-500 rounded-full"></span>
                  Graphics Design
                </h2>
                <PortfolioGrid items={graphicsPortfolios} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
