import { useState, useEffect } from "react";
import {
  Award,
  Flame,
  Gem,
  Shield,
  ShieldCheck,
  Trophy,
  Sparkles,
  Search,
  CheckSquare,
  MessageSquare,
  ThumbsUp,
  FileCheck,
  Calendar,
  Crown,
  Zap,
  Check,
  Share2,
  Download,
  Info,
  Mail,
  ChevronRight,
  UserCheck,
  X,
  AlertCircle,
  Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";

// SafeRide Badge Interface
export interface SafeRideBadge {
  id: string;
  name: string;
  description: string;
  category: "getting-started" | "community-trust" | "verification" | "safety-contributions" | "responsible-reporting" | "longevity" | "rare";
  requirements: string;
  unlocked: boolean;
  dateEarned?: string;
  points: number;
  icon: any; 
  color: string; 
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Legend";
  progress: number;
  maxProgress: number;
  rare?: boolean;
}

// Simulated Reward Email Interface
interface RewardEmail {
  id: string;
  badgeName: string;
  description: string;
  dateEarned: string;
  sentAt: string;
  certificateId: string;
}

interface SafetyJourneyProps {
  isDark: boolean;
  highContrast: boolean;
  userName: string;
  userEmail: string;
  voiceAssist?: boolean;
  driversCount?: number;
  reportsCount?: number;
  recentSearchesCount?: number;
}

export default function SafetyJourney({
  isDark,
  highContrast,
  userName,
  userEmail,
  voiceAssist = false,
  driversCount = 12,
  reportsCount = 4,
  recentSearchesCount = 2,
}: SafetyJourneyProps) {
  // Page SubTabs: Badges Gallery, Certificates, Email Inbox Simulator
  const [activeSubTab, setActiveSubTab] = useState<"badges" | "certificates" | "emails">("badges");

  // User States (Persisted in LocalStorage)
  const [trustScore, setTrustScore] = useState<number>(() => {
    const saved = localStorage.getItem("saferide_trust_score");
    return saved ? parseInt(saved, 10) : 740;
  });

  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem("saferide_xp");
    return saved ? parseInt(saved, 10) : 580;
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem("saferide_streak");
    return saved ? parseInt(saved, 10) : 7;
  });

  const [verificationsCount, setVerificationsCount] = useState<number>(() => {
    const saved = localStorage.getItem("saferide_verifications");
    return saved ? parseInt(saved, 10) : 12;
  });

  const [reviewsCount, setReviewsCount] = useState<number>(() => {
    const saved = localStorage.getItem("saferide_reviews");
    return saved ? parseInt(saved, 10) : 6;
  });

  const [searchesCount, setSearchesCount] = useState<number>(() => {
    const saved = localStorage.getItem("saferide_searches");
    return saved ? parseInt(saved, 10) : 15;
  });

  const [approvedReports, setApprovedReports] = useState<number>(() => {
    const saved = localStorage.getItem("saferide_approved_reports");
    return saved ? parseInt(saved, 10) : reportsCount;
  });

  // Unlocked Badges state
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem("saferide_unlocked_badges");
    return saved ? JSON.parse(saved) : ["gs-member", "gs-first-search", "gs-profile", "trust-voice"];
  });

  // Email Inbox Simulator State
  const [emailLogs, setEmailLogs] = useState<RewardEmail[]>(() => {
    const saved = localStorage.getItem("saferide_emails");
    if (saved) return JSON.parse(saved);
    
    // Default pre-populated email rewards
    return [
      {
        id: "EML-001",
        badgeName: "Community Member",
        description: "Joined SafeRide Africa to make transportation transparent and secure.",
        dateEarned: "June 21, 2026",
        sentAt: "2026-06-21T10:15:00Z",
        certificateId: "SR-CERT-1092"
      },
      {
        id: "EML-002",
        badgeName: "First Search",
        description: "Performed your first driver lookup using the public safety registry.",
        dateEarned: "June 22, 2026",
        sentAt: "2026-06-22T14:30:00Z",
        certificateId: "SR-CERT-9921"
      }
    ];
  });

  const [selectedEmail, setSelectedEmail] = useState<RewardEmail | null>(null);
  const [badgeFilter, setBadgeFilter] = useState<string>("all");
  const [selectedBadge, setSelectedBadge] = useState<SafeRideBadge | null>(null);

  // Dynamic popup notifications for newly earned badges
  const [newBadgePopup, setNewBadgePopup] = useState<SafeRideBadge | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("saferide_trust_score", trustScore.toString());
    localStorage.setItem("saferide_xp", xp.toString());
    localStorage.setItem("saferide_streak", streakDays.toString());
    localStorage.setItem("saferide_verifications", verificationsCount.toString());
    localStorage.setItem("saferide_reviews", reviewsCount.toString());
    localStorage.setItem("saferide_searches", searchesCount.toString());
    localStorage.setItem("saferide_approved_reports", approvedReports.toString());
    localStorage.setItem("saferide_unlocked_badges", JSON.stringify(unlockedBadges));
    localStorage.setItem("saferide_emails", JSON.stringify(emailLogs));
  }, [trustScore, xp, streakDays, verificationsCount, reviewsCount, searchesCount, approvedReports, unlockedBadges, emailLogs]);

  const speakText = (text: string) => {
    if (voiceAssist && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Predefined Badge Definitions
  const BADGES_LIST: Omit<SafeRideBadge, "unlocked" | "progress" | "maxProgress" | "dateEarned">[] = [
    {
      id: "gs-member",
      name: "Community Member",
      description: "Joined SafeRide Africa to make transportation transparent and secure.",
      category: "getting-started",
      requirements: "Create an active user profile.",
      points: 50,
      icon: Trophy,
      color: "blue",
      tier: "Bronze",
    },
    {
      id: "gs-first-search",
      name: "First Search",
      description: "Performed your first driver lookup using the public safety registry.",
      category: "getting-started",
      requirements: "Search 1 driver license plate in the registry.",
      points: 50,
      icon: Search,
      color: "blue",
      tier: "Bronze",
    },
    {
      id: "gs-profile",
      name: "Identity Confirmed",
      description: "Completed your identity check to verify real citizen credentials.",
      category: "getting-started",
      requirements: "Submit your national ID or passport document.",
      points: 150,
      icon: UserCheck,
      color: "blue",
      tier: "Silver",
    },
    {
      id: "trust-voice",
      name: "Trusted Voice",
      description: "Your reports or comments have been upvoted as extremely helpful.",
      category: "community-trust",
      requirements: "Receive 5 helpful votes on reviews or incident reports.",
      points: 150,
      icon: ThumbsUp,
      color: "green",
      tier: "Bronze",
    },
    {
      id: "trust-guardian",
      name: "Trust Guardian",
      description: "Maintained a perfect commuter trust score with continuous clean rides.",
      category: "community-trust",
      requirements: "Reach and maintain a trust score above 900 points.",
      points: 500,
      icon: ShieldCheck,
      color: "green",
      tier: "Gold",
    },
    {
      id: "verify-auditor",
      name: "Senior Auditor",
      description: "Completed comprehensive verification audits on ridesharing drivers.",
      category: "verification",
      requirements: "Verify background certificates of at least 20 drivers.",
      points: 300,
      icon: CheckSquare,
      color: "purple",
      tier: "Platinum",
    },
    {
      id: "report-evidence",
      name: "High Integrity Reporter",
      description: "Logged a community hazard or incident report backed by photographic evidence.",
      category: "responsible-reporting",
      requirements: "Submit 1 moderator-approved safety report with attachments.",
      points: 150,
      icon: FileCheck,
      color: "red",
      tier: "Silver",
    },
    {
      id: "streak-7",
      name: "7-Day safety Streak",
      description: "Looked up plates and secured your transit consistently for a week.",
      category: "longevity",
      requirements: "Maintain 7 days active checking streak.",
      points: 100,
      icon: Flame,
      color: "orange",
      tier: "Bronze",
    },
    {
      id: "rare-guardian-africa",
      name: "Guardian of Africa",
      description: "The highest safety achievement. Your audits help keep millions of commuters safe.",
      category: "rare",
      requirements: "Earn 1,000 total experience points and verify 50 driver licenses.",
      points: 1000,
      icon: Crown,
      color: "yellow",
      tier: "Legend",
      rare: true,
    }
  ];

  // Map progress dynamically
  const getBadgeProgress = (id: string) => {
    switch (id) {
      case "gs-member": return { progress: 1, maxProgress: 1 };
      case "gs-first-search": return { progress: Math.min(1, searchesCount), maxProgress: 1 };
      case "gs-profile": return { progress: 1, maxProgress: 1 };
      case "trust-voice": return { progress: 5, maxProgress: 5 };
      case "trust-guardian": return { progress: trustScore, maxProgress: 900 };
      case "verify-auditor": return { progress: verificationsCount, maxProgress: 20 };
      case "report-evidence": return { progress: approvedReports >= 1 ? 1 : 0, maxProgress: 1 };
      case "streak-7": return { progress: streakDays, maxProgress: 7 };
      case "rare-guardian-africa": return { progress: verificationsCount, maxProgress: 50 };
      default: return { progress: 0, maxProgress: 1 };
    }
  };

  const badges: SafeRideBadge[] = BADGES_LIST.map((b) => {
    const p = getBadgeProgress(b.id);
    const isUnlocked = unlockedBadges.includes(b.id) || p.progress >= p.maxProgress;
    return {
      ...b,
      unlocked: isUnlocked,
      dateEarned: isUnlocked ? "June 24, 2026" : undefined,
      progress: p.progress,
      maxProgress: p.maxProgress,
    };
  });

  // Trigger Badge earning simulation manually to satisfy any user check
  const simulateEarnBadge = (badgeId: string) => {
    const badge = badges.find(b => b.id === badgeId);
    if (!badge) return;

    if (unlockedBadges.includes(badgeId)) {
      speakText(`The ${badge.name} badge is already unlocked and fully certified.`);
      return;
    }

    // Unlock
    const updatedUnlocked = [...unlockedBadges, badgeId];
    setUnlockedBadges(updatedUnlocked);
    setXp((prev) => prev + badge.points);
    setTrustScore((prev) => Math.min(1000, prev + 30));

    // Create reward email log
    const certId = `SR-CERT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEmail: RewardEmail = {
      id: `EML-${Math.floor(100 + Math.random() * 900)}`,
      badgeName: badge.name,
      description: badge.description,
      dateEarned: "June 24, 2026",
      sentAt: new Date().toISOString(),
      certificateId: certId
    };

    setEmailLogs((prev) => [newEmail, ...prev]);
    setNewBadgePopup(badge);
    speakText(`Congratulations! You earned the ${badge.name} badge. A certificate has been dispatched to ${userEmail}.`);
    
    // Automatically dismiss popup after 5 seconds
    setTimeout(() => {
      setNewBadgePopup(null);
    }, 5000);
  };

  // PDF Certificate Generator using jsPDF
  const downloadCertificate = (badgeName: string, certificateId: string) => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4"
      });

      const verificationNumber = Math.floor(100000 + Math.random() * 900000);

      // Cream canvas background
      doc.setFillColor(252, 251, 247); 
      doc.rect(20, 20, 801.89, 555.28, "F");

      // Gold Double Borders
      doc.setDrawColor(212, 175, 55); 
      doc.setLineWidth(3);
      doc.rect(25, 25, 791.89, 545.28);

      doc.setDrawColor(10, 15, 31); 
      doc.setLineWidth(1);
      doc.rect(30, 30, 781.89, 535.28);

      // Ornate corners
      doc.line(40, 30, 40, 50);
      doc.line(30, 40, 50, 40);
      doc.line(801.89, 30, 801.89, 50);
      doc.line(811.89, 40, 791.89, 40);

      // logo header
      doc.setTextColor(10, 15, 31);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.text("S R A", 420, 75, { align: "center" });

      doc.setFontSize(13);
      doc.text("SAFE RIDE AFRICA", 420, 95, { align: "center" });

      doc.setFont("Helvetica", "italic");
      doc.setFontSize(8);
      doc.text("KNOW BEFORE YOU GO", 420, 107, { align: "center" });

      // Certificate Title
      doc.setTextColor(212, 175, 55); 
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(26);
      doc.text("CERTIFICATE OF TRANSIT TRUST", 420, 155, { align: "center" });

      doc.setTextColor(80, 80, 80);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);
      doc.text("This official credential certifies that peer commuter", 420, 195, { align: "center" });

      // User name
      doc.setTextColor(10, 15, 31);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(26);
      doc.text(userName, 420, 235, { align: "center" });

      // Name divider line
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(1.5);
      doc.line(250, 245, 590, 245);

      // Description
      doc.setTextColor(80, 80, 80);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);
      const descText = `has successfully achieved the ${badgeName} milestone. By maintaining outstanding standards of passenger vigilance, performing verified driver credential audits, and contributing responsibly to Africa's public transport safety registry, they have fostered a secure, transparent, and trusted environment.`;
      const splitDesc = doc.splitTextToSize(descText, 560);
      doc.text(splitDesc, 420, 275, { align: "center" });

      // Metadata block
      doc.setTextColor(120, 120, 120);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("REGISTRY INFORMATION", 100, 395);
      doc.setFont("Helvetica", "normal");
      doc.text(`Certificate ID: ${certificateId}`, 100, 410);
      doc.text(`Verification Ref: SRA-REF-${verificationNumber}`, 100, 425);
      doc.text(`Authority: SafeRide Africa Trust Network`, 100, 440);

      // Golden seal
      doc.setFillColor(212, 175, 55);
      doc.ellipse(420, 430, 24, 24, "F");
      doc.setTextColor(252, 251, 247);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("SRA", 420, 429, { align: "center" });
      doc.setFontSize(5);
      doc.text("TRUST SEAL", 420, 437, { align: "center" });

      // Signature line
      doc.setTextColor(120, 120, 120);
      doc.setFont("Helvetica", "bold");
      doc.text("OFFICIAL ISSUING SIGNATURE", 590, 395);
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(1);
      doc.line(590, 425, 730, 425);
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(9);
      doc.text("Director of Safety Operations", 590, 438);

      doc.save(`${badgeName.toLowerCase().replace(/\s+/g, "_")}_certificate.pdf`);
    } catch (err) {
      console.error("Certificate PDF Generation error: ", err);
    }
  };

  const filteredBadges = badges.filter((b) => {
    if (badgeFilter === "all") return true;
    if (badgeFilter === "unlocked") return b.unlocked;
    if (badgeFilter === "locked") return !b.unlocked;
    if (badgeFilter === "rare") return b.rare;
    return b.category === badgeFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans relative">
      
      {/* Floating Earned Badge Toast Popup */}
      <AnimatePresence>
        {newBadgePopup && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 max-w-sm bg-zinc-950 border-2 border-amber-500 rounded-2xl p-4 shadow-2xl flex items-center gap-4 text-white"
          >
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 shrink-0">
              <Trophy className="w-6 h-6 shrink-0 animate-bounce" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wider block">Badge Achieved!</span>
              <h4 className="text-sm font-black text-white">{newBadgePopup.name}</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">{newBadgePopup.description}</p>
              <span className="text-[9px] font-mono text-zinc-500 block mt-1.5">&rarr; Simulated email reward dispatched</span>
            </div>
            <button 
              onClick={() => setNewBadgePopup(null)}
              className="text-zinc-500 hover:text-white shrink-0 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Header */}
      <div>
        <span className="text-[9px] font-mono text-amber-500 font-extrabold uppercase tracking-widest block mb-1">
          Your Safety Journey
        </span>
        <h2 className="text-2xl font-bold tracking-tight">
          Achievements & Certifications
        </h2>
        <p className="text-xs text-zinc-400">
          Build trust, contribute to community safety, and help make transportation safer across Africa.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-850/80 pb-3">
        {[
          { id: "badges", label: "Hexagonal Badge Gallery" },
          { id: "certificates", label: "Verifiable Certificates" },
          { id: "emails", label: "Simulated Email Inbox" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id as any);
              speakText(`Showing ${tab.label}`);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? "bg-amber-500 text-black font-extrabold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* B. HEXAGONAL BADGES GALLERY */}
      {activeSubTab === "badges" && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Hexagonal Souvenirs</h3>
              <p className="text-[11px] text-zinc-500">Click a badge to audit specifications or trigger simulated achievement</p>
            </div>

            <div className="flex flex-wrap gap-1 bg-zinc-900 p-1 border border-zinc-800 rounded-xl">
              {[
                { id: "all", label: "All" },
                { id: "unlocked", label: "Unlocked" },
                { id: "locked", label: "Locked" },
                { id: "rare", label: "Rares" }
              ].map((filt) => (
                <button
                  key={filt.id}
                  onClick={() => setBadgeFilter(filt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wide transition-colors cursor-pointer ${
                    badgeFilter === filt.id
                      ? "bg-amber-500 text-black font-extrabold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {filt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hexagonal grid rendering */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredBadges.map((badge) => {
              const IconComp = badge.icon;
              return (
                <div 
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-5 border rounded-2xl text-center space-y-4 cursor-pointer group transition-all duration-300 hover:scale-[1.03] ${
                    badge.unlocked
                      ? "bg-zinc-950 border-amber-500/20 hover:border-amber-500/50 shadow-lg shadow-amber-500/[0.02]"
                      : "bg-zinc-950/20 border-zinc-900 opacity-60 hover:opacity-80"
                  }`}
                >
                  {/* Hexagon Wrapper */}
                  <div 
                    className={`w-20 h-20 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                      badge.unlocked
                        ? "bg-gradient-to-b from-amber-400 to-yellow-600 shadow-lg"
                        : "bg-zinc-800"
                    }`}
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                  >
                    <div 
                      className={`w-[74px] h-[74px] flex items-center justify-center ${
                        badge.unlocked ? "bg-zinc-950 text-amber-400" : "bg-zinc-900 text-zinc-500"
                      }`}
                      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                    >
                      <IconComp className="w-7 h-7" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{badge.name}</h4>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">{badge.tier} Tier</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-900 text-[10px] flex items-center justify-between text-zinc-400 font-mono">
                    <span>{badge.unlocked ? "Achieved" : `${badge.progress}/${badge.maxProgress}`}</span>
                    <span className="text-amber-500 font-bold">{badge.points} XP</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Badge Detailed Audit modal */}
          {selectedBadge && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 relative space-y-4">
                <button 
                  onClick={() => setSelectedBadge(null)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center shadow-lg">
                    {(() => {
                      const Icon = selectedBadge.icon;
                      return <Icon className="w-8 h-8 shrink-0" />;
                    })()}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedBadge.name}</h3>
                  <span className="text-[10px] font-mono uppercase text-amber-500 tracking-wider font-bold">
                    {selectedBadge.tier} Tier Rarity &bull; {selectedBadge.points} XP
                  </span>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-xl space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">DESCRIPTION</span>
                    <p className="text-zinc-300 leading-relaxed">{selectedBadge.description}</p>
                  </div>

                  <div className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-xl space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">SPECIFICATIONS</span>
                    <p className="text-zinc-300 leading-relaxed font-semibold">{selectedBadge.requirements}</p>
                  </div>
                </div>

                {/* Simulated Earning triggers to help test automated email triggers */}
                {!selectedBadge.unlocked ? (
                  <button
                    onClick={() => {
                      simulateEarnBadge(selectedBadge.id);
                      setSelectedBadge(null);
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer block"
                  >
                    Simulate Achievement Completion
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center font-bold">
                    ✓ Badge Certified on June 24, 2026
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* C. VERIFIABLE PRINTABLE CERTIFICATES */}
      {activeSubTab === "certificates" && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="p-5 bg-zinc-950/40 border border-zinc-850 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-white">Sovereign Safety Certification</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate and download landscape-oriented, vector-ornamented certificates in PDF format. Authenticate your safety contributions and share them on LinkedIn or regional networks.
            </p>
          </div>

          {/* List of certifiable milestones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {[
              { id: "CERT-001", title: "Platinum Safe Commuter", requirement: "Unlock Community Member badge", badgeId: "gs-member", certId: "SRA-CERT-1092" },
              { id: "CERT-002", title: "Regional Safety Auditor", requirement: "Complete 12 background audits", badgeId: "verify-auditor", certId: "SRA-CERT-3301" },
              { id: "CERT-003", title: "Community Guardian", requirement: "Log moderator-approved reports", badgeId: "report-evidence", certId: "SRA-CERT-9081" },
              { id: "CERT-004", title: "Sovereign Africa Defender", requirement: "Achieve top tier safety rank", badgeId: "rare-guardian-africa", certId: "SRA-CERT-7732" }
            ].map((cert) => {
              const associatedBadge = badges.find(b => b.id === cert.badgeId);
              const isEarned = associatedBadge?.unlocked;

              return (
                <div 
                  key={cert.id}
                  className={`p-5 border rounded-3xl flex flex-col justify-between space-y-4 ${
                    isEarned
                      ? "bg-zinc-950 border-amber-500/20 shadow-md"
                      : "bg-zinc-950/10 border-zinc-900 opacity-60"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 block font-bold uppercase tracking-widest">SAFERIDE CITATION</span>
                    <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{cert.requirement}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-900">
                    <span className="text-[10px] font-mono text-zinc-500">
                      {isEarned ? `Ref: ${cert.certId}` : "Locked"}
                    </span>

                    {isEarned ? (
                      <button
                        onClick={() => {
                          downloadCertificate(cert.title, cert.certId);
                          speakText(`Downloading certificate for ${cert.title}`);
                        }}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          simulateEarnBadge(cert.badgeId);
                        }}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[10px] font-mono uppercase tracking-wide rounded-lg transition-all cursor-pointer"
                      >
                        Unlock Milestone
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

        </div>
      )}

      {/* D. SIMULATED AUTOMATED EMAIL INBOX */}
      {activeSubTab === "emails" && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-3xl flex items-center gap-3">
            <Mail className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-white">Automated Email Registry</h3>
              <p className="text-xs text-zinc-400">View real-time rewards sent automatically to {userEmail} upon unlocking badges.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* List of sent emails */}
            <div className="lg:col-span-5 bg-zinc-950/60 border border-zinc-850 rounded-3xl p-4 space-y-2 max-h-[350px] overflow-y-auto">
              {emailLogs.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 space-y-1.5">
                  <Inbox className="w-8 h-8 mx-auto" />
                  <p className="text-xs font-semibold">Inbox is currently empty.</p>
                  <p className="text-[10px]">Unlock a badge to trigger automated reward emails.</p>
                </div>
              ) : (
                emailLogs.map((mail) => (
                  <div
                    key={mail.id}
                    onClick={() => setSelectedEmail(mail)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                      selectedEmail?.id === mail.id
                        ? "bg-amber-500/10 border-amber-500/40"
                        : "bg-zinc-900 border-zinc-850 hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>rewards@saferide.africa</span>
                      <span>{mail.sentAt.split("T")[0]}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white mt-1">Congratulations! You earned the {mail.badgeName} badge</h5>
                    <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{mail.description}</p>
                  </div>
                ))
              )}
            </div>

            {/* Email Viewer Area */}
            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-850 rounded-3xl overflow-hidden min-h-[350px] flex flex-col">
              {selectedEmail ? (
                <div className="flex-1 flex flex-col text-xs text-zinc-300">
                  
                  {/* Email Headers */}
                  <div className="p-4 bg-zinc-900 border-b border-zinc-850 space-y-1">
                    <p className="text-xs font-semibold text-white">
                      From: <span className="text-amber-500">rewards@saferide.africa</span>
                    </p>
                    <p className="text-xs font-semibold text-white">
                      To: <span className="text-zinc-300">{userEmail}</span>
                    </p>
                    <p className="text-xs font-bold text-white mt-2">
                      Subject: Congratulations! You earned the {selectedEmail.badgeName} badge!
                    </p>
                  </div>

                  {/* HTML Email Body Container */}
                  <div className="p-6 flex-1 bg-zinc-950 space-y-4">
                    <div className="max-w-md mx-auto p-5 bg-[#0A0F1F] border border-zinc-850 rounded-2xl space-y-4 text-center">
                      
                      <div className="text-center font-bold text-amber-500 text-lg tracking-wider">
                        SRA REWARDS
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-white font-bold text-sm">Congratulations, Commuter!</h4>
                        <p className="text-[11px] text-zinc-400">You achieved a premium milestone on the SafeRide Africa registry.</p>
                      </div>

                      <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1 inline-block w-full">
                        <span className="text-[9px] font-mono text-amber-500 uppercase font-black tracking-widest block">BADGE ACHIEVED</span>
                        <p className="font-bold text-white text-xs">{selectedEmail.badgeName}</p>
                        <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">{selectedEmail.description}</p>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-relaxed px-2">
                        Thank you for helping build a safer transportation ecosystem across Africa. Your active credentials have been verified and certified on-chain.
                      </p>

                      <div className="pt-3 border-t border-zinc-850/80">
                        <button
                          onClick={() => {
                            downloadCertificate(selectedEmail.badgeName, selectedEmail.certificateId);
                          }}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider text-[10px] rounded-xl cursor-pointer shadow-md inline-block"
                        >
                          Download Verified PDF Certificate
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500 space-y-2">
                  <Mail className="w-10 h-10 text-zinc-600 animate-pulse" />
                  <p className="text-xs font-bold">No Email Selected</p>
                  <p className="text-[10px] max-w-xs">Select an email from the left pane to view its verified reward template, details, and download link.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
