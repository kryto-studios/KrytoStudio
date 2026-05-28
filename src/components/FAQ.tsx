"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles, HelpCircle } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Do I get full ownership of the source code and design assets?",
      answer: "Yes, 100%! Once the final project payment is settled, complete intellectual property, custom assets, databases, and source code directories are fully transferred to you. There are no locking contracts or hidden license fees."
    },
    {
      question: "How are project timelines decided and tracked?",
      answer: "We break projects down into clear sprints. You will receive access to our live client dashboard where you can check completed checkpoints, pending integrations, and upcoming video sync calls. Standard landing pages take 1-2 weeks, while advanced CRM spreadsheets and mobile portals take 3-5 weeks."
    },
    {
      question: "Can I manage the site content, reviews, and client highlights myself?",
      answer: "Absolutely! We build a custom administrative control dashboard (Admin Panel) with every website. From there, you can upload client testimonials, add new portfolio items, update services, edit titles/roles, and even reorder client highlights visually with one click!"
    },
    {
      question: "What frameworks and database stacks do you utilize?",
      answer: "We build using bleeding-edge technologies for maximum performance. Our typical stack consists of Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Supabase (for secure backend, real-time database, and encrypted Row-Level Security), and Framer Motion for premium 3D page movement physics."
    },
    {
      question: "Do you offer post-launch technical support and maintenance?",
      answer: "Yes! Every project includes 30 days of complimentary premium support. We monitor server speed, secure database credentials, check API limits, and verify security protocols. We also offer rolling monthly retention plans if you wish to continuously scale features."
    }
  ];

  return (
    <section id="faq" className="relative z-20 bg-[#030303] pb-40 pt-12 px-4 sm:px-6 border-t border-white/5 overflow-hidden">
      {/* Background neon soft blur glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-500/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-sky-500/20 mb-4">
            <Sparkles size={12} className="text-sky-400 animate-pulse" /> Common Queries
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 font-light text-base max-w-lg mx-auto">
            Everything you need to know about our visual workflows, asset ownership, and development practices.
          </p>
        </div>

        {/* Accordions Container */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div 
                key={index}
                className="bg-[#070709] border border-white/5 hover:border-sky-500/10 rounded-2xl sm:rounded-3xl transition-all duration-300 overflow-hidden shadow-lg"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full text-left p-6 sm:p-8 flex justify-between items-center gap-4 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/5 border border-sky-500/10 flex items-center justify-center shrink-0 group-hover:border-sky-500/30 transition-colors">
                      <HelpCircle size={14} className="text-sky-400" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors tracking-tight">
                      {faq.question}
                    </span>
                  </div>

                  {/* Circular visual rotate crosshair indicator */}
                  <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden group-hover:border-sky-500/30 transition-colors">
                    <motion.span 
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs font-bold text-gray-500 group-hover:text-sky-400 font-mono"
                    >
                      +
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-xs sm:text-sm text-gray-400 font-light leading-relaxed border-t border-white/5 pt-4 select-text">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
