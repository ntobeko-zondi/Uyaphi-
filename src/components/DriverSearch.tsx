/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Driver, Review } from "../types";
import {
  Search,
  Shield,
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
  ThumbsDown,
  Check,
  Plus,
  Compass,
  CornerDownRight,
  CheckSquare,
} from "lucide-react";

interface DriverSearchProps {
  drivers: Driver[];
  reviews: Review[];
  selectedCountry: string;
  selectedCity: string;
  onChangeTab?: (tab: string) => void;
}

export default function DriverSearch({
  drivers: initialDrivers,
  reviews: initialReviews,
  selectedCountry,
  selectedCity,
  onChangeTab,
}: DriverSearchProps) {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  // Recent and trending searches states
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "SD 92 RT GP",
    "DRV-ZA-9821",
    "Sipho Khumalo",
  ]);

  const trendingSearches = [
    { label: "GP817293-C", query: "GP817293-C" },
    { label: "Toyota Corolla Quest", query: "Toyota" },
    { label: "Sipho Khumalo", query: "Sipho" },
    { label: "SD 92 RT GP", query: "SD 92" },
  ];

  // Forms / Dialogs state for "No intelligence found" or Contributions
  const [showAddDriverForm, setShowAddDriverForm] = useState(false);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [showVerifyVehicleForm, setShowVerifyVehicleForm] = useState(false);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  // New Driver Form State
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverPlate, setNewDriverPlate] = useState("");
  const [newDriverMake, setNewDriverMake] = useState("");
  const [newDriverModel, setNewDriverModel] = useState("");
  const [newDriverLicense, setNewDriverLicense] = useState("");

  // New Review Form State
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewPassengerTag, setNewReviewPassengerTag] = useState("Professional");

  // Custom user interactions: Active Community Tags state on drivers
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

  const availableNegativeTags = [
    "Unsafe Driving",
    "Aggressive",
    "Vehicle Mismatch",
    "Harassment Complaint",
    "Reckless Driving",
  ];

  // Helper to handle search trigger
  const handleTriggerSearch = (q: string) => {
    setSearchQuery(q);
    if (q && !recentSearches.includes(q)) {
      setRecentSearches((prev) => [q, ...prev.slice(0, 4)]);
    }
    // Auto-select if there is an exact single match
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
      // Spatial filters
      if (selectedCountry && drv.operatingCountry !== selectedCountry) return false;
      if (selectedCity && drv.operatingCity !== selectedCity) return false;

      const textQuery = query.toLowerCase().trim();
      if (!textQuery) return true;

      return (
        drv.fullName.toLowerCase().includes(textQuery) ||
        drv.id.toLowerCase().includes(textQuery) ||
        drv.vehicle.licensePlate.toLowerCase().includes(textQuery) ||
        drv.driverLicenseNumber.toLowerCase().includes(textQuery) ||
        drv.vehicle.registrationNumber?.toLowerCase().includes(textQuery)
      );
    });
  };

  const filteredDrivers = executeFilter(searchQuery);

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  // Toggle dynamic community tags
  const handleToggleTag = (driverId: string, tag: string) => {
    setDriverTags((prev) => {
      const current = prev[driverId] || [];
      const updated = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return { ...prev, [driverId]: updated };
    });
  };

  // Handle Adding a Driver
  const handleAddDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim() || !newDriverPlate.trim()) return;

    const newId = `DRV-ZA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDriver: Driver = {
      id: newId,
      fullName: newDriverName,
      driverLicenseNumber: newDriverLicense || "GP-DL-TEMP",
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
      trustScore: 75, // Starting score
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
    setSelectedDriver(newDriver);
    setShowAddDriverForm(false);
    setSearchQuery("");
    
    // Clear fields
    setNewDriverName("");
    setNewDriverPlate("");
    setNewDriverMake("");
    setNewDriverModel("");
    setNewDriverLicense("");
  };

  // Handle Adding a Review
  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    // Increment count on driver
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

    // Update active state
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

    // Add tag automatically
    if (newReviewPassengerTag) {
      handleToggleTag(selectedDriver.id, newReviewPassengerTag);
    }

    setShowAddReviewForm(false);
    setNewReviewComment("");
  };

  // Helper to determine safety category classification styling
  const getScoreClassification = (score: number) => {
    if (score >= 90) return { label: "Trusted", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", text: "text-emerald-400" };
    if (score >= 70) return { label: "Good", bg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", text: "text-yellow-400" };
    if (score >= 50) return { label: "Caution", bg: "bg-amber-600/10 text-amber-500 border-amber-500/30", text: "text-amber-500" };
    return { label: "High Risk", bg: "bg-red-500/10 text-red-400 border-red-500/30", text: "text-red-400" };
  };

  return (
    <div className="space-y-6" id="sra-search-intelligence">
      
      {/* CASE A: Landing/Home view when NO driver is selected */}
      {!selectedDriver ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* Centered Truecaller-Inspired Search Box */}
          <div className="text-center py-10 md:py-16 max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] bg-amber-500/10 text-amber-500 font-mono font-bold px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-wider">
                Africa's Ride Trust Intelligence Network
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white leading-none">
                Know Before You Go
              </h1>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Instantly research vehicle plates, driver profiles, and trust rankings in real-time across {selectedCity}.
              </p>
            </div>

            {/* Truecaller styled Big Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plate number, driver name, phone number, vehicle registration or QR code"
                className="w-full bg-zinc-900 border-2 border-zinc-800/80 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-zinc-500 transition-all font-medium shadow-xl"
              />
              <Search className="absolute left-4.5 top-4.5 w-5 h-5 text-zinc-500" />
            </div>

            {/* Quick action grid buttons */}
            <div className="grid grid-cols-5 gap-2.5 pt-2">
              {[
                { label: "Search Driver", tab: "search", icon: Search },
                { label: "Report Incident", tab: "report", icon: FileText },
                { label: "Ride Shield", tab: "sos", icon: Shield },
                { label: "Community Alerts", tab: "gis_map", icon: Compass },
                { label: "Trust Vault", tab: "vault", icon: Award },
              ].map((act, index) => {
                const Icon = act.icon;
                return (
                  <button
                    key={index}
                    onClick={() => onChangeTab && onChangeTab(act.tab)}
                    className="flex flex-col items-center justify-center p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-amber-500/50 hover:bg-zinc-900 transition-all group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-850 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all mb-2">
                      <Icon className="w-4 h-4 text-zinc-400 group-hover:text-amber-500" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-zinc-400 group-hover:text-white leading-tight">
                      {act.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Home screen bottom widgets: Recent, Trending, Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left/Center columns: Matches, Trending and Recent searches */}
            <div className="md:col-span-8 space-y-6">
              
              {/* If user is typing: display search results list */}
              {searchQuery ? (
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                      Search Matches ({filteredDrivers.length})
                    </h3>
                    <span className="text-[9px] text-zinc-500 font-mono">SECTOR: {selectedCity.toUpperCase()}</span>
                  </div>

                  {filteredDrivers.length === 0 ? (
                    /* Fallback: NO INTELLIGENCE FOUND */
                    <div className="text-center py-10 bg-zinc-950/40 border border-zinc-850 rounded-xl p-6 space-y-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6 text-zinc-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-extrabold text-white text-sm">No intelligence found.</h4>
                        <p className="text-[11px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                          No active safety record matches <strong className="text-zinc-300 font-mono">"{searchQuery}"</strong> in the metropolitan nodes. You can become the first to flag or register this profile.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                        <button
                          onClick={() => setShowAddDriverForm(true)}
                          className="px-3.5 py-2 bg-amber-500 text-black font-extrabold text-xs rounded-lg hover:bg-amber-400 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Driver Profile
                        </button>
                        <button
                          onClick={() => {
                            setShowAddDriverForm(true);
                          }}
                          className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs rounded-lg hover:text-white hover:border-zinc-700 transition-all"
                        >
                          Verify Vehicle Plate
                        </button>
                        <button
                          onClick={() => onChangeTab && onChangeTab("report")}
                          className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs rounded-lg hover:text-white hover:border-zinc-700 transition-all"
                        >
                          Submit Review
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
                                  src={driver.profilePhoto}
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
                                <span className="text-[8px] text-zinc-500 block font-mono">TRUST RANK</span>
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
                /* Default view when search is empty: Trending and Recent searches side by side */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Recent searches */}
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 border-b border-zinc-800 pb-2">
                      Recent Lookups
                    </h3>
                    {recentSearches.length === 0 ? (
                      <p className="text-[11px] text-zinc-600 italic py-2">No recent lookups.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {recentSearches.map((term, i) => (
                          <button
                            key={i}
                            onClick={() => handleTriggerSearch(term)}
                            className="w-full text-left py-1.5 text-xs text-zinc-300 hover:text-white flex items-center gap-2 font-mono"
                          >
                            <Clock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                            <span className="truncate">{term}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Trending searches */}
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 border-b border-zinc-800 pb-2">
                      Trending Searches
                    </h3>
                    <div className="space-y-1.5">
                      {trendingSearches.map((trend, i) => (
                        <button
                          key={i}
                          onClick={() => handleTriggerSearch(trend.query)}
                          className="w-full text-left py-1.5 text-xs text-zinc-300 hover:text-white flex items-center justify-between font-medium group"
                        >
                          <span className="truncate group-hover:text-amber-500 transition-colors font-mono">{trend.label}</span>
                          <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1.5 py-0.2 rounded font-mono uppercase tracking-tighter">
                            Active Query
                          </span>
                        </button>
                      ))}
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500"
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Vehicle Make (Manufacturer)</label>
                      <input
                        type="text"
                        placeholder="e.g. Toyota"
                        value={newDriverMake}
                        onChange={(e) => setNewDriverMake(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Vehicle Model</label>
                      <input
                        type="text"
                        placeholder="e.g. Corolla Quest"
                        value={newDriverModel}
                        onChange={(e) => setNewDriverModel(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Driver License Code</label>
                      <input
                        type="text"
                        placeholder="e.g. GP817293-C"
                        value={newDriverLicense}
                        onChange={(e) => setNewDriverLicense(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500"
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
                        className="px-4 py-1.5 bg-amber-500 text-black font-extrabold text-xs rounded-lg hover:bg-amber-400 transition-colors"
                      >
                        Save Driver Record
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* Right column: Nearby Safety Alerts & Metrics */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Nearby Safety Alerts */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Nearby Safety Warnings
                </h3>

                <div className="space-y-2.5">
                  {[
                    { zone: "Braamfontein Campus complex", risk: "critical", desc: "Reported vehicle plate mismatches around late shuttle runs." },
                    { zone: "Melville Student block", risk: "medium", desc: "Increased reports of unsolicited e-hailing solicitations." },
                    { zone: "Johannesburg Central Corridor", risk: "low", desc: "General safety compliance checks actively patrolling." },
                  ].map((alert, i) => (
                    <div key={i} className="bg-zinc-950/65 border border-zinc-850 p-3 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-white">{alert.zone}</span>
                        <span className={`text-[7px] font-mono uppercase px-1.5 py-0.2 rounded font-black ${
                          alert.risk === "critical"
                            ? "bg-red-500/10 text-red-400 border border-red-500/35"
                            : alert.risk === "medium"
                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/35"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/35"
                        }`}>
                          {alert.risk} risk
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal font-medium">{alert.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        
        /* CASE B: Premium Detailed Driver Intelligence Profile card */
        <div className="space-y-6 animate-fade-in">
          
          {/* Back to search navigation button */}
          <button
            onClick={() => setSelectedDriver(null)}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            &larr; Back to Search Console
          </button>

          {/* Master Profile Layout: Grid of Details */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Left/Main Block: Driver Metadata, Timeline, Scores */}
            <div className="xl:col-span-8 space-y-6">
              
              {/* Premium Driver Intelligence Header Card */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 md:p-6 space-y-5">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-zinc-800/60">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={selectedDriver.profilePhoto}
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
                        {selectedDriver.yearsDriving} Years Active E-Hailing veteran &bull; {selectedDriver.operatingCity} Hub
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] text-zinc-500 block font-mono">RISK RATING</span>
                    <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded border ${
                      selectedDriver.riskRating === "low"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : selectedDriver.riskRating === "medium"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                        : "bg-red-500/10 text-red-400 border-red-500/30"
                    }`}>
                      {selectedDriver.riskRating} risk
                    </span>
                  </div>
                </div>

                {/* Sub specifications: Vehicle, Plate, Ride Provider */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  <div className="bg-zinc-950/80 border border-zinc-850 p-3 rounded-xl space-y-1">
                    <span className="text-[8.5px] text-zinc-500 font-mono block uppercase">Vehicle Profile</span>
                    <span className="font-extrabold text-white block">
                      {selectedDriver.vehicle.color} {selectedDriver.vehicle.make} {selectedDriver.vehicle.model}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 block pt-0.5">Year Model: {selectedDriver.vehicle.year}</span>
                  </div>

                  <div className="bg-zinc-950/80 border border-zinc-850 p-3 rounded-xl space-y-1">
                    <span className="text-[8.5px] text-zinc-500 font-mono block uppercase">License Plate Detail</span>
                    <span className="font-mono text-sm font-black text-white bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded inline-block">
                      {selectedDriver.vehicle.licensePlate}
                    </span>
                    <span className="text-[9px] text-zinc-400 block pt-0.5">Reg: {selectedDriver.vehicle.registrationNumber || "N/A"}</span>
                  </div>

                  <div className="bg-zinc-950/80 border border-zinc-850 p-3 rounded-xl space-y-1">
                    <span className="text-[8.5px] text-zinc-500 font-mono block uppercase">Ride Provider Network</span>
                    <span className="font-extrabold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      Uber / Bolt Verified
                    </span>
                    <span className="text-[9px] text-zinc-400 block pt-0.5">Verification Sector Code: {selectedDriver.driverLicenseNumber}</span>
                  </div>

                </div>

              </div>

              {/* Trust Timeline & Safety Score Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* LinkedIn style Trust Timeline */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
                    LinkedIn Trust Timeline
                  </h3>

                  <div className="space-y-4 relative pl-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                    {[
                      { date: "March 2026", title: "Vehicle Safety Registration", desc: "SRA field inspector approved Toyota registration." },
                      { date: "April 2026", title: "Criminal Background Check Cleared", desc: "Criminal records scanned against regional police files." },
                      { date: "May 2026", title: "Trust Star Badge Awarded", desc: "Achieved over 100 positive rides in JHB corridor." },
                      { date: "June 2026", title: "Verification Identity Completed", desc: "Matched driver ID document biometric markers." },
                    ].map((step, idx) => (
                      <div key={idx} className="relative space-y-1">
                        <div className="absolute -left-[13px] top-1.5 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-zinc-950" />
                        <span className="text-[8.5px] font-mono text-zinc-500 block leading-none">{step.date}</span>
                        <h4 className="text-xs font-bold text-white">{step.title}</h4>
                        <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Score Breakdown list of bars */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
                    Safety Score breakdown
                  </h3>

                  <div className="space-y-3.5 pt-1">
                    {[
                      { name: "Driving Safety Metric", score: 96, weight: "35%" },
                      { name: "Identity Verification Check", score: selectedDriver.identityVerified ? 100 : 50, weight: "20%" },
                      { name: "Community Reputation Feed", score: selectedDriver.trustScore, weight: "15%" },
                      { name: "Incident Log Check", score: selectedDriver.reportCount === 0 ? 100 : 60, weight: "15%" },
                      { name: "Vehicle Compliance Specs", score: 95, weight: "15%" },
                    ].map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-medium">
                          <span className="text-zinc-300">{cat.name}</span>
                          <span className="text-zinc-400 font-mono font-bold">{cat.score}% (Weight {cat.weight})</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-850">
                          <div
                            className={`h-full rounded-full transition-all ${
                              cat.score >= 90
                                ? "bg-emerald-500"
                                : cat.score >= 70
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[9px] text-zinc-500 italic leading-relaxed pt-1 border-t border-zinc-800/60">
                    * Metrics are weighted dynamically using biometric, verification status, community reporting, and historical safety infractions.
                  </p>
                </div>

              </div>

              {/* Dynamic Community Tagging System */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                    Passenger Behavior Tagging Feed
                  </h3>
                  <span className="text-[8.5px] text-zinc-500 font-mono uppercase">Click tags to add/toggle</span>
                </div>

                {/* Tag Toggles Container */}
                <div className="space-y-3 pt-1">
                  <div>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block mb-2 font-bold">Positive Tags (Commendations)</span>
                    <div className="flex flex-wrap gap-2">
                      {availablePositiveTags.map((tag) => {
                        const hasTag = (driverTags[selectedDriver.id] || []).includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => handleToggleTag(selectedDriver.id, tag)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              hasTag
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/35"
                                : "bg-zinc-950 text-zinc-400 border-zinc-800/60 hover:border-zinc-700"
                            }`}
                          >
                            {tag} {hasTag && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono text-red-400 uppercase tracking-wider block mb-2 font-bold">Negative Tags (Infractions)</span>
                    <div className="flex flex-wrap gap-2">
                      {availableNegativeTags.map((tag) => {
                        const hasTag = (driverTags[selectedDriver.id] || []).includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => handleToggleTag(selectedDriver.id, tag)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              hasTag
                                ? "bg-red-500/10 text-red-400 border-red-500/35"
                                : "bg-zinc-950 text-zinc-400 border-zinc-800/60 hover:border-zinc-700"
                            }`}
                          >
                            {tag} {hasTag && "⚠"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar Block: Circular trust gauges, AI Assessment and Contributions */}
            <div className="xl:col-span-4 space-y-6">
              
              {/* Premium Circular Score Gauge */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Unified Trust Rating</span>

                {/* Circular indicator */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Outer glowing track ring */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      stroke="#1e293b"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      stroke={selectedDriver.trustScore >= 90 ? "#10b981" : selectedDriver.trustScore >= 70 ? "#eab308" : "#f43f5e"}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 62}
                      strokeDashoffset={2 * Math.PI * 62 * (1 - selectedDriver.trustScore / 100)}
                    />
                  </svg>
                  
                  {/* Central Text display */}
                  <div className="text-center">
                    <span className="text-3xl font-display font-black text-white tracking-tighter">
                      {selectedDriver.trustScore}
                    </span>
                    <span className="text-zinc-500 text-sm block font-semibold leading-none">/ 100</span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h4 className="text-sm font-extrabold text-white">
                    {selectedDriver.trustScore >= 90 ? "Trusted Safe Node" : selectedDriver.trustScore >= 70 ? "Good Operational Rating" : "Caution Requested"}
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-normal font-medium max-w-[200px]">
                    Rating derived from {selectedDriver.positiveReviewsCount} passenger audits and sovereign validation registers.
                  </p>
                </div>
              </div>

              {/* SafeRide AI Assessment (Gemini Smart Feed) */}
              <div className="bg-gradient-to-br from-zinc-900 to-amber-950/20 border border-zinc-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white flex items-center gap-1.5">
                  <BrainCircuit className="w-4.5 h-4.5 text-amber-500" />
                  SRA Safety AI Assessment
                </h3>

                <div className="text-xs text-zinc-300 leading-relaxed font-semibold space-y-2.5">
                  {selectedDriver.trustScore >= 90 ? (
                    <>
                      <p>
                        ✓ <strong>Elite Clearance:</strong> This driver holds a sovereign credential verification badge. No safety flags reported within 12 months.
                      </p>
                      <p>
                        ✓ <strong>Campus Safe:</strong> Highly utilized near University areas. Recommended for women and late student transport.
                      </p>
                    </>
                  ) : selectedDriver.trustScore >= 70 ? (
                    <>
                      <p>
                        ✓ <strong>Standard Clear:</strong> Identity and background certifications have passed verification. Minor community comment noise.
                      </p>
                      <p>
                        ⚠ <strong>Guideline:</strong> Ensure vehicle plate matches <strong className="text-white font-mono">{selectedDriver.vehicle.licensePlate}</strong> before boarding.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-red-400">
                        ⚠ <strong>High Risk Flag:</strong> Multiple active safety disputes logged within the region. Trust rating has declined.
                      </p>
                      <p>
                        ⚠ <strong>Recommendation:</strong> Use the Ride Shield active monitoring if proceeding with this trip. Share live telemetry.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Truecaller-style Community Intelligence bullets */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
                  Truecaller Intelligence Feed
                </h3>

                <ul className="space-y-2 text-xs font-semibold">
                  <li className="flex items-start gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Frequently used around Wits University</span>
                  </li>
                  <li className="flex items-start gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Popular among student shuttle commuters</span>
                  </li>
                  <li className="flex items-start gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Identity biometric details matched & verified</span>
                  </li>
                  <li className="flex items-start gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Vehicle plate registration cleared</span>
                  </li>
                  {selectedDriver.riskRating !== "low" ? (
                    <li className="flex items-start gap-2 text-yellow-400">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Minor operational review outstanding</span>
                    </li>
                  ) : (
                    <li className="flex items-start gap-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>SafeRide Compliance Certificate current</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Passenger Contributions Panel */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
                  Submit Contribution
                </h3>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowAddReviewForm(!showAddReviewForm)}
                    className="w-full py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white rounded-lg flex items-center justify-between px-3.5 transition-all cursor-pointer font-bold"
                  >
                    <span>Submit Review/Rating</span>
                    <Plus className="w-4 h-4 text-zinc-500" />
                  </button>

                  {showAddReviewForm && (
                    <form onSubmit={handleAddReviewSubmit} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase block">Passenger Rating</label>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded p-1.5 outline-none"
                        >
                          <option value="5">5 Stars (Excellent Safe Trip)</option>
                          <option value="4">4 Stars (Good Safe Trip)</option>
                          <option value="3">3 Stars (Infraction Noticed)</option>
                          <option value="1">1 Star (Critical Hazard Warning)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase block">Add Tag Commendation</label>
                        <select
                          value={newReviewPassengerTag}
                          onChange={(e) => setNewReviewPassengerTag(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded p-1.5 outline-none"
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
                          placeholder="Comment details..."
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded px-2.5 py-1.5 outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-1.5 text-[10px]">
                        <button type="button" onClick={() => setShowAddReviewForm(false)} className="text-zinc-400 px-2 py-1">Cancel</button>
                        <button type="submit" className="bg-amber-500 text-black font-extrabold px-3 py-1 rounded">Submit</button>
                      </div>
                    </form>
                  )}

                  <button
                    onClick={() => alert("Verification code generated. Please submit vehicle plate photos in the moderator console for approval.")}
                    className="w-full py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white rounded-lg flex items-center justify-between px-3.5 transition-all cursor-pointer font-bold"
                  >
                    <span>Verify Vehicle Registration</span>
                    <CheckSquare className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => alert("Suggestion logged. Our operations team will review discrepancies with provincial databases.")}
                    className="w-full py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white rounded-lg flex items-center justify-between px-3.5 transition-all cursor-pointer font-bold"
                  >
                    <span>Suggest Correction</span>
                    <Plus className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
