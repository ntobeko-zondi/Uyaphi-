/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Driver, IncidentReport, IncidentCategory } from "../types";
import { AFRICAN_COUNTRIES } from "../mockData";
import {
  AlertTriangle,
  Upload,
  UserCheck,
  BrainCircuit,
  Sparkles,
  Info,
  UserX,
  FileText,
  X,
  Globe,
  MapPin,
} from "lucide-react";

interface IncidentReportingProps {
  drivers: Driver[];
  selectedCountry: string;
  selectedCity: string;
  onAddReport: (newReport: IncidentReport) => void;
}

export default function IncidentReporting({
  drivers,
  selectedCountry,
  selectedCity,
  onAddReport,
}: IncidentReportingProps) {
  const [driverId, setDriverId] = useState("");
  const [category, setCategory] = useState<IncidentCategory>("other");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [landmark, setLandmark] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<string>("");
  const [evidenceFileName, setEvidenceFileName] = useState<string>("");

  // Required jurisdiction selection states
  const [reportCountryCode, setReportCountryCode] = useState("");
  const [reportCity, setReportCity] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setEvidenceFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEvidenceFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEvidenceFile("");
    setEvidenceFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // AI Classification Status States
  const [scannerData, setScannerData] = useState<{
    suggestedCategory: IncidentCategory;
    toxicityScore: number;
    sentiment: string;
    isLikelyFake: boolean;
    confidence: number;
    reasoning: string;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleAiScan = async () => {
    if (!description || description.trim().length < 10) {
      setStatusMessage("Write at least 10 characters to perform the AI verity scanning.");
      return;
    }

    setIsScanning(true);
    setStatusMessage("");
    setScannerData(null);

    try {
      const response = await fetch("/api/analyze-incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const parsed = await response.json();
      setScannerData(parsed);
      
      // Update local dropdown to match suggested category if confidence is high
      if (parsed.suggestedCategory && parsed.confidence > 0.8) {
        setCategory(parsed.suggestedCategory);
      }
    } catch (err: any) {
      console.error("AI scanning failure:", err);
      setStatusMessage("Unable to route real-time review. Falling back to local heuristics.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    if (!reportCountryCode || !reportCity) {
      setStatusMessage("🚨 ACTION REQUIRED: You must select both Country and City jurisdiction where the incident occurred.");
      return;
    }

    const selectedCountryInfo = AFRICAN_COUNTRIES.find((c) => c.code === reportCountryCode);
    const reportCountryName = selectedCountryInfo ? selectedCountryInfo.name : "South Africa";

    const newReport: IncidentReport = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      driverId: driverId || "DRV-UNKNOWN",
      userId: isAnonymous ? "ANON-PASSENGER" : "USR-9921",
      category,
      description,
      timestamp: new Date().toISOString(),
      location: {
        city: reportCity,
        country: reportCountryName,
        latitude: -26.2041 + (Math.random() - 0.5) * 0.1,
        longitude: 28.0473 + (Math.random() - 0.5) * 0.1,
        landmark: landmark || undefined,
      },
      evidenceUrls: evidenceFile ? [evidenceFile] : [],
      isAnonymous,
      status: "pending_review",
      severity: scannerData?.toxicityScore && scannerData.toxicityScore > 0.7 ? "critical" : "medium",
      aiClassification: scannerData ? {
        ...scannerData,
        isLikelyFake: scannerData.isLikelyFake,
      } : undefined,
    };

    onAddReport(newReport);
    
    // Reset Form
    setDriverId("");
    setCategory("other");
    setDescription("");
    setLandmark("");
    setEvidenceFile("");
    setEvidenceFileName("");
    setReportCountryCode("");
    setReportCity("");
    setScannerData(null);
    setStatusMessage("Incident audit log compiled and submitted to rideshare moderators.");
  };

  const selectedDriverProfile = drivers.find((d) => d.id === driverId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="incident-submission-node">
      {/* Incident Input Form Box */}
      <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-5">
        <div>
          <h3 className="font-display font-bold text-neutral-905 text-neutral-900 text-base md:text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-650 text-red-600" />
            File Rideshare Incident Statement
          </h3>
          <p className="text-xs text-neutral-400 font-medium mt-1">
            Log an off-protocol behaviour, plate disparity, harassment or overcharging. Statements are encrypted under global compliance regulations.
          </p>
        </div>

        {statusMessage && (
          <div className="p-3.5 bg-neutral-950 text-white rounded border border-neutral-800 text-xs font-mono font-bold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-white" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Geographic sector selection (Required) */}
          <div className="bg-neutral-50/70 border border-neutral-200 rounded-xl p-4 space-y-3">
            <span className="text-[10px] text-neutral-500 font-mono uppercase font-black tracking-widest block leading-none flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-neutral-600 animate-[spin_8s_linear_infinite]" />
              Incident Location Jurisdiction *
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">
                  Country of Incident
                </label>
                <div className="relative flex items-center bg-white border border-neutral-200 rounded-lg px-3 py-1 shadow-sm">
                  <Globe className="w-4 h-4 text-neutral-400 shrink-0 mr-1.5" />
                  <select
                    value={reportCountryCode}
                    onChange={(e) => {
                      setReportCountryCode(e.target.value);
                      setReportCity(""); // reset city
                    }}
                    required
                    className="w-full bg-transparent text-xs font-semibold text-neutral-800 outline-none border-none cursor-pointer py-1.5"
                  >
                    <option value="" className="text-neutral-400">-- Select Country --</option>
                    {AFRICAN_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code} className="bg-white text-neutral-900">
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">
                  City / Metro of Incident
                </label>
                <div className="relative flex items-center bg-white border border-neutral-200 rounded-lg px-3 py-1 shadow-sm">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mr-1.5" />
                  <select
                    value={reportCity}
                    onChange={(e) => setReportCity(e.target.value)}
                    required
                    disabled={!reportCountryCode}
                    className="w-full bg-transparent text-xs font-semibold text-neutral-800 outline-none border-none cursor-pointer py-1.5 disabled:opacity-50"
                  >
                    <option value="" className="text-neutral-400">-- Select City --</option>
                    {AFRICAN_COUNTRIES.find((c) => c.code === reportCountryCode)?.cities.map((city) => (
                      <option key={city} value={city} className="bg-white text-neutral-900">
                        {city} Metro
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Associate with specific driver */}
            <div>
              <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">
                TARGET PLATE ID / DRIVER DEVIANT
              </label>
              <select
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:outline-none rounded-lg px-3 py-2.5 text-xs text-neutral-800 font-medium cursor-pointer"
              >
                <option value="">-- Unlisted Driver / General Traffic --</option>
                {drivers.map((drv) => (
                  <option key={drv.id} value={drv.id}>
                    {drv.fullName} ({drv.id})
                  </option>
                ))}
              </select>
              {selectedDriverProfile && (
                <p className="text-[9px] text-black mt-1.5 font-bold font-mono uppercase bg-neutral-100 border inline-block px-1.5 py-0.5 rounded-sm">
                  Active Card: {selectedDriverProfile.vehicle.make} &bull; Plate {selectedDriverProfile.vehicle.licensePlate}
                </p>
              )}
            </div>

            {/* Base Category classification selection */}
            <div>
              <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">
                PROVISIONAL VIOLATION CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:outline-none rounded-lg px-3 py-2.5 text-xs text-neutral-800 font-medium cursor-pointer"
              >
                <option value="unsafe_driving">Unsafe / Reckless Driving Speed</option>
                <option value="harassment">Verbal / Threatening Harassment</option>
                <option value="theft">Personal Luggage/Possessions Hijack</option>
                <option value="fraud">Plate/Vehicle Impersonation Scam</option>
                <option value="overcharging">Off-App Extra Charges Coercion</option>
                <option value="vehicle_issues">Deficient/Damaged Cabin Condition</option>
                <option value="reckless_behavior">Physical Assault or Drunk Actions</option>
                <option value="accident">Involvement in Traffic Collision</option>
                <option value="other">Other Protocol Safety Breaches</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">
              SECTOR METRO LANDMARK OR CORRIDOR
            </label>
            <input
              type="text"
              placeholder="e.g. Airport Terminals road ramp, or Rosebank Mall east corner, Johannesburg"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:outline-none rounded-lg px-3 py-2.5 text-sm text-neutral-900 font-medium placeholder:text-neutral-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono">
                DESCRIPTION OF VEHICLE & DRIVER INFRACTION
              </label>
              <button
                type="button"
                onClick={handleAiScan}
                disabled={isScanning || !description}
                className="text-[9px] bg-black hover:bg-neutral-900 text-white px-3 py-1 rounded-sm font-black font-mono uppercase duration-150 inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isScanning ? "Processing..." : "LAUNCH PRE-PARSER SCAN"}
              </button>
            </div>
            <textarea
              required
              rows={4}
              placeholder="Provide a detailed, objective narrative. Mention exact dialogue, requested payments, route diversions, threatening gestures, or vehicle plates that did not match your e-hailing app booking screen..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 font-medium leading-relaxed"
            />
            <p className="text-[10px] text-neutral-400 font-medium mt-1.5 italic">
              Statement pre-parsers automatically flag retaliatory, toxic, or low-context logs to safeguard professional independent drivers.
            </p>
          </div>

          {/* Evidence Upload Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-neutral-400" />
                Evidence Photo / Receipt Screenshot
              </label>
              <div
                className={`bg-neutral-50 border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all duration-150 relative text-center flex flex-col items-center justify-center min-h-[96px] ${
                  dragActive ? "border-black bg-neutral-100" : "border-neutral-200 hover:border-black"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileBrowser}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*,application/pdf,.csv,.doc,.docx,.txt"
                />
                
                {evidenceFile ? (
                  <div className="flex flex-col items-center justify-center w-full h-full gap-2 relative">
                    {evidenceFile.startsWith("data:image/") ? (
                      <div className="relative w-16 h-16 rounded border border-neutral-200 overflow-hidden bg-neutral-100 shadow-sm">
                        <img
                          src={evidenceFile}
                          alt="Evidence preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-neutral-100 rounded border border-neutral-200 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-neutral-500" />
                      </div>
                    )}
                    <span className="text-xs font-mono font-bold text-neutral-800 max-w-[180px] truncate block">
                      {evidenceFileName || "Uploaded File"}
                    </span>
                    
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute -top-1 -right-1 p-1 bg-red-650 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all cursor-pointer shadow-sm"
                      title="Remove file"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                    <span className="block text-[10px] font-mono font-black text-neutral-600 uppercase tracking-wider leading-none">
                      Drag & Drop File Here
                    </span>
                    <span className="block text-[9px] text-neutral-400 font-bold mt-1.5 uppercase tracking-tight">
                      Or click to browse from system
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Anonymous Toggle Switch */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <UserX className="w-4 h-4 text-neutral-500" />
                  De-identify Passenger profile
                </span>
                <p className="text-[10px] text-neutral-400 font-medium leading-none">Logs remain high-verity but anonymous</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                  isAnonymous ? "bg-black" : "bg-neutral-200"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    isAnonymous ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-black hover:bg-neutral-900 text-white font-mono font-black py-4 px-4 rounded text-xs uppercase duration-150 shadow-md cursor-pointer"
            >
              COMPILE AND DEPLOY AUDIT STATEMENT
            </button>
          </div>
        </form>
      </div>

      {/* Dynamic AI Analysis Inspection Screen */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        {scannerData ? (
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden divide-y divide-neutral-150 h-full">
            {/* AI Scanning header */}
            <div className="p-5 bg-black text-white flex items-center gap-2.5">
              <div className="w-9 h-9 bg-neutral-900 border border-neutral-800 text-white rounded flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-neutral-200" />
              </div>
              <div>
                <span className="text-[8px] font-black text-neutral-400 font-mono uppercase tracking-widest leading-none">
                  COGNITIVE RECONSTRUCT CORE
                </span>
                <h4 className="font-display font-medium text-white text-sm md:text-base mt-2 leading-none">
                  AI Verity Classifier
                </h4>
              </div>
            </div>

            {/* Smart Classification Metrics gauges */}
            <div className="p-5 space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-3.5 text-neutral-700">
                {/* Sentiment Meter */}
                <div className="bg-neutral-50 border border-neutral-200 p-3.5 rounded">
                  <span className="text-[8px] text-neutral-400 font-black font-mono uppercase block">EMOTION DENSITY</span>
                  <span className="text-xs font-bold text-neutral-850 text-neutral-800 uppercase tracking-tight mt-1.5 inline-block font-mono">
                    {scannerData.sentiment}
                  </span>
                </div>

                {/* AI Predicted Category */}
                <div className="bg-neutral-50 border border-neutral-200 p-3.5 rounded">
                  <span className="text-[8px] text-neutral-400 font-black font-mono uppercase block">CLASSIFIED COMPLIANCE</span>
                  <span className="text-xs font-bold text-neutral-850 text-neutral-800 uppercase tracking-tight mt-1.5 inline-block font-mono truncate max-w-[120px]">
                    {scannerData.suggestedCategory.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Toxicity gauge */}
              <div>
                <div className="flex justify-between items-center text-xs text-neutral-700 font-bold font-sans">
                  <span>Adversarial/Toxicity Index</span>
                  <span className="font-mono text-red-600 font-black">
                    {(scannerData.toxicityScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full mt-2 overflow-hidden border border-neutral-200/50">
                  <div
                    style={{ width: `${scannerData.toxicityScore * 100}%` }}
                    className={`h-full rounded-full ${
                      scannerData.toxicityScore > 0.7
                        ? "bg-red-650 bg-red-600"
                        : "bg-black"
                    }`}
                  />
                </div>
              </div>

              {/* AI Confidence gauge */}
              <div>
                <div className="flex justify-between items-center text-xs text-neutral-700 font-bold font-sans">
                  <span>Pattern Classification Confidence</span>
                  <span className="font-mono text-black font-black">
                    {(scannerData.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full mt-2 overflow-hidden border border-neutral-200/50">
                  <div
                    style={{ width: `${scannerData.confidence * 100}%` }}
                    className="h-full bg-neutral-850 bg-black rounded-full"
                  />
                </div>
              </div>

              {/* Spam warning indicators */}
              <div
                className={`p-4 rounded border flex gap-3 items-start text-xs leading-relaxed ${
                  scannerData.isLikelyFake
                    ? "bg-red-50/50 border-red-200 text-red-900"
                    : "bg-neutral-50 border-neutral-200 text-neutral-800"
                }`}
              >
                <Info className="w-4.5 h-4.5 shrink-0 mt-0.5 text-neutral-550" />
                <div>
                  <span className="font-mono font-black tracking-widest uppercase text-[8px] leading-none block">
                    {scannerData.isLikelyFake ? "SUSPICIOUS COMPOSITION VETO" : "RECORD VALIDATED"}
                  </span>
                  <p className="mt-1.5 text-[11px] font-sans font-medium">
                    {scannerData.isLikelyFake
                      ? "Warning: Report payload possesses low contextual density or structural repetition traits typical of falsified reviews."
                      : "Semantic structure verified. Narrated safety patterns and corridors correlate with historical sector activity data."}
                  </p>
                </div>
              </div>
            </div>

            {/* Behind the prompt explanation */}
            <div className="p-5 bg-neutral-950 text-white text-[11px]">
              <h5 className="font-mono font-black text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-neutral-400" />
                AI COGNITIVE DIRECTIVE LOGIC
              </h5>
              <p className="text-neutral-400 font-sans font-medium mt-2.5 leading-relaxed">
                {scannerData.reasoning}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-neutral-350 border-neutral-300 rounded-xl text-center p-8 flex flex-col justify-center items-center h-[460px] shadow-sm">
            <span className="w-10 h-10 bg-black text-white hover:bg-neutral-800 rounded flex items-center justify-center font-bold font-mono text-sm leading-none select-none mb-4 animate-[pulse_3s_infinite]">
              AI
            </span>
            <h4 className="font-display font-bold text-neutral-800 text-xs uppercase tracking-wide">Gemini Cognitive Auditor</h4>
            <p className="text-xs text-neutral-400 mt-2 max-w-xs leading-normal font-medium mx-auto">
              Draft your ride-hailing narrative on the left panel, then hit <strong>LAUNCH PRE-PARSER SCAN</strong>. Gemini will analyze toxicity, identify spam signals, and assist core moderators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
