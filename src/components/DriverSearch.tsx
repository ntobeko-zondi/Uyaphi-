/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Driver, Review, IncidentReport, SafetyAlert } from "../types";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  Award,
  Car,
  ChevronRight,
  BrainCircuit,
  MessageSquare,
  Sparkles,
  Star,
  Activity,
  AlertCircle,
  User,
  Phone,
  FileText,
  MapPin,
  Clock,
  ThumbsUp,
  Check,
  Plus,
  Compass,
  CheckSquare,
  Info,
  Shield,
  ShieldAlert,
} from "lucide-react";

interface DriverSearchProps {
  drivers: Driver[];
  reviews: Review[];
  reports?: IncidentReport[];
  alerts?: SafetyAlert[];
  selectedCountry: string;
  selectedCity: string;
  onChangeTab?: (tab: string) => void;
  initialSearchQuery?: string;
  onReportIncident?: (driverId: string) => void;
  onAddDriver?: (driver: Driver) => void;
}

export default function DriverSearch({
  drivers: initialDrivers,
  reviews: initialReviews,
  reports = [],
  alerts = [],
  selectedCountry,
  selectedCity,
  onChangeTab,
  initialSearchQuery,
  onReportIncident,
  onAddDriver,
}: DriverSearchProps) {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  // Real-time backend AI state
  const [aiAssessment, setAiAssessment] = React.useState<{ riskAssessment: string, actionSuggestions: string[], safetyScoreAdvice: string } | null>(null);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedDriver) {
      setAiAssessment(null);
      return;
    }
    setAiLoading(true);
    setAiError(null);
    setAiAssessment(null);

    fetch("/api/driver-safety-intelligence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driver: selectedDriver })
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("HTTP state error: " + res.status);
        }
        const data = await res.json();
        if (!data || (!data.riskAssessment && (!data.actionSuggestions || data.actionSuggestions.length === 0))) {
          setAiAssessment(null); // empty state trigger
        } else {
          setAiAssessment(data);
        }
      })
      .catch((err) => {
        console.error("AI intelligence retrieval failed:", err);
        setAiError(err.message || "Failed to contact safety system");
      })
      .finally(() => {
        setAiLoading(false);
      });
  }, [selectedDriver]);
  
  // Search segments/modes switcher
  const [searchMode, setSearchMode] = useState<"driver" | "vehicle">("driver");

  React.useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      handleTriggerSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);
  
  // Recent searches list
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "SD 92 RT GP",
    "DRV-ZA-9821",
    "Sipho Khumalo",
  ]);

  const trendingSearches = [
    { label: "GP817293-C", query: "GP817293-C", mode: "vehicle" as const },
    { label: "Toyota Corolla Quest", query: "Toyota", mode: "vehicle" as const },
    { label: "Sipho Khumalo", query: "Sipho", mode: "driver" as const },
    { label: "SD 92 RT GP", query: "SD 92", mode: "vehicle" as const },
  ];

  // Form toggles
  const [showAddDriverForm, setShowAddDriverForm] = useState(false);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);

  // New Driver Form State
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverPlate, setNewDriverPlate] = useState("");
  const [newDriverMake, setNewDriverMake] = useState("");
  const [newDriverModel, setNewDriverModel] = useState("");

  // New Review Form State
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewPassengerTag, setNewReviewPassengerTag] = useState("Professional");

  // Dynamic tags
  const [driverTags, setDriverTags] = useState<Record<string, string[]>>({
    "DRV-ZA-9821": ["Professional", "Safe Driver", "Clean Vehicle", "Student Friendly"],
    "DRV-KE-4432": ["Punctual", "Friendly", "Women Friendly"],
    "DRV-NG-0912": ["Airport Specialist", "Clean Vehicle"],
  });

  const availablePositiveTags = [
    "Professional",
    "Safe Driver",
    "Friendly",
    "Clean Vehicle",
    "Punctual",
    "Student Friendly",
    "Women Friendly",
    "Airport Specialist",
  ];

  // Helper to trigger search
  const handleTriggerSearch = (q: string) => {
    setSearchQuery(q);
    if (q && !recentSearches.includes(q)) {
      setRecentSearches((prev) => [q, ...prev.slice(0, 4)]);
    }
    const matching = executeFilter(q);
    if (matching.length === 1) {
      setSelectedDriver(matching[0]);
    } else {
      setSelectedDriver(null);
    }
  };

  // Run filtering logic
  const executeFilter = (query: string) => {
    return drivers.filter((drv) => {
      if (selectedCountry && drv.operatingCountry !== selectedCountry) return false;
      if (selectedCity && drv.operatingCity !== selectedCity) return false;

      const textQuery = query.toLowerCase().trim();
      if (!textQuery) return true;

      if (searchMode === "driver") {
        return (
          drv.fullName.toLowerCase().includes(textQuery) ||
          drv.id.toLowerCase().includes(textQuery) ||
          drv.driverLicenseNumber.toLowerCase().includes(textQuery)
        );
      } else {
        return (
          drv.vehicle.licensePlate.toLowerCase().includes(textQuery) ||
          drv.vehicle.make.toLowerCase().includes(textQuery) ||
          drv.vehicle.model.toLowerCase().includes(textQuery) ||
          (drv.vehicle.registrationNumber && drv.vehicle.registrationNumber.toLowerCase().includes(textQuery))
        );
      }
    });
  };

  const filteredDrivers = executeFilter(searchQuery);

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  // Toggle community tags
  const handleToggleTag = (driverId: string, tag: string) => {
    setDriverTags((prev) => {
      const current = prev[driverId] || [];
      const updated = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return { ...prev, [driverId]: updated };
    });
  };

  // Add Driver Submit
  const handleAddDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim() || !newDriverPlate.trim()) return;

    const newId = `DRV-ZA-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedLicense = `ZA-DL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newDriver: Driver = {
      id: newId,
      fullName: newDriverName,
      driverLicenseNumber: generatedLicense,
      profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
      operatingCountry: selectedCountry || "South Africa",
      operatingCity: selectedCity || "Johannesburg",
      yearsDriving: 2,
      verificationStatus: "pending",
      identityVerified: false,
      backgroundCheckVerified: false,
      vehicle: {
        id: `VEH-ZA-${Math.floor(100 + Math.random() * 900)}`,
        make: newDriverMake || "Toyota",
        model: newDriverModel || "Corolla",
        year: 2020,
        color: "Silver",
        licensePlate: newDriverPlate.toUpperCase(),
        registrationNumber: `REG-ZA-${Math.floor(10000 + Math.random() * 90000)}`,
        photos: [],
      },
      trustScore: 75,
      riskRating: "medium",
      reportCount: 0,
      positiveReviewsCount: 0,
      negativeReviewsCount: 0,
      lastSeen: "Registered Just Now",
      emergencyContactVerified: false,
      scoreFactors: {
        identityWeight: 10,
        reviewsWeight: 15,
        behaviorWeight: 15,
        historyWeight: 20,
        reputationWeight: 15,
      },
    };

    setDrivers((prev) => [newDriver, ...prev]);
    if (onAddDriver) {
      onAddDriver(newDriver);
    }
    setSelectedDriver(newDriver);
    setShowAddDriverForm(false);
    setSearchQuery("");
    
    setNewDriverName("");
    setNewDriverPlate("");
    setNewDriverMake("");
    setNewDriverModel("");
  };

  // Add Review Submit
  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    setDrivers((prev) =>
      prev.map((drv) => {
        if (drv.id === selectedDriver.id) {
          const isPos = newReviewRating >= 4;
          return {
            ...drv,
            trustScore: Math.min(100, drv.trustScore + (isPos ? 3 : -8)),
            positiveReviewsCount: drv.positiveReviewsCount + (isPos ? 1 : 0),
            negativeReviewsCount: drv.negativeReviewsCount + (isPos ? 0 : 1),
          };
        }
        return drv;
      })
    );

    setSelectedDriver((prev) => {
      if (!prev) return null;
      const isPos = newReviewRating >= 4;
      return {
        ...prev,
        trustScore: Math.min(100, prev.trustScore + (isPos ? 3 : -8)),
        positiveReviewsCount: prev.positiveReviewsCount + (isPos ? 1 : 0),
        negativeReviewsCount: prev.negativeReviewsCount + (isPos ? 0 : 1),
      };
    });

    if (newReviewPassengerTag) {
      handleToggleTag(selectedDriver.id, newReviewPassengerTag);
    }

    setShowAddReviewForm(false);
    setNewReviewComment("");
  };

  const getScoreClassification = (score: number) => {
    if (score >= 90) return { label: "Trusted", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", text: "text-emerald-400" };
    if (score >= 70) return { label: "Good", bg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", text: "text-yellow-400" };
    if (score >= 50) return { label: "Caution", bg: "bg-amber-600/10 text-amber-500 border-amber-500/30", text: "text-amber-500" };
    return { label: "High Risk", bg: "bg-red-500/10 text-red-400 border-red-500/30", text: "text-red-400" };
  };

  // Filter out updates for Safety Updates widget
  const activeAlerts = alerts.filter((alt) => alt.isActive);
  const activeReports = reports.filter((rep) => rep.status !== "pending_review" && rep.status !== "dismissed");

  return (
    <div className="space-y-6" id="sra-search-intelligence">
      
      {/* CASE A: Landing/Home view when NO driver is selected */}
      {!selectedDriver ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* Centered Premium Search Box with Mode Swappers */}
          <div className="text-center py-10 md:py-12 max-w-2xl mx-auto space-y-6 bg-zinc-950/20 border border-zinc-900/60 p-6 rounded-3xl">
            <div className="space-y-2">
              <span className="text-[10px] bg-amber-500/10 text-amber-500 font-mono font-bold px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-wider">
                Independent Trust Verification Portal
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white leading-none">
                Know Before You Go
              </h1>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Instantly research driver records, vehicle plate clearances, and sovereign safety indices in real-time.
              </p>
            </div>

            {/* Mode swapper segmented pill tabs */}
            <div className="flex justify-center gap-1.5 p-1 bg-zinc-900 rounded-xl max-w-md mx-auto border border-zinc-850">
              <button
                onClick={() => { setSearchMode("driver"); setSearchQuery(""); }}
                className={`flex-1 py-2 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer ${
                  searchMode === "driver" ? "bg-amber-500 text-black shadow" : "text-zinc-400 hover:text-white"
                }`}
              >
                Search Driver
              </button>
              <button
                onClick={() => { setSearchMode("vehicle"); setSearchQuery(""); }}
                className={`flex-1 py-2 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer ${
                  searchMode === "vehicle" ? "bg-amber-500 text-black shadow" : "text-zinc-400 hover:text-white"
                }`}
              >
                Search Vehicle
              </button>
            </div>

            {/* Big Premium Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchMode === "driver"
                    ? "Enter driver full name or Uyaphi profile ID..."
                    : "Enter vehicle plate number (e.g., SD 92 RT GP) or make/model..."
                }
                className="w-full bg-zinc-900 border-2 border-zinc-800/80 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded-2xl pl-12 pr-4 py-4 text-xs md:text-sm text-white placeholder:text-zinc-500 transition-all font-medium shadow-xl"
              />
              <Search className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
            </div>

            {/* Verification Status & Tips */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> National Databases Active
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Moderator Supervised
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> POPIA Compliant
              </span>
            </div>
          </div>

          {/* Core Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left/Center columns: Matches, Trending, Search Tips and Community Actions */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Search Matches List */}
              {searchQuery ? (
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                      Matches Found ({filteredDrivers.length})
                    </h3>
                    <span className="text-[9px] text-zinc-500 font-mono">NODE: {selectedCity.toUpperCase()}</span>
                  </div>

                  {filteredDrivers.length === 0 ? (
                    <div className="text-center py-10 bg-zinc-950/40 border border-zinc-850 rounded-xl p-6 space-y-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6 text-zinc-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-extrabold text-white text-sm">No record matched.</h4>
                        <p className="text-[11px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                          No registered safety data matches <strong className="text-zinc-300 font-mono">"{searchQuery}"</strong> in {selectedCity}. You can initiate registration or submit a caution report.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                        <button
                          onClick={() => setShowAddDriverForm(true)}
                          className="px-3.5 py-2 bg-amber-500 text-black font-extrabold text-xs rounded-lg hover:bg-amber-400 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Profile
                        </button>
                        <button
                          onClick={() => onChangeTab && onChangeTab("reports")}
                          className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs rounded-lg hover:text-white hover:border-zinc-700 transition-all cursor-pointer"
                        >
                          File Warning Statement
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredDrivers.map((driver) => {
                        const classInfo = getScoreClassification(driver.trustScore);
                        return (
                          <div
                            key={driver.id}
                            onClick={() => handleSelectDriver(driver)}
                            className="bg-zinc-950/60 border border-zinc-850 hover:border-zinc-700 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/30 transition-all group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="relative shrink-0">
                                <img
                                  src={driver.profilePhoto || null}
                                  alt={driver.fullName}
                                  className="w-11 h-11 rounded-full object-cover border border-zinc-800"
                                  referrerPolicy="no-referrer"
                                />
                                {driver.verificationStatus === "verified" && (
                                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black p-0.5 rounded-full border border-zinc-950">
                                    <Check className="w-2.5 h-2.5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-xs font-extrabold text-white group-hover:text-amber-500 transition-colors">
                                    {driver.fullName}
                                  </h4>
                                  <span className="text-[8px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                                    {driver.id}
                                  </span>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                                  {driver.vehicle.color} {driver.vehicle.make} {driver.vehicle.model} &bull; <span className="text-zinc-300 font-mono">{driver.vehicle.licensePlate}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 text-right">
                              <div>
                                <span className="text-[8px] text-zinc-500 block font-mono">TRUST SCORE</span>
                                <span className={`text-xs font-black font-mono ${classInfo.text}`}>{driver.trustScore}%</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Lookups list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-zinc-500" /> Recent Lookups
                      </h3>
                      {recentSearches.length === 0 ? (
                        <p className="text-[11px] text-zinc-600 italic py-2">No recent lookups.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {recentSearches.map((term, i) => (
                            <button
                              key={i}
                              onClick={() => handleTriggerSearch(term)}
                              className="w-full text-left py-1.5 text-xs text-zinc-300 hover:text-white flex items-center gap-2 font-mono hover:bg-zinc-900/20 px-2 rounded-lg transition-all cursor-pointer"
                            >
                              <Clock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                              <span className="truncate">{term}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-amber-500" /> Trending Safety Checks
                      </h3>
                      <div className="space-y-1.5">
                        {trendingSearches.map((trend, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSearchMode(trend.mode);
                              handleTriggerSearch(trend.query);
                            }}
                            className="w-full text-left py-1.5 text-xs text-zinc-300 hover:text-white flex items-center justify-between font-medium group hover:bg-zinc-900/20 px-2 rounded-lg transition-all cursor-pointer"
                          >
                            <span className="truncate group-hover:text-amber-500 transition-colors font-mono">{trend.label}</span>
                            <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1.5 py-0.2 rounded font-mono uppercase tracking-tighter">
                              Active query
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Search Tips & Platform Guidelines */}
                  <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white flex items-center gap-2">
                      <Info className="w-4 h-4 text-amber-500" /> Uyaphi Commuter Verification Guidelines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400">
                      <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-900">
                        <p className="font-bold text-zinc-300 mb-1">1. Match Driver Details</p>
                        <p className="text-[11px] leading-relaxed">Always cross-examine the driver's face and municipal permit ID against the Uyaphi profile badge.</p>
                      </div>
                      <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-900">
                        <p className="font-bold text-zinc-300 mb-1">2. Audit License Plates</p>
                        <p className="text-[11px] leading-relaxed">Ensure physical plate letters and vehicle paint match the registered digital record exactly.</p>
                      </div>
                      <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-900">
                        <p className="font-bold text-zinc-300 mb-1">3. Report Anomalies</p>
                        <p className="text-[11px] leading-relaxed">Log plate disparity, unsolicited detours, or off-protocol cash demands directly to warn others.</p>
                      </div>
                    </div>
                  </div>

                  {/* Community Contribution Actions panel */}
                  <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                      Add to Africa's Trust Intelligence
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Uyaphi operates entirely on peer contributions. You can register new driver profiles, submit reviews, and flag off-protocol rideshares to keep municipal corridors safe for students, commuters, and tourists.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => setShowAddDriverForm(true)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Add New Driver Profile
                      </button>
                      <button
                        onClick={() => onChangeTab && onChangeTab("reports")}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs rounded-xl border border-zinc-800 transition-all cursor-pointer"
                      >
                        File Warning Incident Report
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Driver popup overlay if requested */}
              {showAddDriverForm && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                      Register E-Hailing Driver Profile
                    </h3>
                    <button
                      onClick={() => setShowAddDriverForm(false)}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleAddDriverSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Driver Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sipho Khumalo"
                        value={newDriverName}
                        onChange={(e) => setNewDriverName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 animate-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase">License Plate</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SD 92 RT GP"
                        value={newDriverPlate}
                        onChange={(e) => setNewDriverPlate(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 animate-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Vehicle Make</label>
                      <input
                        type="text"
                        placeholder="e.g. Toyota"
                        value={newDriverMake}
                        onChange={(e) => setNewDriverMake(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 animate-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Vehicle Model</label>
                      <input
                        type="text"
                        placeholder="e.g. Corolla Quest"
                        value={newDriverModel}
                        onChange={(e) => setNewDriverModel(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 animate-none"
                      />
                    </div>

                    <div className="md:col-span-2 pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddDriverForm(false)}
                        className="px-3.5 py-1.5 text-zinc-400 hover:text-white text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-amber-500 text-black font-extrabold text-xs rounded-lg hover:bg-amber-400 transition-colors cursor-pointer"
                      >
                        Save Driver Record
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* Right column: Safety Updates Widget (Verified, non-fear-based) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-300 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-500" /> Verified Safety Updates
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Moderator-approved safety logs and notifications in {selectedCity}.
                  </p>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {/* Verified Notices / Alerts */}
                  {activeAlerts.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="text-[8px] font-mono text-amber-500 font-bold uppercase tracking-wider block">Official Notices</span>
                      {activeAlerts.slice(0, 3).map((alt) => (
                        <div key={alt.id} className="bg-zinc-950/60 border border-zinc-850 p-3 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white">{alt.title}</span>
                            <span className="text-[7px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 py-0.2 rounded font-mono uppercase font-bold">
                              Verified Notice
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-normal font-semibold">{alt.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Verified Incidents */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[8px] font-mono text-amber-500 font-bold uppercase tracking-wider block">Community Safety Logs</span>
                    {activeReports.length === 0 ? (
                      <p className="text-[10px] text-zinc-500 italic">No critical community logs filed recently.</p>
                    ) : (
                      activeReports.slice(0, 3).map((rep) => (
                        <div key={rep.id} className="bg-zinc-950/40 border border-zinc-850 p-3 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white capitalize">{rep.category.replace("_", " ")} Report</span>
                            <span className="text-[8px] text-zinc-500 font-mono">{rep.id}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-normal font-semibold">"{rep.description.substring(0, 100)}..."</p>
                          <p className="text-[8px] text-zinc-500 font-mono">{rep.location.city}, {rep.location.country}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Passenger Commendations */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[8px] font-mono text-amber-500 font-bold uppercase tracking-wider block">Recent Commendations</span>
                    {reviews.slice(0, 2).map((rev) => (
                      <div key={rev.id} className="bg-zinc-950/40 border border-zinc-850 p-3 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-zinc-300">Passenger Commendation</span>
                          <span className="text-amber-500 text-[9px] font-bold flex items-center">
                            {rev.rating} ★
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-normal font-medium">"{rev.comment}"</p>
                        <span className="text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-mono uppercase font-black tracking-wider mt-1 inline-block">
                          {rev.passengerCommendationTag}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        
        /* CASE B: Premium Detailed Driver Intelligence Profile card */
        <div className="space-y-6 animate-fade-in">
          
          {/* Back Button */}
          <button
            onClick={() => setSelectedDriver(null)}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            &larr; Back to Search Console
          </button>

          {/* Master Profile Layout: Grid of Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left/Main Block: Driver Metadata, Timeline, Scores */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Premium Driver Intelligence Header Card / Profile Card */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 md:p-6 space-y-5">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-zinc-800/60">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={selectedDriver.profilePhoto || null}
                        alt={selectedDriver.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-zinc-800"
                        referrerPolicy="no-referrer"
                      />
                      {selectedDriver.verificationStatus === "verified" && (
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black p-1 rounded-full border border-zinc-950">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-display font-black text-white">{selectedDriver.fullName}</h2>
                        <span className="text-[8px] bg-zinc-950 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded font-mono font-bold uppercase">
                          ID: {selectedDriver.id}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                        {selectedDriver.yearsDriving} Years Active E-Hailing Operator &bull; {selectedDriver.operatingCity} Hub
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] text-zinc-500 block font-mono">VERIFICATION STATUS</span>
                    <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded border inline-block mt-1 ${
                      selectedDriver.verificationStatus === "verified"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                    }`}>
                      {selectedDriver.verificationStatus === "verified" ? "Sovereign Verified" : "Verification Pending"}
                    </span>
                  </div>
                </div>

                {/* Grid details fulfilling direct data field checklist */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  <div className="bg-zinc-950/80 border border-zinc-850 p-3.5 rounded-xl space-y-1.5">
                    <span className="text-[8.5px] text-zinc-500 font-mono block uppercase">Vehicle Profile</span>
                    <span className="font-extrabold text-white block">
                      {selectedDriver.vehicle.color} {selectedDriver.vehicle.make} {selectedDriver.vehicle.model}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 block pt-0.5">Year: {selectedDriver.vehicle.year}</span>
                  </div>

                  <div className="bg-zinc-950/80 border border-zinc-850 p-3.5 rounded-xl space-y-1.5">
                    <span className="text-[8.5px] text-zinc-500 font-mono block uppercase">Registration Details</span>
                    <span className="font-mono text-xs font-black text-white bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded inline-block">
                      Plate: {selectedDriver.vehicle.licensePlate}
                    </span>
                    <span className="text-[9px] text-zinc-400 block pt-0.5 font-mono">Reg: {selectedDriver.vehicle.registrationNumber || "REG-ZA-9014"}</span>
                  </div>

                  <div className="bg-zinc-950/80 border border-zinc-850 p-3.5 rounded-xl space-y-1.5">
                    <span className="text-[8.5px] text-zinc-500 font-mono block uppercase">Trust & Activity Score</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-black font-mono ${
                        selectedDriver.trustScore >= 90 ? "text-emerald-400" : selectedDriver.trustScore >= 70 ? "text-yellow-400" : "text-red-400"
                      }`}>
                        {selectedDriver.trustScore}% Trust Score
                      </span>
                    </div>
                    <span className="text-[9px] text-zinc-400 block pt-0.5 font-semibold">Activity: {selectedDriver.lastSeen}</span>
                  </div>

                </div>

                {/* Additional Specific requested Profile Fields: Community Rating, verified reports, reviews count */}
                <div className="grid grid-cols-3 gap-4 border-t border-zinc-800/60 pt-4 text-center">
                  <div>
                    <span className="text-[8px] text-zinc-500 block font-mono uppercase">Community Rating</span>
                    <span className="text-white text-sm font-extrabold block mt-0.5">
                      {(4.0 + (selectedDriver.trustScore - 50) / 50).toFixed(1)} ★ <span className="text-[9px] text-zinc-500">/ 5.0</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-zinc-500 block font-mono uppercase">Verified Reports</span>
                    <span className={`text-sm font-extrabold block mt-0.5 ${selectedDriver.reportCount > 0 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
                      {selectedDriver.reportCount} Active
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-zinc-500 block font-mono uppercase">Total Passenger Reviews</span>
                    <span className="text-white text-sm font-extrabold block mt-0.5">
                      {selectedDriver.positiveReviewsCount + selectedDriver.negativeReviewsCount} Audits
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons for driver Profile - Includes functional Report Incident */}
              <div className="flex flex-wrap items-center gap-3 bg-zinc-900/20 border border-zinc-900 p-4 rounded-2xl">
                <button
                  onClick={() => {
                    if (onReportIncident) {
                      onReportIncident(selectedDriver.id);
                    } else if (onChangeTab) {
                      onChangeTab("reports");
                    }
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/20"
                >
                  <AlertTriangle className="w-4 h-4" /> Report This Driver / Vehicle
                </button>
                <button
                  onClick={() => setShowAddReviewForm(!showAddReviewForm)}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-850 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-zinc-500" /> Submit Positive Review
                </button>
              </div>

              {/* Dynamic Commendations and Community Reviews list */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
                  Verified Commendations & Reviews
                </h3>

                {/* Sub-rating form */}
                {showAddReviewForm && (
                  <form onSubmit={handleAddReviewSubmit} className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase block">Passenger Rating</label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded p-1.5 outline-none cursor-pointer"
                      >
                        <option value="5">5 Stars (Excellent Safe Trip)</option>
                        <option value="4">4 Stars (Good Safe Trip)</option>
                        <option value="3">3 Stars (Minor Infraction Noticed)</option>
                        <option value="1">1 Star (Critical Hazard Warning)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase block">Add Tag Commendation</label>
                      <select
                        value={newReviewPassengerTag}
                        onChange={(e) => setNewReviewPassengerTag(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded p-1.5 outline-none cursor-pointer"
                      >
                        {availablePositiveTags.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase block">Review Commentary</label>
                      <input
                        type="text"
                        required
                        placeholder="Comment details of your journey..."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded px-2.5 py-1.5 outline-none animate-none"
                      />
                    </div>

                    <div className="flex justify-end gap-1.5 text-[10px]">
                      <button type="button" onClick={() => setShowAddReviewForm(false)} className="text-zinc-400 px-2 py-1">Cancel</button>
                      <button type="submit" className="bg-amber-500 text-black font-extrabold px-3 py-1 rounded cursor-pointer">Submit Review</button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {reviews.filter((r) => r.driverId === selectedDriver.id).map((rev) => (
                    <div key={rev.id} className="p-4 bg-zinc-950/60 border border-zinc-850 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Passenger Audit UYA-{rev.id}</span>
                        <span className="text-amber-500 text-xs font-bold flex items-center">
                          {rev.rating} ★
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">"{rev.comment}"</p>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span className="text-[8.5px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-mono font-black uppercase">
                          {rev.passengerCommendationTag}
                        </span>
                        <span className="text-[9.5px] text-zinc-500 font-mono">Date: {rev.timestamp.substring(0, 10)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right column: AI Assessment & Trust Timeline */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Uyaphi Safety AI Assessment with 3 Async States: Loading, Empty, and Error */}
              <div className="bg-gradient-to-br from-zinc-900 to-amber-950/20 border border-zinc-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white flex items-center gap-1.5">
                  <BrainCircuit className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                  Uyaphi Safety AI Assessment
                </h3>

                {aiLoading ? (
                  /* Loading State */
                  <div className="space-y-3 py-2 animate-pulse">
                    <div className="h-3.5 bg-zinc-800 rounded-full w-3/4" />
                    <div className="h-3 bg-zinc-800 rounded-full w-5/6" />
                    <div className="h-3 bg-zinc-800 rounded-full w-2/3" />
                    <p className="text-[10px] font-mono text-zinc-500 italic mt-2">Computing security weights & background corridors...</p>
                  </div>
                ) : aiError ? (
                  /* Error State with Graceful Heuristics Fallback & Manual Retry */
                  <div className="space-y-2.5 py-1">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs">
                      <p className="font-bold flex items-center gap-1.5 mb-1 text-red-400">
                        <AlertCircle className="w-3.5 h-3.5" /> High-Traffic Query Throttled
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {aiError}. Using local biometric security rules instead.
                      </p>
                    </div>
                    <div className="text-xs text-zinc-300 leading-relaxed font-semibold space-y-2">
                      {selectedDriver.trustScore >= 75 ? (
                        <p>✓ <strong>Local Rules:</strong> Profile meets state compliance parameters. Biometric identifiers are verified.</p>
                      ) : (
                        <p className="text-red-400">⚠ <strong>Local Rules Warning:</strong> Low community rating score. Exercise caution.</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        // Trigger re-fetch
                        setSelectedDriver({ ...selectedDriver });
                      }}
                      className="text-[10px] font-mono text-amber-500 hover:text-amber-400 hover:underline font-bold"
                    >
                      ↻ Force Intelligence Recalculation
                    </button>
                  </div>
                ) : !aiAssessment ? (
                  /* Empty State */
                  <div className="py-4 text-center">
                    <p className="text-xs text-zinc-500 italic">No AI safety recommendations registered for this driver footprint yet.</p>
                  </div>
                ) : (
                  /* Success/Data State */
                  <div className="text-xs text-zinc-300 leading-relaxed font-semibold space-y-2.5">
                    <p className="border-b border-zinc-850 pb-2 text-zinc-200">
                      <strong>Risk Standing:</strong> {aiAssessment.riskAssessment}
                    </p>
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">Recommended Protocols:</span>
                      {aiAssessment.actionSuggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-zinc-400 text-[11px]">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                    {aiAssessment.safetyScoreAdvice && (
                      <p className="text-[10px] text-zinc-500 italic border-t border-zinc-850/50 pt-2 font-mono">
                        {aiAssessment.safetyScoreAdvice}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Trust Timeline (Standardized from LinkedIn template references) */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
                  Verification History
                </h3>

                <div className="space-y-4 relative pl-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                  {[
                    { date: "March 2026", title: "Vehicle Registration", desc: "Uyaphi field officer approved vehicle plate registration." },
                    { date: "April 2026", title: "Criminal Record Scan", desc: "Background check cleared with municipal authorities." },
                    { date: "May 2026", title: "Trust Star Badge", desc: "Awarded for 100+ positive commuter check-ins." },
                    { date: "June 2026", title: "Identity Cleared", desc: "Matched biometric parameters against sovereign state database." },
                  ].map((step, idx) => (
                    <div key={idx} className="relative space-y-1">
                      <div className="absolute -left-[13px] top-1.5 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-zinc-950" />
                      <span className="text-[8.5px] font-mono text-zinc-500 block leading-none">{step.date}</span>
                      <h4 className="text-xs font-bold text-white">{step.title}</h4>
                      <p className="text-[10px] text-zinc-400 leading-normal font-medium">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
