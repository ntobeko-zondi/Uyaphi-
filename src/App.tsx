/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { UserRole, Driver, IncidentReport, DangerZoneHotspot, SafetyAlert } from "./types";
import {
  INITIAL_DRIVERS,
  INITIAL_DANGER_ZONES,
  INITIAL_ALERTS,
  INITIAL_REPORTS,
  INITIAL_REVIEWS,
  AFRICAN_COUNTRIES,
} from "./mockData";

// Components
import MapDashboard from "./components/MapDashboard";
import DriverSearch from "./components/DriverSearch";
import IncidentReporting from "./components/IncidentReporting";
import SOSAlertSystem from "./components/SOSAlertSystem";
import ModeratorAdminPanel from "./components/ModeratorAdminPanel";
import SafeRideLogo from "./components/SafeRideLogo";
import TrustVault from "./components/TrustVault";

// Icons
import {
  ShieldAlert,
  Search,
  MapPin,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Globe,
  Bell,
  Fingerprint,
  LayoutDashboard,
  Shield,
  UserCheck,
  Car,
  DollarSign,
  Award,
} from "lucide-react";

export default function App() {
  // Master Database States
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [reports, setReports] = useState<IncidentReport[]>(INITIAL_REPORTS);
  const [dangerZones, setDangerZones] = useState<DangerZoneHotspot[]>(INITIAL_DANGER_ZONES);
  const [alerts, setAlerts] = useState<SafetyAlert[]>(INITIAL_ALERTS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "SD 92 RT GP",
    "DRV-ZA-9821",
    "Sipho Khumalo",
  ]);

  // Perspective and Routing States
  const [portalMode, setPortalMode] = useState<"user" | "admin">("user");
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.PASSENGER);
  const [activeTab, setActiveTab] = useState<string>("search");

  // Selected Location context
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("ZA");
  const [selectedCity, setSelectedCity] = useState<string>("Johannesburg");

  const countryInfo = AFRICAN_COUNTRIES.find((c) => c.code === selectedCountryCode);
  const selectedCountryName = countryInfo ? countryInfo.name : "South Africa";

  // Handle swapping countries and auto-select first city
  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    const firstCity = AFRICAN_COUNTRIES.find((c) => c.code === code)?.cities[0] || "";
    setSelectedCity(firstCity);
  };

  // Switch between User Portal and Admin Portal
  const handlePortalChange = (mode: "user" | "admin") => {
    setPortalMode(mode);
    if (mode === "admin") {
      setCurrentRole(UserRole.ADMIN);
      setActiveTab("insights");
    } else {
      setCurrentRole(UserRole.PASSENGER);
      setActiveTab("search");
    }
  };

  // Pilot Addition helper
  const handleAddDriver = (newDriver: Driver) => {
    setDrivers((prev) => [newDriver, ...prev]);
  };

  // Bulk / individual Pilot update helper
  const handleUpdateDrivers = (updatedDrivers: Driver[]) => {
    setDrivers(updatedDrivers);
  };

  // Direct Warning Signal Broadcast helper
  const handleAddAlert = (newAlert: SafetyAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Delete Alert helper
  const handleDeleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  // Passenger registers a custom hotspot
  const handleAddHotspot = (newHotspot: DangerZoneHotspot) => {
    setDangerZones((prev) => [newHotspot, ...prev]);
    
    // Broadcast community notice alert automatically
    const newAlert: SafetyAlert = {
      id: `ALT-GEN-${Date.now()}`,
      title: "New Local Danger Flagged",
      message: `${newHotspot.name} reported by passenger. Extreme vigilance required.`,
      category: "hotspot",
      country: newHotspot.country,
      city: newHotspot.city,
      latitude: newHotspot.latitude,
      longitude: newHotspot.longitude,
      severity: "warning",
      timestamp: new Date().toISOString(),
      isActive: true,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Passenger logs an incident report entry
  const handleAddReport = (newReport: IncidentReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  // Moderator resolve/approve dispatches
  const handleModerateReport = (reportId: string, action: "approve" | "dismiss") => {
    // 1. Locate report and set status
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: action === "approve" ? "resolved" : "dismissed" }
          : r
      )
    );

    if (action === "approve") {
      // 2. Penalize corresponding driver's score severely (down 15 points)
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) => {
          if (driver.id === report.driverId) {
            const nextScore = Math.max(0, driver.trustScore - 15);
            // Re-evaluate risk standard rating threshold
            let nextRisk: "low" | "medium" | "high" | "critical" = "low";
            if (nextScore < 30) nextRisk = "critical";
            else if (nextScore < 50) nextRisk = "high";
            else if (nextScore < 80) nextRisk = "medium";

            return {
              ...driver,
              trustScore: nextScore,
              riskRating: nextRisk,
              reportCount: driver.reportCount + 1,
              scoreFactors: {
                ...driver.scoreFactors,
                historyWeight: Math.max(0, driver.scoreFactors.historyWeight - 3),
              },
            };
          }
          return driver;
        })
      );

      // 3. Pin as dangerous zones area if critical severity
      const targetedDriver = drivers.find((d) => d.id === report.driverId);
      const isCritical = report.severity === "critical" || report.category === "theft" || report.category === "harassment";

      if (targetedDriver && isCritical) {
        const matchingHotspot = dangerZones.find(
          (z) => z.city === report.location.city && z.name.includes(report.location.landmark || "")
        );

        if (!matchingHotspot) {
          const zone: DangerZoneHotspot = {
            id: `HOT-${report.id}`,
            name: `${report.location.landmark || "Incident Sector"} (${targetedDriver.vehicle.licensePlate})`,
            city: report.location.city,
            country: report.location.country,
            riskLevel: "high",
            latitude: report.location.latitude,
            longitude: report.location.longitude,
            radius: 350,
            recentIncidentCount: 1,
            description: `Driver ${targetedDriver.fullName} registry infraction: ${report.description}`,
          };
          setDangerZones((prev) => [zone, ...prev]);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] font-sans text-zinc-100 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-400">
      
      {/* 1. TOP GLOBAL NAVIGATION HEADER */}
      <header className="border-b border-zinc-800/80 bg-[#070913]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
          
          {/* Logo Frame */}
          <SafeRideLogo variant="compact" />

          {/* Location Base selectors */}
          <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
            {/* Country Swapper */}
            <div className="flex items-center gap-1.5 bg-zinc-900 px-3.5 py-1.5 rounded-lg border border-zinc-800">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={selectedCountryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white outline-none border-none cursor-pointer pr-1"
              >
                {AFRICAN_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code} className="bg-zinc-900 text-white">
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City Swapper */}
            <div className="flex items-center gap-1.5 bg-zinc-900 px-3.5 py-1.5 rounded-lg border border-zinc-800">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white outline-none border-none cursor-pointer pr-1"
              >
                {countryInfo?.cities.map((city) => (
                  <option key={city} value={city} className="bg-zinc-900 text-white">
                    {city} Metro
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dual-Portal Mode Switcher Slider in Uber Style */}
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 select-none shrink-0">
            <button
              onClick={() => handlePortalChange("user")}
              className={`px-4 py-2 rounded-lg uppercase tracking-wider font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                portalMode === "user"
                  ? "bg-amber-500 text-black shadow-md font-black"
                  : "hover:text-white"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Rider Portal
            </button>
            <button
              onClick={() => handlePortalChange("admin")}
              className={`px-4 py-2 rounded-lg uppercase tracking-wider font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                portalMode === "admin"
                  ? "bg-red-650 bg-red-600 text-white shadow-md"
                  : "hover:text-red-500"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Console
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN APPLICATION CONTENT PORTAL */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Operations Sidebar navigation */}
        <aside className="md:col-span-4 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-6 shadow-lg backdrop-blur-sm">
          <div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block mb-1 font-black">
              {portalMode === "user" ? "Safety Control Panel" : "Backoffice Navigation"}
            </span>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            {portalMode === "user" ? (
              <>
                <button
                  onClick={() => setActiveTab("search")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === "search"
                      ? "bg-amber-500 text-black shadow-md font-extrabold"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <Search className="w-4.5 h-4.5" />
                  Driver Search Registry
                </button>

                <button
                  onClick={() => setActiveTab("gis_map")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === "gis_map"
                      ? "bg-amber-500 text-black shadow-md font-extrabold"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <MapPin className="w-4.5 h-4.5" />
                  Interactive Safety GIS
                </button>

                <button
                  onClick={() => setActiveTab("report")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === "report"
                      ? "bg-amber-500 text-black shadow-md font-extrabold"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <AlertTriangle className="w-4.5 h-4.5" />
                  Log Community Report
                </button>

                <button
                  onClick={() => setActiveTab("sos")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === "sos"
                      ? "bg-red-500 text-black shadow-md font-extrabold animate-pulse"
                      : "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  }`}
                >
                  <ShieldAlert className="w-4.5 h-4.5" />
                  Distress Panic SOS
                </button>

                <button
                  onClick={() => setActiveTab("vault")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === "vault"
                      ? "bg-amber-500 text-black shadow-md font-extrabold"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <Award className="w-4.5 h-4.5" />
                  My Trust Vault
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab("insights")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === "insights"
                      ? "bg-red-600 text-white shadow-md font-bold"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                  Core Analytics
                </button>

                <button
                  onClick={() => setActiveTab("moderation")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 cursor-pointer relative ${
                    activeTab === "moderation"
                      ? "bg-red-600 text-white shadow-md font-bold"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <AlertTriangle className="w-4.5 h-4.5" />
                  Moderation Queue
                  {reports.filter(r => r.status === "pending_review").length > 0 && (
                    <span className="absolute top-3 right-4 w-2 h-2 bg-white rounded-full animate-ping" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("drivers")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === "drivers"
                      ? "bg-red-600 text-white shadow-md font-bold"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <Car className="w-4.5 h-4.5" />
                  Driver Score Manager
                </button>

                <button
                  onClick={() => setActiveTab("alerts")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === "alerts"
                      ? "bg-red-600 text-white shadow-md font-bold"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <AlertTriangle className="w-4.5 h-4.5" />
                  Broadcast Warnings
                </button>

                <button
                  onClick={() => setActiveTab("roles")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === "roles"
                      ? "bg-red-600 text-white shadow-md font-bold"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <Layers className="w-4.5 h-4.5" />
                  Simulated Sandbox
                </button>

                <button
                  onClick={() => setActiveTab("revenue")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === "revenue"
                      ? "bg-red-600 text-white shadow-md font-bold"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <DollarSign className="w-4.5 h-4.5" />
                  Revenue Audits
                </button>
              </>
            )}
          </nav>

          <div className="pt-4 border-t border-zinc-800 text-center relative select-none space-y-4">
            <SafeRideLogo variant="full" />
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 flex items-center justify-between gap-1">
              <Fingerprint className="w-5 h-5 text-zinc-400 shrink-0" />
              <div className="text-right">
                <span className="text-[8px] text-zinc-500 block font-mono leading-none font-bold">SECURITY GATEWAY</span>
                <span className="text-[9px] text-zinc-300 uppercase font-black font-mono">
                  POPIA PROTECTED
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Section: Core viewport dynamic rendering */}
        <section className="md:col-span-8 lg:col-span-9 space-y-6 animate-fade-in">
          
          {/* DYNAMIC TAB VIEWPORTS (PORTAL SELECTIVE) */}
          {portalMode === "user" ? (
            <>
              {activeTab === "search" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 px-1">
                    <h2 className="text-2xl font-display font-medium text-white tracking-tight">Driver Trust Registry</h2>
                    <p className="text-xs text-zinc-400 font-medium font-sans">
                      Independent credentials verification for ride-hailing networks (UberX, Uber Comfort, Uber Black, and Bolt). Verify driver identity and vehicle plate before taking your ride.
                    </p>
                  </div>
                  <DriverSearch
                    drivers={drivers}
                    reviews={reviews}
                    selectedCountry={selectedCountryName}
                    selectedCity={selectedCity}
                    onChangeTab={setActiveTab}
                  />
                </div>
              )}

              {activeTab === "gis_map" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 px-1">
                    <h2 className="text-2xl font-display font-medium text-white tracking-tight">Interactive Safety Map</h2>
                    <p className="text-xs text-zinc-400 font-medium font-sans">
                      Geographical risk tracking, active community distress vectors, and verified safety zones layered across current metropolitan blocks.
                    </p>
                  </div>
                  <MapDashboard
                    hotspots={dangerZones}
                    alerts={alerts}
                    selectedCity={selectedCity}
                    selectedCountry={selectedCountryName}
                    onAddHotspot={handleAddHotspot}
                  />
                </div>
              )}

              {activeTab === "report" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 px-1">
                    <h2 className="text-2xl font-display font-medium text-white tracking-tight">Log Safety Hazard</h2>
                    <p className="text-xs text-zinc-400 font-medium font-sans">
                      Report behavior infractions, vehicle disparities or route deviations. Reports are audited instantly using cognitive Gemini analysis.
                    </p>
                  </div>
                  <IncidentReporting
                    drivers={drivers}
                    selectedCountry={selectedCountryName}
                    selectedCity={selectedCity}
                    onAddReport={handleAddReport}
                  />
                </div>
              )}

              {activeTab === "sos" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 px-1">
                    <h2 className="text-2xl font-display font-medium text-white tracking-tight">In-Trip Security Safe Toolkit</h2>
                    <p className="text-xs text-zinc-400 font-medium font-sans">
                      Active distress triggers and emergency beaconing. Broadcasts telemetry records, live cabin audio streams, and initiates rapid response alerts.
                    </p>
                  </div>
                  <SOSAlertSystem
                    selectedCity={selectedCity}
                    selectedCountry={selectedCountryName}
                    drivers={drivers}
                  />
                </div>
              )}

              {activeTab === "vault" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 px-1">
                    <h2 className="text-2xl font-display font-medium text-white tracking-tight">Personal Security Vault</h2>
                    <p className="text-xs text-zinc-400 font-medium font-sans">
                      Your cryptographic trust profile, saved drivers list, contribution achievements, and active emergency panic contacts.
                    </p>
                  </div>
                  <TrustVault
                    drivers={drivers}
                    reports={reports}
                    recentSearches={recentSearches}
                    onSelectDriver={(driver) => {
                      setActiveTab("search");
                    }}
                    onClearRecentSearches={() => setRecentSearches([])}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-1 px-1">
                <h2 className="text-2xl font-display font-medium text-white tracking-tight flex items-center gap-2">
                  Regional Operations Controls
                </h2>
                <p className="text-xs text-zinc-400 font-medium font-sans">
                  Regional safety compliance reports, role configuration perspective testing, and e-hailing fleet business integrations.
                </p>
              </div>
              <ModeratorAdminPanel
                currentRole={currentRole}
                onChangeRole={setCurrentRole}
                drivers={drivers}
                reports={reports}
                alerts={alerts}
                onModerateReport={handleModerateReport}
                onAddDriver={handleAddDriver}
                onUpdateDrivers={handleUpdateDrivers}
                onAddAlert={handleAddAlert}
                onDeleteAlert={handleDeleteAlert}
                selectedCity={selectedCity}
                selectedCountry={selectedCountryName}
                activeTab={activeTab}
                onChangeTab={setActiveTab}
              />
            </div>
          )}

        </section>

      </main>

      {/* 3. HUMAN-CENTRIC ATTRIBUTION FOOTER */}
      <footer className="border-t border-zinc-800/80 bg-[#070913] py-8 text-zinc-500 font-mono text-[9px] mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-bold text-zinc-300">
              SafeRide Safety Core Protocol &bull; Nodes Active
            </span>
          </div>

          <div className="font-medium text-zinc-400">
            <span>Corporate Protection and Sovereign Compliance Regulations Apply (POPIA & GDPR Safe)</span>
          </div>

          <div>
            <span className="text-zinc-200 hover:underline cursor-pointer font-bold">
              Independent Ride Safety Terms of Use
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
