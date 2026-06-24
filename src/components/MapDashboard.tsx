/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { DangerZoneHotspot, SafetyAlert } from "../types";
import { MapPin, Shield, AlertTriangle, ZoomIn, ZoomOut, Flame, Compass, Info, X, GraduationCap } from "lucide-react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";

interface MapDashboardProps {
  hotspots: DangerZoneHotspot[];
  alerts: SafetyAlert[];
  selectedCity: string;
  selectedCountry: string;
  onAddHotspot: (newHotspot: DangerZoneHotspot) => void;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY" && API_KEY.trim() !== "";

// Custom Circle component utilizing native google.maps overlays inside react-google-maps
interface CircleProps {
  center: { lat: number; lng: number };
  radius: number;
  options?: any;
}

function MapCircle({ center, radius, options }: CircleProps) {
  const map = useMap();
  const circleRef = useRef<any>(null);

  const { fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight } = options || {};

  useEffect(() => {
    if (!map) return;

    const g = (window as any).google;
    if (!g || !g.maps) return;

    const circle = new g.maps.Circle({
      map,
      center,
      radius,
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity,
      strokeWeight,
    });
    circleRef.current = circle;

    return () => {
      circle.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setCenter(center);
      circleRef.current.setRadius(radius);
    }
  }, [center, radius]);

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setOptions({
        fillColor,
        fillOpacity,
        strokeColor,
        strokeOpacity,
        strokeWeight,
      });
    }
  }, [fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight]);

  return null;
}

export default function MapDashboard({
  hotspots,
  alerts,
  selectedCity,
  selectedCountry,
  onAddHotspot,
}: MapDashboardProps) {
  const [zoom, setZoom] = useState<number>(13);
  const [activeTab, setActiveTab] = useState<"gis" | "heat" | "alerts">("gis");
  const [selectedHotspot, setSelectedHotspot] = useState<DangerZoneHotspot | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<SafetyAlert | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Coordinates clicked by user to place a precise flag
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // States for adding custom hotspot/flag
  const [newHotspotName, setNewHotspotName] = useState("");
  const [newHotspotDesc, setNewHotspotDesc] = useState("");
  const [newHotspotRisk, setNewHotspotRisk] = useState<"medium" | "high" | "critical">("high");

  // University Selection for South Africa mode
  const [mapSelectedUni, setMapSelectedUni] = useState<string>("None");

  const getUniCoordinates = (uni: string) => {
    switch (uni) {
      case "Wits":
        return { lat: -26.1914, lng: 28.0268, name: "Wits University Braamfontein Campus" };
      case "UJ":
        return { lat: -26.1834, lng: 27.9994, name: "University of Johannesburg Auckland Park" };
      case "UP":
        return { lat: -25.7545, lng: 28.2307, name: "University of Pretoria Hatfield Campus" };
      case "UKZN":
        return { lat: -29.8667, lng: 30.9806, name: "UKZN Howard College Durban" };
      case "UCT":
        return { lat: -33.9576, lng: 18.4612, name: "UCT Rondebosch Upper Campus Cape Town" };
      default:
        return { lat: -26.2041, lng: 28.0473, name: "Gauteng Corridor Grid" };
    }
  };

  // Center on different select countries/cities
  const getCityCoordinates = (city: string) => {
    switch (city) {
      // South Africa
      case "Johannesburg":
        return { lat: -26.2041, lng: 28.0473, name: "Johannesburg Corridor Grid" };
      case "Cape Town":
        return { lat: -33.9249, lng: 18.4241, name: "Cape Town Metro" };
      case "Durban":
        return { lat: -29.8587, lng: 31.0218, name: "Durban Precinct" };
      case "Pretoria":
        return { lat: -25.7479, lng: 28.1878, name: "Pretoria Capital Sector" };
      case "Port Elizabeth":
        return { lat: -33.9608, lng: 25.6022, name: "Port Elizabeth Coast" };
      case "Bloemfontein":
        return { lat: -29.1181, lng: 26.2167, name: "Bloemfontein Central" };
      
      // Lesotho
      case "Maseru":
        return { lat: -29.3134, lng: 27.4844, name: "Maseru Sector" };
      case "Maputsoe":
        return { lat: -28.8789, lng: 27.9156, name: "Maputsoe Link" };
      case "Mafeteng":
        return { lat: -29.8230, lng: 27.2373, name: "Mafeteng District" };
      
      // Eswatini
      case "Mbabane":
        return { lat: -26.3144, lng: 31.1448, name: "Mbabane Central" };
      case "Manzini":
        return { lat: -26.4921, lng: 31.3713, name: "Manzini Hub" };
      case "Lobamba":
        return { lat: -26.4667, lng: 31.2000, name: "Lobamba Royal Sector" };
      
      // Namibia
      case "Windhoek":
        return { lat: -22.5609, lng: 17.0658, name: "Windhoek Metro" };
      case "Walvis Bay":
        return { lat: -22.9575, lng: 14.5053, name: "Walvis Bay Port" };
      case "Swakopmund":
        return { lat: -22.6806, lng: 14.5294, name: "Swakopmund Coast" };
      
      // Botswana
      case "Gaborone":
        return { lat: -24.6282, lng: 25.9231, name: "Gaborone Hub" };
      case "Francistown":
        return { lat: -21.1716, lng: 27.5072, name: "Francistown Link" };
      case "Maun":
        return { lat: -19.9833, lng: 23.4167, name: "Maun Gateway" };
      
      // Zimbabwe
      case "Harare":
        return { lat: -17.8252, lng: 31.0530, name: "Harare Sector" };
      case "Bulawayo":
        return { lat: -20.1500, lng: 28.5833, name: "Bulawayo Metro" };
      case "Mutare":
        return { lat: -18.9728, lng: 32.6694, name: "Mutare Gateway" };
      
      // Mozambique
      case "Maputo":
        return { lat: -25.9692, lng: 32.5732, name: "Maputo Port" };
      case "Beira":
        return { lat: -19.8436, lng: 34.8389, name: "Beira Coast" };
      case "Nampula":
        return { lat: -15.1165, lng: 39.2662, name: "Nampula Sector" };

      // Others
      case "Nairobi":
        return { lat: -1.2921, lng: 36.8219, name: "Nairobi Hub Sector" };
      case "Lagos":
        return { lat: 6.5244, lng: 3.3792, name: "Lagos Mainland Route" };
      case "Cairo":
        return { lat: 30.0444, lng: 31.2357, name: "Nile Transit Hub" };
      case "Accra":
        return { lat: 5.6037, lng: -0.1870, name: "Accra Central Link" };
      case "Kigali":
        return { lat: -1.9403, lng: 30.0619, name: "Kiyovu Hub Sector" };
      
      default:
        return { lat: -26.2041, lng: 28.0473, name: "Johannesburg Corridor Grid" };
    }
  };

  const coords = getCityCoordinates(selectedCity || "Johannesburg");
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: coords.lat, lng: coords.lng });

  // Synchronize map center and zoom level dynamically
  useEffect(() => {
    if (mapSelectedUni !== "None") {
      const uniCoords = getUniCoordinates(mapSelectedUni);
      setMapCenter({ lat: uniCoords.lat, lng: uniCoords.lng });
      setZoom(14);
    } else {
      setMapCenter({ lat: coords.lat, lng: coords.lng });
      setZoom(13);
    }
  }, [mapSelectedUni, selectedCity, selectedCountry]);

  // Reset selected hotspot/alert on city switch
  useEffect(() => {
    setSelectedHotspot(null);
    setSelectedAlert(null);
    setClickedCoords(null);
    setMapSelectedUni("None");
  }, [selectedCity]);

  // Filters
  const filteredHotspots = hotspots.filter(
    (h) =>
      (!selectedCountry || h.country === selectedCountry) &&
      (!selectedCity || h.city === selectedCity)
  );

  const filteredAlerts = alerts.filter(
    (a) =>
      (!selectedCountry || a.country === selectedCountry) &&
      (!selectedCity || a.city === selectedCity)
  );

  const handleCreateHotspot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotspotName.trim()) return;

    const finalLat = clickedCoords ? clickedCoords.lat : coords.lat + (Math.random() - 0.5) * 0.04;
    const finalLng = clickedCoords ? clickedCoords.lng : coords.lng + (Math.random() - 0.5) * 0.04;

    const created: DangerZoneHotspot = {
      id: `HOT-SIM-${Date.now()}`,
      name: newHotspotName.trim(),
      city: selectedCity || "Johannesburg",
      country: selectedCountry || "South Africa",
      riskLevel: newHotspotRisk,
      latitude: finalLat,
      longitude: finalLng,
      radius: Math.floor(Math.random() * 300) + 200,
      recentIncidentCount: 1,
      description: newHotspotDesc ? newHotspotDesc.trim() : "Community generated safety warning flag.",
    };

    onAddHotspot(created);
    setNewHotspotName("");
    setNewHotspotDesc("");
    setClickedCoords(null);
    setShowAddModal(false);
  };

  const handleMapClick = (e: any) => {
    if (e.detail?.latLng) {
      const { lat, lng } = e.detail.latLng;
      setClickedCoords({ lat, lng });
      setShowAddModal(true);
    }
  };

  // Helper options to create beautiful dynamic GIS overlays
  const getCircleOptions = (riskLevel: string) => {
    const isHeat = activeTab === "heat";
    switch (riskLevel) {
      case "critical":
        return {
          fillColor: "#dc2626", // red-600
          fillOpacity: isHeat ? 0.35 : 0.15,
          strokeColor: "#dc2626",
          strokeOpacity: 0.5,
          strokeWeight: isHeat ? 0.5 : 1.5,
        };
      case "high":
        return {
          fillColor: "#f59e0b", // amber-500
          fillOpacity: isHeat ? 0.28 : 0.12,
          strokeColor: "#f59e0b",
          strokeOpacity: 0.45,
          strokeWeight: isHeat ? 0.5 : 1.2,
        };
      default:
        return {
          fillColor: "#eab308", // yellow-500
          fillOpacity: isHeat ? 0.22 : 0.1,
          strokeColor: "#eab308",
          strokeOpacity: 0.4,
          strokeWeight: isHeat ? 0.5 : 1,
        };
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm" id="map-dashboard-viewport">
      {/* Map Control Bar - Premium Monochrome header */}
      <div className="p-5 bg-neutral-50 border-b border-neutral-200/80 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white rounded flex items-center justify-center font-bold relative shadow-sm shrink-0">
            <Compass className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="font-display font-bold text-neutral-900 text-sm md:text-base flex items-center gap-2">
              Rider Hazard Locator & GIS Radar
              <span className="text-[8px] bg-neutral-900 text-white font-mono font-black px-2 py-0.5 rounded-sm uppercase tracking-widest">
                GOOGLE MAPS ACTIVE
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-mono font-semibold">
              {selectedCountry || "Continental Channels"} &bull; {selectedCity || "Global Sector"} Grid
            </p>
          </div>
        </div>

        {/* View mode selectors in Uber-style slider */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200 select-none text-[10px] font-mono font-bold text-neutral-500">
          <button
            onClick={() => {
              setActiveTab("gis");
              setSelectedHotspot(null);
            }}
            className={`px-3.5 py-1.5 rounded uppercase font-black transition-all cursor-pointer ${
              activeTab === "gis"
                ? "bg-white text-neutral-900 shadow-sm"
                : "hover:text-neutral-900"
            }`}
          >
            Hotspots Map
          </button>
          <button
            onClick={() => {
              setActiveTab("heat");
              setSelectedHotspot(null);
            }}
            className={`px-3.5 py-1.5 rounded uppercase font-black transition-all cursor-pointer ${
              activeTab === "heat"
                ? "bg-white text-neutral-900 shadow-sm"
                : "hover:text-neutral-900"
            }`}
          >
            Risk Heatmap
          </button>
          <button
            onClick={() => {
              setActiveTab("alerts");
              setSelectedHotspot(null);
            }}
            className={`px-3.5 py-1.5 rounded uppercase font-black transition-all cursor-pointer relative ${
              activeTab === "alerts"
                ? "bg-white text-red-650 text-red-600 shadow-sm"
                : "hover:text-neutral-900"
            }`}
          >
            Direct Alerts
            {filteredAlerts.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 h-[520px]">
        {/* Left Side: Real interactive Google Map (or splash screen if no key) */}
        <div className="col-span-1 lg:col-span-8 relative bg-neutral-950 overflow-hidden group select-none border-b lg:border-b-0 lg:border-r border-neutral-200">
          
          {!hasValidKey ? (
            /* Splash setup screen */
            <div className="absolute inset-0 bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center z-30">
              <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Compass className="w-24 h-24 text-white rotate-12" />
                </div>
                
                <div className="w-12 h-12 bg-neutral-800 border bg-neutral-850 text-neutral-300 rounded mb-4 flex items-center justify-center font-bold relative mx-auto shadow">
                  <Compass className="w-6 h-6 animate-pulse text-zinc-400" />
                </div>

                <h3 className="font-display font-black text-white text-sm md:text-base uppercase tracking-wider">
                  Google Maps API Required
                </h3>
                <p className="text-xs text-neutral-400 font-medium mt-2 leading-relaxed font-sans">
                  Connect live interactive Google Maps, precise coordinate pins, custom hazard radii, and satellite GIS overlays in real-time.
                </p>

                <div className="mt-5 text-left space-y-3.5 bg-neutral-950/80 p-4 border border-neutral-850 rounded">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-neutral-500 font-black text-[10px] bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded leading-none mt-0.5">01</span>
                    <p className="text-[11px] text-neutral-300 leading-normal font-sans font-medium">
                      <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-red-400 font-extrabold underline hover:text-red-300">
                        Get a Google Maps API Key
                      </a> from your Google Cloud Console.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-neutral-500 font-black text-[10px] bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded leading-none mt-0.5">02</span>
                    <div className="text-[11px] text-neutral-300 leading-normal font-sans font-medium">
                      Open <strong className="text-white">Settings</strong> (⚙️ gear icon, top-right of screen) &rarr; <strong className="text-white">Secrets</strong>.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-neutral-500 font-black text-[10px] bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded leading-none mt-0.5">03</span>
                    <div className="text-[11px] text-neutral-300 leading-normal font-sans font-medium">
                      Add a secret named <strong className="text-rose-400 font-mono">GOOGLE_MAPS_PLATFORM_KEY</strong>, paste your API key, and expand. The map will load automatically.
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-[9px] text-neutral-500 font-mono font-black uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
                  MAP ENGINE STANDBY
                </div>
              </div>
            </div>
          ) : (
            /* Live Google Map Frame */
            <div className="w-full h-full relative" style={{ minHeight: "100%" }}>
              <APIProvider apiKey={API_KEY} version="weekly">
                <Map
                  center={mapCenter}
                  zoom={zoom}
                  onZoomChanged={(e) => setZoom(e.detail.zoom)}
                  onClick={handleMapClick}
                  mapId="DEMO_MAP_ID"
                  gestureHandling="cooperative"
                  disableDefaultUI={false}
                  mapTypeControl={true}
                  internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                  style={{ width: "100%", height: "100%" }}
                >
                  
                  {/* Anchor City Inner Hub Center */}
                  <AdvancedMarker position={{ lat: coords.lat, lng: coords.lng }} title={coords.name}>
                    <div className="p-2 bg-black border border-white text-white rounded-full shadow-2xl flex items-center justify-center scale-110">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </AdvancedMarker>

                  {/* Dynamic University Safety Campus Zone Overlay */}
                  {mapSelectedUni !== "None" && (activeTab === "gis" || activeTab === "heat") && (
                    <React.Fragment>
                      <MapCircle
                        center={{ lat: getUniCoordinates(mapSelectedUni).lat, lng: getUniCoordinates(mapSelectedUni).lng }}
                        radius={600}
                        options={{
                          fillColor: "#10b981", // emerald-500
                          fillOpacity: activeTab === "heat" ? 0.35 : 0.15,
                          strokeColor: "#10b981",
                          strokeOpacity: 0.6,
                          strokeWeight: 2,
                        }}
                      />
                      <AdvancedMarker
                        position={{ lat: getUniCoordinates(mapSelectedUni).lat, lng: getUniCoordinates(mapSelectedUni).lng }}
                        onClick={() => {
                          setSelectedHotspot({
                            id: `UNI-${mapSelectedUni}`,
                            name: `${mapSelectedUni} University Shield Zone`,
                            city: selectedCity,
                            country: selectedCountry,
                            riskLevel: "low",
                            latitude: getUniCoordinates(mapSelectedUni).lat,
                            longitude: getUniCoordinates(mapSelectedUni).lng,
                            radius: 600,
                            recentIncidentCount: 0,
                            description: `Official SafeRide Student Patrol Corridor. Intermittent safe campus shuttles running. Crime rate reduced by 85% within this geofenced radius.`
                          });
                          setSelectedAlert(null);
                        }}
                      >
                        <div className="p-2 bg-emerald-600 text-white rounded-full border border-white shadow-xl scale-110 flex items-center justify-center cursor-pointer animate-[bounce_2s_infinite]">
                          <GraduationCap className="w-4.5 h-4.5 text-white" />
                        </div>
                      </AdvancedMarker>
                    </React.Fragment>
                  )}

                  {/* Rendering hotspots on hotspots and heatmap viewports */}
                  {(activeTab === "gis" || activeTab === "heat") &&
                    filteredHotspots.map((hotspot) => {
                      const isCritical = hotspot.riskLevel === "critical";
                      const isHigh = hotspot.riskLevel === "high";

                      return (
                        <React.Fragment key={hotspot.id}>
                          {/* Radius Outer Coverage Circle */}
                          <MapCircle
                            center={{ lat: hotspot.latitude, lng: hotspot.longitude }}
                            radius={hotspot.radius}
                            options={getCircleOptions(hotspot.riskLevel)}
                          />

                          {/* Visual pin on top */}
                          <AdvancedMarker
                            position={{ lat: hotspot.latitude, lng: hotspot.longitude }}
                            onClick={(e) => {
                              setSelectedHotspot(hotspot);
                              setSelectedAlert(null);
                            }}
                          >
                            <div
                              className={`p-1.5 rounded-full transform hover:scale-125 transition-all duration-150 shadow-md border cursor-pointer flex items-center justify-center ${
                                isCritical
                                  ? "bg-red-600 text-white border-white animate-bounce"
                                  : isHigh
                                  ? "bg-amber-50 text-neutral-900 border-black"
                                  : "bg-yellow-400 text-neutral-900 border-black"
                              }`}
                            >
                              {isCritical ? (
                                <Flame className="w-3.5 h-3.5 text-white" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5" />
                              )}
                            </div>
                          </AdvancedMarker>
                        </React.Fragment>
                      );
                    })}

                  {/* Warning signals coordinates overlaid while on direct alerts view */}
                  {activeTab === "alerts" &&
                    filteredAlerts.map((alert) => (
                      <AdvancedMarker
                        key={alert.id}
                        position={{ lat: alert.latitude || coords.lat + 0.015, lng: alert.longitude || coords.lng - 0.015 }}
                        onClick={() => {
                          setSelectedAlert(alert);
                          setSelectedHotspot(null);
                        }}
                      >
                        <div className="p-2 bg-rose-950 text-white border border-rose-500 rounded-lg shadow-xl cursor-pointer flex items-center gap-1.5 duration-150 scale-105">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse shrink-0" />
                          <span className="font-mono text-[8px] font-black uppercase tracking-wider text-red-200">
                            CRITICAL SIGNAL
                          </span>
                        </div>
                      </AdvancedMarker>
                    ))}

                  {/* Temporary draft flag indicating click action */}
                  {clickedCoords && (
                    <AdvancedMarker position={clickedCoords}>
                      <div className="px-2.5 py-1.5 bg-neutral-900/95 border border-white rounded shadow-xl text-white font-mono text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                        <MapPin className="w-3 h-3 text-red-500" />
                        CREATING FLAG
                      </div>
                    </AdvancedMarker>
                  )}

                  {/* InfoWindows details overlays */}
                  {selectedHotspot && (
                    <InfoWindow
                      position={{ lat: selectedHotspot.latitude, lng: selectedHotspot.longitude }}
                      onCloseClick={() => setSelectedHotspot(null)}
                    >
                      <div className="p-2.5 max-w-xs text-neutral-900 leading-normal font-sans text-xs space-y-2">
                        <div className="flex items-center justify-between gap-2.5">
                          <span className="font-extrabold text-[12px] tracking-tight truncate leading-tight">
                            {selectedHotspot.name}
                          </span>
                          <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${
                            selectedHotspot.riskLevel === "critical"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : selectedHotspot.riskLevel === "high"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : "bg-yellow-50 text-yellow-800 border-yellow-200"
                          }`}>
                            {selectedHotspot.riskLevel}
                          </span>
                        </div>
                        <p className="text-neutral-600 font-medium leading-relaxed">
                          {selectedHotspot.description}
                        </p>
                        <div className="flex gap-2 text-[9px] font-mono items-center pt-2 border-t border-neutral-100 justify-between text-neutral-400">
                          <span>Radius: {selectedHotspot.radius}m</span>
                          <span className="text-red-655 text-red-600 font-bold">
                            {selectedHotspot.recentIncidentCount} reports
                          </span>
                        </div>
                      </div>
                    </InfoWindow>
                  )}

                  {selectedAlert && (
                    <InfoWindow
                      position={{ lat: selectedAlert.latitude || coords.lat + 0.015, lng: selectedAlert.longitude || coords.lng - 0.015 }}
                      onCloseClick={() => setSelectedAlert(null)}
                    >
                      <div className="p-2.5 max-w-xs text-neutral-900 leading-normal font-sans text-xs space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[12px] tracking-tight leading-tight">
                            {selectedAlert.title}
                          </span>
                          <span className="text-[8px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 shrink-0">
                            ALERT
                          </span>
                        </div>
                        <p className="text-neutral-600 font-medium leading-relaxed">
                          {selectedAlert.message}
                        </p>
                        <div className="pt-2 border-t border-neutral-100 text-[9px] font-mono text-neutral-400 flex justify-between">
                          <span>Sector Broadcast</span>
                          <span>Active Log</span>
                        </div>
                      </div>
                    </InfoWindow>
                  )}

                </Map>
              </APIProvider>

              {/* Floating controls */}
              <div className="absolute top-4 left-4 z-10 bg-black/90 text-white backdrop-blur border border-neutral-800 p-3.5 rounded text-neutral-200 shadow-lg">
                <span className="font-mono text-[8px] font-black uppercase text-neutral-400 flex items-center gap-1.5 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  ANCHOR POINT
                </span>
                <div className="text-xs md:text-sm font-display font-medium text-white mt-1.5 leading-none">
                  {coords.name}
                </div>
                <div className="text-[9px] font-mono mt-1 text-neutral-500">
                  LAT: {coords.lat.toFixed(4)} &bull; LNG: {coords.lng.toFixed(4)}
                </div>
              </div>

              {/* Action utilities */}
              <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 items-end">
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setZoom(z => Math.min(18, z + 1))}
                    className="p-2.5 bg-black hover:bg-neutral-900 border border-neutral-800 text-white transition-all rounded shadow-md cursor-pointer flex items-center justify-center bg-zinc-950 hover:bg-zinc-900"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoom(z => Math.max(9, z - 1))}
                    className="p-2.5 bg-black hover:bg-neutral-900 border border-neutral-800 text-white transition-all rounded shadow-md cursor-pointer flex items-center justify-center bg-zinc-950 hover:bg-zinc-900"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setClickedCoords(null);
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-mono font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  +旗 REGISTER CORRIDOR FLAG
                </button>
              </div>

              {/* Informational map-click notice */}
              <div className="absolute bottom-4 left-4 z-10 pointer-events-none md:block hidden">
                <div className="px-3 py-1.5 bg-black/80 backdrop-blur border border-neutral-800 text-white font-mono text-[8px] font-bold rounded shadow-lg uppercase tracking-wide">
                  💡 Hint: click any point on Map to flag custom safety risks there
                </div>
              </div>

            </div>
          )}

          {/* Active alerts tickers bottom overlay */}
          {hasValidKey && filteredAlerts.length > 0 && (
            <div className="absolute bottom-4 left-4 z-10 max-w-sm">
              <div className="bg-red-950 text-white border border-red-900/60 p-4 rounded flex gap-3 items-start text-xs shadow-xl animate-bounce">
                <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-red-400 uppercase text-[8px] tracking-widest font-mono bg-red-900 border border-red-800/80 px-2 py-0.5 rounded-sm">
                    METRO HAZARD THREAT
                  </span>
                  <p className="mt-2 font-display font-medium text-white leading-tight">
                    {filteredAlerts[0].title}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1 truncate max-w-[220px]">
                    {filteredAlerts[0].message}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Active Hotspots & Live Incident Feed */}
        <div className="col-span-1 lg:col-span-4 bg-neutral-50 p-5 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0">
          <div className="space-y-4">

            {/* South African University Safety Mode Selector */}
            {selectedCountry === "South Africa" && (
              <div className="bg-white border border-neutral-200 rounded-xl p-3.5 space-y-2.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest">
                  <GraduationCap className="w-4 h-4 text-neutral-600" />
                  STUDENT SHIELD: CAMPUS SECTOR
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  {["None", "Wits", "UJ", "UP", "UKZN", "UCT"].map((uni) => (
                    <button
                      key={uni}
                      type="button"
                      onClick={() => setMapSelectedUni(uni)}
                      className={`py-1.5 rounded text-[10px] font-mono font-black uppercase tracking-tight border transition-all cursor-pointer ${
                        mapSelectedUni === uni
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-800"
                      }`}
                    >
                      {uni}
                    </button>
                  ))}
                </div>

                {mapSelectedUni !== "None" && (
                  <div className="bg-emerald-50/50 border border-emerald-200/50 p-2.5 rounded-lg text-[10px] leading-relaxed text-emerald-900 font-semibold space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-black uppercase tracking-wide text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      {mapSelectedUni} Safe corridor active
                    </div>
                    <p className="text-emerald-700 font-medium">
                      Student shuttle patrol active. Special security escorts responding to late-night emergency flags on principal routes.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "alerts" ? (
              <>
                <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-mono flex items-center justify-between border-b border-neutral-200 pb-2">
                  Active Safety Alerts
                  <span className="text-[10px] bg-red-105 bg-red-100 text-red-850 text-red-800 px-2.5 py-0.5 rounded-sm font-black font-mono">
                    {filteredAlerts.length} LOGGED
                  </span>
                </h4>

                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded border border-neutral-200/80 p-6 shadow-sm">
                    <p className="text-xs text-neutral-450 text-neutral-400 font-medium">No critical alerts broadcasted for this operating sector.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {filteredAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => setSelectedAlert(alert)}
                        className={`p-4 rounded border transition-all cursor-pointer shadow-sm ${
                          selectedAlert?.id === alert.id
                            ? "bg-white border-black ring-1 ring-black/10 shadow-md"
                            : "bg-white border-neutral-200 hover:border-neutral-400 hover:shadow"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-display font-bold text-neutral-900 text-sm truncate leading-tight mt-0.5">
                            {alert.title}
                          </span>
                          <span className="text-[8px] px-2 py-0.5 rounded-sm font-mono font-black uppercase shrink-0 border bg-rose-55 bg-rose-50 text-rose-850 text-rose-800 border-rose-200">
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2 font-medium line-clamp-2 leading-relaxed">
                          {alert.message}
                        </p>
                        <div className="flex items-center justify-between mt-4 text-[10px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
                          <span className="font-bold text-neutral-500 uppercase">
                            {alert.category}
                          </span>
                          <span>{alert.timestamp.split("T")[0] || alert.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-mono flex items-center justify-between border-b border-neutral-200 pb-2">
                  Zone Risk Registries
                  <span className="text-[10px] bg-neutral-200 text-neutral-800 px-2.5 py-0.5 rounded-sm font-black font-mono">
                    {filteredHotspots.length} ACTIVE
                  </span>
                </h4>

                {filteredHotspots.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded border border-neutral-200/80 p-6 shadow-sm">
                    <p className="text-xs text-neutral-450 text-neutral-450 text-neutral-400 font-medium mt-3.5 leading-normal">No active unsafe zones flagged for this operating sector.</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-3.5 text-xs text-neutral-900 font-bold hover:underline inline-flex items-center gap-1 transition-all cursor-pointer"
                    >
                      + Flag the first coordinate
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {filteredHotspots.map((hotspot) => {
                      const isCritical = hotspot.riskLevel === "critical";
                      const isHigh = hotspot.riskLevel === "high";

                      return (
                        <div
                          key={hotspot.id}
                          onClick={() => {
                            setSelectedHotspot(hotspot);
                            // Auto trigger zoom closer if map is active
                            setZoom(14);
                          }}
                          className={`p-4 rounded border transition-all cursor-pointer shadow-sm ${
                            selectedHotspot?.id === hotspot.id
                              ? "bg-white border-black ring-1 ring-black/10 shadow-md"
                              : "bg-white border-neutral-200 hover:border-neutral-400 hover:shadow"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-display font-bold text-neutral-900 text-sm truncate leading-tight mt-0.5">
                              {hotspot.name}
                            </span>
                            <span
                              className={`text-[8px] px-2 py-0.5 rounded-sm font-mono font-black uppercase shrink-0 border ${
                                isCritical
                                  ? "bg-red-50 text-red-800 border-red-200"
                                  : isHigh
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-yellow-50 text-yellow-800 border-yellow-250"
                              }`}
                            >
                              {hotspot.riskLevel}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-2 font-medium line-clamp-2 leading-relaxed">
                            {hotspot.description}
                          </p>
                          <div className="flex items-center justify-between mt-4 text-[10px] font-mono text-neutral-500 border-t border-neutral-100 pt-3">
                            <span className="flex items-center gap-1 font-bold bg-neutral-100 border px-1.5 py-0.5 rounded text-neutral-600">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                              Radius {hotspot.radius}m
                            </span>
                            <span className="text-red-750 text-red-700 font-extrabold bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                              {hotspot.recentIncidentCount} incident logs
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

          </div>

          <div className="mt-4 pt-4 border-t border-neutral-200 text-[10px] text-neutral-400 font-bold font-mono tracking-wide flex items-center justify-between">
            <span>GRID MON: SECTOR-Z9</span>
            <span className="text-black uppercase font-black font-semibold">● DIRECT OVERLAYS ALIVE</span>
          </div>
        </div>
      </div>

      {/* Add Custom Spot Flag Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-2xl p-6 text-neutral-800">
            <div className="flex justify-between items-start mb-5 border-b border-neutral-100 pb-3">
              <div>
                <h4 className="font-display font-bold text-neutral-900 text-base leading-none">Register Safety Hazard Coordinates</h4>
                <p className="text-xs text-neutral-400 font-medium mt-2 leading-normal">
                  Flag a verified threat, high-risk corridor, or active unsafe staging area inside <span className="font-extrabold text-neutral-950 font-mono text-[11px] bg-neutral-100 px-1.5 py-0.5 rounded">{selectedCity}</span> sector.
                </p>
              </div>
              <button
                onClick={() => {
                  setClickedCoords(null);
                  setShowAddModal(false);
                }}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHotspot} className="space-y-4">
              {clickedCoords && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-rose-950 flex items-start gap-2 text-xs">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-[10px] uppercase font-mono text-red-700 tracking-wider">PIN LOCATION CHOSEN</span>
                    <p className="mt-0.5 font-mono text-[9px] font-bold">
                      Latitude: {clickedCoords.lat.toFixed(5)} &bull; Longitude: {clickedCoords.lng.toFixed(5)}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">
                  CORRIDOR LOCATION OR LANDMARK NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exit 14 flyover intersection ramps"
                  value={newHotspotName}
                  onChange={(e) => setNewHotspotName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:outline-none focus:ring-1 focus:ring-black rounded-lg px-3 py-2.5 text-sm text-neutral-900 font-medium placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">
                  SAFETY WARNING DETAILS
                </label>
                <textarea
                  required
                  placeholder="e.g. Activity reports of unregistered/imposter vehicles staging tire failure tricks to force stops..."
                  value={newHotspotDesc}
                  onChange={(e) => setNewHotspotDesc(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:outline-none focus:ring-1 focus:ring-black rounded-lg px-3 py-2.5 text-xs text-neutral-905 h-24 font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">
                  RISK SEVERITY LEVEL
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["medium", "high", "critical"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNewHotspotRisk(r)}
                      className={`py-2 rounded font-mono text-[9px] font-black uppercase border duration-150 transition-all cursor-pointer ${
                        newHotspotRisk === r
                          ? r === "critical"
                            ? "bg-black text-white border-black shadow"
                            : r === "high"
                            ? "bg-neutral-900 text-white border-neutral-900 shadow"
                            : "bg-neutral-100 text-neutral-900 border-neutral-300 shadow"
                          : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-50"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 border-t border-neutral-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setClickedCoords(null);
                    setShowAddModal(false);
                  }}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-2.5 rounded text-xs font-bold font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded text-xs font-bold font-mono uppercase shadow-md cursor-pointer"
                >
                  Broadcast flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
