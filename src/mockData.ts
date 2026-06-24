/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Driver, DangerZoneHotspot, SafetyAlert, IncidentReport, Review } from "./types";

export const AFRICAN_COUNTRIES = [
  { code: "ZA", name: "South Africa", cities: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein"] },
  { code: "LS", name: "Lesotho", cities: ["Maseru", "Maputsoe", "Mafeteng"] },
  { code: "SZ", name: "Eswatini", cities: ["Mbabane", "Manzini", "Lobamba"] },
  { code: "NA", name: "Namibia", cities: ["Windhoek", "Walvis Bay", "Swakopmund"] },
  { code: "BW", name: "Botswana", cities: ["Gaborone", "Francistown", "Maun"] },
  { code: "ZW", name: "Zimbabwe", cities: ["Harare", "Bulawayo", "Mutare"] },
  { code: "MZ", name: "Mozambique", cities: ["Maputo", "Beira", "Nampula"] },
  { code: "KE", name: "Kenya", cities: ["Nairobi", "Mombasa", "Kisumu"] },
  { code: "NG", name: "Nigeria", cities: ["Lagos", "Abuja", "Port Harcourt"] },
  { code: "GH", name: "Ghana", cities: ["Accra", "Kumasi", "Tamale"] },
  { code: "RW", name: "Rwanda", cities: ["Kigali", "Gisenyi", "Butare"] },
  { code: "EG", name: "Egypt", cities: ["Cairo", "Alexandria", "Giza"] },
  { code: "TZ", name: "Tanzania", cities: ["Dar es Salaam", "Arusha", "Dodoma"] },
  { code: "UG", name: "Uganda", cities: ["Kampala", "Entebbe"] },
  { code: "MA", name: "Morocco", cities: ["Casablanca", "Marrakech", "Rabat"] }
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: "DRV-ZA-9821",
    fullName: "Sipho Khumalo",
    driverLicenseNumber: "GP817293-C",
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
    operatingCountry: "South Africa",
    operatingCity: "Johannesburg",
    yearsDriving: 6,
    verificationStatus: "verified",
    identityVerified: true,
    backgroundCheckVerified: true,
    vehicle: {
      id: "VEH-ZA-102",
      make: "Toyota",
      model: "Corolla Quest",
      year: 2021,
      color: "White",
      licensePlate: "SD 92 RT GP",
      registrationNumber: "REG-JHB-99812",
      photos: ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=500"]
    },
    trustScore: 94,
    riskRating: "low",
    reportCount: 0,
    positiveReviewsCount: 312,
    negativeReviewsCount: 1,
    lastSeen: "Active 5 mins ago",
    emergencyContactVerified: true,
    scoreFactors: {
      identityWeight: 35, // Fully verified identity = 35%
      reviewsWeight: 19.5, // 19.5 out of 20%
      behaviorWeight: 19,  // Excellent driving behavior = 19%
      historyWeight: 15,  // No negative incident history = 15%
      reputationWeight: 5.5 // Commendations & endorsements = 5.5%
    }
  },
  {
    id: "DRV-KE-4432",
    fullName: "Mwangi Mwangi",
    driverLicenseNumber: "KE-DL-98261A",
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
    operatingCountry: "Kenya",
    operatingCity: "Nairobi",
    yearsDriving: 4,
    verificationStatus: "verified",
    identityVerified: true,
    backgroundCheckVerified: true,
    vehicle: {
      id: "VEH-KE-29",
      make: "Honda",
      model: "Fit",
      year: 2018,
      color: "Silver",
      licensePlate: "KDD 172X",
      registrationNumber: "REG-NBO-11202",
      photos: ["https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=500"]
    },
    trustScore: 82,
    riskRating: "low",
    reportCount: 1,
    positiveReviewsCount: 184,
    negativeReviewsCount: 3,
    lastSeen: "Active block - Westlands",
    emergencyContactVerified: true,
    scoreFactors: {
      identityWeight: 35,
      reviewsWeight: 16.5,
      behaviorWeight: 14.5,
      historyWeight: 11.0,
      reputationWeight: 5.0
    }
  },
  {
    id: "DRV-NG-0912",
    fullName: "Chinedu Okafor",
    driverLicenseNumber: "NG-DL-LAG8871",
    profilePhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300&h=300",
    operatingCountry: "Nigeria",
    operatingCity: "Lagos",
    yearsDriving: 8,
    verificationStatus: "pending",
    identityVerified: true,
    backgroundCheckVerified: false,
    vehicle: {
      id: "VEH-NG-881",
      make: "Hyundai",
      model: "Accent",
      year: 2017,
      color: "Black",
      licensePlate: "LSD-412AA",
      registrationNumber: "REG-LAG-40491",
      photos: []
    },
    trustScore: 49,
    riskRating: "high",
    reportCount: 8,
    positiveReviewsCount: 94,
    negativeReviewsCount: 14,
    lastSeen: "Offline since yesterday",
    emergencyContactVerified: false,
    scoreFactors: {
      identityWeight: 20, // Only 20% due to unverified background check
      reviewsWeight: 9.5,
      behaviorWeight: 8.0,
      historyWeight: 6.5,
      reputationWeight: 5.0
    }
  },
  {
    id: "DRV-EG-5511",
    fullName: "Amr Mansour",
    driverLicenseNumber: "EG-1192837",
    profilePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300",
    operatingCountry: "Egypt",
    operatingCity: "Cairo",
    yearsDriving: 10,
    verificationStatus: "verified",
    identityVerified: true,
    backgroundCheckVerified: true,
    vehicle: {
      id: "VEH-EG-440",
      make: "Nissan",
      model: "Sunny",
      year: 2022,
      color: "Dark Blue",
      licensePlate: "N91-ABC",
      registrationNumber: "REG-CAI-22361",
      photos: []
    },
    trustScore: 91,
    riskRating: "low",
    reportCount: 0,
    positiveReviewsCount: 442,
    negativeReviewsCount: 2,
    lastSeen: "Active - Maadi, Cairo",
    emergencyContactVerified: true,
    scoreFactors: {
      identityWeight: 35,
      reviewsWeight: 19,
      behaviorWeight: 18.5,
      historyWeight: 13.5,
      reputationWeight: 5.0
    }
  },
  {
    id: "DRV-GH-3392",
    fullName: "Kofi Mensah",
    driverLicenseNumber: "GH-DL-ACC8192",
    profilePhoto: "https://images.unsplash.com/photo-1542178243-fc2029671d2b?auto=format&fit=crop&q=80&w=300&h=300",
    operatingCountry: "Ghana",
    operatingCity: "Accra",
    yearsDriving: 3,
    verificationStatus: "unverified",
    identityVerified: false,
    backgroundCheckVerified: false,
    vehicle: {
      id: "VEH-GH-009",
      make: "Kia",
      model: "Picanto",
      year: 2016,
      color: "Yellow",
      licensePlate: "GW 8829-19",
      registrationNumber: "REG-ACC-71829",
      photos: []
    },
    trustScore: 18,
    riskRating: "critical",
    reportCount: 16,
    positiveReviewsCount: 12,
    negativeReviewsCount: 28,
    lastSeen: "Active minutes ago - East Legon",
    emergencyContactVerified: false,
    scoreFactors: {
      identityWeight: 0, // Unverified identity
      reviewsWeight: 2.0,
      behaviorWeight: 3.0,
      historyWeight: 1.0,
      reputationWeight: 12.0
    }
  },
  {
    id: "DRV-RW-0021",
    fullName: "Jean Bosco Niyonsaba",
    driverLicenseNumber: "RW-DL-KGL912",
    profilePhoto: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=300&h=300",
    operatingCountry: "Rwanda",
    operatingCity: "Kigali",
    yearsDriving: 5,
    verificationStatus: "verified",
    identityVerified: true,
    backgroundCheckVerified: true,
    vehicle: {
      id: "VEH-RW-12",
      make: "Volkswagen",
      model: "Polo",
      year: 2020,
      color: "White",
      licensePlate: "RAC 112S",
      registrationNumber: "REG-KGL-88192",
      photos: []
    },
    trustScore: 98,
    riskRating: "low",
    reportCount: 0,
    positiveReviewsCount: 219,
    negativeReviewsCount: 0,
    lastSeen: "Active - Kiyovu, Kigali",
    emergencyContactVerified: true,
    scoreFactors: {
      identityWeight: 35,
      reviewsWeight: 20,
      behaviorWeight: 19.5,
      historyWeight: 15,
      reputationWeight: 8.5
    }
  }
];

export const INITIAL_DANGER_ZONES: DangerZoneHotspot[] = [
  {
    id: "HOT-ZA-001",
    name: "Hillbrow Intersection & Surroundings",
    city: "Johannesburg",
    country: "South Africa",
    riskLevel: "critical",
    latitude: -26.1864,
    longitude: 28.0467,
    radius: 400,
    recentIncidentCount: 15,
    description: "Frequent opportunistic hijackings, forced window-smashing, and overcharging reports by unregistered drivers targeting late-night e-hailers."
  },
  {
    id: "HOT-KE-002",
    name: "Globe Roundabout Flyover Sector",
    city: "Nairobi",
    country: "Kenya",
    riskLevel: "high",
    latitude: -1.2801,
    longitude: 36.8222,
    radius: 250,
    recentIncidentCount: 8,
    description: "Reports of phone-snatching by motorcyclists working in tandem with slow-moving driver accomplices. Use heightened vigilance."
  },
  {
    id: "HOT-NG-003",
    name: "Oshodi Interchange Expressway",
    city: "Lagos",
    country: "Nigeria",
    riskLevel: "critical",
    latitude: 6.5594,
    longitude: 3.3444,
    radius: 500,
    recentIncidentCount: 22,
    description: "High level of vehicle impersonation scams where individuals posing as verified e-hailing drivers overcharge or divert passengers into gridlocks."
  },
  {
    id: "HOT-EG-004",
    name: "Downtown Tahrir Late Transit Corridor",
    city: "Cairo",
    country: "Egypt",
    riskLevel: "medium",
    latitude: 30.0444,
    longitude: 31.2357,
    radius: 300,
    recentIncidentCount: 4,
    description: "Isolated complaints of aggressive driving behavior, refusal to turn on the e-hailing app structure, and cash extortion demands under detouring pretexts."
  }
];

export const INITIAL_ALERTS: SafetyAlert[] = [
  {
    id: "ALT-001",
    title: "Immobilizer Scam Alert",
    message: "Multiple passengers in Nairobi report a trend of fake mechanical failure stops to summon accomplices for extortion.",
    category: "driver_flagged",
    country: "Kenya",
    city: "Nairobi",
    latitude: -1.2921,
    longitude: 36.8219,
    severity: "critical",
    timestamp: "2026-06-23T06:10:00Z",
    isActive: true
  },
  {
    id: "ALT-002",
    title: "Opportunistic Hijack Sector Active",
    message: "Gauteng Police warning around JHB CBD exit ramps. Keep your digital trackers armed and windows rolled up.",
    category: "hotspot",
    country: "South Africa",
    city: "Johannesburg",
    latitude: -26.2041,
    longitude: 28.0473,
    severity: "warning",
    timestamp: "2026-06-23T05:30:00Z",
    isActive: true
  },
  {
    id: "ALT-003",
    title: "Fake Driver Verification Sweep",
    message: "SafeRide inspectors checking e-hail documentation near Ikeja. Verify matching car plates before boarding.",
    category: "community_notice",
    country: "Nigeria",
    city: "Lagos",
    latitude: 6.5967,
    longitude: 3.3413,
    severity: "info",
    timestamp: "2026-06-23T04:15:00Z",
    isActive: true
  }
];

export const INITIAL_REPORTS: IncidentReport[] = [
  {
    id: "REP-9102",
    driverId: "DRV-GH-3392",
    userId: "USR-0941",
    category: "impersonation",
    description: "The driver matched the photo, but he allowed another unregistered man into the front seat midway claiming 'it was his brother'. They both aggressively demanded more cash and locked the doors. Avoid this vehicle plate GW 8829-19 immediately.",
    timestamp: "2026-06-22T21:40:00Z",
    location: {
      city: "Accra",
      country: "Ghana",
      latitude: 5.6037,
      longitude: -0.1870,
      landmark: "East Legon Main Street"
    },
    evidenceUrls: ["simulated_upload_gw_plate.jpg"],
    isAnonymous: false,
    status: "under_investigation",
    severity: "critical",
    aiClassification: {
      suggestedCategory: "impersonation",
      toxicityScore: 0.88,
      sentiment: "fearful",
      isLikelyFake: false,
      confidence: 0.95,
      reasoning: "Description outlines severe security breach violating standard ride agreements (allowing secondary unverified passengers, passenger lockouts)."
    }
  },
  {
    id: "REP-1102",
    driverId: "DRV-NG-0912",
    userId: "USR-8821",
    category: "overcharging",
    description: "Driver refused to start the in-app trip meter. Extorted multiple Naira commissions at target destination in Lekki, threatening to throw passenger out of moving vehicle.",
    timestamp: "2026-06-21T14:10:00Z",
    location: {
      city: "Lagos",
      country: "Nigeria",
      latitude: 6.4281,
      longitude: 3.4219,
      landmark: "Lekki Toll Gate"
    },
    evidenceUrls: [],
    isAnonymous: true,
    status: "pending_review",
    severity: "high",
    aiClassification: {
      suggestedCategory: "overcharging",
      toxicityScore: 0.72,
      sentiment: "angry",
      isLikelyFake: false,
      confidence: 0.89,
      reasoning: "Details an off-app extorted fare and violent verbal threats."
    }
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "REV-101",
    driverId: "DRV-ZA-9821",
    userId: "USR-1092",
    rating: 5,
    comment: "Extremely professional driver, clean Corolla, offered bottled water and checked if I was comfortable with the route. Best ride in JHB!",
    serviceUsed: "Uber",
    timestamp: "2026-06-22T18:30:00Z"
  },
  {
    id: "REV-102",
    driverId: "DRV-ZA-9821",
    userId: "USR-3331",
    rating: 5,
    comment: "Sipho took extra care to avoid sketchy areas in Hillbrow because it was late night. Made me feel totally safe",
    serviceUsed: "Bolt",
    timestamp: "2026-06-20T23:10:00Z"
  }
];
