import React, { useState } from "react";
import { User, Mail, Shield, Award, Calendar, ChevronRight, CheckCircle2, RefreshCw } from "lucide-react";

interface UserProfilePageProps {
  userName: string;
  userEmail: string;
  trustScore: number;
  xp: number;
  streakDays: number;
  unlockedBadgesCount: number;
  recentSearches: string[];
  reportsCount: number;
  speak: (text: string) => void;
}

export default function UserProfilePage({
  userName,
  userEmail,
  trustScore,
  xp,
  streakDays,
  unlockedBadgesCount,
  recentSearches,
  reportsCount,
  speak
}: UserProfilePageProps) {
  const [activeSubTab, setActiveSubTab] = useState<"details" | "logs">("details");

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header section */}
      <div>
        <span className="text-[9px] font-mono text-amber-500 font-extrabold uppercase tracking-widest block mb-1">
          [ REGIONAL CITATION INDEX ]
        </span>
        <h2 className="text-2xl font-bold tracking-tight">
          Your Commuter Profile
        </h2>
        <p className="text-xs text-zinc-400">
          Secure, on-chain identifier for safe transit across East and South Africa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Avatar Card & Identity Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-950/60 border border-zinc-850 rounded-3xl p-6 text-center space-y-4 shadow-lg relative overflow-hidden">
            
            {/* Soft decorative light */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-xl">
                <User className="w-12 h-12" />
              </div>
              <div className="absolute bottom-0 right-1 w-6 h-6 bg-emerald-500 border-2 border-zinc-950 rounded-full flex items-center justify-center text-white" title="Identity Verified">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{userName}</h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{userEmail}</p>
            </div>

            <div className="border-t border-zinc-850/80 pt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 bg-zinc-900/60 rounded-xl">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">TRUST LEVEL</span>
                <span className="text-white font-bold block mt-1">DIAMOND</span>
              </div>
              <div className="p-2.5 bg-zinc-900/60 rounded-xl">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">REGISTRATION</span>
                <span className="text-zinc-300 font-mono font-bold block mt-1 text-[10px]">VERIFIED</span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 leading-relaxed pt-2 font-mono">
              Member ID: UYA-{trustScore}-{streakDays}-{userName.substring(0, 3).toUpperCase()}
            </p>
          </div>

          {/* Quick Account Information Form (Visual, clean, read-only/editable) */}
          <div className="bg-zinc-950/40 border border-zinc-850 rounded-3xl p-5 space-y-3 shadow-md">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-850 pb-2">
              Registration Meta
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </span>
                <span className="text-white font-semibold">{userName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </span>
                <span className="text-white font-semibold font-mono">{userEmail}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Registry Date
                </span>
                <span className="text-white font-semibold">2026-06-24</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Security Standard
                </span>
                <span className="text-amber-500 font-bold font-mono text-[10px]">POPIA METRO LEVEL A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Activity Log & Stats Summary */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Subtabs for detail stats and activity log */}
          <div className="flex border-b border-zinc-850/80">
            <button
              onClick={() => setActiveSubTab("details")}
              className={`pb-3 px-4 text-xs font-bold font-sans uppercase tracking-wider relative cursor-pointer ${
                activeSubTab === "details" ? "text-amber-500 font-extrabold" : "text-zinc-500 hover:text-white"
              }`}
            >
              Overview & Statistics
              {activeSubTab === "details" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
              )}
            </button>
            <button
              onClick={() => setActiveSubTab("logs")}
              className={`pb-3 px-4 text-xs font-bold font-sans uppercase tracking-wider relative cursor-pointer ${
                activeSubTab === "logs" ? "text-amber-500 font-extrabold" : "text-zinc-500 hover:text-white"
              }`}
            >
              Vigilance Activity History
              {activeSubTab === "logs" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
              )}
            </button>
          </div>

          {activeSubTab === "details" ? (
            <div className="space-y-6 animate-fade-in">
              {/* Detailed scorecard grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-5 bg-zinc-950/40 border border-zinc-850 rounded-2xl space-y-2">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">VIGILANCE POWER</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <p className="text-2xl font-extrabold text-white">{unlockedBadgesCount}</p>
                    <span className="text-xs text-zinc-500">Badges Unlocked</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 border-t border-zinc-850/40 mt-2">
                    Hexagonal souvenirs earned through direct verification lookups, background check audits, and positive driver commendations.
                  </p>
                </div>

                <div className="p-5 bg-zinc-950/40 border border-zinc-850 rounded-2xl space-y-2">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">REGISTRY CHECKS</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <p className="text-2xl font-extrabold text-white">{recentSearches.length}</p>
                    <span className="text-xs text-zinc-500">Total License Audits</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 border-t border-zinc-850/40 mt-2">
                    Number of unique e-hailing and rideshare vehicle plate numbers scanned, cross-referenced, and audited for regional passenger security.
                  </p>
                </div>

                <div className="p-5 bg-zinc-950/40 border border-zinc-850 rounded-2xl space-y-2">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">COMMUNITY VIGILANCE</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <p className="text-2xl font-extrabold text-white">{reportsCount}</p>
                    <span className="text-xs text-zinc-500">Reports Contributed</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 border-t border-zinc-850/40 mt-2">
                    Legitimate logs added to help warn other regional commuters of vehicle impersonation or hazardous transit situations.
                  </p>
                </div>

                <div className="p-5 bg-zinc-950/40 border border-zinc-850 rounded-2xl space-y-2">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">TOTAL REPUTATION XP</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <p className="text-2xl font-extrabold text-amber-500">{xp} XP</p>
                    <span className="text-xs text-zinc-500">Level Progression</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 border-t border-zinc-850/40 mt-2">
                    Combined experience points accrued through active platform contributions. Higher XP unlocks Uyaphi Certified Credentials.
                  </p>
                </div>

              </div>

              {/* Security notice card */}
              <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                  <Shield className="w-4 h-4 shrink-0" />
                  UYAPHI SECURE IDENTITY MANDATE
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Your Uyaphi profile operates completely detached from personal commercial ridesharing identifiers. Uyaphi does not share any transit verification audits or user logs with external transport aggregators to respect user privacy and adhere strictly to regional POPIA constraints.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Chronological List of audits/logs */}
              <div className="space-y-3">
                {recentSearches.map((query, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-2xl flex justify-between items-center text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl shrink-0 font-bold font-mono">
                        VET
                      </div>
                      <div>
                        <p className="font-mono font-bold text-white">License Plate Audited: {query}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Cross-referenced Uyaphi Driver registry for state compliance</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">2026-06-24</span>
                  </div>
                ))}
                
                <div className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-2xl flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0 font-bold font-mono">
                      LOG
                    </div>
                    <div>
                      <p className="font-bold text-white">Community Safety Report Submitted</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Report logged inside regional database metro logs</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">2026-06-24</span>
                </div>

                <div className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-2xl flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl shrink-0 font-bold font-mono">
                      SEC
                    </div>
                    <div>
                      <p className="font-bold text-white">Account Created & Identity Audited</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Authorized via secure biometric passport verification</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">2026-06-24</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
