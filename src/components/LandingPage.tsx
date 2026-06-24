import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Search,
  AlertTriangle,
  Award,
  Users,
  TrendingUp,
  Volume2,
  VolumeX,
  FileText,
  CheckCircle2,
  Lock,
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronRight,
  Activity,
  Award as TrophyIcon,
  Fingerprint,
  Smartphone,
  Check,
  Download,
  Mail,
  Info
} from "lucide-react";

// Floating Paths Component for Investor-Ready Background Animation
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    d: `M-${200 - i * 8 * position} -${100 + i * 10}C-${
      200 - i * 8 * position
    } -${100 + i * 10} -${150 - i * 8 * position} ${150 - i * 10} ${
      100 - i * 8 * position
    } ${250 - i * 10}C${350 - i * 8 * position} ${350 - i * 10} ${
      400 - i * 8 * position
    } ${600 - i * 10} ${400 - i * 8 * position} ${600 - i * 10}`,
    color: `rgba(59, 130, 246, ${0.03 + i * 0.005})`,
    width: 0.5 + i * 0.05,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full text-blue-600 dark:text-amber-500 opacity-40"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="none"
      >
        <title>Dynamic Wave Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            initial={{ pathLength: 0.3, opacity: 0.2 }}
            animate={{
              pathLength: 1,
              opacity: [0.1, 0.4, 0.1],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Particle Canvas Component for interactive subtle floating nodes
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const setSize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    setSize();

    type P = { x: number; y: number; v: number; o: number; size: number };
    let ps: P[] = [];
    let raf = 0;

    const make = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.15 + 0.05,
      o: Math.random() * 0.25 + 0.1,
      size: Math.random() * 1.5 + 0.5,
    });

    const init = () => {
      ps = [];
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 20;
          p.v = Math.random() * 0.15 + 0.05;
          p.o = Math.random() * 0.25 + 0.1;
        }
        ctx.fillStyle = `rgba(59, 130, 246, ${p.o})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
    />
  );
}

interface LandingPageProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onNavigate: (tab: string) => void;
  onSearchSubmit: (query: string) => void;
  voiceAssist: boolean;
  setVoiceAssist: (enabled: boolean) => void;
  speak: (text: string) => void;
  reportsCount: number;
  driversCount: number;
  recentSearchesCount: number;
  isDark: boolean;
  highContrast: boolean;
  onSearchClick?: (query: string) => void;
}

export default function LandingPage({
  isLoggedIn,
  onLoginClick,
  onNavigate,
  onSearchSubmit,
  voiceAssist,
  setVoiceAssist,
  speak,
  reportsCount,
  driversCount,
  recentSearchesCount,
  isDark,
  highContrast,
  onSearchClick,
}: LandingPageProps) {
  const [activeSearchTab, setActiveSearchTab] = useState<"driver" | "plate" | "vehicle">("driver");
  const [searchVal, setSearchVal] = useState("");
  const [authRequiredMsg, setAuthRequiredMsg] = useState<string | null>(null);

  const getPlaceholder = () => {
    if (activeSearchTab === "driver") return "Enter Driver Name or ID (e.g., Sipho Khumalo)...";
    if (activeSearchTab === "plate") return "Enter Vehicle Registration / Plate Number (e.g., SD 92 RT GP)...";
    return "Enter Vehicle Make or Model (e.g., Toyota Corolla Quest)...";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;

    if (!isLoggedIn) {
      // Trigger Authentication Modal logic or display message
      setAuthRequiredMsg("Create an account or sign in to access SafeRide Africa's verification network.");
      speak("Authentication required. Create an account or sign in to access SafeRide Africa's verification network.");
      onLoginClick(); // Calls parent login modal prompt
      return;
    }

    // Authenticated: trigger the actual search
    onSearchSubmit(searchVal);
  };

  // If the user logs in while having a pending search, we can run it.
  useEffect(() => {
    if (isLoggedIn && searchVal && authRequiredMsg) {
      setAuthRequiredMsg(null);
      onSearchSubmit(searchVal);
    }
  }, [isLoggedIn]);

  const toggleVoice = () => {
    const nextState = !voiceAssist;
    setVoiceAssist(nextState);
    if (nextState) {
      speak("Voice guidance enabled. SafeRide Africa will assist your hands-free navigation.");
    } else {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Features detailed data list with SVG visuals built inline
  const showcaseFeatures = [
    {
      icon: Search,
      title: "Driver Search",
      description: "Instantly check independent driver credentials, historical trust indices, and municipal transport permits.",
      color: "blue",
      element: (
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono text-[10px] space-y-1 select-none">
          <div className="flex justify-between border-b border-blue-500/20 pb-1">
            <span>REGISTRY ID</span>
            <span className="font-bold">ZA-9821</span>
          </div>
          <div className="flex justify-between">
            <span>STATUS</span>
            <span className="text-emerald-500 font-bold">VERIFIED ACTIVE</span>
          </div>
        </div>
      )
    },
    {
      icon: Shield,
      title: "Verification System",
      description: "Dual-layer validation mechanism checking police clearance certificates, valid licenses, and active vehicle roadworthiness.",
      color: "emerald",
      element: (
        <div className="flex items-center gap-2.5 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <Fingerprint className="w-8 h-8 animate-pulse text-emerald-500" />
          <div className="text-[10px] font-sans">
            <p className="font-bold">Biometric Authenticated</p>
            <p className="opacity-80">98.4% Confidence Score</p>
          </div>
        </div>
      )
    },
    {
      icon: AlertTriangle,
      title: "Incident Reporting",
      description: "Anonymous or verified logging for deviations, plate mismatch, extra-app charging coersions, or reckless driving.",
      color: "red",
      element: (
        <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 text-red-600 dark:text-red-400 font-mono text-[10px] space-y-1">
          <span className="text-red-500 font-black flex items-center gap-1">⚠️ INCIDENT LOGGED</span>
          <p className="opacity-80 text-[9px] truncate">Unlicensed vehicle mismatch reported GP...</p>
        </div>
      )
    },
    {
      icon: TrophyIcon,
      title: "Achievements & Progress",
      description: "Earn experience points (XP) for verifying rides, and unlock rare trust badges that solidify your stature as a safety guardian.",
      color: "amber",
      element: (
        <div className="flex gap-1.5 overflow-x-auto py-1">
          {["gs-member", "gs-first-search", "trust-voice"].map((badge) => (
            <div key={badge} className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded text-[9px] font-mono font-bold whitespace-nowrap">
              🎖️ {badge.replace("gs-", "").replace("-", " ").toUpperCase()}
            </div>
          ))}
        </div>
      )
    },
    {
      icon: Compass,
      title: "Trust Scoring",
      description: "Advanced community-led grading ranging from 0 to 1000, derived securely from real traveler feedback and validated trip data.",
      color: "purple",
      element: (
        <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-600 dark:text-purple-400 text-center">
          <span className="text-xl font-bold font-mono tracking-tight text-purple-500 block">820 / 1000</span>
          <span className="text-[9px] font-mono uppercase opacity-70">EXCELLENT TRUST GRADE</span>
        </div>
      )
    },
    {
      icon: Users,
      title: "Community Contributions",
      description: "Crowdsourced logs and live metro alerts compiled dynamically to alert commuters about high-risk zones, roadblocks, or safe avenues.",
      color: "teal",
      element: (
        <div className="p-2 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] flex justify-between items-center">
          <span className="font-bold flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Commuter Net</span>
          <span className="bg-teal-500 text-white dark:text-teal-950 font-bold px-1.5 py-0.5 rounded text-[8px]">LIVE FEED</span>
        </div>
      )
    }
  ];

  return (
    <div className="relative w-full space-y-24 pb-20 overflow-hidden font-sans">
      
      {/* Dynamic interactive backdrop elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        <ParticleCanvas />
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 md:pt-20 lg:pt-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="sra-hero">
        <div className="lg:col-span-7 space-y-8 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-semibold select-none">
            <TrendingUp className="w-4 h-4 text-blue-500 animate-[bounce_1.5s_infinite]" />
            <span>Pan-African Safety Coalition • Verified Network</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-neutral-900 dark:text-white">
              Know Before <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-500">
                You Go
              </span>
            </h1>
            <p className="text-base md:text-lg text-neutral-600 dark:text-zinc-400 font-medium leading-relaxed max-w-xl">
              Verify transportation credentials, build deep community trust, and make safer, data-backed decisions before every journey.
            </p>
          </div>

          {/* DRIVER SEARCH FEATURE INSIDE HERO */}
          <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-neutral-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xl space-y-4 max-w-xl">
            <div className="flex gap-2 border-b border-neutral-100 dark:border-zinc-900 pb-2 overflow-x-auto">
              {[
                { id: "driver", label: "Search Driver" },
                { id: "plate", label: "Search Plate / Reg" },
                { id: "vehicle", label: "Search Vehicle Info" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSearchTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeSearchTab === tab.id
                      ? "bg-blue-600 text-white dark:bg-amber-500 dark:text-black font-extrabold"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full bg-neutral-50 dark:bg-zinc-900/60 border border-neutral-200 dark:border-zinc-800 rounded-xl pl-10 pr-3 py-3 text-xs md:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-amber-500/30 placeholder:text-neutral-400 dark:placeholder:text-zinc-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-black font-mono font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <AnimatePresence>
              {authRequiredMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5"
                >
                  <Lock className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed">
                    {authRequiredMsg}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => {
                if (isLoggedIn) {
                  onNavigate("search");
                } else {
                  onLoginClick();
                }
              }}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase bg-blue-600 text-white dark:bg-amber-500 dark:text-black hover:opacity-90 shadow-md transition-all cursor-pointer"
            >
              Get Started
            </button>
            <a
              href="#feature-showcase"
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase border border-neutral-300 dark:border-zinc-800 text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-900 shadow-sm transition-all text-center"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Dynamic Interactive Dashboard Mockup for Visual Richness */}
        <div className="lg:col-span-5 relative z-10 w-full flex justify-center">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-zinc-950 dark:to-zinc-900 border border-neutral-200 dark:border-zinc-800 p-6 rounded-3xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">[ SECURITY CONSOLE ]</span>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            </div>

            <div className="space-y-4">
              {/* Trust Index Metric */}
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-zinc-800/80 shadow-sm space-y-1">
                <span className="text-[8px] font-mono font-bold text-neutral-400 block uppercase">COMMUNITY TRUST SCORE</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-blue-600 dark:text-amber-500 tracking-tight">854</span>
                  <span className="text-neutral-400 text-xs font-mono">/ 1000</span>
                </div>
                <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  ✓ Exemplary Service Rating
                </p>
              </div>

              {/* Active alerts feed */}
              <div className="p-4 bg-red-500/5 dark:bg-red-500/10 rounded-2xl border border-red-500/10 space-y-1.5">
                <span className="text-[8px] font-mono font-bold text-red-500 block uppercase">CRITICAL TRAVELER WARNING</span>
                <p className="text-[11px] text-neutral-800 dark:text-zinc-200 font-bold leading-tight">Plate mismatch reported near airport corridors</p>
                <p className="text-[9px] text-neutral-400 leading-normal">Use on-app verified vehicle search only.</p>
              </div>

              {/* Quick statistics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800/60 rounded-xl text-center">
                  <span className="text-[18px] font-extrabold text-blue-600 dark:text-amber-500 block">50K+</span>
                  <span className="text-[9px] font-medium text-neutral-500">Verified Drivers</span>
                </div>
                <div className="p-3 bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800/60 rounded-xl text-center">
                  <span className="text-[18px] font-extrabold text-blue-600 dark:text-amber-500 block">200K+</span>
                  <span className="text-[9px] font-medium text-neutral-500">Safe Journeys</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SOCIAL PROOF / TRUST METRICS ================= */}
      <section className="max-w-7xl mx-auto px-6" id="sra-social-proof">
        <div className="bg-white/60 dark:bg-zinc-900/40 border border-neutral-200/80 dark:border-zinc-800 p-8 rounded-3xl backdrop-blur-md">
          <p className="text-center text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.25em] mb-8">
            SafeRide Africa Vital Statistics
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: `${driversCount}+`, label: "Verified Active Records" },
              { value: `${reportsCount}+`, label: "Community Incident Audits" },
              { value: `${recentSearchesCount}+`, label: "Weekly Safety Lookups" },
              { value: "4.9 / 5", label: "Commuter Trust Index" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-amber-500 tracking-tight">{stat.value}</p>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURE SHOWCASE ================= */}
      <section className="max-w-7xl mx-auto px-6 space-y-12" id="feature-showcase">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-amber-500 uppercase tracking-[0.25em] block">Comprehensive Safety Network</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">Empowering African Commuters</h2>
          <p className="text-sm md:text-base text-neutral-500 dark:text-zinc-400">
            A state-of-the-art suite of security mechanisms engineered for public transit trust, accountability, and seamless transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseFeatures.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-amber-500" />
                  </div>
                  <h3 className="font-bold text-neutral-900 dark:text-white text-base">{f.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed font-medium">
                    {f.description}
                  </p>
                </div>
                {f.element}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= VOICE ASSISTANT SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6" id="sra-voice-assistant">
        <div className="bg-gradient-to-br from-neutral-900 to-zinc-950 text-white p-8 md:p-12 rounded-3xl border border-neutral-800 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
          {/* Subtle audio waves illustration in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="space-y-6 lg:max-w-xl text-left z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Voice Guidance System</span>
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight">Hands-Free Accessibility</h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Designed for ease and security. Turn on Voice Guidance to hear auditory alerts, system confirmations, navigation guides, and safety warnings during transit. Fully accessibility-friendly and settings-controlled.
            </p>

            <div className="flex flex-wrap gap-4 items-center pt-2">
              <button
                type="button"
                onClick={toggleVoice}
                className={`px-5 py-3 rounded-xl font-bold font-mono text-xs uppercase transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                  voiceAssist
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "bg-blue-600 text-white hover:bg-blue-500 dark:bg-amber-500 dark:text-black dark:hover:bg-amber-400"
                }`}
              >
                {voiceAssist ? (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Voice Enabled</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Enable Voice Guidance</span>
                  </>
                )}
              </button>

              <div className="flex gap-4 text-xs font-mono text-zinc-500 font-bold uppercase">
                <span>• Hands-Free</span>
                <span>• Inclusive</span>
                <span>• Settings Controlled</span>
              </div>
            </div>
          </div>

          {/* Interactive CSS Audio Wave visualizer */}
          <div className="flex gap-1.5 items-end h-24 select-none z-10 shrink-0">
            {[4, 8, 12, 16, 20, 16, 12, 8, 4, 8, 14, 18, 12, 6, 10, 16, 8, 4].map((h, i) => (
              <motion.div
                key={i}
                animate={voiceAssist ? {
                  height: [h, h * 2, h * 0.5, h]
                } : { height: h }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.05,
                  ease: "easeInOut"
                }}
                className={`w-1 rounded-full ${
                  voiceAssist ? "bg-blue-500 dark:bg-amber-500" : "bg-neutral-800"
                }`}
                style={{ height: h }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRUST & CREDIBILITY (WHY WE EXIST) ================= */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="sra-credibility">
        <div className="lg:col-span-5 order-last lg:order-first relative">
          {/* Elegant SVG Graphic representing secure networks & trust scoring */}
          <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-6 rounded-3xl shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-zinc-900 pb-3">
              <span className="text-xs font-bold text-neutral-800 dark:text-zinc-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-amber-500" />
                Sovereign Trust Ledger
              </span>
              <span className="text-[9px] font-mono font-bold text-neutral-400">AES-256 ENCRYPTED</span>
            </div>

            <div className="space-y-4 font-mono text-[11px] text-neutral-600 dark:text-zinc-400">
              <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-2.5 rounded-lg border">
                <span>Community Verification</span>
                <span className="text-emerald-500 font-bold">✓ 100% SECURE</span>
              </div>
              <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-2.5 rounded-lg border">
                <span>Accountability Loop</span>
                <span className="text-emerald-500 font-bold">✓ ENFORCED</span>
              </div>
              <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-2.5 rounded-lg border">
                <span>Responsible Contributions</span>
                <span className="text-emerald-500 font-bold">✓ AUDITED</span>
              </div>
            </div>

            <p className="text-[10px] text-neutral-400 leading-normal font-sans text-center">
              Our open protocol and strict de-identification models prevent retaliation and guarantee high-verity statements.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6 text-left">
          <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-amber-500 uppercase tracking-[0.25em] block">Mission Statement & Architecture</span>
          <h3 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">Why SafeRide Africa Exists</h3>
          <p className="text-sm md:text-base text-neutral-500 dark:text-zinc-400 leading-relaxed font-medium">
            Modern commuter travel lacks standardized accountability. Plate fraud, fake profiles, and unregistered operations compromise safety daily.
          </p>
          <p className="text-sm md:text-base text-neutral-500 dark:text-zinc-400 leading-relaxed font-medium">
            SafeRide Africa fills this gap by constructing a robust, crowdsourced, and moderated directory of rideshare and vehicle records. By prioritizing transparency and responsible reporting, we compile clean, sovereign data indices that safeguard travelers across the continent.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              "Community Verification Loop",
              "Unbiased Transparancy",
              "Absolute Accountability",
              "Sovereign Safety Infrastructure"
            ].map((t, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-zinc-300 font-bold">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ACHIEVEMENTS SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="sra-achievements">
        <div className="lg:col-span-7 space-y-6 text-left">
          <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-amber-500 uppercase tracking-[0.25em] block">Sovereign Traveler Prestige</span>
          <h3 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">Badge Collections & Certification</h3>
          <p className="text-sm md:text-base text-neutral-500 dark:text-zinc-400 leading-relaxed font-medium">
            Your vigilance shouldn't go unnoticed. Accumulate Experience Points (XP) for verifying plates and reporting protocol breaches. Unlock prestigious digital safety badges and download validated certificates of honor.
          </p>
          
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-neutral-400 block uppercase tracking-wider">Example Badge Progression</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "First Search", emoji: "🔍", desc: "Initiated first plate check" },
                { name: "Safety Voice", emoji: "🎙️", desc: "Active voice guide commuter" },
                { name: "Vigilant Scout", emoji: "🛡️", desc: "Logged 3 verified audits" },
                { name: "Elite Guardian", emoji: "🎖️", desc: "Top safety trust index" }
              ].map((badge, idx) => (
                <div key={idx} className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-4 rounded-2xl text-center space-y-2 shadow-sm">
                  <span className="text-2xl block">{badge.emoji}</span>
                  <div>
                    <h5 className="font-bold text-neutral-900 dark:text-white text-xs">{badge.name}</h5>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-normal font-medium">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificate Mockup Preview */}
        <div className="lg:col-span-5 relative">
          <div className="bg-white text-slate-900 border-8 border-double border-amber-600 p-6 md:p-8 rounded-xl shadow-2xl relative select-none font-serif text-center max-w-sm mx-auto">
            {/* SafeRide Seal */}
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center font-bold text-[9px] text-amber-600 uppercase font-sans tracking-tight">
              SEAL
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-sans font-bold text-amber-600 uppercase tracking-widest block leading-none">CERTIFICATE OF RECOGNITION</span>
                <h4 className="text-xl font-bold font-serif text-slate-800 mt-2">SafeRide Africa</h4>
              </div>

              <div className="h-[1px] bg-slate-200 w-1/2 mx-auto" />

              <p className="text-[11px] italic text-slate-500 font-sans leading-relaxed">
                This document honors a verified citizen traveler for exemplary contributions to regional transport vigilance, maintaining roadworthiness awareness, and supporting the safety network.
              </p>

              <div>
                <p className="text-[9px] font-sans text-slate-400 block uppercase">RECIPIENT ACCOUNT</p>
                <p className="text-xs font-bold text-slate-800 font-sans">verified-commuter@saferide.africa</p>
              </div>

              <div className="flex justify-between items-end pt-4 font-sans text-[8px] text-slate-400">
                <div>
                  <p className="font-bold border-t border-slate-200 pt-1">SafeRide Board</p>
                  <p>Trust Committee</p>
                </div>
                <div>
                  <p className="font-bold border-t border-slate-200 pt-1 font-mono">2026-06-24</p>
                  <p>Issue Date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PREMIUM SaaS FOOTER ================= */}
      <footer className="w-full bg-neutral-950 dark:bg-black border-t border-neutral-900 pt-16 pb-8 px-6 mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-neutral-900 pb-12 mb-8">
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-extrabold font-sans text-lg tracking-wider">SafeRide Africa</span>
            </div>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed max-w-xs">
              Continental trust and safety registry for rideshare commuter transport. Building high-verity data networks to protect travelers across Africa.
            </p>
            <div className="text-[10px] font-mono text-neutral-500 uppercase">
              Slogan: Know Before You Go
            </div>
          </div>

          {/* Platform utilities */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Verification Registry</h5>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <button onClick={() => onSearchClick?.("")} className="hover:text-amber-500 duration-150 transition-colors">
                  Check Driver Plate
                </button>
              </li>
              <li>
                <button onClick={() => onSearchClick?.("")} className="hover:text-amber-500 duration-150 transition-colors">
                  File Incident Statement
                </button>
              </li>
              <li>
                <button onClick={() => onSearchClick?.("")} className="hover:text-amber-500 duration-150 transition-colors">
                  Vigilance Badges
                </button>
              </li>
              <li>
                <button onClick={() => onSearchClick?.("")} className="hover:text-amber-500 duration-150 transition-colors">
                  Commuter Safety Center
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Compliance</h5>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium font-sans">
              <li className="hover:text-white cursor-pointer transition-colors">POPIA & GDPR Compliant</li>
              <li className="hover:text-white cursor-pointer transition-colors">Passenger Privacy Lock</li>
              <li className="hover:text-white cursor-pointer transition-colors">Moderator Guidelines</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Verification</li>
            </ul>
          </div>

          {/* Security details */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">System Integrity</h5>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              Every audit trail undergoes rigorous AI verification to safeguard professional independent operators from defamatory reports.
            </p>
            <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Row */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500 font-medium font-sans">
          <p>© 2026 SafeRide Africa. All sovereign rights reserved.</p>
          <p className="text-center md:text-right max-w-md">
            SafeRide Africa is an independent community safety network and is not affiliated with or endorsed by external ridesharing applications.
          </p>
        </div>
      </footer>

    </div>
  );
}
