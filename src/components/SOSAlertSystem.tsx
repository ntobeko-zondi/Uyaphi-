/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  User,
  Car,
  Phone,
  Volume2,
  Navigation,
  Clock,
  MapPin,
  RefreshCcw,
  Bell,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Driver } from "../types";

interface SOSProps {
  selectedCity: string;
  selectedCountry: string;
  drivers?: Driver[];
}

export default function SOSAlertSystem({
  selectedCity,
  selectedCountry,
  drivers = [],
}: SOSProps) {
  // SOS trigger state
  const [sosState, setSosState] = useState<"idle" | "holding" | "active">("idle");
  const [holdProgress, setHoldProgress] = useState(0);
  const [timeline, setTimeline] = useState<{ time: string; event: string; isHighAlert?: boolean }[]>([]);
  const [recordingActive, setRecordingActive] = useState(false);
  const [simulatedDecibels, setSimulatedDecibels] = useState<number[]>(Array(15).fill(4));

  // Ride Shield settings & simulation
  const [activeDriverId, setActiveDriverId] = useState<string>("DRV-ZA-9821"); // Default to Sipho Khumalo for premium experience
  const [tripStarted, setTripStarted] = useState(true);
  const [duration, setDuration] = useState(142); // 2 mins 22s initial
  const [eta, setEta] = useState(12); // minutes left
  const [selectedUni, setSelectedUni] = useState<string>("None");

  // GPS Simulation coordinates (glowing track)
  const [lat, setLat] = useState(-26.2041);
  const [lng, setLng] = useState(28.0473);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const selectedDriver = drivers.find((d) => d.id === activeDriverId) || null;

  // University safety modes
  const universities = [
    { name: "None", label: "Off" },
    { name: "Wits", label: "Wits University" },
    { name: "UJ", label: "UJ (Auckland Park)" },
    { name: "UP", label: "University of Pretoria" },
    { name: "UCT", label: "UCT Rondebosch" },
  ];

  const getUniInfo = (uni: string) => {
    switch (uni) {
      case "Wits":
        return { zone: "Braamfontein / West Campus Corridor", patrol: "Wits Campus Control Rapid Dispatch" };
      case "UJ":
        return { zone: "Auckland Park Safe Corridor", patrol: "UJ Protection Services Patrol" };
      case "UP":
        return { zone: "Hatfield Campus Safe Perimeter", patrol: "UP Security Armed Unit" };
      case "UCT":
        return { zone: "Rondebosch Main Road Corridor", patrol: "UCT Campus Safety Patrol" };
      default:
        return null;
      }
  };

  const uniInfo = getUniInfo(selectedUni);

  // Auto GPS & Trip Duration increment loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (tripStarted) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
        // Random slight jitter in latitude/longitude to simulate moving on live GPS
        setLat((prev) => prev + (Math.random() - 0.5) * 0.0002);
        setLng((prev) => prev + (Math.random() - 0.5) * 0.0002);
        
        // Count down ETA slowly
        if (Math.random() > 0.85) {
          setEta((prev) => Math.max(1, prev - 1));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tripStarted]);

  // Press & Hold Logic (3 Seconds = 3000ms)
  const handleHoldStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (sosState === "active") return;
    e.preventDefault();
    setSosState("holding");
    setHoldProgress(0);

    const startTime = Date.now();
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / 3000) * 100, 100);
      setHoldProgress(pct);

      if (pct >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        activateSOS();
      }
    }, 50);
  };

  const handleHoldEnd = () => {
    if (sosState === "holding") {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      setSosState("idle");
      setHoldProgress(0);
    }
  };

  const activateSOS = () => {
    setSosState("active");
    setRecordingActive(true);

    const now = new Date().toLocaleTimeString();
    const currentDate = new Date().toLocaleDateString();

    const gpsCoords = `GPS Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    const driverDetails = selectedDriver
      ? `Driver: ${selectedDriver.fullName} (Plate: ${selectedDriver.vehicle.licensePlate}, Vehicle: ${selectedDriver.vehicle.color} ${selectedDriver.vehicle.make}, Trust Score: ${selectedDriver.trustScore}/100)`
      : "Driver Profile: Standalone emergency beacon";

    const initialEvents = [
      { time: now, event: `🚨 ACTIVE DISTRESS BEACON DEPLOYED [${currentDate} ${now}]`, isHighAlert: true },
      { time: now, event: `📡 High-Accuracy Telemetry Locked: ${gpsCoords}` },
      { time: now, event: `🚘 Synchronized E-Hailing Payload: ${driverDetails}` },
    ];

    if (selectedUni !== "None" && uniInfo) {
      initialEvents.push({
        time: now,
        event: `🎓 Campus Geofence Armed: Alert transmitted to ${selectedUni} Command Center. Armed campus response vehicle routed.`,
        isHighAlert: true,
      });
    } else {
      initialEvents.push({
        time: now,
        event: "Distress SMS tunnels opened. Live telemetry packets broadcasting to registered Emergency Contacts.",
      });
    }

    setTimeline(initialEvents);
  };

  // Audio Decibel and Timeline simulation loop during active alarm
  useEffect(() => {
    if (sosState !== "active") return;

    const events = [
      "Secure encrypted cabin microphone recording stream initialized.",
      "Distress routing sent to regional dispatch center.",
      selectedUni !== "None" && uniInfo
        ? `First responders (${uniInfo.patrol}) dispatched to live GPS vector.`
        : "Armed roadside security routed to active metropolitan coordinate stream.",
      "Incident log flagged for sovereign regional admin & moderator priority review.",
    ].filter(Boolean) as string[];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= events.length) {
        clearInterval(interval);
        return;
      }
      const now = new Date().toLocaleTimeString();
      setTimeline((prev) => [
        ...prev,
        { time: now, event: events[idx] },
      ]);
      idx++;
    }, 4000);

    // Audio frequency feedback animation loop
    audioIntervalRef.current = setInterval(() => {
      setSimulatedDecibels(
        Array(15)
          .fill(0)
          .map(() => Math.floor(Math.random() * 26) + 4)
      );
    }, 100);

    return () => {
      clearInterval(interval);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [sosState, selectedUni]);

  const resetSOS = () => {
    setSosState("idle");
    setHoldProgress(0);
    setRecordingActive(false);
    setTimeline([]);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="space-y-6" id="ride-shield-system">
      
      {/* Top Banner indicating Active Encryption Shield */}
      <div className="bg-[#131B2E] border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5.5 h-5.5 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">
                Ride Shield Live Monitoring
              </h3>
              <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold px-1.5 py-0.5 rounded animate-pulse">
                ENCRYPTED & SECURED
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
              Active telemetry tracking is streaming your spatial data directly to the SafeRide Africa network nodes.
            </p>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <label className="text-[9px] font-mono font-black text-zinc-400 uppercase shrink-0">Trip Sync:</label>
          <select
            value={activeDriverId}
            onChange={(e) => setActiveDriverId(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer min-w-[200px]"
          >
            <option value="">-- No Synchronized Driver --</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName} ({d.vehicle.licensePlate})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Live Ride Stats Card (Uber-style) */}
        <div className="lg:col-span-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-5">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
            Trip Telemetry Status
          </h3>

          {/* Active Driver Profile Info */}
          {selectedDriver ? (
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 space-y-3.5">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDriver.profilePhoto}
                  alt={selectedDriver.fullName}
                  className="w-12 h-12 rounded-full object-cover border border-zinc-800 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">{selectedDriver.fullName}</span>
                    <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 py-0.2 rounded font-mono font-bold">
                      {selectedDriver.trustScore}% TRUST
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                    {selectedDriver.operatingCity} Hub &bull; Operating
                  </p>
                </div>
              </div>

              {/* Vehicle Specification */}
              <div className="border-t border-zinc-800/60 pt-3 flex items-start gap-2.5">
                <Car className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-zinc-300 block">
                    {selectedDriver.vehicle.color} {selectedDriver.vehicle.make} {selectedDriver.vehicle.model}
                  </span>
                  <span className="font-mono text-[10px] font-black text-white bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded inline-block mt-1">
                    {selectedDriver.vehicle.licensePlate}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-950/80 border border-zinc-800 border-dashed rounded-xl p-4 text-center">
              <p className="text-xs text-zinc-500">No synchronized trip details found. Select a driver from the Sync menu.</p>
            </div>
          )}

          {/* Live GIS Shifting coordinates */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 space-y-3">
            <span className="text-[9px] font-mono font-extrabold text-zinc-500 uppercase tracking-wider block">
              Live Coordinate stream
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-900/60 border border-zinc-850 p-2 rounded-lg">
                <span className="text-[8px] text-zinc-500 font-mono block uppercase">Latitude</span>
                <span className="font-mono text-white font-semibold">{lat.toFixed(6)}</span>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-850 p-2 rounded-lg">
                <span className="text-[8px] text-zinc-500 font-mono block uppercase">Longitude</span>
                <span className="font-mono text-white font-semibold">{lng.toFixed(6)}</span>
              </div>
            </div>

            {/* Simulated mini Map path */}
            <div className="h-28 bg-zinc-900 border border-zinc-800 rounded-lg relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
              {/* Route line */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 20 90 Q 110 20, 180 80 T 320 20"
                  fill="none"
                  stroke="#3f3f46"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
                <path
                  d="M 20 90 Q 110 20, 180 80 T 320 20"
                  fill="none"
                  stroke="#EAB308"
                  strokeWidth="2"
                  strokeDashoffset="10"
                  className="animate-[dash_10s_linear_infinite]"
                />
              </svg>
              {/* Pulsing GPS dot */}
              <div className="absolute w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-lg animate-ping" />
              <div className="absolute w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white shadow-md" />
              
              <div className="absolute bottom-1.5 left-2 bg-zinc-950/80 border border-zinc-800 px-1.5 py-0.5 rounded text-[8px] font-mono text-zinc-400 font-bold">
                Wits Corridor Track
              </div>
            </div>
          </div>

          {/* Ride Duration and Estimated Arrival */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-[8px] text-zinc-500 font-mono block uppercase">DURATION</span>
                <span className="text-xs font-mono font-black text-white">{formatDuration(duration)}</span>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 flex items-center gap-2.5">
              <Navigation className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-[8px] text-zinc-500 font-mono block uppercase">ETA</span>
                <span className="text-xs font-mono font-black text-white">{eta} mins left</span>
              </div>
            </div>
          </div>

        </div>

        {/* Center/Right: Press & Hold panic target & active feed */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
          
          {/* Circular Panic Trigger Screen */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-5 bg-zinc-950/40 border border-zinc-800/60 rounded-xl shadow-inner relative overflow-hidden min-h-[340px]">
            
            {sosState === "idle" && (
              <div className="space-y-5 w-full select-none">
                <div
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  onTouchStart={handleHoldStart}
                  onTouchEnd={handleHoldEnd}
                  className="mx-auto w-32 h-32 bg-red-950/30 border-4 border-red-500/80 rounded-full flex flex-col items-center justify-center text-red-500 shadow-lg cursor-pointer transition-all active:scale-95 duration-100 hover:bg-red-950/45"
                >
                  <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest font-mono mt-1.5">HOLD PANIC</span>
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-white text-sm uppercase tracking-tight">
                    Distress Sentinel
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    <strong>Hold button for 3 seconds</strong> to stream immediate distress. Accidental triggers are geolocked.
                  </p>
                </div>
                <div className="w-full bg-zinc-850 h-2 rounded-full overflow-hidden border border-zinc-800">
                  <div className="bg-red-500 h-full transition-all duration-75" style={{ width: "0%" }} />
                </div>
                <p className="text-[9px] text-zinc-500 font-bold font-mono">0.0S RECORD TIME TARGET</p>
              </div>
            )}

            {sosState === "holding" && (
              <div className="space-y-5 w-full select-none">
                <div
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  onTouchEnd={handleHoldEnd}
                  className="mx-auto w-32 h-32 bg-red-550 bg-red-650 border-4 border-zinc-900 rounded-full flex flex-col items-center justify-center text-white shadow-xl scale-110 duration-150 relative overflow-hidden"
                >
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="#FFFFFF"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 58}
                      strokeDashoffset={2 * Math.PI * 58 * (1 - holdProgress / 100)}
                    />
                  </svg>
                  <span className="text-white font-black text-xl font-mono relative z-10">
                    {Math.max(1, Math.ceil((100 - holdProgress) / 33))}s
                  </span>
                  <span className="text-[8px] font-mono font-black tracking-widest relative z-10 text-red-100">ARMING</span>
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-red-400 text-sm uppercase tracking-wider">
                    TRANSMITTING UPLINK
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    Do not release! Active satellite responders geolocating cabin vector.
                  </p>
                </div>
                <div className="w-full bg-zinc-850 h-2 rounded-full overflow-hidden border border-zinc-850">
                  <div className="bg-red-500 h-full transition-all" style={{ width: `${holdProgress}%` }} />
                </div>
                <p className="text-[9px] text-zinc-500 font-bold font-mono">
                  {Math.min(3.0, (holdProgress * 3) / 100).toFixed(1)}s / 3.0s ACTIVE TARGET
                </p>
              </div>
            )}

            {sosState === "active" && (
              <div className="space-y-4 w-full">
                <div className="mx-auto w-28 h-28 bg-red-600 rounded-full flex items-center justify-center text-white border-2 border-zinc-900 shadow-2xl animate-bounce relative">
                  <Volume2 className="w-10 h-10 animate-pulse" />
                  <span className="absolute -inset-2.5 rounded-full border border-red-500/30 animate-[ping_1.5s_ease-in-out_infinite]" />
                </div>

                <div>
                  <span className="text-[8px] font-black text-red-400 font-mono uppercase bg-red-950/40 border border-red-800 px-2.5 py-1 rounded animate-pulse inline-block">
                    🚨 BEACON BEAM BROADCASTING LIVE
                  </span>
                  <p className="text-[11px] text-zinc-400 mt-2 font-bold leading-normal">
                    Secure cabin recording established. Regional guard response routed to current vector.
                  </p>
                </div>

                <div className="flex items-end justify-center gap-1 h-8 w-full bg-zinc-950 p-1.5 rounded border border-zinc-850">
                  {simulatedDecibels.map((db, idx) => (
                    <span
                      key={idx}
                      style={{ height: `${db}px` }}
                      className="w-1 bg-red-500 rounded-full duration-75 transition-all"
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={resetSOS}
                    className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-750 rounded text-[9px] uppercase font-mono font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <RefreshCcw className="w-3 h-3" /> Reset Alert
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right logs & safety geofence select */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                  University safety geofence
                </h4>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {universities.map((uni) => (
                  <button
                    key={uni.name}
                    onClick={() => setSelectedUni(uni.name)}
                    className={`px-2.5 py-1.5 rounded text-[9px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                      selectedUni === uni.name
                        ? "bg-amber-500 text-black border-amber-500 shadow-md font-extrabold"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    {uni.label}
                  </button>
                ))}
              </div>

              {selectedUni !== "None" && uniInfo && (
                <div className="text-[10px] text-zinc-300 bg-amber-500/5 border border-amber-500/20 px-3 py-2 rounded-lg leading-relaxed font-semibold">
                  <span className="text-amber-500 font-extrabold block mb-0.5">✓ Campus Shield Activated</span>
                  Geofence Sector: <span className="text-white">{uniInfo.zone}</span> <br />
                  Dispatcher Channel: <span className="text-white">{uniInfo.patrol}</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-none pt-2">
              <span className="text-[8px] font-mono font-extrabold text-zinc-500 uppercase tracking-widest block mb-1">
                Security log feed
              </span>
              {timeline.length === 0 ? (
                <p className="text-[10px] text-zinc-500 italic">No dispatch activity. SafeRide Shield is armed and tracking.</p>
              ) : (
                timeline.map((log, idx) => (
                  <div
                    key={idx}
                    className={`text-[10px] p-2 rounded border leading-normal ${
                      log.isHighAlert
                        ? "bg-red-500/5 border-red-500/30 text-red-200"
                        : "bg-zinc-950 border-zinc-850 text-zinc-400"
                    }`}
                  >
                    <strong className="text-white font-mono mr-1">{log.time}</strong>
                    {log.event}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[9px] font-mono text-zinc-500 font-semibold">
              <span>SRA COUPLING DISPATCH PROTOCOL</span>
              <span className="text-amber-500 font-bold">READY</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
