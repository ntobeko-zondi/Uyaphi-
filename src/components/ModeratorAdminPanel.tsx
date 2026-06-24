/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserRole, Driver, IncidentReport, SafetyAlert } from "../types";
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  AlertOctagon,
  Layers,
  Sparkles,
  Ban,
  Check,
  BarChart3,
  DollarSign,
  ChevronRight,
  Globe,
  Trash2,
  PlusCircle,
  AlertTriangle,
  UserCheck,
  UserX,
  MapPin,
  Activity,
  CheckCircle2,
  Car
} from "lucide-react";

interface ModAdminProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  drivers: Driver[];
  reports: IncidentReport[];
  alerts: SafetyAlert[];
  onModerateReport: (reportId: string, action: "approve" | "dismiss") => void;
  onAddDriver: (newDriver: Driver) => void;
  onUpdateDrivers: (updatedDrivers: Driver[]) => void;
  onAddAlert: (newAlert: SafetyAlert) => void;
  onDeleteAlert: (alertId: string) => void;
  selectedCity: string;
  selectedCountry: string;
  activeTab: string;
  onChangeTab: (tab: any) => void;
}

export default function ModeratorAdminPanel({
  currentRole,
  onChangeRole,
  drivers,
  reports,
  alerts,
  onModerateReport,
  onAddDriver,
  onUpdateDrivers,
  onAddAlert,
  onDeleteAlert,
  selectedCity,
  selectedCountry,
  activeTab,
  onChangeTab,
}: ModAdminProps) {

  // Sum of total drivers, incidents, average score
  const totalDrivers = drivers.length;
  const pendingMeds = reports.filter((r) => r.status === "pending_review").length;
  const averageTrust = totalDrivers > 0
    ? Math.floor(drivers.reduce((acc, current) => acc + current.trustScore, 0) / totalDrivers)
    : 100;

  // States for Driver Directory
  const [driverSearch, setDriverSearch] = useState("");
  const [showAddDriverForm, setShowAddDriverForm] = useState(false);
  
  // New Driver Form States
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverLicense, setNewDriverLicense] = useState("");
  const [newDriverYears, setNewDriverYears] = useState(3);
  const [newDriverVehicleMake, setNewDriverVehicleMake] = useState("");
  const [newDriverVehicleModel, setNewDriverVehicleModel] = useState("");
  const [newDriverVehicleColor, setNewDriverVehicleColor] = useState("");
  const [newDriverVehiclePlate, setNewDriverVehiclePlate] = useState("");

  // States for Safety Alarm Ticker Broadcast
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertCategory, setAlertCategory] = useState<"hotspot" | "incident" | "emergency" | "weather" | "system">("incident");
  const [alertSeverity, setAlertSeverity] = useState<"info" | "warning" | "critical">("warning");

  const MONETIZATION_SUMMARY = [
    { source: "Rider premium top-ups", amount: "$149,200", region: "Lagos / JHB" },
    { source: "Fleet telemetry API plans", amount: "$384,100", region: "Nairobi / Accra" },
    { source: "Insurance compliance reports", amount: "$210,500", region: "Cairo / Kigali" },
    { source: "Sovereign safety grant funds", amount: "$94,000", region: "Continental Hub" }
  ];

  // Filters
  const filteredDrivers = drivers.filter(d => 
    d.fullName.toLowerCase().includes(driverSearch.toLowerCase()) ||
    d.vehicle.licensePlate.toLowerCase().includes(driverSearch.toLowerCase()) ||
    d.id.toLowerCase().includes(driverSearch.toLowerCase())
  );

  const filteredAlerts = alerts.filter(a => 
    a.city === selectedCity && a.country === selectedCountry
  );

  // Create Brand New Driver Profile
  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim() || !newDriverLicense.trim() || !newDriverVehiclePlate.trim()) return;

    const newDrv: Driver = {
      id: `DRV-${selectedCountry.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: newDriverName.trim(),
      driverLicenseNumber: newDriverLicense.trim().toUpperCase(),
      profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
      operatingCountry: selectedCountry,
      operatingCity: selectedCity,
      yearsDriving: Number(newDriverYears),
      verificationStatus: "verified",
      identityVerified: true,
      backgroundCheckVerified: true,
      vehicle: {
        id: `VEH-${selectedCountry.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        make: newDriverVehicleMake.trim() || "Toyota",
        model: newDriverVehicleModel.trim() || "Corolla",
        year: 2020,
        color: newDriverVehicleColor.trim() || "White",
        licensePlate: newDriverVehiclePlate.trim().toUpperCase(),
        registrationNumber: `REG-${selectedCity.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        photos: ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=500"]
      },
      trustScore: 95,
      riskRating: "low",
      reportCount: 0,
      positiveReviewsCount: 1,
      negativeReviewsCount: 0,
      lastSeen: "Registered just now",
      emergencyContactVerified: true,
      scoreFactors: {
        identityWeight: 35,
        reviewsWeight: 20,
        behaviorWeight: 20,
        historyWeight: 15,
        reputationWeight: 10
      }
    };

    onAddDriver(newDrv);
    
    // Reset Form
    setNewDriverName("");
    setNewDriverLicense("");
    setNewDriverVehicleMake("");
    setNewDriverVehicleModel("");
    setNewDriverVehicleColor("");
    setNewDriverVehiclePlate("");
    setShowAddDriverForm(false);
  };

  // Adjust driver safety score manually
  const updateDriverScore = (driverId: string, delta: number) => {
    const updated = drivers.map(d => {
      if (d.id === driverId) {
        const nextScore = Math.max(0, Math.min(100, d.trustScore + delta));
        let nextRisk: "low" | "medium" | "high" | "critical" = "low";
        if (nextScore < 30) nextRisk = "critical";
        else if (nextScore < 50) nextRisk = "high";
        else if (nextScore < 80) nextRisk = "medium";

        return {
          ...d,
          trustScore: nextScore,
          riskRating: nextRisk
        };
      }
      return d;
    });
    onUpdateDrivers(updated);
  };

  // Toggle driver suspension / blacklisted state
  const toggleDriverSuspension = (driverId: string) => {
    const updated = drivers.map(d => {
      if (d.id === driverId) {
        const isSuspended = d.verificationStatus === "unverified";
        return {
          ...d,
          verificationStatus: isSuspended ? ("verified" as const) : ("unverified" as const),
          trustScore: isSuspended ? 90 : 0,
          riskRating: isSuspended ? ("low" as const) : ("critical" as const)
        };
      }
      return d;
    });
    onUpdateDrivers(updated);
  };

  // Create Safety Warning Ticket
  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMessage.trim()) return;

    // Anchor coordinates around center points
    let baseLat = -1.2921;
    let baseLng = 36.8219;
    
    if (selectedCity === "Johannesburg") {
      baseLat = -26.2041; baseLng = 28.0473;
    } else if (selectedCity === "Lagos") {
      baseLat = 6.5244; baseLng = 3.3792;
    } else if (selectedCity === "Cairo") {
      baseLat = 30.0444; baseLng = 31.2357;
    } else if (selectedCity === "Accra") {
      baseLat = 5.6037; baseLng = -0.1870;
    } else if (selectedCity === "Kigali") {
      baseLat = -1.9403; baseLng = 30.0619;
    }

    const createdAlert: SafetyAlert = {
      id: `ALT-ADM-${Date.now()}`,
      title: alertTitle.trim(),
      message: alertMessage.trim(),
      category: alertCategory,
      country: selectedCountry,
      city: selectedCity,
      latitude: baseLat + (Math.random() - 0.5) * 0.03,
      longitude: baseLng + (Math.random() - 0.5) * 0.03,
      severity: alertSeverity,
      timestamp: new Date().toISOString(),
      isActive: true
    };

    onAddAlert(createdAlert);
    
    // Clear
    setAlertTitle("");
    setAlertMessage("");
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm" id="admin-management-console">
      {/* Admin Module Panel Controller Top Header */}
      <div className="p-5 bg-neutral-50 border-b border-neutral-200/80 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-neutral-900 text-white rounded-lg flex items-center justify-center font-bold relative shadow">
            <Layers className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 bg-red-650 bg-red-500 w-2.5 h-2.5 rounded-full border border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-medium text-neutral-950 text-sm md:text-base tracking-tight leading-none">
                SafeRide Global Operations Console
              </h3>
              <span className="text-[7.5px] bg-red-650 bg-red-600 text-white font-mono px-2 py-0.5 rounded font-black uppercase tracking-widest leading-none">
                SECURE ACCESS
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-bold mt-1 inline-flex items-center gap-1.5 font-mono">
              ROLE: 
              <span className="text-neutral-900 uppercase">
                {currentRole}
              </span>
              &bull; Sector: <span className="text-neutral-800">{selectedCity} Grid</span>
            </p>
          </div>
        </div>

        {/* Console view switcher in Uber style slider */}
        <div className="flex bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-[10px] font-mono font-bold text-neutral-500 max-w-full overflow-x-auto scrollbar-none select-none">
          <button
            onClick={() => onChangeTab("insights")}
            className={`px-3 py-1.5 rounded uppercase font-black transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "insights" ? "bg-white text-neutral-900 shadow-sm" : "hover:text-neutral-900"
            }`}
          >
            Analytics
          </button>
          
          <button
            onClick={() => onChangeTab("moderation")}
            className={`px-3 py-1.5 rounded uppercase font-black transition-all whitespace-nowrap relative cursor-pointer ${
              activeTab === "moderation" ? "bg-white text-neutral-900 shadow-sm" : "hover:text-neutral-900"
            }`}
          >
            Moderation Queue
            {pendingMeds > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
            )}
          </button>

          <button
            onClick={() => onChangeTab("drivers")}
            className={`px-3 py-1.5 rounded uppercase font-black transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "drivers" ? "bg-white text-neutral-900 shadow-sm" : "hover:text-neutral-900"
            }`}
          >
            Driver Records
          </button>

          <button
            onClick={() => onChangeTab("alerts")}
            className={`px-3 py-1.5 rounded uppercase font-black transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "alerts" ? "bg-white text-neutral-900 shadow-sm" : "hover:text-neutral-900"
            }`}
          >
            Area warnings
          </button>

          <button
            onClick={() => onChangeTab("roles")}
            className={`px-3 py-1.5 rounded uppercase font-black transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "roles" ? "bg-white text-neutral-900 shadow-sm" : "hover:text-neutral-900"
            }`}
          >
            Roles Sandbox
          </button>

          <button
            onClick={() => onChangeTab("revenue")}
            className={`px-3 py-1.5 rounded uppercase font-black transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "revenue" ? "bg-white text-neutral-900 shadow-sm" : "hover:text-neutral-900"
            }`}
          >
            Audits
          </button>
        </div>
      </div>

      <div className="p-6">
        
        {/* TAB 1: ANALYTICS INSIGHTS & EXECUTIVES SUMMARY */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-center text-black shrink-0 shadow-xs">
                  <Users className="w-5 h-5 text-neutral-700" />
                </div>
                <div>
                  <span className="text-[8px] text-neutral-400 font-extrabold font-mono block">COMMUNITY MEMBERS</span>
                  <span className="text-xl font-display font-medium text-neutral-900 leading-none mt-1 inline-block">
                    124,104
                  </span>
                  <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1 leading-none font-mono">
                    <TrendingUp className="w-3 h-3" /> +14.2% MOM
                  </p>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-center text-black shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-650 text-emerald-600" />
                </div>
                <div>
                  <span className="text-[8px] text-neutral-400 font-extrabold font-mono block">FLEET TRUST MATRIX</span>
                  <span className="text-xl font-display font-semibold text-neutral-900 leading-none mt-1 inline-block">
                    {averageTrust}%
                  </span>
                  <p className="text-[9px] text-neutral-400 font-extrabold mt-1 leading-none font-mono">
                     Continental Avg
                  </p>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-center text-black shrink-0 shadow-xs">
                  <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" />
                </div>
                <div>
                  <span className="text-[8px] text-neutral-400 font-extrabold font-mono block">PENDING DISPATCHES</span>
                  <span className="text-xl font-display font-semibold text-neutral-900 leading-none mt-1 inline-block">
                    {pendingMeds}
                  </span>
                  <p className="text-[9px] text-red-650 text-red-600 font-black mt-1 leading-none font-mono">
                    Investigative Queue
                  </p>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-center text-black shrink-0 shadow-xs">
                  <Briefcase className="w-5 h-5 text-neutral-700" />
                </div>
                <div>
                  <span className="text-[8px] text-neutral-400 font-extrabold font-mono block">E-HAIL CHANNELS</span>
                  <span className="text-xl font-display font-semibold text-neutral-900 leading-none mt-1 inline-block">
                    18 Providers
                  </span>
                  <p className="text-[9px] text-neutral-900 font-bold mt-1 leading-none font-mono">
                    9 active countries
                  </p>
                </div>
              </div>
            </div>

            {/* Geographical coverage simulation panel */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 shadow-inner">
              <h4 className="font-display font-bold text-neutral-950 text-xs flex items-center gap-2 mb-4 leading-none uppercase tracking-wider">
                <Globe className="w-4 h-4 text-black animate-spin" style={{ animationDuration: "30s" }} />
                Rideshare Security Compliance Indices
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { region: "Gauteng Corridor Hub", coverage: "Verified high density network", index: "92% trust index", count: "1,104 profiles" },
                  { region: "Nairobi Central Hub", coverage: "Standard operating check", index: "82% trust index", count: "481 profiles" },
                  { region: "Lagos Mainland Hub", coverage: "Active expansion block", index: "64% trust index", count: "904 profiles" },
                ].map((reg, idx) => (
                  <div key={idx} className="p-4 bg-white border border-neutral-200 rounded shadow-xs flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-xs font-extrabold text-neutral-900">{reg.region}</span>
                      <p className="text-[10px] text-neutral-500 font-semibold mt-1 font-sans">{reg.coverage}</p>
                    </div>
                    <div className="flex items-center justify-between font-mono pt-2 border-t border-neutral-100">
                      <span className="text-[8px] font-black text-neutral-700 bg-neutral-100 border px-1.5 py-0.5 rounded">
                        {reg.count}
                      </span>
                      <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">{reg.index}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border border-neutral-200 rounded-lg flex items-center justify-between flex-wrap gap-4 bg-white shadow-xs">
              <div className="space-y-1">
                <span className="text-[8.5px] font-mono font-bold text-red-600 uppercase tracking-widest flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-red-500" /> Live Synchronicity Indicator
                </span>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed font-sans max-w-xl">
                  Any direct adjustments to driver credentials, blacklisting states or metropolitan alert broadcast signals issued on this panel instantly feed into user-facing search registers and active GIS hazard maps.
                </p>
              </div>
              <span className="text-[9px] font-mono font-black text-white bg-black border px-3 py-1.5 rounded uppercase tracking-wider">
                NODE NETWORK: OPERATIONAL
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: MODERATOR QUEUE & CRITICAL REPORTS INVESTIGATION */}
        {activeTab === "moderation" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="font-display font-extrabold text-neutral-900 text-sm flex items-center gap-1.5 leading-none uppercase tracking-wide">
                  <AlertOctagon className="w-4 h-4 text-red-600 animate-bounce" />
                  Rider Support Safety Queue
                </h4>
                <p className="text-xs text-neutral-450 mt-1.5">
                  Resolve and moderate submitted passenger statements. Approved actions deduct scoring weights from target driver files.
                </p>
              </div>

              <span className="text-[8px] bg-red-50 border border-red-200 text-red-700 px-2.5 py-1 rounded font-mono font-black uppercase animate-pulse shrink-0">
                {reports.filter(r => r.status === "pending_review").length} DISPATCHES PENDING
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {reports.filter(r => r.status === "pending_review").length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 border border-neutral-200 border-dashed rounded p-6 shadow-inner">
                  <ShieldCheck className="w-10 h-10 text-neutral-800 mx-auto mb-3" />
                  <h5 className="font-display font-medium text-neutral-800 text-xs uppercase tracking-wider">Queue Backlog Clear</h5>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto leading-normal font-sans font-medium">
                    All submitted reports are fully audited and compliance states synchronized.
                  </p>
                </div>
              ) : (
                reports
                  .filter((r) => r.status === "pending_review")
                  .map((report) => (
                    <div
                      key={report.id}
                      className="p-5 bg-neutral-50 border border-neutral-200 rounded space-y-4 hover:border-neutral-300 hover:bg-white duration-150 transition-all shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-neutral-150 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono font-black text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded leading-none">
                            TICKET ID: {report.id}
                          </span>
                          <span className="text-neutral-400 text-[10px] font-semibold font-mono">
                            LOGGED: {new Date(report.timestamp).toLocaleDateString()} &bull; {report.location.city}
                          </span>
                        </div>

                        <span className="text-[8px] font-mono font-black text-neutral-600 bg-white border border-neutral-200 px-2 py-0.5 rounded uppercase select-none tracking-tight">
                          Class: {report.category.replace("_", " ")}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-700 leading-relaxed italic bg-white p-3.5 rounded border border-neutral-200 shadow-inner font-sans font-medium">
                        "{report.description}"
                      </p>

                      {/* Display Gemini analysis if exists */}
                      {report.aiClassification && (
                        <div className="p-4 bg-neutral-950 text-white rounded border border-neutral-800 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black text-neutral-300 uppercase tracking-widest font-mono flex items-center gap-1.5 leading-none">
                              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                              Gemini Pre-Parser verdict:
                            </span>
                            <span className="text-[9px] font-bold font-mono text-white bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded-sm">
                              CONFIDENCE: {(report.aiClassification.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-relaxed font-sans font-medium">
                            {report.aiClassification.reasoning}
                          </p>
                          <div className="flex justify-between items-center text-[8px] font-mono font-black tracking-tight mt-1.5 pt-2 border-t border-neutral-900">
                            <span className="text-neutral-500">Language toxicity: {(report.aiClassification.toxicityScore * 100).toFixed(0)}%</span>
                            <span className={report.aiClassification.isLikelyFake ? "text-red-400" : "text-emerald-500"}>
                              {report.aiClassification.isLikelyFake ? "⚠️ SUSPECTED SPOOF FLAG" : "✓ VALIDATED THREAT LOG"}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-neutral-150 flex-wrap">
                        <span className="text-xs font-mono text-neutral-500 font-semibold">
                          Accused Driver ID: <strong className="text-red-700 font-mono font-black">{report.driverId}</strong>
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onModerateReport(report.id, "dismiss")}
                            className="px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-250 rounded text-[11px] font-mono font-black duration-155 flex items-center gap-1 cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5 text-neutral-700 font-extrabold" /> FALSE FLAG / DISMISS
                          </button>
                          <button
                            onClick={() => onModerateReport(report.id, "approve")}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-mono font-black duration-155 flex items-center gap-1 cursor-pointer shadow-md"
                          >
                            <Check className="w-3.5 h-3.5 text-white font-extrabold" /> PENALIZE DRIVER (-15)
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVE DRIVER REGISTRY & COMPLIANCE SCORE SLIDERS */}
        {activeTab === "drivers" && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div>
                <h4 className="font-display font-extrabold text-neutral-900 text-sm uppercase tracking-wide flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-neutral-900" />
                  Active Driver Score manager
                </h4>
                <p className="text-xs text-neutral-450 mt-1">
                  Adjust driver credentials, check license plates, toggle background checks or register custom fleet pilots manually.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search name, vehicle plate or ID..."
                  value={driverSearch}
                  onChange={(e) => setDriverSearch(e.target.value)}
                  className="bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black focus:outline-none rounded-lg px-3 py-1.5 text-xs text-neutral-800 font-semibold"
                />
                
                <button
                  onClick={() => setShowAddDriverForm(!showAddDriverForm)}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-850 text-white text-[11px] font-mono font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  <PlusCircle className="w-4 h-4" />
                  {showAddDriverForm ? "HIDE FORM" : "ADD DRIVER"}
                </button>
              </div>
            </div>

            {/* Form to Register custom Driver manually */}
            {showAddDriverForm && (
              <form onSubmit={handleCreateDriver} className="p-5 bg-neutral-50 border border-neutral-200 rounded-lg space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <span className="text-[10px] font-mono font-black text-black uppercase tracking-widest flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-neutral-800" /> REGISTER COMPLIANT RIDER CHANNEL PILOT
                  </span>
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-black">
                    MANUAL SYNC ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1.5">PILOT FULL NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Adebayo Coker"
                      value={newDriverName}
                      onChange={(e) => setNewDriverName(e.target.value)}
                      className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-none rounded px-3 py-2 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1.5">License number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NG-DL-99120B"
                      value={newDriverLicense}
                      onChange={(e) => setNewDriverLicense(e.target.value)}
                      className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-none rounded px-3 py-2 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1.5">Years Driving experience</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={40}
                      value={newDriverYears}
                      onChange={(e) => setNewDriverYears(Number(e.target.value))}
                      className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-none rounded px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div>
                    <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1.5">Vehicle Make</label>
                    <input
                      type="text"
                      placeholder="Toyota"
                      value={newDriverVehicleMake}
                      onChange={(e) => setNewDriverVehicleMake(e.target.value)}
                      className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-none rounded px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1.5">Vehicle Model</label>
                    <input
                      type="text"
                      placeholder="Corolla Quest"
                      value={newDriverVehicleModel}
                      onChange={(e) => setNewDriverVehicleModel(e.target.value)}
                      className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-none rounded px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1.5">Vehicle Color</label>
                    <input
                      type="text"
                      placeholder="White"
                      value={newDriverVehicleColor}
                      onChange={(e) => setNewDriverVehicleColor(e.target.value)}
                      className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-none rounded px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1.5">License plate number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. JHB 221 GP"
                      value={newDriverVehiclePlate}
                      onChange={(e) => setNewDriverVehiclePlate(e.target.value)}
                      className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-none rounded px-3 py-2 text-xs font-mono font-semibold"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setShowAddDriverForm(false)}
                    className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded text-xs font-bold font-mono uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold font-mono uppercase shadow cursor-pointer"
                  >
                    DEPLOY PILOT LOG
                  </button>
                </div>
              </form>
            )}

            {/* Drivers list table cards view */}
            {filteredDrivers.length === 0 ? (
              <div className="text-center py-20 bg-white border rounded p-6 shadow-sm">
                <UserX className="w-10 h-10 text-neutral-450 mx-auto mb-3" />
                <p className="text-xs text-neutral-400 font-semibold font-sans">No matching driver profiles registered in this sector catalog.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                {filteredDrivers.map(d => {
                  const isSuspended = d.verificationStatus === "unverified";
                  const isCritical = d.riskRating === "critical";
                  const isHigh = d.riskRating === "high";

                  return (
                    <div key={d.id} className={`p-4 rounded border bg-white shadow-xs space-y-4 hover:shadow duration-150 transition-all ${
                      isSuspended ? "border-red-300 bg-red-50/10" : "border-neutral-200"
                    }`}>
                      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={d.profilePhoto}
                            alt={d.fullName}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                          />
                          <div>
                            <span className="font-display font-bold text-neutral-900 text-xs block leading-tight">
                              {d.fullName}
                            </span>
                            <span className="font-mono text-[8px] font-black text-neutral-400">
                              ID: {d.id} &bull; {d.operatingCity}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                          isSuspended
                            ? "bg-red-150 text-red-800 border-red-200"
                            : d.verificationStatus === "pending"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200 animate-pulse"
                        }`}>
                          {d.verificationStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[10px] bg-neutral-50/50 p-2 border border-neutral-100 rounded">
                        <div>
                          <span className="text-neutral-450 text-[7px] font-mono block font-bold leading-none uppercase">VEHICLE PLATE</span>
                          <span className="font-mono font-black text-neutral-800 tracking-tight leading-none inline-block mt-1">{d.vehicle.licensePlate}</span>
                        </div>
                        <div>
                          <span className="text-neutral-450 text-[7px] font-mono block font-bold leading-none uppercase">VEHICLE MODEL</span>
                          <span className="font-bold text-neutral-800 truncate leading-none inline-block mt-1">{d.vehicle.make} {d.vehicle.model}</span>
                        </div>
                        <div>
                          <span className="text-neutral-450 text-[7px] font-mono block font-bold leading-none uppercase">TRUST SCORE</span>
                          <span className={`font-mono font-black leading-none inline-block mt-1 ${
                            isCritical ? "text-red-600" : isHigh ? "text-amber-500" : "text-emerald-600 font-extrabold"
                          }`}>{d.trustScore}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-2.5 flex-wrap">
                        {/* Adjust Score Controllers */}
                        <div className="flex gap-1 items-center">
                          <span className="text-[8px] font-mono font-bold text-neutral-400 mr-1">ADJUST:</span>
                          <button
                            onClick={() => updateDriverScore(d.id, -10)}
                            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-mono text-[10px] px-2 py-0.5 rounded-sm font-black border border-neutral-250 cursor-pointer"
                            title="Subtract 10 points"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => updateDriverScore(d.id, -5)}
                            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-mono text-[10px] px-2 py-0.5 rounded-sm font-black border border-neutral-250 cursor-pointer"
                            title="Subtract 5 points"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => updateDriverScore(d.id, 10)}
                            className="bg-neutral-900 hover:bg-black text-white font-mono text-[10px] px-2 py-0.5 rounded-sm font-black border border-neutral-700 cursor-pointer"
                            title="Add 10 points"
                          >
                            +10
                          </button>
                        </div>

                        {/* Ban / Suspension Trigger Toggle */}
                        <button
                          onClick={() => toggleDriverSuspension(d.id)}
                          className={`px-3 py-1 text-[10px] font-mono font-black rounded duration-150 border cursor-pointer ${
                            isSuspended
                              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-250"
                              : "bg-red-50 hover:bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {isSuspended ? "✓ ACTIVATE PILOT" : "⚠️ SUSPEND / BLACKLIST"}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 4: BROADCAST REGIONAL WARNING TICKERS */}
        {activeTab === "alerts" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Broadcast Form Panel */}
              <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4">
                <h5 className="text-[10px] font-mono font-black text-black uppercase tracking-widest border-b border-neutral-100 pb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                  INITIATE GIS BROADCAST SIGNAL
                </h5>

                <form onSubmit={handleBroadcastAlert} className="space-y-4">
                  <div>
                    <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                      ALERT SIGNAL TITLE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bolt vehicle impersonation warning near Westlands"
                      value={alertTitle}
                      onChange={(e) => setAlertTitle(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:outline-none rounded px-3 py-2 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                      WARNING DISPATCH MESSAGE
                    </label>
                    <textarea
                      required
                      placeholder="e.g. Extreme vigilance required. Multiple reports of unregistered vehicles using fake license printouts staging roadside breakdowns..."
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 h-28 focus:border-black focus:outline-none rounded px-3 py-2 text-xs font-semibold leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                        ALARM INCIDENT CLASS
                      </label>
                      <select
                        value={alertCategory}
                        onChange={(e) => setAlertCategory(e.target.value as any)}
                        className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-none rounded px-3 py-2 text-xs font-semibold cursor-pointer"
                      >
                        <option value="incident">Incident Alert</option>
                        <option value="hotspot">Hazard Zone</option>
                        <option value="emergency">Emergency Distress</option>
                        <option value="weather">Weather Alert</option>
                        <option value="system">System Notice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1.5">
                        alarm SEVERITY LEVEL
                      </label>
                      <select
                        value={alertSeverity}
                        onChange={(e) => setAlertSeverity(e.target.value as any)}
                        className="w-full bg-white border border-neutral-200 focus:border-black focus:outline-none rounded px-4 py-2 text-xs font-semibold cursor-pointer"
                      >
                        <option value="critical">CRITICAL (Red Flag)</option>
                        <option value="warning">WARNING (Amber Flag)</option>
                        <option value="info">INFO (Standard Alert)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-650 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold font-mono uppercase shadow-md flex items-center justify-center gap-2 duration-155 transition-all cursor-pointer"
                  >
                    <Activity className="w-4 h-4 text-white" />
                    BROADCAST LIVE OVERLAY
                  </button>
                </form>
              </div>

              {/* Active Broadcasts List */}
              <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4">
                <span className="text-[10px] font-mono font-black text-black uppercase tracking-widest border-b border-neutral-100 pb-2.5 block">
                  Broadcast logs active inside {selectedCity} sector
                </span>

                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-16 bg-neutral-50 border border-neutral-200 border-dashed rounded p-6 shadow-inner text-neutral-400">
                    <ShieldCheck className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-[11px] font-semibold">No active warnings are currently broadcasted by administrators in this area.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {filteredAlerts.map(alert => {
                      const isCritical = alert.severity === "critical";
                      const isWarning = alert.severity === "warning";

                      return (
                        <div key={alert.id} className="p-4 bg-neutral-50 rounded border border-neutral-200 flex justify-between gap-4 items-start duration-150 transition-all hover:bg-white shadow-xs">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[7px] font-mono font-black uppercase px-2 py-0.5 rounded border inline-block select-none ${
                                isCritical
                                  ? "bg-red-50 text-red-800 border-red-200 animate-pulse"
                                  : isWarning
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-neutral-100 text-neutral-800 border-neutral-200"
                              }`}>
                                {alert.severity}
                              </span>
                              <span className="text-[8.5px] font-mono font-extrabold text-neutral-450 uppercase">
                                CAT: {alert.category}
                              </span>
                              <span className="text-[8.5px] font-mono text-neutral-400">
                                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <h6 className="font-display font-black text-neutral-900 text-xs md:text-sm">
                              {alert.title}
                            </h6>
                            <p className="text-xs text-neutral-550 text-neutral-505 font-medium leading-relaxed font-sans mt-1">
                              {alert.message}
                            </p>
                          </div>

                          <button
                            onClick={() => onDeleteAlert(alert.id)}
                            className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-red-700 rounded transition-all cursor-pointer border border-transparent hover:border-neutral-200"
                            title="Expire Broadcast warning"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: SWITCH ROLE PERSPECTIVE ACCORDING TO SPECS */}
        {activeTab === "roles" && (
          <div className="space-y-4">
            <div className="bg-neutral-950 text-white p-5 rounded-lg border border-neutral-850">
              <h4 className="font-display font-medium text-white text-sm md:text-base leading-none">Simulated Role Sandbox</h4>
              <p className="text-xs text-neutral-400 font-medium mt-2 leading-relaxed">
                Toggle clearance levels below to inspect accessibility partitions. SafeRide partitions logs, actions, and overrides depending on Passenger, Driver, Supervisor, or Board Admin privileges:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                {
                  role: UserRole.PASSENGER,
                  title: "Passenger",
                  desc: "Search verified driver cards, review hazard coordinates, log behavior, and toggle panic beaconing.",
                  color: "bg-neutral-100 text-neutral-800 border-neutral-250/50 text-[8px]"
                },
                {
                  role: UserRole.DRIVER,
                  title: "EHail Driver",
                  desc: "Review compliance scores, rating factors, vehicle cards, and national safety credentials.",
                  color: "bg-neutral-100 text-neutral-800 border-neutral-250/50 text-[8px]"
                },
                {
                  role: UserRole.MODERATOR,
                  title: "Investigator",
                  desc: "Audit incident backlogs, inspect Gemini classifications, and resolve score penalty appeals.",
                  color: "bg-neutral-100 text-neutral-800 border-neutral-250/50 text-[8px]"
                },
                {
                  role: UserRole.ADMIN,
                  title: "Metro Admin",
                  desc: "Post regional warning tickers, verify drivers records, and manage municipal safety logs.",
                  color: "bg-neutral-100 text-neutral-800 border-neutral-250/50 text-[8px]"
                },
                {
                  role: UserRole.SUPER_ADMIN,
                  title: "Executive",
                  desc: "Review continental financial dashboards, monetization structures, and core neural assets.",
                  color: "bg-neutral-100 text-neutral-800 border-neutral-250/50 text-[8px]"
                }
              ].map((item) => (
                <div
                  key={item.role}
                  onClick={() => onChangeRole(item.role)}
                  className={`p-4 rounded border transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:border-neutral-400 ${
                    currentRole === item.role
                      ? "border-black bg-neutral-50 shadow-md ring-1 ring-black/5"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  <div className="space-y-4">
                    <span className={`font-mono font-black uppercase px-2 py-0.5 rounded border inline-block ${item.color}`}>
                      {item.title}
                    </span>
                    <p className="text-xs text-neutral-550 text-neutral-500 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-[8px] font-black uppercase text-neutral-800 font-mono tracking-tight pt-3 border-t border-neutral-100">
                    <span>Simulate View</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 text-neutral-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PLATFORM MONETIZATION & ENTERPRISE FLEETS */}
        {activeTab === "revenue" && (
          <div className="space-y-4">
            <div>
              <h4 className="font-display font-bold text-neutral-900 text-sm flex items-center gap-1.5 leading-none uppercase tracking-wider">
                <DollarSign className="w-4 h-4 text-neutral-900" />
                Fleet API & Premium Monetization Plans
              </h4>
              <p className="text-xs text-neutral-450 mt-1.5">
                Financial structures of SafeRide operations supporting high-fidelity driver checks across continental hubs:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-sm space-y-3">
                <h5 className="text-[8px] font-black font-mono text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
                  Active Commercial Revenue Runs
                </h5>

                <div className="divide-y divide-neutral-100">
                  {MONETIZATION_SUMMARY.map((sub, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-semibold text-neutral-600">
                      <span>{sub.source}</span>
                      <div className="text-right">
                        <span className="font-mono text-neutral-900 font-bold">{sub.amount}</span>
                        <span className="block text-[8px] font-mono text-neutral-450 font-bold uppercase tracking-tight">{sub.region}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-sm flex flex-col justify-between">
                <div>
                  <h5 className="text-[8px] font-black font-mono text-neutral-450 uppercase tracking-widest flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                    <BarChart3 className="w-4 h-4 text-neutral-450" />
                    Rider Subscription Index
                  </h5>
                  <p className="text-xs text-neutral-450 mt-3 leading-relaxed font-sans font-medium">
                    Basic lookups and warnings remain 100% free. Over 18% of operating users choose Premium ($1.99/mo) to unlock real-time corridor map routing, unlimited plate searches, and secure SOS relay triggers.
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 text-neutral-505 text-xs font-bold mt-4">
                  <div className="flex justify-between items-center text-[10px]">
                    <span>Premium members proportion:</span>
                    <span className="font-mono text-black font-extrabold font-black">18.4% subscription cap</span>
                  </div>
                  <div className="h-2 bg-neutral-150 rounded-full mt-2.5 overflow-hidden border border-neutral-200/50">
                    <div style={{ width: "18.4%" }} className="bg-black h-full rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
