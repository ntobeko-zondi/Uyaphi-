/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Driver, IncidentReport, IncidentCategory } from "../types";
import { AFRICAN_COUNTRIES } from "../mockData";
import {
  AlertTriangle,
  Upload,
  UserCheck,
  UserX,
  FileText,
  X,
  Globe,
  MapPin,
  Search,
  User,
  Car,
  CheckCircle,
} from "lucide-react";

interface IncidentReportingProps {
  drivers: Driver[];
  selectedCountry: string;
  selectedCity: string;
  onAddReport: (newReport: IncidentReport) => void;
  prefilledDriverId?: string | null;
  clearPrefilledDriverId?: () => void;
}

export default function IncidentReporting({
  drivers,
  selectedCountry,
  selectedCity,
  onAddReport,
  prefilledDriverId,
  clearPrefilledDriverId,
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

  // Enhanced driver search and selection states
  const [driverSearchQuery, setDriverSearchQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [isUnlistedDriver, setIsUnlistedDriver] = useState(false);

  // Unlisted driver profile input fields
  const [unlistedDriverName, setUnlistedDriverName] = useState("");
  const [unlistedLicensePlate, setUnlistedLicensePlate] = useState("");
  const [unlistedVehicleDetails, setUnlistedVehicleDetails] = useState("");

  // Submission feedback states
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (prefilledDriverId) {
      setDriverId(prefilledDriverId);
      const drv = drivers.find((d) => d.id === prefilledDriverId);
      if (drv) {
        setSelectedDriver(drv);
        setIsUnlistedDriver(false);
        setDriverSearchQuery(drv.fullName);
        const countryObj = AFRICAN_COUNTRIES.find((c) => c.name === drv.operatingCountry);
        if (countryObj) {
          setReportCountryCode(countryObj.code);
          setReportCity(drv.operatingCity);
        }
      }
    } else {
      // Default to the header values if not prefilled
      setReportCountryCode(selectedCountry);
      setReportCity(selectedCity);
    }
  }, [prefilledDriverId, selectedCountry, selectedCity, drivers]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDriverDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Core validations
    if (!description.trim()) {
      setStatusMessage("🚨 Please provide a description of the incident.");
      return;
    }

    if (!reportCountryCode || !reportCity) {
      setStatusMessage("🚨 Jurisdiction selection required: Please select Country and City.");
      return;
    }

    if (!isUnlistedDriver && !selectedDriver) {
      setStatusMessage("🚨 Please search and select a driver, or choose 'Unlisted Driver'.");
      return;
    }

    const selectedCountryInfo = AFRICAN_COUNTRIES.find((c) => c.code === reportCountryCode);
    const reportCountryName = selectedCountryInfo ? selectedCountryInfo.name : "South Africa";

    // Format description text to include unlisted driver details if applicable
    let finalDescription = description;
    if (isUnlistedDriver) {
      const detailsHeader = `[REPORTED UNLISTED DRIVER]\nName: ${unlistedDriverName || "Unknown"}\nPlate: ${unlistedLicensePlate || "Unknown"}\nVehicle details: ${unlistedVehicleDetails || "Unknown"}\n-----------------------------------\n\n`;
      finalDescription = detailsHeader + description;
    }

    const newReport: IncidentReport = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      driverId: isUnlistedDriver ? "DRV-UNLISTED" : (selectedDriver?.id || "DRV-UNKNOWN"),
      userId: isAnonymous ? "ANON-PASSENGER" : "USR-9921",
      category,
      description: finalDescription,
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
      severity: "medium",
    };

    onAddReport(newReport);
    setSubmitSuccess(true);
    setStatusMessage("Your report has been submitted and will be reviewed.");

    // Clean prefilled states if applicable
    if (clearPrefilledDriverId) {
      clearPrefilledDriverId();
    }
  };

  const handleResetForm = () => {
    setDriverId("");
    setSelectedDriver(null);
    setDriverSearchQuery("");
    setIsUnlistedDriver(false);
    setUnlistedDriverName("");
    setUnlistedLicensePlate("");
    setUnlistedVehicleDetails("");
    setCategory("other");
    setDescription("");
    setLandmark("");
    setEvidenceFile("");
    setEvidenceFileName("");
    setReportCountryCode("");
    setReportCity("");
    setSubmitSuccess(false);
    setStatusMessage("");
  };

  // Filter drivers based on query
  const matchingDrivers = drivers.filter((drv) => {
    const q = driverSearchQuery.toLowerCase();
    return (
      drv.fullName.toLowerCase().includes(q) ||
      drv.vehicle.licensePlate.toLowerCase().includes(q) ||
      drv.vehicle.make.toLowerCase().includes(q) ||
      drv.vehicle.model.toLowerCase().includes(q) ||
      drv.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-2xl mx-auto font-sans" id="incident-reporting-view">
      
      {/* Success View Overlay */}
      {submitSuccess ? (
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-6 shadow-lg animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-black text-neutral-900 dark:text-zinc-100 text-xl uppercase tracking-tight">
              Report Filed Successfully
            </h3>
            <p className="text-sm text-neutral-500 dark:text-zinc-400 max-w-md mx-auto">
              {statusMessage || "Your report has been submitted and will be reviewed."}
            </p>
          </div>
          <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-100 dark:border-zinc-850 p-4 rounded-xl text-[11px] text-left text-neutral-450 text-neutral-500 dark:text-zinc-500 leading-relaxed font-mono">
            &bull; SafeRide Africa safety moderators review community contributions within 12 hours.<br />
            &bull; Verified patterns trigger dynamic area alerts to safeguard commuters instantly.
          </div>
          <button
            onClick={handleResetForm}
            className="w-full bg-black hover:bg-neutral-900 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-black font-mono font-black py-3 rounded text-xs uppercase duration-150 shadow"
          >
            File Another Report
          </button>
        </div>
      ) : (
        /* Standard Form view */
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <h3 className="font-display font-bold text-neutral-900 dark:text-zinc-100 text-base md:text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              File Ride-Hailing Safety Incident Report
            </h3>
            <p className="text-xs text-neutral-400 dark:text-zinc-500 font-medium mt-1">
              Log plate mismatches, off-app demands, reckless speeds, or harassment. Help protect fellow commuters.
            </p>
          </div>

          {statusMessage && (
            <div className="p-3 bg-red-500/10 dark:bg-red-950/20 border border-red-500/20 text-red-700 dark:text-red-400 rounded text-xs font-semibold">
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            {/* Geographic sector selection (Required) */}
            <div className="bg-neutral-50/70 dark:bg-zinc-950/70 border border-neutral-200 dark:border-zinc-850 rounded-xl p-4 space-y-3">
              <span className="text-[10px] text-neutral-500 dark:text-zinc-400 font-mono uppercase font-black tracking-widest block leading-none flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-neutral-600 dark:text-amber-500" />
                Incident Location Jurisdiction *
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[8px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-2">
                    Country of Incident
                  </label>
                  <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-lg px-3 py-1 shadow-sm">
                    <Globe className="w-4 h-4 text-neutral-400 shrink-0 mr-1.5" />
                    <select
                      value={reportCountryCode}
                      onChange={(e) => {
                        setReportCountryCode(e.target.value);
                        setReportCity(""); // reset city
                      }}
                      required
                      className="w-full bg-transparent text-xs font-semibold text-neutral-800 dark:text-zinc-200 outline-none border-none cursor-pointer py-1.5"
                    >
                      <option value="" className="text-neutral-400 dark:text-zinc-500 bg-white dark:bg-zinc-900">-- Select Country --</option>
                      {AFRICAN_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code} className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100">
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-2">
                    City / Metro of Incident
                  </label>
                  <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-lg px-3 py-1 shadow-sm">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mr-1.5" />
                    <select
                      value={reportCity}
                      onChange={(e) => setReportCity(e.target.value)}
                      required
                      disabled={!reportCountryCode}
                      className="w-full bg-transparent text-xs font-semibold text-neutral-800 dark:text-zinc-200 outline-none border-none cursor-pointer py-1.5 disabled:opacity-50"
                    >
                      <option value="" className="text-neutral-400 dark:text-zinc-500 bg-white dark:bg-zinc-900">-- Select City --</option>
                      {AFRICAN_COUNTRIES.find((c) => c.code === reportCountryCode)?.cities.map((city) => (
                        <option key={city} value={city} className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100">
                          {city} Metro
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Driver / Vehicle Selector */}
            <div className="bg-neutral-50/70 dark:bg-zinc-950/70 border border-neutral-200 dark:border-zinc-850 rounded-xl p-4 space-y-3.5">
              <span className="text-[10px] text-neutral-500 dark:text-zinc-400 font-mono uppercase font-black tracking-widest block leading-none flex items-center gap-1.5">
                <User className="w-4 h-4 text-neutral-600 dark:text-amber-500" />
                Target Driver / Vehicle Identification
              </span>

              {/* Integrated Search Selector */}
              <div ref={searchContainerRef} className="relative">
                <label className="block text-[8px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-2">
                  Search Registered Drivers / Vehicles
                </label>
                
                <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-lg px-3 py-1 shadow-sm">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-1.5" />
                  <input
                    type="text"
                    placeholder="Search driver name, vehicle brand, or license plate..."
                    value={driverSearchQuery}
                    onChange={(e) => {
                      setDriverSearchQuery(e.target.value);
                      setShowDriverDropdown(true);
                      setIsUnlistedDriver(false);
                    }}
                    onFocus={() => setShowDriverDropdown(true)}
                    className="w-full bg-transparent text-xs font-semibold text-neutral-800 dark:text-zinc-200 outline-none border-none py-1.5"
                  />
                  {(selectedDriver || isUnlistedDriver) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDriver(null);
                        setDriverId("");
                        setDriverSearchQuery("");
                        setIsUnlistedDriver(false);
                      }}
                      className="text-xs text-neutral-400 hover:text-neutral-600 font-bold uppercase tracking-tight"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Dropdown list */}
                {showDriverDropdown && (
                  <div className="absolute z-150 top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-lg shadow-lg max-h-56 overflow-y-auto divide-y divide-neutral-150 dark:divide-zinc-850">
                    {matchingDrivers.map((drv) => (
                      <button
                        key={drv.id}
                        type="button"
                        onClick={() => {
                          setSelectedDriver(drv);
                          setDriverId(drv.id);
                          setDriverSearchQuery(drv.fullName);
                          setIsUnlistedDriver(false);
                          setShowDriverDropdown(false);
                        }}
                        className="w-full text-left p-3 hover:bg-neutral-50 dark:hover:bg-zinc-950 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-neutral-200">
                          <img src={drv.profilePhoto || null} alt={drv.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-neutral-900 dark:text-zinc-100 truncate">{drv.fullName}</h5>
                          <p className="text-[10px] text-neutral-400 font-mono truncate">
                            {drv.vehicle.make} {drv.vehicle.model} &bull; Plate {drv.vehicle.licensePlate}
                          </p>
                        </div>
                        <span className="text-[8px] bg-neutral-100 dark:bg-zinc-800 text-neutral-500 px-1.5 py-0.5 rounded font-mono uppercase font-bold shrink-0">
                          {drv.id}
                        </span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setIsUnlistedDriver(true);
                        setSelectedDriver(null);
                        setDriverId("DRV-UNLISTED");
                        setDriverSearchQuery("Report Unlisted Driver / Vehicle");
                        setShowDriverDropdown(false);
                      }}
                      className="w-full text-left p-3 hover:bg-amber-500/10 bg-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center gap-2.5 transition-colors cursor-pointer font-bold font-sans text-xs"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Driver not found? Report as Unlisted Driver/Vehicle</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Verified Driver Display Card */}
              {selectedDriver && (
                <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200">
                    <img src={selectedDriver.profilePhoto || null} alt={selectedDriver.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-zinc-100 flex items-center gap-1.5 leading-none">
                      {selectedDriver.fullName}
                      <span className="text-[9px] bg-neutral-100 dark:bg-zinc-800 text-neutral-500 font-mono px-1.5 py-0.5 rounded">
                        {selectedDriver.id}
                      </span>
                    </h5>
                    <p className="text-[11px] text-neutral-500 dark:text-zinc-400 font-medium mt-1">
                      {selectedDriver.vehicle.color} {selectedDriver.vehicle.make} {selectedDriver.vehicle.model} &bull; License Plate: <strong className="font-mono text-neutral-900 dark:text-zinc-100">{selectedDriver.vehicle.licensePlate}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Unlisted Driver Profile Form */}
              {isUnlistedDriver && (
                <div className="bg-white dark:bg-zinc-900 border border-amber-500/20 rounded-lg p-4 space-y-3 shadow-inner">
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500 font-extrabold font-mono uppercase tracking-tight">
                    <Car className="w-4 h-4" />
                    Unlisted Driver & Vehicle Context
                  </div>
                  <p className="text-[10px] text-neutral-400 dark:text-zinc-500 font-semibold leading-relaxed">
                    Provide any known details about the unregistered driver or vehicle so moderators can track cross-platform records.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[8px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-1.5">
                        Driver Name / Alias
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. John (from app)"
                        value={unlistedDriverName}
                        onChange={(e) => setUnlistedDriverName(e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded px-2.5 py-1.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-1.5">
                        License Plate Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CA 123-456"
                        value={unlistedLicensePlate}
                        onChange={(e) => setUnlistedLicensePlate(e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded px-2.5 py-1.5 text-xs text-neutral-800 dark:text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[8px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-1.5">
                        Vehicle Brand, Model or Color
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Silver Toyota Avanza, cracked left taillight"
                        value={unlistedVehicleDetails}
                        onChange={(e) => setUnlistedVehicleDetails(e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded px-2.5 py-1.5 text-xs text-neutral-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Base Category classification selection */}
            <div>
              <label className="block text-[8px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-2">
                PROVISIONAL VIOLATION CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 focus:border-black dark:focus:border-amber-500 focus:outline-none rounded-lg px-3 py-2.5 text-xs text-neutral-800 dark:text-zinc-200 font-medium cursor-pointer"
              >
                <option value="unsafe_driving" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100">Unsafe / Reckless Driving Speed</option>
                <option value="harassment" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100">Verbal / Threatening Harassment</option>
                <option value="theft" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100">Personal Luggage/Possessions Hijack</option>
                <option value="fraud" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100">Plate/Vehicle Impersonation Scam</option>
                <option value="overcharging" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100">Off-App Extra Charges Coercion</option>
                <option value="vehicle_issues" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100">Deficient/Damaged Cabin Condition</option>
                <option value="reckless_behavior" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100">Physical Assault or Drunk Actions</option>
                <option value="accident" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100">Involvement in Traffic Collision</option>
                <option value="other" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100">Other Protocol Safety Breaches</option>
              </select>
            </div>

            <div>
              <label className="block text-[8px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-2">
                SECTOR METRO LANDMARK OR CORRIDOR
              </label>
              <input
                type="text"
                placeholder="e.g. Airport Terminals road ramp, or Rosebank Mall east corner, Johannesburg"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 focus:border-black dark:focus:border-amber-500 focus:outline-none rounded-lg px-3 py-2.5 text-xs md:text-sm text-neutral-900 dark:text-zinc-100 font-medium placeholder:text-neutral-400 dark:placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[8px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-2">
                DESCRIPTION OF VEHICLE & DRIVER INFRACTION
              </label>
              <textarea
                required
                rows={5}
                placeholder="Provide a detailed, objective narrative. Mention exact dialogue, requested payments, route diversions, threatening gestures, or vehicle plates that did not match your e-hailing app booking screen..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 focus:border-black dark:focus:border-amber-500 focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 dark:text-zinc-100 placeholder:text-neutral-400 dark:placeholder:text-zinc-500 font-medium leading-relaxed"
              />
            </div>

            {/* Evidence Upload Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[8px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-2 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500" />
                  Evidence Photo / Receipt Screenshot
                </label>
                <div
                  className={`bg-neutral-50 dark:bg-zinc-950 border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all duration-150 relative text-center flex flex-col items-center justify-center min-h-[96px] ${
                    dragActive ? "border-black dark:border-amber-500 bg-neutral-100 dark:bg-zinc-900" : "border-neutral-200 dark:border-zinc-800 hover:border-black dark:hover:border-amber-500"
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
                        <div className="relative w-16 h-16 rounded border border-neutral-200 dark:border-zinc-800 overflow-hidden bg-neutral-100 dark:bg-zinc-900 shadow-sm">
                          <img
                            src={evidenceFile || null}
                            alt="Evidence preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-neutral-100 dark:bg-zinc-900 rounded border border-neutral-200 dark:border-zinc-800 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-neutral-500 dark:text-zinc-400" />
                        </div>
                      )}
                      <span className="text-xs font-mono font-bold text-neutral-800 dark:text-zinc-200 max-w-[180px] truncate block">
                        {evidenceFileName || "Uploaded File"}
                      </span>
                      
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute -top-1 -right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all cursor-pointer shadow-sm"
                        title="Remove file"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-neutral-400 dark:text-zinc-500 mb-1" />
                      <span className="block text-[10px] font-mono font-black text-neutral-600 dark:text-zinc-400 uppercase tracking-wider leading-none">
                        Drag & Drop File Here
                      </span>
                      <span className="block text-[9px] text-neutral-450 text-neutral-400 dark:text-zinc-500 font-bold mt-1.5 uppercase tracking-tight">
                        Or click to browse from system
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Anonymous Toggle Switch */}
              <div className="flex flex-col justify-between p-4 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-neutral-800 dark:text-zinc-200 flex items-center gap-1.5" id="de-identify-passenger-label">
                      <UserX className="w-4 h-4 text-neutral-500 dark:text-zinc-400" />
                      De-identify Passenger Profile
                    </span>
                    <p className="text-[10px] text-neutral-400 dark:text-zinc-500 leading-relaxed font-semibold pr-1">
                      Omits your real name, email, and avatar from publicly visible community reports. Safety moderators verify all metrics securely to guarantee high reliability without displaying personal data.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 cursor-pointer ${
                      isAnonymous ? "bg-black dark:bg-amber-500" : "bg-neutral-200 dark:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white dark:bg-zinc-950 w-4 h-4 rounded-full transition-transform ${
                        isAnonymous ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-black hover:bg-neutral-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-mono font-black py-4 px-4 rounded text-xs uppercase tracking-wider duration-150 shadow-md cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
