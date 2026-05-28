"use client";

import { Camera, MessageCircle, Send } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-20 bg-[#020202] border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-6">
              Kryto<span className="text-accent">.</span>
            </h2>
            <p className="text-gray-400 max-w-sm font-light leading-relaxed mb-8">
              Crafting Digital Excellence. A premium hybrid dev & edit studio crafting exceptional digital experiences for forward-thinking brands.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent/20 hover:text-accent hover:border-accent/50 transition-all cursor-pointer">
                <Camera size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#5865F2]/20 hover:text-[#5865F2] hover:border-[#5865F2]/50 transition-all cursor-pointer">
                <Send size={18} /> {/* Using Send as a proxy for Discord */}
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#25D366]/20 hover:text-[#25D366] hover:border-[#25D366]/50 transition-all cursor-pointer">
                <MessageCircle size={18} /> {/* Using MessageCircle as a proxy for WhatsApp */}
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="text-gray-400">
                <span className="text-accent font-semibold block text-[10px] uppercase tracking-wider mb-0.5">Co-Founders</span>
                Dewansh Chatterjee & Aryan Gupta
              </li>
              <li>
                <span className="text-accent font-semibold block text-[10px] uppercase tracking-wider mb-0.5">Email</span>
                <a href="mailto:kryto.studioo@zohomail.in" className="text-gray-300 hover:text-accent transition-colors cursor-pointer break-all">
                  kryto.studioo@zohomail.in
                </a>
              </li>
              <li>
                <span className="text-accent font-semibold block text-[10px] uppercase tracking-wider mb-0.5">Phone</span>
                <div className="flex flex-col gap-1 text-gray-300">
                  <a href="tel:+919294625866" className="hover:text-accent transition-colors cursor-pointer">
                    +91 9294625866
                  </a>
                  <a href="tel:+919340411838" className="hover:text-accent transition-colors cursor-pointer">
                    +91 9340411838
                  </a>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Headquarters</h3>
            <address className="text-gray-400 not-italic leading-relaxed">
              Ambikapur,<br />
              Chhattisgarh,<br />
              India.
            </address>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Kryto Studio. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors cursor-pointer">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
