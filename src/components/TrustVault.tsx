/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Driver, IncidentReport } from "../types";
import {
  Shield,
  Bookmark,
  History,
  CheckCircle2,
  Users,
  FileText,
  Award,
  TrendingUp,
  MapPin,
  ChevronRight,
  UserCheck,
  Plus,
  Trash2,
} from "lucide-react";

interface TrustVaultProps {
  drivers: Driver[];
  reports: IncidentReport[];
  recentSearches: string[];
  onSelectDriver: (driver: Driver) => void;
  onClearRecentSearches: () => void;
}

export default function TrustVault({
  drivers,
  reports,
  recentSearches,
  onSelectDriver,
  onClearRecentSearches,
}: TrustVaultProps) {
  // Saved drivers list (mocked ID storage)
  const [savedDriverIds, setSavedDriverIds] = useState<string[]>([
    "DRV-ZA-9821", // Sipho
  ]);

  // Emergency contacts list
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: "Nomvula Khumalo", relation: "Spouse", phone: "+27 82 918 2731" },
    { name: "Wits Protection Services", relation: "Campus Control", phone: "+27 11 717 4444" },
  ]);

  const [newContactName, setNewContactName] = useState("");
  const [newContactRelation, setNewContactRelation] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [showAddContactForm, setShowAddContactForm] = useState(false);

  // User details
  const reputationScore = 780;
  const contributionLevel = "Silver Sentinel";

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    setEmergencyContacts((prev) => [
      ...prev,
      {
        name: newContactName,
        relation: newContactRelation || "General Contact",
        phone: newContactPhone,
      },
    ]);
    setNewContactName("");
    setNewContactRelation("");
    setNewContactPhone("");
    setShowAddContactForm(false);
  };

  const handleRemoveContact = (index: number) => {
    setEmergencyContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleSaveDriver = (driverId: string) => {
    if (savedDriverIds.includes(driverId)) {
      setSavedDriverIds((prev) => prev.filter((id) => id !== driverId));
    } else {
      setSavedDriverIds((prev) => [...prev, driverId]);
    }
  };

  // Saved drivers instances
  const savedDrivers = drivers.filter((d) => savedDriverIds.includes(d.id));

  // User achievements
  const achievements = [
    {
      id: "ach-1",
      title: "First Responder",
      description: "Submitted your first ride incident report.",
      icon: Shield,
      unlockedAt: "2026-04-12",
      tier: "Bronze",
    },
    {
      id: "ach-2",
      title: "Campus Guardian",
      description: "Tagged 5 safe zones around University complexes.",
      icon: Award,
      unlockedAt: "2026-05-18",
      tier: "Silver",
    },
    {
      id: "ach-3",
      title: "Verify Pioneer",
      description: "Successfully validated a vehicle registration detail.",
      icon: UserCheck,
      unlockedAt: "2026-06-02",
      tier: "Gold",
    },
  ];

  return (
    <div className="space-y-6" id="trust-vault-panel">
      {/* Vault Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/20 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <span className="text-[10px] bg-amber-500/10 text-amber-500 font-mono font-extrabold px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest inline-block">
              Premium SafeRide Vault
            </span>
            <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
              My Trust Vault
            </h2>
            <p className="text-xs text-zinc-400 font-medium max-w-xl">
              Securely store verified driver credentials, track contributions to Africa's e-hailing safety network, and manage distress contacts.
            </p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-7 h-7 text-amber-500" />
            </div>
            <div>
              <span className="text-[9px] text-zinc-400 font-mono block leading-none font-bold">REPUTATION LEVEL</span>
              <span className="text-lg font-display font-black text-white mt-0.5 block">{contributionLevel}</span>
              <span className="text-[10px] text-amber-500 font-mono font-bold">{reputationScore} Trust XP earned</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left main: Saved items & Activities */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Saved Drivers Section */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4.5 h-4.5 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
                  Saved Trusted Drivers ({savedDrivers.length})
                </h3>
              </div>
            </div>

            {savedDrivers.length === 0 ? (
              <div className="text-center py-10 bg-zinc-950/30 border border-zinc-800 border-dashed rounded-xl p-5">
                <p className="text-xs text-zinc-500 font-medium">
                  No drivers saved yet. Use the Search Registry to bookmark drivers.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {savedDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={driver.profilePhoto}
                        alt={driver.fullName}
                        className="w-11 h-11 rounded-full object-cover border border-zinc-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{driver.fullName}</h4>
                        <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
                          {driver.vehicle.color} {driver.vehicle.make} &bull; {driver.vehicle.licensePlate}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded font-mono font-bold">
                            Score: {driver.trustScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectDriver(driver)}
                        className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                        title="View Profile"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent & Trending Searches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Search Logs */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">Recent Lookups</h3>
                </div>
                {recentSearches.length > 0 && (
                  <button
                    onClick={onClearRecentSearches}
                    className="text-[9px] text-zinc-500 hover:text-zinc-300 font-mono uppercase"
                  >
                    Clear
                  </button>
                )}
              </div>

              {recentSearches.length === 0 ? (
                <p className="text-[11px] text-zinc-600 italic py-4">No recent queries.</p>
              ) : (
                <div className="space-y-1">
                  {recentSearches.map((query, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-1.5 border-b border-zinc-800/40 last:border-0 text-xs"
                    >
                      <span className="text-zinc-300 font-medium font-mono">{query}</span>
                      <span className="text-[9px] text-zinc-600 font-mono">Verified Search</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements & Milestones */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">My Achievements</h3>
              </div>

              <div className="space-y-2.5">
                {achievements.map((ach) => {
                  const IconComp = ach.icon;
                  return (
                    <div key={ach.id} className="flex gap-3 bg-zinc-950/60 border border-zinc-800/80 p-2.5 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 shrink-0 mt-0.5">
                        <IconComp className="w-4.5 h-4.5 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-[11px] font-black text-white">{ach.title}</h4>
                          <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 py-0.1 rounded font-mono uppercase">
                            {ach.tier}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-0.5">{ach.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* User's Logged Safety Reports */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-3">
              <FileText className="w-4.5 h-4.5 text-red-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
                My Submitted Incident Reports
              </h3>
            </div>

            {reports.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No incident reports logged yet.</p>
            ) : (
              <div className="space-y-2.5">
                {reports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5 flex flex-col md:flex-row justify-between gap-3 items-start md:items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] text-zinc-400 font-mono font-bold bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                          {report.id}
                        </span>
                        <span className="text-xs font-bold text-white uppercase tracking-tight">
                          {report.category.replace("_", " ")}
                        </span>
                        <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          report.status === "resolved"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                            : report.status === "pending_review"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                            : "bg-zinc-800 text-zinc-400"
                        }`}>
                          {report.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 italic">{report.description}</p>
                      <p className="text-[9px] text-zinc-500 font-mono">
                        {report.location.city}, {report.location.country} &bull; {new Date(report.timestamp).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[8px] text-zinc-500 block font-mono">SEVERITY</span>
                      <span className={`text-[10px] font-mono font-black uppercase ${
                        report.severity === "critical" || report.severity === "high"
                          ? "text-red-500"
                          : "text-amber-500"
                      }`}>
                        {report.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right side: Emergency Contacts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Emergency distress Contacts */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-red-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                  Distress Contacts
                </h3>
              </div>
              <button
                onClick={() => setShowAddContactForm(!showAddContactForm)}
                className="p-1 bg-zinc-800 hover:bg-zinc-750 text-white rounded-lg border border-zinc-700 transition-colors"
                title="Add Contact"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showAddContactForm && (
              <form onSubmit={handleAddContact} className="bg-zinc-950/80 p-3.5 border border-zinc-800 rounded-xl space-y-3">
                <span className="text-[9px] font-mono text-zinc-400 block uppercase font-bold">New Security Contact</span>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Contact Name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-500 placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Relation (e.g. Brother, Security)"
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-500 placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Phone Number"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-500 placeholder:text-zinc-500"
                  />
                </div>
                <div className="flex justify-end gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setShowAddContactForm(false)}
                    className="px-2.5 py-1 text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-amber-500 text-black font-extrabold rounded-md hover:bg-amber-400"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-zinc-950/80 border border-zinc-800/60 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-zinc-750 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{contact.name}</span>
                      <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1 py-0.2 rounded font-mono uppercase">
                        {contact.relation}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono block font-medium">{contact.phone}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveContact(index)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            
            <p className="text-[9px] text-zinc-500 leading-normal italic">
              * Distress contacts are automatically pinged via cellular SMS gateways with high-fidelity telemetry payloads upon SOS activation.
            </p>
          </div>

          {/* Core Trust Vault Stats card */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              Community Contributions
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3">
                <span className="text-[9px] text-zinc-500 font-mono block">REVIEWS</span>
                <span className="text-lg font-display font-black text-white">4</span>
              </div>
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3">
                <span className="text-[9px] text-zinc-500 font-mono block">VERIFIED VEHICLES</span>
                <span className="text-lg font-display font-black text-white">2</span>
              </div>
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3">
                <span className="text-[9px] text-zinc-500 font-mono block">SUGGESTIONS</span>
                <span className="text-lg font-display font-black text-white">1</span>
              </div>
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3">
                <span className="text-[9px] text-zinc-500 font-mono block">SENTINEL BADGES</span>
                <span className="text-lg font-display font-black text-white">3</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
