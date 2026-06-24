/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UserRole, Driver, IncidentReport, DangerZoneHotspot, SafetyAlert, AboutMeData } from "./types";
import {
  INITIAL_DRIVERS,
  INITIAL_DANGER_ZONES,
  INITIAL_ALERTS,
  INITIAL_REPORTS,
  INITIAL_REVIEWS,
  AFRICAN_COUNTRIES,
} from "./mockData";

// Components
import DriverSearch from "./components/DriverSearch";
import IncidentReporting from "./components/IncidentReporting";
import ModeratorAdminPanel from "./components/ModeratorAdminPanel";
import SafeRideLogo from "./components/SafeRideLogo";
import SafetyJourney from "./components/SafetyJourney";
import AuthPage from "./components/AuthPage";
import LandingPage from "./components/LandingPage";
import UserProfilePage from "./components/UserProfilePage";
import SettingsPage from "./components/SettingsPage";
import AboutMePage from "./components/AboutMePage";
import LegalModal from "./components/LegalModal";

// Translations
import { AFRICAN_LANGUAGES, TRANSLATIONS } from "./utils/translations";

// Icons
import {
  Search,
  MapPin,
  AlertTriangle,
  LayoutDashboard,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Type,
  X,
  AlertCircle,
  HelpCircle,
  Trophy,
  User,
  LogOut,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Settings,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Volume2,
  VolumeX,
  Info,
} from "lucide-react";

const DEFAULT_ABOUT_ME: AboutMeData = {
  fullName: "Ntobeko Zondi",
  title: "Computer Science Student | Software Developer",
  bio: "A highly motivated Computer Science student at the University of the Witwatersrand with experience in software development, cybersecurity, student leadership, and technology-driven community projects.\n\nCurrently pursuing a Bachelor of Science in Computer Science, focusing on software development, databases, programming, and emerging technologies.",
  witsProject: "Ntobeko has contributed to real-world software projects including the development of South Africa's first Computer Museum digital platform at Wits University, collaborating in a professional developer team to deliver a live public platform.",
  passion: "Passionate about cybersecurity, ethical hacking, artificial intelligence, and building technology solutions that improve communities.",
  leadership: "He has participated in cybersecurity competitions, software development initiatives, and student leadership roles, including academic leadership within Wits University.",
  phone1: "+27 72 311 8395",
  phone2: "+27 78 1896 415",
  email: "ntobekozondi99@gmail.com",
  location: "University of the Witwatersrand, Johannesburg, South Africa",
  linkedin: "linkedin.com/in/ntobeko-zondi-22769828b",
  languages: ["English", "IsiZulu"],
  profilePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300",
};

export default function App() {
  // Master database states
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem("saferide_drivers");
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [reports, setReports] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem("saferide_reports");
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [alerts, setAlerts] = useState<SafetyAlert[]>(() => {
    const saved = localStorage.getItem("saferide_alerts");
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("saferide_reviews_list");
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("saferide_recent_searches");
    return saved ? JSON.parse(saved) : ["SD 92 RT GP", "DRV-ZA-9821", "Sipho Khumalo"];
  });

  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem("saferide_unlocked_badges");
    return saved ? JSON.parse(saved) : ["gs-member", "gs-first-search", "gs-profile", "trust-voice"];
  });

  const [aboutMe, setAboutMe] = useState<AboutMeData>(() => {
    const saved = localStorage.getItem("saferide_about_me");
    return saved ? JSON.parse(saved) : DEFAULT_ABOUT_ME;
  });

  // Persistent storage synchronizer
  useEffect(() => {
    localStorage.setItem("saferide_drivers", JSON.stringify(drivers));
    localStorage.setItem("saferide_reports", JSON.stringify(reports));
    localStorage.setItem("saferide_alerts", JSON.stringify(alerts));
    localStorage.setItem("saferide_reviews_list", JSON.stringify(reviews));
    localStorage.setItem("saferide_recent_searches", JSON.stringify(recentSearches));
    localStorage.setItem("saferide_unlocked_badges", JSON.stringify(unlockedBadges));
    localStorage.setItem("saferide_about_me", JSON.stringify(aboutMe));
  }, [drivers, reports, alerts, reviews, recentSearches, unlockedBadges, aboutMe]);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("saferide_logged_in") === "true";
  });

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: "user" | "admin" } | null>(() => {
    const savedName = localStorage.getItem("saferide_user_name");
    const savedEmail = localStorage.getItem("saferide_user_email");
    const savedRole = localStorage.getItem("saferide_user_role") as "user" | "admin";
    if (savedName && savedEmail && savedRole) {
      return { name: savedName, email: savedEmail, role: savedRole };
    }
    return null;
  });

  // Perspective and Navigation
  const [portalMode, setPortalMode] = useState<"user" | "admin">(() => {
    const savedRole = localStorage.getItem("saferide_user_role");
    return savedRole === "admin" ? "admin" : "user";
  });
  
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedRole = localStorage.getItem("saferide_user_role");
    return savedRole === "admin" ? "insights" : "home";
  });

  // Multi-Language Support State
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem("saferide_language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("saferide_language", language);
  }, [language]);

  const t = (key: string) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS["en"]?.[key] || key;
  };

  // Password Visibility State for Modal
  const [showPassword, setShowPassword] = useState(false);

  // Legal Modal State
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState<"privacy" | "terms" | "cookies" | "disclosure" | "directory" | "certificate" | "editCookies" | "conduct">("privacy");

  const openLegalDoc = (type: typeof legalDocType) => {
    setLegalDocType(type);
    setIsLegalModalOpen(true);
    speak(`Opening document: ${type}`);
  };

  // Location context
  const [selectedCountryCode, setSelectedCountryCode] = useState("ZA");
  const [selectedCity, setSelectedCity] = useState("Johannesburg");

  // Accessibility States
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("saferide_is_dark") !== "false";
  });
  const [textSize, setTextSize] = useState<"normal" | "large" | "xl">("normal");
  const [isDyslexic, setIsDyslexic] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [voiceAssist, setVoiceAssist] = useState<boolean>(() => {
    return localStorage.getItem("saferide_voice_assist") === "true";
  });
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState<boolean>(false);

  // Authentication Modal states for unauthenticated users trying to search or visit tabs
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalIsSignUp, setAuthModalIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);
  const [initialSearchQuery, setInitialSearchQuery] = useState("");
  const [prefilledDriverId, setPrefilledDriverId] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  // Normal login input states
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Staff admin gateway inputs inside Modal
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Global user-friendly error state
  const [globalError, setGlobalError] = useState<{
    title: string;
    message: string;
    type: "error" | "warning" | "success" | "info";
  } | null>(null);

  // Trigger speech assistance
  const speak = (text: string) => {
    if (voiceAssist && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Keep dark theme class synced on HTML element for Tailwind CSS
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("saferide_is_dark", isDark.toString());
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("saferide_voice_assist", voiceAssist.toString());
  }, [voiceAssist]);

  // Log In / Sign Up handler
  const handleLogin = (name: string, email: string) => {
    setIsLoggedIn(true);
    setCurrentUser({ name, email, role: "user" });
    setPortalMode("user");
    localStorage.setItem("saferide_logged_in", "true");
    localStorage.setItem("saferide_user_name", name);
    localStorage.setItem("saferide_user_email", email);
    localStorage.setItem("saferide_user_role", "user");
    
    // Close modal
    setIsAuthModalOpen(false);
    setAuthError(null);
    setAuthEmail("");
    setAuthName("");
    setAuthPassword("");
    
    speak(`Welcome to SafeRide Africa, ${name}. Your secure safety session has initiated.`);

    // Perform pending actions
    if (pendingSearch) {
      setInitialSearchQuery(pendingSearch);
      setActiveTab("search");
      setPendingSearch(null);
      setPendingTab(null);
      speak(`Automatically continuing your search for: ${pendingSearch}`);
    } else if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
      speak(`Automatically navigating to your requested tab.`);
    } else {
      setActiveTab("home");
    }
  };

  // Administrative Gateway Login handler
  const handleAdminLogin = () => {
    setIsLoggedIn(true);
    setCurrentUser({ name: "System Administrator", email: "admin@saferide.africa", role: "admin" });
    setPortalMode("admin");
    setActiveTab("insights");
    localStorage.setItem("saferide_logged_in", "true");
    localStorage.setItem("saferide_user_name", "System Administrator");
    localStorage.setItem("saferide_user_email", "admin@saferide.africa");
    localStorage.setItem("saferide_user_role", "admin");
    
    // Close modal
    setIsAuthModalOpen(false);
    setAuthError(null);
    setAdminUsername("");
    setAdminPassword("");
    setIsAdminMode(false);
    
    speak("Administrative access authorized. Loading SafeRide Operations Center.");
  };

  // Secure Sign Out handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPortalMode("user");
    setActiveTab("home");
    localStorage.removeItem("saferide_logged_in");
    localStorage.removeItem("saferide_user_name");
    localStorage.removeItem("saferide_user_email");
    localStorage.removeItem("saferide_user_role");
    speak("Securely logged out. Go safely.");
  };

  // Secure Modal submit
  const handleAuthModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (isAdminMode) {
      if (adminUsername === "admin" && adminPassword === "safeAfrica@2026") {
        handleAdminLogin();
      } else {
        setAuthError("Invalid administrative credentials. Access Denied.");
      }
    } else {
      if (!authEmail || !authPassword || (authModalIsSignUp && !authName)) {
        setAuthError("Please fill in all required fields.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) {
        setAuthError("Please enter a valid email address.");
        return;
      }
      if (authPassword.length < 6) {
        setAuthError("Password must be at least 6 characters long.");
        return;
      }

      const userName = authModalIsSignUp ? authName : authEmail.split("@")[0];
      handleLogin(userName, authEmail);
    }
  };

  // Tab change validator (for top SaaS navigation)
  const handleTabChange = (tab: string) => {
    if (tab === "home" || tab === "settings") {
      setActiveTab(tab);
      speak(`Viewing ${tab === "home" ? "SafeRide Home" : "Settings"}`);
      return;
    }

    if (!isLoggedIn) {
      setAuthMessage("Create an account or sign in to access SafeRide Africa's verification network.");
      setPendingTab(tab);
      setPendingSearch(null);
      setAuthModalIsSignUp(false);
      setIsAuthModalOpen(true);
      speak("Authentication required. Create an account or sign in to access SafeRide Africa's verification network.");
      return;
    }

    setActiveTab(tab);
    speak(`Navigating to ${tab}`);
  };

  // Landing Page Search proxy for non-authenticated users
  const handleLandingSearch = (query: string) => {
    if (!isLoggedIn) {
      setAuthMessage("Create an account or sign in to access SafeRide Africa's verification network.");
      setPendingSearch(query);
      setPendingTab(null);
      setAuthModalIsSignUp(false);
      setIsAuthModalOpen(true);
      speak("Authentication required. Create an account or sign in to access SafeRide Africa's verification network.");
      return;
    }

    // Authenticated: trigger immediately
    setInitialSearchQuery(query);
    setActiveTab("search");
    speak(`Initiating safety audit check for ${query}`);
  };

  // Core modification functions
  const handleAddReport = (newReport: IncidentReport) => {
    setReports((prev) => [newReport, ...prev]);
    speak(`Community safety report successfully logged for vehicle ID ${newReport.driverId}. Dispatching report data.`);
    setGlobalError({
      title: "Community Log Registered",
      message: "Thank you for contributing responsibly. Your safety report is queued for immediate moderator review.",
      type: "success"
    });
  };

  const handleModerateReport = (reportId: string, action: "approve" | "dismiss") => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return { ...r, status: action === "approve" ? "approved" : "dismissed" };
        }
        return r;
      })
    );
    speak(`Report ID ${reportId} moderated successfully as ${action}d.`);
  };

  const handleAddDriver = (newDriver: Driver) => {
    setDrivers((prev) => [newDriver, ...prev]);
    speak(`New driver record registered: ${newDriver.fullName}. Plate number ${newDriver.vehicle.licensePlate}.`);
  };

  const handleUpdateDrivers = (updatedDrivers: Driver[]) => {
    setDrivers(updatedDrivers);
  };

  const handleAddAlert = (newAlert: SafetyAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    speak(`Safety alert warning broadcasted: ${newAlert.title}.`);
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    speak("Safety warning cleared.");
  };

  // Location configurations
  const countryInfo = AFRICAN_COUNTRIES.find((c) => c.code === selectedCountryCode);

  // Styling helper classes for typography scaling
  const textScaleClass = 
    textSize === "large" 
      ? "text-[115%]" 
      : textSize === "xl" 
      ? "text-[130%]" 
      : "text-base";

  const dyslexicFontClass = isDyslexic ? "font-mono tracking-widest" : "font-sans";

  const bgThemeClass = highContrast
    ? "bg-black text-yellow-400"
    : isDark
    ? "bg-[#0A0F1F] text-zinc-100"
    : "bg-neutral-50 text-neutral-900";

  return (
    <div className={`min-h-screen flex flex-col transition-all ${bgThemeClass} ${textScaleClass} ${dyslexicFontClass}`}>
      
      {/* ================= PREMIUM SaaS STICKY HEADER ================= */}
      <header className={`sticky top-0 z-50 px-4 md:px-8 h-16 shrink-0 flex items-center justify-between border-b backdrop-blur-md select-none ${
        highContrast 
          ? "border-yellow-400 bg-black" 
          : isDark 
          ? "bg-[#0A0F1F]/90 border-zinc-900 shadow-sm" 
          : "bg-white/90 border-neutral-200 shadow-sm"
      }`}>
        {/* Left Side: Responsive Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => handleTabChange("home")} 
            className="flex items-center gap-2 outline-none focus:ring-0 cursor-pointer"
          >
            <SafeRideLogo variant="compact" />
          </button>

          {/* Regular Commuter Portal Navigation Links (In Header matching premium SaaS guidelines) */}
          {portalMode === "user" && (
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: t("search"), value: "search", icon: Search },
                { label: t("reports"), value: "reports", icon: AlertTriangle },
                { label: t("achievements"), value: "achievements", icon: Trophy },
                { label: t("profile"), value: "profile", icon: User },
                { label: t("settings"), value: "settings", icon: Sliders },
                { label: t("about"), value: "about", icon: Info },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => handleTabChange(item.value)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                      isActive 
                        ? "bg-amber-500 text-black font-extrabold shadow-sm" 
                        : "text-neutral-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-900/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Side Control Items */}
        <div className="flex items-center gap-2.5">
          {/* Multi-Language Selector Dropdown */}
          <div className="relative flex items-center gap-1 bg-zinc-900/35 dark:bg-zinc-900/60 border border-neutral-200/20 dark:border-zinc-800/80 px-2.5 py-1.5 rounded-xl" id="language-selector-wrapper">
            <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <select
              value={language}
              onChange={(e) => {
                const nextLang = e.target.value;
                setLanguage(nextLang);
                const langName = AFRICAN_LANGUAGES.find(l => l.code === nextLang)?.name || nextLang;
                speak(`Language changed to ${langName}`);
              }}
              className="bg-transparent text-[11px] font-extrabold pr-5 py-0 focus:outline-none cursor-pointer border-none outline-none text-neutral-700 dark:text-zinc-200"
              title="Select African Language"
            >
              {AFRICAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-200">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Voice Assist Toggle */}
          <button
            onClick={() => {
              setVoiceAssist(!voiceAssist);
              speak(`Voice assistance ${!voiceAssist ? "activated" : "deactivated"}`);
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              voiceAssist
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                : "text-neutral-400 hover:text-neutral-600 dark:text-zinc-400 dark:hover:text-white"
            }`}
            title="Toggle Voice Assistance"
          >
            {voiceAssist ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Quick Accessibility Toggle */}
          <button
            onClick={() => {
              setShowAccessibilityPanel(!showAccessibilityPanel);
              speak("Toggled Accessibility Quick Settings Panel");
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              showAccessibilityPanel
                ? "bg-amber-500 text-black border-amber-500"
                : isDark
                ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                : "bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900"
            }`}
            title="Accessibility Tools"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden xl:inline">Accessibility</span>
          </button>

          {/* Secure Operator Toggle (Visible only to Admin Roles) */}
          {isLoggedIn && currentUser?.role === "admin" && (
            <button
              onClick={() => {
                const nextMode = portalMode === "user" ? "admin" : "user";
                setPortalMode(nextMode);
                setActiveTab(nextMode === "admin" ? "insights" : "home");
                speak(`Switched session back to ${nextMode} interface.`);
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold font-mono uppercase transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm shadow-red-650/10"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{portalMode === "admin" ? "Rider App" : "Admin Hub"}</span>
            </button>
          )}

          {/* User Sign-In/Out Panel */}
          <div className="flex items-center gap-2 border-l border-neutral-200 dark:border-zinc-800 pl-3 shrink-0">
            {isLoggedIn ? (
              <>
                <div className="hidden md:block text-right">
                  <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-500 uppercase block tracking-wider font-extrabold leading-none">AUTHORIZED</span>
                  <span className="text-xs font-bold text-neutral-855 text-neutral-800 dark:text-zinc-100 truncate max-w-[120px] block mt-0.5">
                    {currentUser?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 dark:text-red-400 rounded-xl transition-all cursor-pointer border border-red-500/10"
                  title="Secure Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMessage("Create an account or sign in to access SafeRide Africa's verification network.");
                    setAuthModalIsSignUp(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-900 rounded-lg text-xs font-bold text-neutral-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthMessage("Create an account or sign in to access SafeRide Africa's verification network.");
                    setAuthModalIsSignUp(true);
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm shadow-amber-500/10"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ACCESSIBILITY BAR DRAWER */}
      {showAccessibilityPanel && (
        <div className={`border-b transition-all ${
          isDark ? "bg-zinc-950/80 border-zinc-900" : "bg-white border-neutral-200 shadow-inner"
        }`}>
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                <Type className="w-4 h-4" /> Text Scale Sizing
              </h4>
              <p className="text-[10px] text-zinc-500">Scale interface fonts for easier reading.</p>
              <div className="flex gap-1.5">
                {(["normal", "large", "xl"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setTextSize(sz);
                      speak(`Font size scaled to ${sz}`);
                    }}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      textSize === sz
                        ? "bg-amber-500 text-black"
                        : "bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Dyslexic Friendly Layout
              </h4>
              <p className="text-[10px] text-zinc-500">Applies heavy base line characters to facilitate readability.</p>
              <button
                onClick={() => {
                  setIsDyslexic(!isDyslexic);
                  speak(`Dyslexia high legibility font ${!isDyslexic ? "activated" : "deactivated"}`);
                }}
                className={`w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  isDyslexic ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                {isDyslexic ? "ACTIVE" : "APPLY DYSLEXIA TEXT"}
              </button>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Contrast Optimizer
              </h4>
              <p className="text-[10px] text-zinc-500">Maximum visibility contrast colors.</p>
              <button
                onClick={() => {
                  setHighContrast(!highContrast);
                  speak(`High contrast mode ${!highContrast ? "activated" : "deactivated"}`);
                }}
                className={`w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  highContrast ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                {highContrast ? "ACTIVE" : "APPLY HIGH CONTRAST"}
              </button>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                <Sun className="w-4 h-4" /> Dark & Light Scheme
              </h4>
              <p className="text-[10px] text-zinc-500">Modify overall screen brightness.</p>
              <button
                onClick={() => {
                  setIsDark(!isDark);
                  speak(`Switched to ${!isDark ? "Light" : "Dark"} mode`);
                }}
                className="w-full py-1.5 rounded-lg text-xs font-bold bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
              >
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MOBILE HEADER NAVIGATION BAR (Visible only on smaller screens for authenticated users) */}
      {isLoggedIn && portalMode === "user" && (
        <div className={`lg:hidden border-b flex items-center justify-around py-2 px-2 shrink-0 ${
          isDark ? "bg-[#0A0F1F] border-zinc-900" : "bg-white border-neutral-200"
        }`}>
          {[
            { label: t("home"), value: "home", icon: LayoutDashboard },
            { label: t("search"), value: "search", icon: Search },
            { label: t("reports"), value: "reports", icon: AlertTriangle },
            { label: t("achievements"), value: "achievements", icon: Trophy },
            { label: t("about"), value: "about", icon: Info },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.value;
            return (
              <button
                key={item.value}
                onClick={() => handleTabChange(item.value)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive ? "text-amber-500 font-bold scale-105" : "text-neutral-500 dark:text-zinc-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] uppercase tracking-wider font-mono">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* COMPREHENSIVE TOAST / ALERT BANNER */}
      {globalError && (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-4 animate-fade-in">
          <div className={`p-4 rounded-2xl border flex items-start gap-4 shadow-lg relative ${
            globalError.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-200"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
          }`}>
            <AlertCircle className={`w-5 h-5 shrink-0 ${globalError.type === "error" ? "text-red-400" : "text-emerald-400"}`} />
            <div className="space-y-1 pr-6 flex-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-current">{globalError.title}</h4>
              <p className="text-xs leading-relaxed font-sans opacity-90">{globalError.message}</p>
            </div>
            <button
              onClick={() => setGlobalError(null)}
              className="absolute top-3.5 right-3.5 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= GEOGRAPHIC BAR OVERVIEW FOR USER MODULES ================= */}
      {isLoggedIn && portalMode === "user" && activeTab !== "home" && (
        <div className={`px-4 md:px-8 py-2 border-b flex flex-wrap items-center justify-between gap-4 text-xs font-semibold ${
          isDark ? "bg-zinc-950/40 border-zinc-900 text-zinc-300" : "bg-neutral-100/50 border-neutral-200 text-slate-700"
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Active Verification Jurisdiction:</span>
            <span className="text-amber-500 dark:text-amber-400 font-bold">{countryInfo?.name} ({selectedCity})</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Country Swapper */}
            <select
              value={selectedCountryCode}
              onChange={(e) => {
                setSelectedCountryCode(e.target.value);
                const defaultCity = AFRICAN_COUNTRIES.find(c => c.code === e.target.value)?.cities[0] || "";
                setSelectedCity(defaultCity);
                speak(`Jurisdiction sector changed to ${AFRICAN_COUNTRIES.find(c => c.code === e.target.value)?.name}`);
              }}
              className="bg-transparent text-[11px] font-bold font-mono uppercase outline-none border border-neutral-300 dark:border-zinc-800 rounded px-2.5 py-1 cursor-pointer text-current"
            >
              {AFRICAN_COUNTRIES.map((country) => (
                <option key={country.code} value={country.code} className={isDark ? "bg-zinc-900 text-white" : "bg-white text-slate-800"}>
                  {country.name}
                </option>
              ))}
            </select>

            {/* Metro Swapper */}
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                speak(`City corridor changed to ${e.target.value} metro area`);
              }}
              className="bg-transparent text-[11px] font-bold font-mono uppercase outline-none border border-neutral-300 dark:border-zinc-800 rounded px-2.5 py-1 cursor-pointer text-current"
            >
              {countryInfo?.cities.map((city) => (
                <option key={city} value={city} className={isDark ? "bg-zinc-900 text-white" : "bg-white text-slate-800"}>
                  {city} Metro
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ================= MAIN APPLICATION VIEW LAYOUT ================= */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* CONDITIONAL SIDEBAR (Visible ONLY in Admin Portal Mode) */}
        {portalMode === "admin" && (
          <aside className={`w-full md:w-64 border-r shrink-0 flex flex-col justify-between p-4 ${
            highContrast ? "border-yellow-400 bg-black" : isDark ? "bg-zinc-950/40 border-zinc-900" : "bg-white border-neutral-200 shadow-sm"
          }`}>
            <nav className="space-y-2">
              <span className="text-[9px] font-mono font-extrabold tracking-widest text-zinc-500 uppercase block px-4 mb-2">OPERATIONS WORKSPACE</span>
              
              <button
                onClick={() => setActiveTab("insights")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-xs font-bold cursor-pointer ${
                  activeTab === "insights" ? "bg-red-600 text-white font-extrabold shadow-md" : "text-zinc-400 hover:text-white hover:bg-zinc-900/55"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Core Analytics
              </button>

              <button
                onClick={() => setActiveTab("moderation")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-xs font-bold cursor-pointer ${
                  activeTab === "moderation" ? "bg-red-600 text-white font-extrabold shadow-md" : "text-zinc-400 hover:text-white hover:bg-zinc-900/55"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Moderation Queue
              </button>

              <button
                onClick={() => setActiveTab("drivers")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-xs font-bold cursor-pointer ${
                  activeTab === "drivers" ? "bg-red-600 text-white font-extrabold shadow-md" : "text-zinc-400 hover:text-white hover:bg-zinc-900/55"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Driver Score Manager
              </button>

              <button
                onClick={() => setActiveTab("alerts")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-xs font-bold cursor-pointer ${
                  activeTab === "alerts" ? "bg-red-600 text-white font-extrabold shadow-md" : "text-zinc-400 hover:text-white hover:bg-zinc-900/55"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Broadcast Warnings
              </button>
            </nav>

            <div className="pt-4 border-t border-zinc-900 text-center select-none space-y-2">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">Secure Staff Gateway</span>
              <p className="text-[10px] text-zinc-400 font-bold font-mono">POPIA CORRIDOR</p>
            </div>
          </aside>
        )}

        {/* CONTENT MAIN DISPLAY AREA (Full width for normal users!) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {portalMode === "user" ? (
            /* USER PORTAL RENDER CORRIDOR */
            <>
              {activeTab === "home" && (
                <LandingPage
                  isLoggedIn={isLoggedIn}
                  onLoginClick={() => {
                    setAuthMessage("Create an account or sign in to access SafeRide Africa's verification network.");
                    setAuthModalIsSignUp(false);
                    setIsAuthModalOpen(true);
                  }}
                  onNavigate={handleTabChange}
                  onSearchSubmit={handleLandingSearch}
                  voiceAssist={voiceAssist}
                  setVoiceAssist={setVoiceAssist}
                  speak={speak}
                  reportsCount={reports.length}
                  driversCount={drivers.length}
                  recentSearchesCount={recentSearches.length}
                  isDark={isDark}
                  highContrast={highContrast}
                  onSearchClick={handleLandingSearch}
                />
              )}

              {activeTab === "search" && (
                <DriverSearch
                  drivers={drivers}
                  reviews={reviews}
                  reports={reports}
                  alerts={alerts}
                  selectedCountry={selectedCountryCode}
                  selectedCity={selectedCity}
                  initialSearchQuery={initialSearchQuery}
                  onChangeTab={(tab) => {
                    handleTabChange(tab);
                  }}
                  onReportIncident={(driverId) => {
                    setPrefilledDriverId(driverId);
                    handleTabChange("reports");
                  }}
                />
              )}

              {activeTab === "reports" && (
                <IncidentReporting
                  drivers={drivers}
                  selectedCountry={selectedCountryCode}
                  selectedCity={selectedCity}
                  onAddReport={handleAddReport}
                  prefilledDriverId={prefilledDriverId}
                  clearPrefilledDriverId={() => setPrefilledDriverId(null)}
                />
              )}

              {activeTab === "about" && (
                <AboutMePage data={aboutMe} />
              )}

              {activeTab === "achievements" && (
                <SafetyJourney
                  isDark={isDark}
                  highContrast={highContrast}
                  userName={currentUser?.name || "Ntobeko Zondi"}
                  userEmail={currentUser?.email || "ntobekozondi98@gmail.com"}
                  voiceAssist={voiceAssist}
                  driversCount={drivers.length}
                  reportsCount={reports.length}
                  recentSearchesCount={recentSearches.length}
                />
              )}

              {activeTab === "profile" && (
                <UserProfilePage
                  userName={currentUser?.name || "Ntobeko Zondi"}
                  userEmail={currentUser?.email || "ntobekozondi98@gmail.com"}
                  trustScore={820}
                  xp={1250}
                  streakDays={7}
                  unlockedBadgesCount={unlockedBadges.length}
                  recentSearches={recentSearches}
                  reportsCount={reports.length}
                  speak={speak}
                />
              )}

              {activeTab === "settings" && (
                <SettingsPage
                  isDark={isDark}
                  setIsDark={setIsDark}
                  voiceAssist={voiceAssist}
                  setVoiceAssist={setVoiceAssist}
                  textSize={textSize}
                  setTextSize={setTextSize}
                  isDyslexic={isDyslexic}
                  setIsDyslexic={setIsDyslexic}
                  highContrast={highContrast}
                  setHighContrast={setHighContrast}
                  speak={speak}
                />
              )}
            </>
          ) : (
            /* ADMIN PORTAL RENDER CORRIDOR */
            <ModeratorAdminPanel
              currentRole={UserRole.ADMIN}
              onChangeRole={() => {}}
              drivers={drivers}
              reports={reports}
              alerts={alerts}
              onModerateReport={handleModerateReport}
              onAddDriver={handleAddDriver}
              onUpdateDrivers={handleUpdateDrivers}
              onAddAlert={handleAddAlert}
              onDeleteAlert={handleDeleteAlert}
              selectedCity={selectedCity}
              selectedCountry={selectedCountryCode}
              activeTab={activeTab}
              onChangeTab={(tab) => setActiveTab(tab)}
              aboutMeData={aboutMe}
              onUpdateAboutMe={setAboutMe}
            />
          )}

        </main>

      </div>

      {/* ================= COMPLIANCE & LEGAL SAFETY FOOTER ================= */}
      <footer className={`py-4 px-4 md:px-8 border-t text-center text-[10px] font-semibold tracking-wide shrink-0 ${
        isDark ? "bg-zinc-950/40 border-zinc-900 text-zinc-500" : "bg-neutral-100 border-neutral-200 text-neutral-500"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} SafeRide Africa Operations Center. All Rights Reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-bold">
            <button type="button" onClick={() => openLegalDoc("privacy")} className="hover:text-amber-500 cursor-pointer bg-transparent border-none outline-none">{t("privacy")}</button>
            <span className="opacity-30">|</span>
            <button type="button" onClick={() => openLegalDoc("terms")} className="hover:text-amber-500 cursor-pointer bg-transparent border-none outline-none">{t("terms")}</button>
            <span className="opacity-30">|</span>
            <button type="button" onClick={() => openLegalDoc("cookies")} className="hover:text-amber-500 cursor-pointer bg-transparent border-none outline-none">{t("cookies")}</button>
            <span className="opacity-30">|</span>
            <button type="button" onClick={() => openLegalDoc("disclosure")} className="hover:text-amber-500 cursor-pointer bg-transparent border-none outline-none">{t("responsibleDisclosure")}</button>
            <span className="opacity-30">|</span>
            <button type="button" onClick={() => openLegalDoc("directory")} className="hover:text-amber-500 cursor-pointer bg-transparent border-none outline-none">{t("directory")}</button>
            <span className="opacity-30">|</span>
            <button type="button" onClick={() => openLegalDoc("certificate")} className="hover:text-amber-500 cursor-pointer bg-transparent border-none outline-none">{t("publicationCert")}</button>
            <span className="opacity-30">|</span>
            <button type="button" onClick={() => openLegalDoc("editCookies")} className="hover:text-amber-500 cursor-pointer bg-transparent border-none outline-none">{t("editCookies")}</button>
            <span className="opacity-30">|</span>
            <button type="button" onClick={() => openLegalDoc("conduct")} className="hover:text-amber-500 cursor-pointer bg-transparent border-none outline-none">{t("conduct")}</button>
          </div>
        </div>
      </footer>

      {/* ================= COMPLIANCE LEGAL MODAL ================= */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        documentType={legalDocType}
      />

      {/* ================= PREMIUM SaaS AUTHENTICATION MODAL ================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-zinc-950/95 border border-zinc-850 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-scale-up max-h-[95vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthError(null);
                setPendingTab(null);
                setPendingSearch(null);
              }}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Logo */}
            <div className="text-center space-y-1 mb-5">
              <div className="inline-block">
                <SafeRideLogo variant="full" />
              </div>
              <p className="text-[10px] text-zinc-400 tracking-widest font-mono uppercase mt-1">
                {t("knowBeforeYouGo")}
              </p>
            </div>

            {/* Custom Redirect Message (High emphasis) */}
            {authMessage && (
              <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center text-amber-300 text-xs font-semibold leading-relaxed">
                {authMessage}
              </div>
            )}

            {/* Form Title */}
            <div className="space-y-1 mb-4 text-center">
              <h2 className="text-lg font-extrabold tracking-tight text-white font-sans">
                {isAdminMode 
                  ? t("adminGateway") 
                  : authModalIsSignUp 
                    ? "Register Commuter Account" 
                    : t("secureAccess")}
              </h2>
              <p className="text-[11px] text-zinc-400">
                {isAdminMode 
                  ? "Staff operator gateway & central moderation portal" 
                  : "Verify plate credentials and protect community safety"}
              </p>
            </div>

            {/* Error alerts */}
            {authError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <p className="font-semibold">{authError}</p>
              </div>
            )}

            <form onSubmit={handleAuthModalSubmit} className="space-y-3.5">
              {isAdminMode ? (
                /* ADMIN/STAFF LOGIN MODE */
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
                      Admin Username
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                        <Terminal className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all placeholder:text-zinc-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
                      Security Token Code
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl py-2.5 pl-10 pr-10 text-xs font-semibold outline-none transition-all placeholder:text-zinc-600 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* USER LOGIN/SIGNUP MODE */
                <>
                  {authModalIsSignUp && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          required={authModalIsSignUp}
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="e.g. Ntobeko Zondi"
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all placeholder:text-zinc-600 text-white"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="e.g. ntobekozondi98@gmail.com"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all placeholder:text-zinc-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
                      Secure Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 pl-10 pr-10 text-xs font-semibold outline-none transition-all placeholder:text-zinc-600 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me switch */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="remember-me-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-zinc-800 bg-zinc-900 text-amber-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                    />
                    <label htmlFor="remember-me-checkbox" className="text-[10px] font-semibold text-zinc-400 cursor-pointer">
                      Remember secure session
                    </label>
                  </div>
                </>
              )}

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg mt-2 ${
                  isAdminMode 
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/10" 
                    : "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/10"
                }`}
              >
                <span>
                  {isAdminMode 
                    ? "Authorize admin security" 
                    : authModalIsSignUp 
                      ? "Create Citizen Profile" 
                      : "Begin SafeRide Session"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Google Sign-In & Toggles */}
            <div className="mt-4 pt-4 border-t border-zinc-850 text-center space-y-3">
              
              {!isAdminMode && (
                <>
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-zinc-800/80"></div>
                    <span className="flex-shrink mx-3 text-zinc-500 text-[9px] font-mono tracking-wider uppercase">or</span>
                    <div className="flex-grow border-t border-zinc-800/80"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      // Perform quick Google Sign-In as ntobekozondi98@gmail.com
                      handleLogin("Ntobeko Zondi", "ntobekozondi98@gmail.com");
                    }}
                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all border border-zinc-800/80 rounded-xl cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </>
              )}

              {!isAdminMode && (
                <p className="text-xs text-zinc-500">
                  {authModalIsSignUp ? "Already registered?" : "New to SafeRide?"}{" "}
                  <button
                    onClick={() => {
                      setAuthModalIsSignUp(!authModalIsSignUp);
                      setAuthError(null);
                    }}
                    className="text-amber-500 hover:text-amber-400 font-bold underline cursor-pointer bg-transparent border-none"
                  >
                    {authModalIsSignUp ? "Log In" : "Sign Up"}
                  </button>
                </p>
              )}

              {isAdminMode ? (
                <button
                  onClick={() => {
                    setIsAdminMode(false);
                    setAuthError(null);
                  }}
                  className="text-xs text-zinc-500 hover:text-white flex items-center gap-1.5 mx-auto font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to Commuter Access
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    setAuthError(null);
                  }}
                  className="text-[9px] font-mono tracking-widest text-zinc-600 hover:text-red-500 uppercase transition-colors cursor-pointer block mx-auto py-1 bg-transparent border-none"
                >
                  🔒 STAFF GATEWAY ACCESS
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
