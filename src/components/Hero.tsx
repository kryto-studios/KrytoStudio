"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useStudio } from "@/context/StudioContext";
import { Sparkles, Terminal, Activity, Shield, Cpu, ChevronRight } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useStudio();

  // Scroll Parallax Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yProgressSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // 3D Parallax movement bound to scroll
  const mockupRotateX = useTransform(yProgressSpring, [0, 1], [8, -12]);
  const mockupScale = useTransform(yProgressSpring, [0, 1], [1, 0.88]);
  const mockupY = useTransform(yProgressSpring, [0, 1], ["0px", "100px"]);
  const gridScale = useTransform(yProgressSpring, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(yProgressSpring, [0, 0.6], [1, 0]);
  const heroY = useTransform(yProgressSpring, [0, 0.6], ["0px", "-60px"]);

  // Mouse Parallax Motion Values for Background Video & Particles
  const bgMouseX = useMotionValue(0);
  const bgMouseY = useMotionValue(0);
  const bgSpringX = useSpring(bgMouseX, { stiffness: 45, damping: 20 });
  const bgSpringY = useSpring(bgMouseY, { stiffness: 45, damping: 20 });

  // Mouse Move 3D Hover Tilt States for Mockup
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 1. Update background parallax offsets based on screen percentage (Opposing depth)
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const mouseXRatio = (e.clientX - windowWidth / 2) / (windowWidth / 2); // -1 to 1
    const mouseYRatio = (e.clientY - windowHeight / 2) / (windowHeight / 2); // -1 to 1

    bgMouseX.set(-mouseXRatio * 20); // Opposing shift, max 20px
    bgMouseY.set(-mouseYRatio * 20); // Opposing shift, max 20px

    // 2. Also tilt mockup dynamically if hovering relatively close to it
    if (mockupRef.current) {
      const rect = mockupRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mX = e.clientX - rect.left - width / 2;
      const mY = e.clientY - rect.top - height / 2;

      const dist = Math.hypot(mX, mY);
      if (dist < width * 0.9) {
        setTiltX(-(mY / height) * 10);
        setTiltY((mX / width) * 10);
      } else {
        setTiltX(0);
        setTiltY(0);
      }
    }
  };

  const handleContainerMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
    bgMouseX.set(0);
    bgMouseY.set(0);
  };

  // Canvas interactive particle network setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 180 };

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (!canvas) return;
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Mouse collision detection
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 4;
            this.y -= forceDirectionY * force * 4;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      if (!canvas) return;
      particles = [];
      let numberOfParticles = (canvas.height * canvas.width) / 12000;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.8;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.3) - 0.15;
        let directionY = (Math.random() * 0.3) - 0.15;
        // Alternate colors matching sky-blue and purple
        let color = i % 2 === 0 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(192, 132, 252, 0.35)';
        particles.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init(); 
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const connect = () => {
      if (!canvas || !ctx) return;
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
              + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
          
          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - (distance / 25000);
            
            let dx_mouse_a = 0;
            let dy_mouse_a = 0;
            if (mouse.x !== null && mouse.y !== null) {
              dx_mouse_a = particles[a].x - mouse.x;
              dy_mouse_a = particles[a].y - mouse.y;
            }
            let distance_mouse_a = Math.sqrt(dx_mouse_a*dx_mouse_a + dy_mouse_a*dy_mouse_a);

            if (mouse.x && distance_mouse_a < mouse.radius) {
                 ctx.strokeStyle = `rgba(14, 165, 233, ${opacityValue * 0.35})`; // Glowing sky blue
            } else {
                 ctx.strokeStyle = `rgba(168, 85, 247, ${opacityValue * 0.18})`; // Muted purple lines
            }
            
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Keep transparent!

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };
    
    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const wordSplit = settings?.name ? settings.name.split(' ') : ['Kryto', 'Studio'];
  const firstWord = wordSplit[0] || 'Kryto';
  const restWords = wordSplit.slice(1).join(' ') || 'Studio';

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={handleContainerMouseLeave}
      className="relative min-h-[120vh] w-full flex flex-col items-center justify-start overflow-hidden bg-[#030303] pt-32 sm:pt-40 px-4 select-none"
    >
      {/* 1. Full Screen Premium Ambient Video Background & Interactive Canvas Particles */}
      <motion.div 
        style={{ 
          scale: gridScale,
          x: bgSpringX,
          y: useTransform(yProgressSpring, [0, 1], ["0%", "15%"]) // Scroll Parallax
        }}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-30 filter brightness-[0.6] contrast-[1.1]"
        >
          <source src="/asset/ok_good_starting_me_build_hoga.mp4" type="video/mp4" />
        </video>

        {/* Dynamic Aether Flow Interactive canvas layer */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 opacity-70 pointer-events-none mix-blend-screen" />

        {/* Sleek cyber grid lines in CSS */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] z-20" />
        
        {/* Soft back-glowing radial gradients */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-br from-sky-500/10 via-purple-500/5 to-transparent rounded-full blur-[130px] z-20 pointer-events-none" />
        <div className="absolute top-[40%] left-[20%] w-[350px] h-[350px] bg-sky-500/5 rounded-full blur-[90px] z-20 pointer-events-none" />
        <div className="absolute top-[35%] right-[20%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[90px] z-20 pointer-events-none" />
        
        {/* Dark mask overlay to make text easily readable with extreme visual premium look */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/30 via-[#030303]/85 to-[#030303] z-20" />
      </motion.div>

      {/* 2. Top Glowing Badge & Interactive Headers */}
      <motion.div 
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center mb-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 backdrop-blur-md text-xs font-mono text-sky-400 tracking-wider shadow-[0_0_15px_rgba(14,165,233,0.1)]"
        >
          <Sparkles size={12} className="text-sky-400 animate-pulse" />
          NEXT-GEN DIGITAL ARCHITECTURE
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white mb-6 leading-[0.95]"
        >
          {firstWord} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500 animate-gradient">{restWords}</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-gray-400 max-w-2xl font-light text-base sm:text-lg md:text-xl leading-relaxed tracking-wide"
        >
          {settings.bio}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto"
        >
          <a
            href="/appointment"
            className="px-8 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-medium text-sm transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Start Project <ChevronRight size={16} />
          </a>
          <a
            href="#services"
            className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-medium text-sm transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            Explore Services
          </a>
        </motion.div>
      </motion.div>

      {/* 3. 3D Parallax Glass Dashboard Mockup */}
      <motion.div
        style={{ 
          rotateX: mockupRotateX, 
          scale: mockupScale, 
          y: mockupY,
          perspective: 1200
        }}
        className="w-full max-w-5xl z-10 relative mt-4 md:mt-8 px-2 md:px-0"
      >
        <div 
          className="w-full rounded-[2.5rem] p-1.5 sm:p-2.5 bg-gradient-to-b from-sky-500/20 via-white/5 to-white/[0.02] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative group cursor-default overflow-hidden"
        >
          {/* Inner ambient card glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-sky-500/10 via-purple-500/5 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none" />

          <motion.div
            ref={mockupRef}
            style={{ 
              rotateX: tiltX, 
              rotateY: tiltY,
              transformStyle: "preserve-3d"
            }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="w-full bg-[#070708]/90 border border-white/5 rounded-[2rem] aspect-[16/10] overflow-hidden flex shadow-2xl relative"
          >
            {/* Sidebar Mockup panel */}
            <div className="w-[18%] sm:w-[15%] h-full border-r border-white/5 bg-[#0a0a0c]/60 p-3 flex flex-col gap-5 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-500/80" />
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-yellow-500/80" />
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1.5 sm:h-2.5 rounded bg-white/${i === 1 ? '10' : '5'} w-${i === 1 ? '4/5' : i === 2 ? '2/3' : '1/2'}`} />
                ))}
              </div>
            </div>

            {/* Main Mockup Dashboard content */}
            <div className="flex-1 h-full p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 bg-gradient-to-br from-[#0c0c0f]/80 to-transparent">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 sm:h-4 bg-white/10 rounded w-28 sm:w-40" />
                  <div className="h-2 bg-white/5 rounded w-16 sm:w-24" />
                </div>
                <div className="h-6 sm:h-8 w-16 sm:w-20 bg-sky-500/10 border border-sky-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-[8px] sm:text-[10px] font-mono text-sky-400">ACTIVE</span>
                </div>
              </div>

              {/* Glowing Interactive Widgets grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { icon: Activity, title: "SYSTEM PULSE", val: "99.9%", col: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { icon: Cpu, title: "CORE LOAD", val: "14.2 ms", col: "text-sky-400", bg: "bg-sky-500/10" },
                  { icon: Shield, title: "DATA INTEGRITY", val: "SECURE", col: "text-purple-400", bg: "bg-purple-500/10" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/[0.01] border border-white/5 p-2 sm:p-4 rounded-xl flex flex-col gap-1 sm:gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${item.bg}`}>
                        <item.icon size={10} className={item.col} />
                      </div>
                      <span className="text-[6px] sm:text-[8px] font-mono text-gray-500 uppercase tracking-widest hidden sm:inline">{item.title}</span>
                    </div>
                    <span className="text-[10px] sm:text-lg font-bold text-white tracking-tight mt-1">{item.val}</span>
                  </div>
                ))}
              </div>

              {/* Lower mock system logs log stream */}
              <div className="flex-1 bg-[#050506]/95 border border-white/5 rounded-xl p-3 flex flex-col gap-1.5 sm:gap-2.5 font-mono text-[7px] sm:text-[10px] text-sky-200/40 relative overflow-hidden">
                <div className="absolute top-2 right-3 flex items-center gap-1">
                  <Terminal size={10} className="text-sky-400 animate-pulse" />
                  <span className="text-[6px] sm:text-[8px] text-sky-400/80">KRYTO_OS v2.4</span>
                </div>
                <div className="text-sky-400/80">&gt; npm run dev --architecture=premium</div>
                <div className="text-white/60">&gt; Booting visitors grid visual layout... Success (34ms)</div>
                <div className="text-purple-400/60">&gt; Binding Lenis scroll controllers to 3D spring transformations...</div>
                <div className="text-emerald-400/60">&gt; Status 200: Direct DB callback listeners configured.</div>
                <div className="animate-pulse text-sky-400/30 font-bold">&gt; Active connection initialized. System running... _</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 4. Elegant Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[8px] sm:text-[10px] text-sky-400/40 uppercase tracking-widest font-mono">SCROLL SYSTEM</span>
        <div className="w-[1px] h-12 bg-sky-500/20 overflow-hidden relative">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-full h-full bg-sky-400 absolute top-0 left-0"
          />
        </div>
      </div>
    </section>
  );
}
